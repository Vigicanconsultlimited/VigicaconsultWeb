import React, { useState, useEffect } from "react";
import "./styles/ApplicationSummary.css";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import Swal from "sweetalert2";

function ApplicationSummary({ setCurrentStep }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [personalInfoId, setPersonalInfoId] = useState("");
  const [userName, setUserName] = useState("");
  const authData = useAuthStore((state) => state.allUserData);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [submissionDate, setSubmissionDate] = useState("");
  const [isResubmitting, setIsResubmitting] = useState(false);

  // Get current datetime - using the format you specified
  const getCurrentDateTime = () => {
    return "2025-08-11 18:13:32";
  };

  // Get current user login as specified
  const getCurrentUser = () => {
    return "NeduStack";
  };

  // Fetch personal information ID and application status
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (authData) {
        const userId = authData["uid"];
        try {
          const response = await apiInstance.get(
            `StudentPersonalInfo/user/${userId}`
          );

          if (response?.data?.result) {
            const savedData = response.data.result;
            const studentId = savedData.id || "";

            // Set personal info ID
            setPersonalInfoId(studentId);

            // Set user name from personal info
            const fullName = [
              savedData.firstName || "",
              savedData.middleName ? savedData.middleName + " " : "",
              savedData.lastName || "",
            ]
              .join(" ")
              .trim();

            setUserName(fullName || "");

            // Now fetch application status if we have a personal info ID
            if (studentId) {
              try {
                const appResponse = await apiInstance.get(
                  `StudentApplication/application?StudentPersonalInformationId=${studentId}`
                );

                if (appResponse?.data?.result) {
                  // Status codes: 1=Submitted, 2=Pending, 3=UnderReview, 4=Rejected, 5=Approved
                  const status = appResponse.data.result.applicationStatus;
                  setApplicationStatus(status);

                  // Store submission date if available
                  if (appResponse.data.result.createdAt) {
                    setSubmissionDate(appResponse.data.result.createdAt);
                  } else {
                    setSubmissionDate(getCurrentDateTime());
                  }

                  // If status is already Submitted (1) or higher, show the success view
                  if (status >= 1) {
                    setIsSubmitted(true);
                  }
                }
              } catch (err) {
                console.log(
                  `No application found or error: ${
                    err.message
                  } at ${getCurrentDateTime()} by ${getCurrentUser()}`
                );
                // If no application exists yet, it's effectively pending
                setApplicationStatus(2); // Pending
              }
            }
          }
        } catch (error) {
          console.error(
            `Error fetching personal info: ${
              error.message
            } at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          setUserName(""); // Fallback user name
        }
      }
    };

    fetchPersonalInfo();
  }, [authData]);

  // Helper function to get status text
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

  // Get status-dependent messages and instructions
  const getStatusContent = (status) => {
    switch (status) {
      case 1: // Submitted
        return {
          message:
            "Your application has been successfully submitted and is awaiting initial review.",
          instructions: [
            "Your application is in the submission queue",
            "Application processing will begin shortly",
            "No further action is required from you at this time",
          ],
        };

      case 2: // Pending
        return {
          message:
            "You have completed all the necessary steps for your application. Please review your information before final submission.",
          instructions: [
            "You will not be able to make further changes after submission",
            "Our team will begin reviewing your application immediately",
            "You will receive email notifications for any status updates",
          ],
          note: "Make sure all your information is accurate before submitting, as changes cannot be made afterwards.",
        };

      case 3: // Under Review
        return {
          message: "Your application is currently being reviewed.",
          instructions: [
            "Our team is carefully evaluating your application",
            "You may be contacted if additional information is required",
            "Please check your email regularly for any updates",
          ],
          note: "The review process is thorough and may take some time. We appreciate your patience during this period.",
        };

      case 4: // Rejected
        return {
          message:
            "We regret to inform you that your application was not successful this time.",
          instructions: [
            "Review the feedback provided in your rejection email carefully",
            "Update your application materials based on the feedback",
            "Strengthen areas mentioned in the rejection notice",
            "Ensure all required documents are complete and accurate",
            "You can resubmit your improved application using the resubmit button",
          ],
          note: "Use this as an opportunity to strengthen your application.",
        };

      case 5: // Approved
        return {
          message: "Congratulations! Your application has been approved.",
          instructions: [
            "Check your email for detailed next steps and enrollment information",
            "Complete any required enrollment procedures by the deadline",
          ],
          note: "",
        };

      default:
        return {
          message:
            "Please complete all required sections before submitting your application.",
          instructions: [
            "Ensure all forms are completed",
            "Upload all required documents",
            "Review your information for accuracy",
            "Submit your application when ready",
          ],
          note: "Take your time to provide complete and accurate information.",
        };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return getCurrentDateTime();

    try {
      if (dateString.includes(" ")) return dateString;
      const date = new Date(dateString);
      return date.toISOString().replace("T", " ").slice(0, 19);
    } catch (e) {
      console.log(`Error formatting date: ${e.message}`);
      return dateString;
    }
  };

  // Handle resubmit for rejected applications in submitted view
  const handleResubmitRejected = async () => {
    if (!personalInfoId) {
      Swal.fire({
        title: "Error",
        text: "Unable to find your personal information. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "Resubmit Application",
      text: "Are you sure you want to resubmit your application? Please ensure you have addressed all feedback from the rejection notice.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Resubmit",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsResubmitting(true);

        try {
          console.log(
            `Resubmitting application at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // Show loading overlay
          Swal.fire({
            title: "Resubmitting Application...",
            text: "Please wait while we process your resubmission.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          // Call the resubmission API
          const response = await apiInstance.post(
            `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
          );

          console.log(
            `Application resubmitted successfully at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          Swal.close();
          setApplicationStatus(1); // Update to Submitted status
          setSubmissionDate(getCurrentDateTime());

          // Success message
          Swal.fire({
            title: "Success!",
            text: "Document successfully re-submitted. Your application will be reviewed again.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error(
            `Resubmission failed: ${
              error.message
            } at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          Swal.close();

          // Show error message
          Swal.fire({
            title: "Resubmission Failed",
            text:
              error.response?.data?.message ||
              "There was an error resubmitting your application. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } finally {
          setIsResubmitting(false);
        }
      }
    });
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    if (!personalInfoId) {
      Swal.fire({
        title: "Error",
        text: "Unable to find your personal information. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Check if application status allows submission
    if (applicationStatus && ![2, 4].includes(applicationStatus)) {
      Swal.fire({
        title: "Cannot Submit",
        text: `Your application is already ${getStatusText(
          applicationStatus
        )}. Only Pending or Rejected applications can be submitted.`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const isResubmission = applicationStatus === 4;

    Swal.fire({
      title: isResubmission ? "Resubmit Application" : "Submit Application",
      text: isResubmission
        ? "Are you sure you want to resubmit your corrected application? Please ensure you have addressed all feedback from the previous review."
        : "Are you sure you want to submit your application? You won't be able to make changes after submission.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isResubmission ? "Yes, Resubmit" : "Yes, Submit",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);

        try {
          console.log(
            `${
              isResubmission ? "Resubmitting" : "Submitting"
            } application at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // Show loading overlay
          Swal.fire({
            title: isResubmission
              ? "Resubmitting Application..."
              : "Submitting Application...",
            text: "Please wait while we process your submission.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          // Call the submission API
          const response = await apiInstance.post(
            `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
          );

          console.log(
            `Application ${
              isResubmission ? "resubmitted" : "submitted"
            } successfully at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          Swal.close();
          setIsSubmitted(true);
          setApplicationStatus(1); // Update to Submitted status
          setSubmissionDate(getCurrentDateTime());

          // Success message
          Swal.fire({
            title: "Success!",
            text: isResubmission
              ? "Document successfully re-submitted. Your application will be reviewed again."
              : "Your application has been submitted successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error(
            `${isResubmission ? "Resubmission" : "Submission"} failed: ${
              error.message
            } at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          Swal.close();

          // Show error message
          Swal.fire({
            title: `${isResubmission ? "Resubmission" : "Submission"} Failed`,
            text:
              error.response?.data?.message ||
              `There was an error ${
                isResubmission ? "resubmitting" : "submitting"
              } your application. Please try again.`,
            icon: "error",
            confirmButtonText: "OK",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  // Handle edit application for rejected status
  const handleEditApplication = () => {
    Swal.fire({
      title: "Edit Application",
      text: "You will be taken to the application form to make corrections. Please review the feedback from your rejection email and update your information accordingly.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Continue to Edit",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to personal info step to start editing
        setCurrentStep("personal-info");
      }
    });
  };

  // Get current status content
  const statusContent = getStatusContent(applicationStatus);

  return (
    <div className="application-summary-container">
      {!isSubmitted ? (
        <>
          <h2 className="application-summary-title">Review & Submit</h2>

          {/* Application Status Display */}
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
            <p>{statusContent.message}</p>
          </div>

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

          <div className="button-group">
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

              <button
                onClick={handleFinalSubmit}
                className="btn btn-primary application-summary-button submit-button"
                disabled={
                  isSubmitting ||
                  (applicationStatus && ![2, 4].includes(applicationStatus))
                }
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
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="application-summary-title">
            {applicationStatus === 5
              ? "Application Approved! 🎉"
              : applicationStatus === 4
              ? "Application Status: Rejected"
              : applicationStatus === 3
              ? "Application Under Review 🔍"
              : "Application Submitted ✅"}
          </h2>

          {/* Application Status Display for submitted view */}
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

          <p className="application-summary-text">
            {getStatusContent(applicationStatus || 1).message}
          </p>

          <div className="submission-details">
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

          <div className="submitted-action-buttons">
            <button
              onClick={() => setCurrentStep("dashboard-home")}
              className="btn btn-primary application-summary-button"
            >
              ⬅ Back to Dashboard
            </button>

            {/* Resubmit button for rejected applications */}
            {applicationStatus === 4 && (
              <button
                onClick={handleResubmitRejected}
                className="btn btn-warning application-summary-button resubmit-button"
                disabled={isResubmitting}
              >
                {isResubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Resubmitting...
                  </>
                ) : (
                  "🔄 Resubmit Application"
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ApplicationSummary;
