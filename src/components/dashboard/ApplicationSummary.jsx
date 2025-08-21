import React, { useState, useEffect } from "react";
import "./styles/ApplicationSummary.css";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function ApplicationSummary({ setCurrentStep }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [personalInfoId, setPersonalInfoId] = useState("");
  const [userName, setUserName] = useState("");
  const authData = useAuthStore((state) => state.allUserData);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [submissionDate, setSubmissionDate] = useState("");
  const [isResubmitting, setIsResubmitting] = useState(false);

  // Mobile collapsible states
  const [showInstructionsMobile, setShowInstructionsMobile] = useState(false);
  const [showNextStepsMobile, setShowNextStepsMobile] = useState(false);

  const getCurrentDateTime = () => "2025-08-19 17:17:36";
  const getCurrentUser = () => "NeduStack";

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (!authData) return;
      const userId = authData["uid"];
      try {
        const response = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`
        );
        if (response?.data?.result) {
          const savedData = response.data.result;
          const studentId = savedData.id || "";
          setPersonalInfoId(studentId);

          const fullName = [
            savedData.firstName || "",
            savedData.middleName ? savedData.middleName + " " : "",
            savedData.lastName || "",
          ]
            .join(" ")
            .trim();
          setUserName(fullName || "");

          if (studentId) {
            try {
              const appResponse = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${studentId}`
              );
              if (appResponse?.data?.result) {
                const status = appResponse.data.result.applicationStatus;
                setApplicationStatus(status);
                if (appResponse.data.result.createdAt) {
                  setSubmissionDate(appResponse.data.result.createdAt);
                } else {
                  setSubmissionDate(getCurrentDateTime());
                }
                if (status >= 1 && status !== 4 && status !== 2) {
                  setIsSubmitted(true);
                } else {
                  setIsSubmitted(false);
                }
              }
            } catch (err) {
              console.log(
                `No application found or error: ${
                  err.message
                } at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );
              setApplicationStatus(2);
            }
          }
        }
      } catch (error) {
        console.error(
          `Error fetching personal info: ${
            error.message
          } at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
        setUserName("");
      }
    };
    fetchPersonalInfo();
  }, [authData]);

  const getStatusText = (status) => {
    const statusMap = {
      1: "Submitted",
      2: "Pending",
      3: "Under Review",
      4: "Rejected",
      5: "Approved",
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusContent = (status) => {
    switch (status) {
      case 1:
        return {
          message:
            "Your application has been successfully submitted and is awaiting initial review.",
          instructions: [
            "Application queued",
            "Processing will begin shortly",
            "No further action required",
          ],
        };
      case 2:
        return {
          message:
            "Review all sections of your application before final submission.",
          instructions: [
            "Changes locked after submission",
            "Review starts immediately",
            "Email updates will be sent",
          ],
          note: "Ensure accuracy—changes are not possible after submission.",
        };
      case 3:
        return {
          message: "Your application is currently under review.",
          instructions: [
            "Team evaluating details",
            "We may request more info",
            "Monitor your email",
          ],
          note: "Thorough review may take time. Thank you for your patience.",
        };
      case 4:
        return {
          message:
            "Your application was not successful. You may edit and resubmit.",
          instructions: [
            "Read rejection feedback",
            "Improve weak areas",
            "Update documents/details",
            "Resubmit when ready",
          ],
          note: "Use the feedback to strengthen your resubmission.",
        };
      case 5:
        return {
          message: "Congratulations! Your application has been approved.",
          instructions: [
            "Check email for next steps",
            "Complete enrollment tasks",
          ],
          note: "",
        };
      default:
        return {
          message:
            "Complete all required sections before submitting your application.",
          instructions: [
            "Fill required forms",
            "Upload documents",
            "Review details",
            "Submit when ready",
          ],
          note: "Provide accurate information to avoid delays.",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return getCurrentDateTime();
    try {
      if (dateString.includes(" ")) return dateString;
      const date = new Date(dateString);
      return date.toISOString().replace("T", " ").slice(0, 19);
    } catch {
      return dateString;
    }
  };

  const handleResubmitRejected = async () => {
    if (!personalInfoId) {
      Swal.fire({
        title: "Error",
        text: "Missing personal information.",
        icon: "error",
      });
      return;
    }
    Swal.fire({
      title: "Resubmit Application",
      text: "Confirm you have addressed feedback before resubmitting.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Resubmit",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      setIsResubmitting(true);
      try {
        Swal.fire({
          title: "Resubmitting...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        await apiInstance.post(
          `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
        );
        Swal.close();
        setApplicationStatus(1);
        setSubmissionDate(getCurrentDateTime());
        setIsSubmitted(true);
        Toast.fire({ icon: "success", title: "Application resubmitted" });
      } catch (error) {
        Swal.close();
        Swal.fire({
          title: "Resubmission Failed",
          text:
            error.response?.data?.message ||
            "An error occurred. Please try again.",
          icon: "error",
        });
      } finally {
        setIsResubmitting(false);
      }
    });
  };

  const handleFinalSubmit = async () => {
    if (!personalInfoId) {
      Swal.fire({
        title: "Error",
        text: "Missing personal information.",
        icon: "error",
      });
      return;
    }
    if (applicationStatus && ![2, 4].includes(applicationStatus)) {
      Swal.fire({
        title: "Cannot Submit",
        text: `Current status: ${getStatusText(
          applicationStatus
        )}. Only Pending or Rejected can submit.`,
        icon: "warning",
      });
      return;
    }
    const isResubmission = applicationStatus === 4;
    Swal.fire({
      title: isResubmission ? "Resubmit Application" : "Submit Application",
      text: isResubmission
        ? "Confirm your corrections before resubmitting."
        : "You cannot edit after final submission. Proceed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isResubmission ? "Resubmit" : "Submit",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      setIsSubmitting(true);
      try {
        Swal.fire({
          title: isResubmission ? "Resubmitting..." : "Submitting...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        await apiInstance.post(
          `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
        );
        Swal.close();
        setIsSubmitted(true);
        setApplicationStatus(1);
        setSubmissionDate(getCurrentDateTime());
        Toast.fire({
          icon: "success",
          title: isResubmission ? "Resubmitted" : "Submitted",
        });
      } catch (error) {
        Swal.close();
        Toast.fire({
          icon: "error",
          title: isResubmission ? "Resubmission failed" : "Submission failed",
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleEditApplication = () => {
    Swal.fire({
      title: "Edit Application",
      text: "You will return to the form to make corrections.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed",
    }).then((r) => {
      if (r.isConfirmed) setCurrentStep("personal-info");
    });
  };

  const statusContent = getStatusContent(applicationStatus);
  const shouldShowSubmissionForm =
    !isSubmitted || applicationStatus === 2 || applicationStatus === 4;

  // Meta detail block (shown for Rejected above instructions)
  const resubmissionMetaBlock =
    applicationStatus === 4 && shouldShowSubmissionForm ? (
      <div className="resubmission-meta-block">
        <div className="meta-row">
          <span className="meta-label">Status:</span>
          <span className="meta-value">{getStatusText(applicationStatus)}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Rejection Date:</span>
          <span className="meta-value">{formatDate(submissionDate)}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Applicant:</span>
          <span className="meta-value">{userName || getCurrentUser()}</span>
        </div>
      </div>
    ) : null;

  return (
    <div className="application-summary-container">
      {/* Removed mobile meta chips per user request */}

      {shouldShowSubmissionForm ? (
        <>
          <h2 className="application-summary-title">Review &amp; Submit</h2>

          {applicationStatus && (
            <div
              className={`application-status ${getStatusText(applicationStatus)
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              <p>
                Current Application Status:{" "}
                <strong>{getStatusText(applicationStatus)}</strong>
              </p>
            </div>
          )}

          <div className="summary-message">
            <p className="compact-text">{statusContent.message}</p>
          </div>

          {resubmissionMetaBlock}

          {/* Mobile collapsible instructions */}
          <div className="mobile-collapse-wrapper">
            <button
              type="button"
              className="collapse-toggle"
              onClick={() => setShowInstructionsMobile((prev) => !prev)}
              aria-expanded={showInstructionsMobile}
            >
              {showInstructionsMobile ? "−" : "+"}{" "}
              {applicationStatus === 4
                ? "Resubmission Instructions"
                : applicationStatus === 2
                ? "Submission Instructions"
                : "Status Notes"}
            </button>
            <div
              className={`collapse-content ${
                showInstructionsMobile ? "open" : ""
              }`}
            >
              <div className="summary-instructions">
                <p className="mobile-heading">
                  {applicationStatus === 2
                    ? "Once you submit:"
                    : applicationStatus === 4
                    ? "To resubmit:"
                    : "Information:"}
                </p>
                <ul>
                  {statusContent.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
              {statusContent.note && (
                <div
                  className={`status-specific-note mobile-note ${getStatusText(
                    applicationStatus
                  )
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  <strong>Important:</strong> {statusContent.note}
                </div>
              )}
            </div>
          </div>

          {/* Desktop instructions */}
          <div className="desktop-only">
            <div className="summary-instructions">
              <p>
                {applicationStatus === 2
                  ? "Once you submit your application:"
                  : applicationStatus === 4
                  ? "To resubmit your application:"
                  : "Current status information:"}
              </p>
              <ul>
                {statusContent.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            {statusContent.note && (
              <div
                className={`status-specific-note ${getStatusText(
                  applicationStatus
                )
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <strong>Important:</strong> {statusContent.note}
              </div>
            )}
          </div>

          <div className="button-group non-mobile">
            <button
              onClick={() => setCurrentStep("supporting-documents")}
              className="btn btn-outline-primary application-summary-button"
              disabled={isSubmitting}
            >
              ⬅ Back to Documents
            </button>

            <div className="action-buttons">
              {applicationStatus === 4 && (
                <button
                  onClick={handleEditApplication}
                  className="btn btn-outline-secondary application-summary-button edit-button"
                  disabled={isSubmitting}
                >
                  ✏️ Edit Application
                </button>
              )}
              {(applicationStatus === 2 || applicationStatus === 4) && (
                <button
                  onClick={handleFinalSubmit}
                  className="btn btn-primary application-summary-button submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {applicationStatus === 4
                        ? "Resubmitting..."
                        : "Submitting..."}
                    </>
                  ) : applicationStatus === 4 ? (
                    "Resubmit Application 🔄"
                  ) : (
                    "Submit Application 🚀"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile stacked buttons */}
          <div className="mobile-button-stack">
            <button
              onClick={() => setCurrentStep("supporting-documents")}
              className="btn btn-outline-primary"
              disabled={isSubmitting}
            >
              ⬅ Documents
            </button>
            {applicationStatus === 4 && (
              <button
                onClick={handleEditApplication}
                className="btn btn-outline-secondary"
                disabled={isSubmitting}
              >
                ✏️ Edit
              </button>
            )}
            {(applicationStatus === 2 || applicationStatus === 4) && (
              <button
                onClick={handleFinalSubmit}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? applicationStatus === 4
                    ? "Resubmitting..."
                    : "Submitting..."
                  : applicationStatus === 4
                  ? "Resubmit 🔄"
                  : "Submit 🚀"}
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="application-summary-title">
            {applicationStatus === 5
              ? "Application Approved! 🎉"
              : applicationStatus === 4
              ? "Application Rejected"
              : applicationStatus === 3
              ? "Application Under Review 🔍"
              : "Application Submitted ✅"}
          </h2>

          <div
            className={`application-status ${getStatusText(
              applicationStatus || 1
            )
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            <p>
              Current Status:{" "}
              <strong>{getStatusText(applicationStatus || 1)}</strong>
            </p>
          </div>

          <p className="application-summary-text compact-text">
            {getStatusContent(applicationStatus || 1).message}
          </p>

          <div className="mobile-collapse-wrapper">
            <button
              type="button"
              className="collapse-toggle"
              onClick={() => setShowNextStepsMobile((prev) => !prev)}
              aria-expanded={showNextStepsMobile}
            >
              {showNextStepsMobile ? "−" : "+"} Next Steps
            </button>
            <div
              className={`collapse-content ${
                showNextStepsMobile ? "open" : ""
              }`}
            >
              <ul className="compact-ul">
                {getStatusContent(applicationStatus || 1).instructions.map(
                  (instruction, index) => (
                    <li key={index}>{instruction}</li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="desktop-only">
            <div className="next-steps-section">
              <h3>
                {applicationStatus === 5
                  ? "Enrollment Steps"
                  : applicationStatus === 4
                  ? "Resubmission Options"
                  : applicationStatus === 3
                  ? "What Happens Next"
                  : "Next Steps"}
              </h3>
              <ul>
                {getStatusContent(applicationStatus || 1).instructions.map(
                  (instruction, index) => (
                    <li key={index}>{instruction}</li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="submission-details compact-details">
            <p>
              <strong>Applicant:</strong> {userName || getCurrentUser()}
            </p>
            <p>
              <strong>
                {applicationStatus === 4 ? "Rejection" : "Submission"} Date:
              </strong>{" "}
              {formatDate(submissionDate)}
            </p>
          </div>

          {getStatusContent(applicationStatus || 1).note && (
            <div
              className={`status-specific-note submitted ${getStatusText(
                applicationStatus || 1
              )
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              <strong>Note:</strong>{" "}
              {getStatusContent(applicationStatus || 1).note}
            </div>
          )}

          <div className="submitted-action-buttons non-mobile">
            <button
              onClick={() => setCurrentStep("dashboard-home")}
              className="btn btn-primary application-summary-button"
            >
              ⬅ Back to Dashboard
            </button>
            {applicationStatus === 4 && (
              <button
                onClick={handleResubmitRejected}
                className="btn resubmit-button application-summary-button submit-button"
                disabled={isResubmitting}
              >
                {isResubmitting ? "Resubmitting..." : "🔄 Resubmit Application"}
              </button>
            )}
          </div>

          <div className="mobile-button-stack">
            <button
              onClick={() => setCurrentStep("dashboard-home")}
              className="btn btn-primary"
            >
              Dashboard
            </button>
            {applicationStatus === 4 && (
              <button
                onClick={handleResubmitRejected}
                className="btn resubmit-button"
                disabled={isResubmitting}
              >
                {isResubmitting ? "Resubmitting..." : "Resubmit 🔄"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ApplicationSummary;
