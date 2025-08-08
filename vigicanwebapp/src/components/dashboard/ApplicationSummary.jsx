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

  // Get current datetime - using the format you specified
  const getCurrentDateTime = () => {
    return "2025-08-06 11:34:45";
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
          console.log(
            `Fetching personal info for user ${userId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

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
                console.log(
                  `Fetching application status for student ID ${studentId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
                );

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

                  console.log(
                    `Application status: ${getStatusText(
                      status
                    )} (${status}) at ${getCurrentDateTime()} by ${getCurrentUser()}`
                  );

                  // If status is already Submitted (1), show the success view
                  if (status === 1) {
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return getCurrentDateTime();

    // Try to parse the date, if it fails, return the original string
    try {
      // If it's already in the right format, just return it
      if (dateString.includes(" ")) return dateString;

      const date = new Date(dateString);
      return date.toISOString().replace("T", " ").slice(0, 19);
    } catch (e) {
      console.log(`Error formatting date: ${e.message}`);
      return dateString;
    }
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

    Swal.fire({
      title: "Submit Application",
      text: "Are you sure you want to submit your application? You won't be able to make changes after submission.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);

        try {
          console.log(
            `Submitting application at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // Show loading overlay
          Swal.fire({
            title: "Submitting Application...",
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
            `Application submitted successfully at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          console.log("API Response:", response.data);

          Swal.close();
          setIsSubmitted(true);
          setApplicationStatus(1); // Update to Submitted status
          setSubmissionDate(getCurrentDateTime());

          // Success message
          Swal.fire({
            title: "Success!",
            text: "Your application has been submitted successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error(
            `Submission failed: ${
              error.message
            } at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          Swal.close();

          // Show error message
          Swal.fire({
            title: "Submission Failed",
            text:
              error.response?.data?.message ||
              "There was an error submitting your application. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  return (
    <div className="application-summary-container">
      {!isSubmitted ? (
        <>
          <h2 className="application-summary-title">Review & Submit</h2>

          <div className="summary-message">
            <p>
              You have completed all the necessary steps for your application.
              Please review your information before final submission.
            </p>
          </div>

          <div className="summary-icon">📝</div>

          {applicationStatus && (
            <div
              className={`application-status ${getStatusText(applicationStatus)
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              Current Status:{" "}
              <strong>{getStatusText(applicationStatus)}</strong>
              {applicationStatus !== 2 && applicationStatus !== 4 && (
                <div className="status-note">
                  Note: Your application cannot be edited or resubmitted in its
                  current status.
                </div>
              )}
            </div>
          )}

          <div className="summary-instructions">
            <p>Once you submit your application:</p>
            <ul>
              <li>
                Your application status will change from "Pending" to
                "Submitted"
              </li>
              <li>You will not be able to make further changes</li>
              <li>Our team will begin reviewing your application</li>
            </ul>
          </div>

          <div className="button-group">
            <button
              onClick={() => setCurrentStep("academic-documents")}
              className="btn btn-outline-primary application-summary-button"
              disabled={isSubmitting}
            >
              ⬅ Back to Documents
            </button>

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
                  Submitting...
                </>
              ) : (
                "Submit Application 🚀"
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/*
          <div className="success-icon">✅</div>
          */}

          <h2 className="application-summary-title">
            Application Submitted ✅
          </h2>

          <div className="application-status submitted">
            <strong>Status: {getStatusText(applicationStatus || 1)}</strong>
          </div>

          <p className="application-summary-text">
            Your application has been submitted and is now under review. You
            will be notified of any updates or decisions regarding your
            application.
          </p>

          <div className="submission-details">
            <p>
              <strong>Applicant:</strong> {userName || getCurrentUser()}
            </p>
            <p>
              <strong>Submission Date:</strong> {formatDate(submissionDate)}
            </p>
            <p>
              <strong>Application ID:</strong> {personalInfoId.substring(0, 8)}
            </p>
          </div>

          <div className="next-steps-section">
            <h3>Next Steps</h3>
            <ul>
              <li>Your application will be reviewed by our admissions team</li>
              <li>You may be contacted for additional information if needed</li>
              <li>The review process typically takes 2-4 weeks</li>
              <li>Check your email regularly for updates</li>
            </ul>
          </div>

          <button
            onClick={() => setCurrentStep("dashboard-home")}
            className="btn btn-primary application-summary-button"
          >
            ⬅ Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default ApplicationSummary;
