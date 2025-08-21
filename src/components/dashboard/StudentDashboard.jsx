import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "./styles/StudentDashboard.css";
import Swal from "sweetalert2";

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
        let currentPersonalInfoId = null;
        let fetchedApplicationStatus = null;

        // Personal Info
        try {
          const personalRes = await apiInstance.get(
            `StudentPersonalInfo/user/${userId}`
          );
          const personalInfo = personalRes?.data?.result;
          currentPersonalInfoId = personalInfo?.id;
          setPersonalInfoId(currentPersonalInfoId);

          if (personalInfo?.firstName && personalInfo?.lastName) {
            setDisplayName(
              `${personalInfo.firstName} ${personalInfo.lastName}`
            );
          }

          // Application Status
          if (currentPersonalInfoId) {
            try {
              const appResponse = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${currentPersonalInfoId}`
              );
              if (appResponse?.data?.result) {
                const status = appResponse.data.result.applicationStatus;
                setApplicationStatus(status);
                fetchedApplicationStatus = status;
              }
            } catch {
              setApplicationStatus(2);
              fetchedApplicationStatus = 2;
            }

            // Submitted Applications (general)
            try {
              const submittedAppRes = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${currentPersonalInfoId}`
              );
              submittedApps = submittedAppRes?.data?.result || [];
              setApplications(
                Array.isArray(submittedApps) ? submittedApps : [submittedApps]
              );
            } catch {
              /* ignore */
            }

            // Academic Applications
            try {
              const academicAppRes = await apiInstance.get(
                `Academic/StudentInformationId?PersonalInformationId=${currentPersonalInfoId}`
              );

              if (
                academicAppRes?.data?.result &&
                academicAppRes.data.statusCode === 201
              ) {
                const academicData = academicAppRes.data.result;
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
                  type: "academic",
                  appliedProgramId: academicData.program?.id || null,
                  applicationStatus: fetchedApplicationStatus || 2,
                  isSubmitted: (fetchedApplicationStatus || 2) >= 1,
                  submittedAt: academicData.submittedAt || null,
                  updatedAt: academicData.updatedAt || null,
                };
                setSubmittedAcademicApps([formattedAcademicApp]);
              } else {
                setSubmittedAcademicApps([]);
              }
            } catch {
              setSubmittedAcademicApps([]);
            }
          }
        } catch {
          // proceed gracefully
        }

        // Available Programs
        try {
          const availableRes = await apiInstance.get(`AcademicProgram`);
          if (availableRes?.data?.result) {
            setAvailableApplications(availableRes.data.result);
          } else {
            setAvailableApplications([]);
          }
        } catch {
          setAvailableApplications([]);
        }
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [userId]);

  // Helpers
  const getProgramLevelText = (level) => {
    const levels = {
      0: "Undergraduate",
      1: "Masters",
      2: "PhD",
      3: "Certificate",
    };
    return levels[level] || "Other";
  };

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

  const getStatusBadge = (applicationStatus) => {
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
      default:
        return <span className="badge bg-secondary">Draft</span>;
    }
  };

  const canEditApplication = (app) => [2, 4].includes(app.applicationStatus);

  const isProgramApplied = (programId) =>
    submittedAcademicApps.some((app) => app.appliedProgramId === programId);

  // Contact Support
  const handleContactSupport = async (
    applicationId = null,
    applicationDetails = null
  ) => {
    const { value: formValues } = await Swal.fire({
      title: "Contact Support",
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 15px;">
            <label for="subject" style="display:block;margin-bottom:5px;font-weight:600;color:#374151;">Subject *</label>
            <select id="subject" class="swal2-select" style="width:100%;padding:8px;border:2px solid #e5e7eb;border-radius:6px;">
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
          ${
            applicationDetails
              ? `
            <div style="margin-bottom:15px;padding:10px;background:#f8fafc;border-radius:6px;border-left:4px solid #3b82f6;">
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
          <div style="margin-bottom:15px;">
            <label for="message" style="display:block;margin-bottom:5px;font-weight:600;color:#374151;">Message *</label>
            <textarea id="message" class="swal2-textarea" placeholder="Describe your issue..." style="width:100%;min-height:120px;padding:8px;border:2px solid #e5e7eb;border-radius:6px;resize:vertical;"></textarea>
          </div>
          <div style="margin-bottom:10px;">
            <label for="email" style="display:block;margin-bottom:5px;font-weight:600;color:#374151;">Contact Email</label>
            <input id="email" class="swal2-input" type="email" value="${
              userEmail || ""
            }" placeholder="your.email@example.com" style="width:100%;padding:8px;border:2px solid #e5e7eb;border-radius:6px;margin:0;">
          </div>
          <div style="font-size:12px;color:#6b7280;margin-top:10px;">
            <i class="fas fa-info-circle"></i> We reply within 24-48 business hours.
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Send Message",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      width: "600px",
      preConfirm: () => {
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;
        const email = document.getElementById("email").value;
        if (!subject) {
          Swal.showValidationMessage("Please select a subject");
          return false;
        }
        if (!message || message.trim().length < 10) {
          Swal.showValidationMessage(
            "Please enter at least 10 characters for the message"
          );
          return false;
        }
        if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
          Swal.showValidationMessage("Enter a valid email address");
          return false;
        }
        return {
          subject,
          message: message.trim(),
          email,
          applicationId,
          applicationDetails,
        };
      },
    });

    if (formValues) {
      Swal.fire({
        title: "Sending...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        await new Promise((r) => setTimeout(r, 1200)); // simulate
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Your support request has been submitted.",
          confirmButtonColor: "#10b981",
        });
        Toast.fire({ icon: "success", title: "Support request sent" });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not send your message.",
        });
        Toast.fire({ icon: "error", title: "Sending failed" });
      }
    }
  };

  const handleEdit = (app) => {
    if (!canEditApplication(app)) {
      Toast.fire({
        icon: "warning",
        title: "Cannot edit this application",
      });
      return;
    }
    navigate("/dashboard", {
      state: { step: "saved-personal-info", applicationId: app.id },
    });
  };

  const handleDeleteAcademic = async (app) => {
    if (!canEditApplication(app)) {
      Toast.fire({
        icon: "warning",
        title: "Cannot delete this application",
      });
      return;
    }
    if (!personalInfoId) {
      Toast.fire({ icon: "error", title: "Missing personal info ID" });
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Delete Academic Application",
        html: `
          <p>Are you sure you want to delete this academic application?</p>
          <p><strong>This action cannot be undone.</strong></p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        await apiInstance.delete(
          `Academic?StudentPersonalInformationId=${personalInfoId}`
        );
        setSubmittedAcademicApps([]);
        setApplicationStatus(null);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Application removed successfully.",
        });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        Toast.fire({ icon: "info", title: "Already deleted" });
        setSubmittedAcademicApps([]);
        setApplicationStatus(null);
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  const totalApplications = submittedAcademicApps.length;
  const hasAnyApplications = totalApplications > 0;
  const hasSubmittedApplications = hasAnyApplications;
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
                    You already have an active application. Delete it (if status
                    allows) to create a new one.
                  </small>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="dashboard-section">
        {/* Your Applications */}
        <h4 className="section-title">📂 Your Applications</h4>
        <div className="table-container responsive-table">
          {loading ? (
            <div className="table-loading">
              <div className="small-spinner"></div>
              <span>Loading applications...</span>
            </div>
          ) : !hasAnyApplications ? (
            <p className="p-2">No applications found.</p>
          ) : (
            <table className="styled-table apps-table">
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
                {submittedAcademicApps.map((app) => {
                  const rowStateClass = canEditApplication(app)
                    ? "editable"
                    : "locked";
                  return (
                    <tr key={`academic-${app.id}`} className={rowStateClass}>
                      <td data-label="Select" className="select-cell">
                        <input type="checkbox" />
                      </td>
                      <td data-label="School" className="school">
                        {app.school}
                      </td>
                      <td data-label="Program" className="program-col">
                        {app.description}
                      </td>
                      <td data-label="Level" className="level">
                        {getProgramLevelText(app.programLevel)}
                      </td>
                      <td data-label="Status" className="status-col">
                        {getStatusBadge(app.applicationStatus)}
                      </td>
                      <td data-label="Action" className="actions action-col">
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
                              : "Locked"
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
                              : "Locked"
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Available Programs */}
        <h4 className="section-title mt-4">🎓 Available Programs</h4>
        <div className="table-container responsive-table">
          {loading ? (
            <div className="table-loading">
              <div className="small-spinner"></div>
              <span>Loading programs...</span>
            </div>
          ) : availableApplications.length === 0 ? (
            <p className="p-2">No available programs at the moment.</p>
          ) : (
            <table className="styled-table programs-table">
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

                  const rowStateClass = isThisProgramApplied
                    ? "applied-row"
                    : isAnyOtherProgramApplied
                    ? "locked-row"
                    : "open-row";

                  return (
                    <tr key={index} className={rowStateClass}>
                      <td className="program" data-label="Program">
                        <span className="program-name">
                          {app.description || "General"}
                        </span>
                      </td>
                      <td className="faculty" data-label="Faculty">
                        {app.faculty || "General"}
                      </td>
                      <td className="level" data-label="Level">
                        {getProgramLevelText(app.programLevel)}
                      </td>
                      <td className="duration" data-label="Duration">
                        {app.durationInYears} years
                      </td>
                      <td className="action" data-label="Action">
                        <button
                          className={`apply-btn ${
                            isThisProgramApplied || isAnyOtherProgramApplied
                              ? "disabled"
                              : ""
                          } ${
                            isThisProgramApplied
                              ? "btn-applied"
                              : isAnyOtherProgramApplied
                              ? "btn-locked"
                              : "btn-open"
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
                              ? "You have an open application. Delete it (if status allows) to switch."
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
