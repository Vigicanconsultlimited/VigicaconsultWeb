import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "./styles/StudentDashboard.css";
import Swal from "sweetalert2";

// Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-08-11 16:30:08
// Current User's Login: NeduStack

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

export default function StudentDashboard({
  setCurrentStep,
  handleStartApplication,
}) {
  const authData = useAuthStore((state) => state.allUserData);
  const [applications, setApplications] = useState([]);
  const [availableApplications, setAvailableApplications] = useState([]);
  const [submittedAcademicApps, setSubmittedAcademicApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [personalInfoId, setPersonalInfoId] = useState("");
  const [applicationStatus, setApplicationStatus] = useState(null);

  const navigate = useNavigate();
  const userId = authData?.uid;
  const userEmail =
    authData?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let submittedApps = [];
        let personalInfoData = null;
        let currentPersonalInfoId = null;
        let fetchedApplicationStatus = null;

        // Step 1: Get StudentPersonalInformationId (with individual error handling)
        try {
          const personalRes = await apiInstance.get(
            `StudentPersonalInfo/user/${userId}`
          );
          const personalInfo = personalRes?.data?.result;
          currentPersonalInfoId = personalInfo?.id;
          setPersonalInfoId(currentPersonalInfoId); // Store for delete operations

          // Set display name from personal info
          if (personalInfo?.firstName && personalInfo?.lastName) {
            setDisplayName(
              `${personalInfo.firstName} ${personalInfo.lastName}`
            );
          }

          // Step 2: Fetch application status first if we have personalInfoId
          if (currentPersonalInfoId) {
            try {
              const appResponse = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${currentPersonalInfoId}`
              );

              if (appResponse?.data?.result) {
                // Status codes: 1=Submitted, 2=Pending, 3=UnderReview, 4=Rejected, 5=Approved
                const status = appResponse.data.result.applicationStatus;
                setApplicationStatus(status);
                fetchedApplicationStatus = status;
              }
            } catch (statusErr) {
              console.log(
                `No application found or error: ${statusErr.message}`
              );
              // If no application exists yet, it's effectively pending
              setApplicationStatus(2); // Pending
              fetchedApplicationStatus = 2;
            }

            // Step 3: Get submitted general applications
            try {
              const submittedAppRes = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${currentPersonalInfoId}`
              );

              submittedApps = submittedAppRes?.data?.result || [];
              personalInfoData =
                submittedAppRes?.data?.result?.personalInformation;

              setApplications(
                Array.isArray(submittedApps) ? submittedApps : [submittedApps]
              );
            } catch (appErr) {
              console.warn(`Error fetching applications: ${appErr.message}`);
              // Don't stop execution, continue to fetch other data
            }

            // Step 4: Get submitted academic applications using the new API
            try {
              const academicAppRes = await apiInstance.get(
                `Academic/StudentInformationId?PersonalInformationId=${currentPersonalInfoId}`
              );

              if (
                academicAppRes?.data?.result &&
                academicAppRes.data.statusCode === 201
              ) {
                const academicData = academicAppRes.data.result;

                // Format the academic application data to match the table structure
                const formattedAcademicApp = {
                  id: academicData.id,
                  school: academicData.schoolResponse?.name || "Unknown School",
                  description:
                    academicData.program?.description || "Unknown Program",
                  course:
                    academicData.courseOfInterest?.name || "Unknown Course",
                  faculty: academicData.program?.faculty || "Unknown Faculty",
                  programLevel: academicData.program?.programLevel || 0,
                  duration: academicData.program?.durationInYears || 0,
                  type: "academic", // Mark as academic application
                  address: academicData.schoolResponse?.addresss || "",
                  town: academicData.schoolResponse?.town || "",
                  county: academicData.schoolResponse?.county || "",
                  postCode: academicData.schoolResponse?.postCode || "",
                  // Store the exact program ID for comparison
                  appliedProgramId: academicData.program?.id || null,
                  // Use the fetched application status
                  applicationStatus: fetchedApplicationStatus || 2, // Default to Pending if not found
                  isSubmitted: fetchedApplicationStatus >= 1, // Submitted if status is 1 or higher
                  submittedAt: academicData.submittedAt || null,
                  updatedAt: academicData.updatedAt || null,
                };

                setSubmittedAcademicApps([formattedAcademicApp]);
              } else {
                setSubmittedAcademicApps([]);
              }
            } catch (academicErr) {
              console.warn(
                `Error fetching academic applications: ${academicErr.message}`
              );
              setSubmittedAcademicApps([]);
            }
          }
        } catch (personalErr) {
          console.warn(`Error fetching personal info: ${personalErr.message}`);
          // Don't stop execution, continue to fetch programs
        }

        // Step 5: Get available programs (always execute this, regardless of previous errors)
        try {
          const availableRes = await apiInstance.get(`AcademicProgram`);

          if (availableRes?.data?.result) {
            setAvailableApplications(availableRes.data.result);
          } else {
            console.warn("No programs found in response");
            setAvailableApplications([]);
          }
        } catch (programErr) {
          console.error(`Error fetching programs: ${programErr.message}`);
          console.error("Full error details:", programErr);
          setAvailableApplications([]);
        }
      } catch (err) {
        console.error(`General error in fetchData: ${err.message}`);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    if (userId) {
      fetchData();
    } else {
      console.warn("No userId found");
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [userId]);

  // Helper function to get program level text
  const getProgramLevelText = (level) => {
    const levels = {
      0: "Undergraduate",
      1: "Masters",
      2: "PhD",
      3: "Certificate",
    };
    return levels[level] || "Other";
  };

  // Helper function to get status text (matching ApplicationSummary)
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

  // Helper function to get status badge based on applicationStatus codes
  const getStatusBadge = (applicationStatus) => {
    // Status codes: 1=Submitted, 2=Pending, 3=UnderReview, 4=Rejected, 5=Approved
    switch (applicationStatus) {
      case 1:
        return <span className="badge bg-primary">Submitted</span>;
      case 2:
        return <span className="badge bg-warning">Pending</span>;
      case 3:
        return <span className="badge bg-info">Under Review</span>;
      case 4:
        return <span className="badge bg-danger">Rejected</span>;
      case 5:
        return <span className="badge bg-success">Approved</span>;
      case 0:
      default:
        return <span className="badge bg-secondary">Draft</span>;
    }
  };

  // Helper function to check if application can be edited (matching ApplicationSummary logic)
  const canEditApplication = (app) => {
    // Can only edit if status is Pending (2) or Rejected (4)
    return [2, 4].includes(app.applicationStatus);
  };

  // Helper function to check if a specific program has been applied for
  const isProgramApplied = (programId) => {
    return submittedAcademicApps.some(
      (app) => app.appliedProgramId === programId
    );
  };

  // Helper function to get applied program IDs
  const getAppliedProgramIds = () => {
    return submittedAcademicApps
      .map((app) => app.appliedProgramId)
      .filter(Boolean);
  };

  // Contact Support Modal Function
  const handleContactSupport = async (
    applicationId = null,
    applicationDetails = null
  ) => {
    const { value: formValues } = await Swal.fire({
      title: "Contact Support",
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 15px;">
            <label for="subject" style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Subject *</label>
            <select id="subject" class="swal2-select" style="width: 100%; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px;">
              <option value="">Select a subject</option>
              <option value="Application Status Inquiry">Application Status Inquiry</option>
              <option value="Document Upload Issue">Document Upload Issue</option>
              <option value="Application Editing Problem">Application Editing Problem</option>
              <option value="Payment Related">Payment Related</option>
              <option value="Technical Support">Technical Support</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label for="priority" style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Priority Level</label>
            <select id="priority" class="swal2-select" style="width: 100%; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px;">
              <option value="low">Low - General inquiry</option>
              <option value="medium" selected>Medium - Standard request</option>
              <option value="high">High - Urgent issue</option>
            </select>
          </div>

          ${
            applicationDetails
              ? `
          <div style="margin-bottom: 15px; padding: 10px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <strong>Application Details:</strong><br>
            <small>School: ${applicationDetails.school}</small><br>
            <small>Program: ${applicationDetails.description}</small><br>
            <small>Status: ${getStatusText(
              applicationDetails.applicationStatus
            )}</small>
          </div>
          `
              : ""
          }

          <div style="margin-bottom: 15px;">
            <label for="message" style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Message *</label>
            <textarea id="message" class="swal2-textarea" placeholder="Please describe your issue or inquiry in detail..." style="width: 100%; min-height: 120px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px; resize: vertical;"></textarea>
          </div>

          <div style="margin-bottom: 10px;">
            <label for="email" style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Contact Email</label>
            <input id="email" class="swal2-input" type="email" value="${
              userEmail || ""
            }" placeholder="your.email@example.com" style="width: 100%; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px; margin: 0;">
          </div>

          <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">
            <i class="fas fa-info-circle"></i> Our support team typically responds within 24-48 hours during business days.
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Send Message",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      width: "600px",
      customClass: {
        container: "support-modal-container",
      },
      preConfirm: () => {
        const subject = document.getElementById("subject").value;
        const priority = document.getElementById("priority").value;
        const message = document.getElementById("message").value;
        const email = document.getElementById("email").value;

        if (!subject) {
          Swal.showValidationMessage("Please select a subject");
          return false;
        }
        if (!message || message.trim().length < 10) {
          Swal.showValidationMessage(
            "Please enter a detailed message (at least 10 characters)"
          );
          return false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Swal.showValidationMessage("Please enter a valid email address");
          return false;
        }

        return {
          subject: subject,
          priority: priority,
          message: message.trim(),
          email: email,
          applicationId: applicationId,
          applicationDetails: applicationDetails,
        };
      },
    });

    if (formValues) {
      // Show sending message
      Swal.fire({
        title: "Sending Message...",
        text: "Please wait while we send your message to our support team.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        // Simulate API call for sending support message
        // Replace this with your actual support API endpoint
        const supportData = {
          subject: formValues.subject,
          priority: formValues.priority,
          message: formValues.message,
          contactEmail: formValues.email,
          userId: userId,
          personalInfoId: personalInfoId,
          applicationId: formValues.applicationId,
          applicationDetails: formValues.applicationDetails,
          timestamp: "2025-08-11 16:30:08",
          submittedBy: "NeduStack",
        };

        // For now, we'll simulate the API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Success response
        Swal.fire({
          title: "Message Sent Successfully!",
          html: `
            <div style="text-align: center;">
              <i class="fas fa-check-circle" style="font-size: 48px; color: #10b981; margin-bottom: 15px;"></i>
              <p>Your support request has been submitted successfully.</p>
              <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: left;">
                <strong>Ticket Details:</strong><br>
                <small><strong>Subject:</strong> ${
                  formValues.subject
                }</small><br>
                <small><strong>Priority:</strong> ${formValues.priority.toUpperCase()}</small><br>
                <small><strong>Submitted:</strong> 2025-08-11 16:30:08</small><br>
                <small><strong>Reference ID:</strong> SUP-${Date.now()
                  .toString()
                  .slice(-6)}</small>
              </div>
              <p style="font-size: 14px; color: #6b7280;">
                Our support team will review your request and respond to <strong>${
                  formValues.email
                }</strong> within 24-48 hours.
              </p>
            </div>
          `,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981",
        });

        // Show success toast
        Toast.fire({
          icon: "success",
          title: "Support request submitted successfully!",
        });
      } catch (error) {
        console.error("Error sending support message:", error);

        Swal.fire({
          title: "Failed to Send Message",
          text: "There was an error sending your message. Please try again later or contact support directly.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
        });

        Toast.fire({
          icon: "error",
          title: "Failed to send support request",
        });
      }
    }
  };

  const handleEdit = (app) => {
    if (!canEditApplication(app)) {
      Toast.fire({
        icon: "warning",
        title: "Cannot edit application",
        text: `This application is ${getStatusText(
          app.applicationStatus
        ).toLowerCase()} and cannot be modified. Only Pending or Rejected applications can be edited.`,
      });
      return;
    }

    navigate("/dashboard", {
      state: { step: "saved-personal-info", applicationId: app.id },
    });
  };

  // Updated delete function for general applications using SweetAlert
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Delete Application",
        text: "Are you sure you want to delete this application? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete your application.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await apiInstance.delete(`StudentApplication/${id}`);
        setApplications(applications.filter((app) => app.id !== id));

        Swal.close();
        Toast.fire({
          icon: "success",
          title: "Application deleted successfully!",
        });
      }
    } catch (err) {
      console.error(
        `Delete failed for general application ${id}: ${err.message}`
      );

      Swal.close();
      Toast.fire({
        icon: "error",
        title: "Failed to delete application. Please try again.",
      });
    }
  };

  // New delete function for academic applications using SweetAlert
  const handleDeleteAcademic = async (app) => {
    if (!canEditApplication(app)) {
      Toast.fire({
        icon: "warning",
        title: "Cannot delete application",
        text: `This application is ${getStatusText(
          app.applicationStatus
        ).toLowerCase()} and cannot be deleted. Only Pending or Rejected applications can be deleted.`,
      });
      return;
    }

    if (!personalInfoId) {
      console.error(
        "Cannot delete academic application - missing personalInfoId"
      );
      Toast.fire({
        icon: "error",
        title: "Unable to delete application. Please refresh the page.",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Delete Academic Application",
        html: `
          <p>Are you sure you want to delete this academic application?</p>
          <p><strong>This action cannot be undone and will remove:</strong></p>
          <ul style="text-align: left; margin: 10px 0;">
            <li>Your program selection</li>
            <li>School information</li>
            <li>Course preferences</li>
          </ul>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          htmlContainer: "text-start",
        },
      });

      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: "Deleting Academic Application...",
          text: "Please wait while we delete your academic application.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Use the Academic delete API with studentPersonalInformationId
        await apiInstance.delete(
          `Academic?StudentPersonalInformationId=${personalInfoId}`
        );

        // Remove from local state
        setSubmittedAcademicApps([]);
        setApplicationStatus(null);

        Swal.close();

        // Show success message with details
        await Swal.fire({
          title: "Application Deleted!",
          text: "Your academic application has been successfully deleted. You can now apply for other programs.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error(
        `Delete failed for academic application ${app.id}: ${err.message}`
      );

      Swal.close();

      // Show user-friendly error message
      if (err.response?.status === 404) {
        Toast.fire({
          icon: "info",
          title: "Application not found. It may have already been deleted.",
        });
        // Remove from local state anyway since it doesn't exist on server
        setSubmittedAcademicApps([]);
        setApplicationStatus(null);
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to delete application. Please try again later.",
        });
      }
    }
  };

  // Modified to use the parent component's handleStartApplication
  const onStartApplication = (school, description) => {
    // Check if parent provided the handler
    if (typeof handleStartApplication === "function") {
      // Use the parent's handler which will set the school/program and change step
      handleStartApplication(school, description);
    } else {
      // Fallback to direct step change if handler not provided
      console.warn(
        "handleStartApplication not provided, falling back to direct step change"
      );
      setCurrentStep("academic-info");
    }
  };

  // Calculate total applications (general + academic)
  const totalApplications = submittedAcademicApps.length;
  const hasAnyApplications = totalApplications > 0;

  // Check if any application is already submitted (to disable Apply buttons)
  const hasSubmittedApplications = hasAnyApplications;
  const appliedProgramIds = getAppliedProgramIds();

  // Check if user has any submitted applications (cannot edit)
  const hasSubmittedNonEditableApp = submittedAcademicApps.some(
    (app) => !canEditApplication(app)
  );

  if (!initialLoadComplete) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="welcome-card">
        <h2 className="fs-4">
          Welcome, {displayName || authData?.fullName || userEmail}
        </h2>
        <p className="subtitle">This is your application dashboard</p>

        {hasAnyApplications ? (
          <>
            <h3>{totalApplications} Application(s) Found</h3>
            {applicationStatus && (
              <div
                className={`application-status ${getStatusText(
                  applicationStatus
                )
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <p>
                  Current Application Status:{" "}
                  <strong>{getStatusText(applicationStatus)}</strong>
                </p>
              </div>
            )}
            {hasSubmittedNonEditableApp ? (
              <div className="alert alert-primary mb-2 mt-0 p-2">
                <p>
                  <strong>Notice:</strong> Your application cannot be edited at
                  this time.
                </p>
              </div>
            ) : (
              <>
                <p>You have an open application. Continue to make changes.</p>
                <button
                  className="btn btn-success"
                  onClick={() => setCurrentStep("personal-info")}
                >
                  Continue Editing
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {availableApplications.length > 0 && (
              <>
                <h3>{availableApplications.length} Available Program(s)</h3>
                <p className="mb-0">You can start a new application here:</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentStep("personal-info")}
                  disabled={hasSubmittedApplications}
                >
                  {hasSubmittedApplications
                    ? "✅ Application Submitted"
                    : "➕ Start New Application"}
                </button>
                {hasSubmittedApplications && (
                  <small className="text-muted d-block mt-1">
                    You already have an active application. Delete existing
                    application to create a new one (only if status allows).
                  </small>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="dashboard-section">
        {/* Your Applications */}
        <h3 className="section-title">📂 Your Applications</h3>
        <div className="table-container responsive-table">
          {loading ? (
            <div className="table-loading">
              <div className="small-spinner"></div>
              <span>Loading applications...</span>
            </div>
          ) : !hasAnyApplications ? (
            <p className="p-2">No applications found.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th></th>
                  <th>School Name</th>
                  <th>Program</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Academic Applications */}
                {submittedAcademicApps.map((app) => (
                  <tr key={`academic-${app.id}`}>
                    <td data-label="Select">
                      <input type="checkbox" />
                    </td>
                    <td data-label="School Name">{app.school}</td>
                    <td data-label="Program">{app.description}</td>
                    <td data-label="Level">
                      {getProgramLevelText(app.programLevel)}
                    </td>
                    <td data-label="Status">
                      {getStatusBadge(app.applicationStatus)}
                    </td>
                    <td data-label="Action" className="actions">
                      <button
                        className="icon-btn"
                        title="Contact Support"
                        onClick={() => handleContactSupport(app.id, app)}
                      >
                        <i className="fas fa-envelope"></i>
                      </button>
                      <button
                        className={`icon-btn ${
                          !canEditApplication(app) ? "disabled" : ""
                        }`}
                        onClick={() => handleEdit(app)}
                        title={
                          canEditApplication(app)
                            ? "Edit Academic Application"
                            : `Cannot edit ${getStatusText(
                                app.applicationStatus
                              ).toLowerCase()} application - only Pending or Rejected applications can be edited`
                        }
                        disabled={!canEditApplication(app)}
                      >
                        {canEditApplication(app) ? "✏️" : "🔒"}
                      </button>
                      <button
                        className={`icon-btn ${
                          !canEditApplication(app) ? "disabled" : ""
                        }`}
                        onClick={() => handleDeleteAcademic(app)}
                        title={
                          canEditApplication(app)
                            ? "Delete Academic Application"
                            : `Cannot delete ${getStatusText(
                                app.applicationStatus
                              ).toLowerCase()} application - only Pending or Rejected applications can be deleted`
                        }
                        style={{
                          color: canEditApplication(app)
                            ? "#dc3545"
                            : "#6c757d",
                        }}
                        disabled={!canEditApplication(app)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Available Applications */}
        <h3 className="section-title mt-4">🎓 Available Programs</h3>
        <div className="table-container responsive-table">
          {loading ? (
            <div className="table-loading">
              <div className="small-spinner"></div>
              <span>Loading programs...</span>
            </div>
          ) : availableApplications.length === 0 ? (
            <p className="p-2">No available programs at the moment.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Faculty</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {availableApplications.map((app, index) => {
                  const isThisProgramApplied = isProgramApplied(app.id);
                  const isAnyOtherProgramApplied =
                    hasSubmittedApplications && !isThisProgramApplied;

                  return (
                    <tr key={index}>
                      <td>{app.description || "General"}</td>
                      <td>{app.faculty || "General"}</td>
                      <td>{getProgramLevelText(app.programLevel)}</td>
                      <td>{app.durationInYears} years</td>
                      <td>
                        <button
                          className={`apply-btn ${
                            isThisProgramApplied || isAnyOtherProgramApplied
                              ? "disabled"
                              : ""
                          }`}
                          onClick={() =>
                            !isThisProgramApplied &&
                            !isAnyOtherProgramApplied &&
                            setCurrentStep("personal-info")
                          }
                          disabled={
                            isThisProgramApplied || isAnyOtherProgramApplied
                          }
                          title={
                            isThisProgramApplied
                              ? "You have already applied for this program"
                              : isAnyOtherProgramApplied
                              ? "You have applied for another program. Delete existing application to apply for this one (only if status allows)."
                              : "Apply for this program"
                          }
                        >
                          {isThisProgramApplied
                            ? "✅ Applied"
                            : isAnyOtherProgramApplied
                            ? "🚫 You have an Open Application"
                            : "➕ Apply"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
