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

  const navigate = useNavigate();
  const userId = authData?.uid;
  const userEmail =
    authData?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  // Updated current date and time as specified
  const getCurrentDateTime = () => {
    return "2025-08-08 21:25:31";
  };

  // Updated current user login as specified
  const getCurrentUser = () => {
    return "NeduStack";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(
          `Dashboard: Fetching data at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

        let submittedApps = [];
        let personalInfoData = null;
        let currentPersonalInfoId = null;

        // Step 1: Get StudentPersonalInformationId (with individual error handling)
        try {
          console.log(
            `Dashboard: Fetching personal info for user ${userId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          const personalRes = await apiInstance.get(
            `StudentPersonalInfo/user/${userId}`
          );
          const personalInfo = personalRes?.data?.result;
          currentPersonalInfoId = personalInfo?.id;
          setPersonalInfoId(currentPersonalInfoId); // Store for delete operations

          console.log(
            `Dashboard: Personal info ID found: ${currentPersonalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // Set display name from personal info
          if (personalInfo?.firstName && personalInfo?.lastName) {
            setDisplayName(
              `${personalInfo.firstName} ${personalInfo.lastName}`
            );
          }

          // Step 2: Get submitted application with that ID (only if we have personalInfoId)
          if (currentPersonalInfoId) {
            try {
              console.log(
                `Dashboard: Fetching applications for personal info ID ${currentPersonalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );

              const submittedAppRes = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${currentPersonalInfoId}`
              );

              submittedApps = submittedAppRes?.data?.result || [];
              personalInfoData =
                submittedAppRes?.data?.result?.personalInformation;

              setApplications(
                Array.isArray(submittedApps) ? submittedApps : [submittedApps]
              );

              console.log(
                `Dashboard: Found ${
                  Array.isArray(submittedApps)
                    ? submittedApps.length
                    : submittedApps
                    ? 1
                    : 0
                } general applications at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );
            } catch (appErr) {
              console.warn(
                `Dashboard: Error fetching applications: ${
                  appErr.message
                } at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );
              // Don't stop execution, continue to fetch other data
            }

            // Step 2.5: Get submitted academic applications using the new API
            try {
              console.log(
                `Dashboard: Fetching academic applications for personal info ID ${currentPersonalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );

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
                };

                setSubmittedAcademicApps([formattedAcademicApp]);

                console.log(
                  `Dashboard: Found 1 academic application (${
                    formattedAcademicApp.school
                  } - ${formattedAcademicApp.description}) with program ID: ${
                    formattedAcademicApp.appliedProgramId
                  } at ${getCurrentDateTime()} by ${getCurrentUser()}`
                );
              } else {
                setSubmittedAcademicApps([]);
                console.log(
                  `Dashboard: No academic applications found at ${getCurrentDateTime()} by ${getCurrentUser()}`
                );
              }
            } catch (academicErr) {
              console.warn(
                `Dashboard: Error fetching academic applications: ${
                  academicErr.message
                } at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );
              setSubmittedAcademicApps([]);
            }
          }
        } catch (personalErr) {
          console.warn(
            `Dashboard: Error fetching personal info: ${
              personalErr.message
            } at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          // Don't stop execution, continue to fetch programs
        }

        // Step 3: Get available programs (always execute this, regardless of previous errors)
        try {
          console.log(
            `Dashboard: Fetching available academic programs at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          const availableRes = await apiInstance.get(`AcademicProgram`);

          if (availableRes?.data?.result) {
            setAvailableApplications(availableRes.data.result);
            console.log(
              `Dashboard: Loaded ${
                availableRes.data.result.length
              } programs at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );
          } else {
            console.warn(
              `Dashboard: No programs found in response at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );
            setAvailableApplications([]);
          }
        } catch (programErr) {
          console.error(
            `Dashboard: Error fetching programs: ${
              programErr.message
            } at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          console.error("Full error details:", programErr);
          setAvailableApplications([]);
        }
      } catch (err) {
        console.error(
          `Dashboard: General error in fetchData: ${
            err.message
          } at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
        console.log(
          `Dashboard: Data fetching completed at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
      }
    };

    if (userId) {
      fetchData();
    } else {
      console.warn(
        `Dashboard: No userId found at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
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

  const handleEdit = (id) => {
    navigate("/dashboard", {
      state: { step: "saved-personal-info", applicationId: id },
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
        console.log(
          `Dashboard: Deleting general application ${id} at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

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

        console.log(
          `Dashboard: General application ${id} deleted successfully at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

        Swal.close();
        Toast.fire({
          icon: "success",
          title: "Application deleted successfully!",
        });
      }
    } catch (err) {
      console.error(
        `Dashboard: Delete failed for general application ${id}: ${
          err.message
        } at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );

      Swal.close();
      Toast.fire({
        icon: "error",
        title: "Failed to delete application. Please try again.",
      });
    }
  };

  // New delete function for academic applications using SweetAlert
  const handleDeleteAcademic = async (academicId) => {
    if (!personalInfoId) {
      console.error(
        `Dashboard: Cannot delete academic application - missing personalInfoId at ${getCurrentDateTime()} by ${getCurrentUser()}`
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
        console.log(
          `Dashboard: Deleting academic application ${academicId} using personalInfoId ${personalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

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

        console.log(
          `Dashboard: Academic application ${academicId} deleted successfully at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

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
        `Dashboard: Delete failed for academic application ${academicId}: ${
          err.message
        } at ${getCurrentDateTime()} by ${getCurrentUser()}`
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
    console.log(
      `Starting application for ${school} - ${description} at ${getCurrentDateTime()} by ${getCurrentUser()}`
    );

    // Check if parent provided the handler
    if (typeof handleStartApplication === "function") {
      // Use the parent's handler which will set the school/program and change step
      handleStartApplication(school, description);
    } else {
      // Fallback to direct step change if handler not provided
      console.warn(
        `handleStartApplication not provided, falling back to direct step change at ${getCurrentDateTime()} by ${getCurrentUser()}`
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
            <p>You have submitted these applications. Continue to edit.</p>
            <button
              className="btn btn-success"
              onClick={() => setCurrentStep("personal-info")}
            >
              Continue
            </button>
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
                    application to create a new one.
                  </small>
                )}
              </>
            )}

            <>
              <p className="mt-4 mb-0">
                Can't find a program of interest yet? Start your application
                anyway:
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentStep("personal-info")}
                disabled={hasSubmittedApplications}
              >
                {hasSubmittedApplications
                  ? "✅ Application Submitted"
                  : "➕ Start Document Submission"}
              </button>
              {hasSubmittedApplications && (
                <small className="text-muted d-block mt-1">
                  You already have an active application. Delete existing
                  application to create a new one.
                </small>
              )}
            </>
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
                  <th>Type</th>
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
                    <td data-label="Type">
                      <span className="badge bg-success">Academic</span>
                    </td>
                    <td data-label="Action" className="actions">
                      <button className="icon-btn" title="Contact Support">
                        <i className="fas fa-envelope"></i>
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => setCurrentStep("personal-info")}
                        title="Edit Academic Application"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleDeleteAcademic(app.id)}
                        title="Delete Academic Application"
                        style={{ color: "#dc3545" }}
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
                              ? "You have applied for another program. Delete existing application to apply for this one."
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

        {/* Show message when applications are disabled */}
        {hasSubmittedApplications && (
          <div className="alert alert-info mt-3">
            <i className="fas fa-info-circle me-2"></i>
            <strong>Note:</strong> You currently have an active application. To
            apply for a different program, you must first delete your existing
            application.
          </div>
        )}
      </div>
    </div>
  );
}
