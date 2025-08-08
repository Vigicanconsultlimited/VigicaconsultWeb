import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "./styles/StudentDashboard.css";

export default function StudentDashboard({
  setCurrentStep,
  handleStartApplication,
}) {
  const authData = useAuthStore((state) => state.allUserData);
  const [applications, setApplications] = useState([]);
  const [availableApplications, setAvailableApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const navigate = useNavigate();
  const userId = authData?.uid;
  const userEmail =
    authData?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  // Updated current date and time as specified
  const getCurrentDateTime = () => {
    return "2025-08-07 21:20:19";
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
        let personalInfoId = null;

        // Step 1: Get StudentPersonalInformationId (with individual error handling)
        try {
          console.log(
            `Dashboard: Fetching personal info for user ${userId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          const personalRes = await apiInstance.get(
            `StudentPersonalInfo/user/${userId}`
          );
          const personalInfo = personalRes?.data?.result;
          personalInfoId = personalInfo?.id;

          console.log(
            `Dashboard: Personal info ID found: ${personalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // Step 2: Get submitted application with that ID (only if we have personalInfoId)
          if (personalInfoId) {
            try {
              console.log(
                `Dashboard: Fetching applications for personal info ID ${personalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );

              const submittedAppRes = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
              );

              submittedApps = submittedAppRes?.data?.result || [];
              personalInfoData =
                submittedAppRes?.data?.result?.personalInformation;

              setApplications(
                Array.isArray(submittedApps) ? submittedApps : [submittedApps]
              );

              if (personalInfoData?.firstName && personalInfoData?.lastName) {
                setDisplayName(
                  `${personalInfoData.firstName} ${personalInfoData.lastName}`
                );
              }

              console.log(
                `Dashboard: Found ${
                  Array.isArray(submittedApps)
                    ? submittedApps.length
                    : submittedApps
                    ? 1
                    : 0
                } applications at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );
            } catch (appErr) {
              console.warn(
                `Dashboard: Error fetching applications: ${
                  appErr.message
                } at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );
              // Don't stop execution, continue to fetch programs
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

          const availableRes = await apiInstance.get(`AcademicProgram`); // Removed the leading slash

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

  const handleEdit = (id) => {
    navigate("/dashboard", {
      state: { step: "saved-personal-info", applicationId: id },
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      console.log(
        `Dashboard: Deleting application ${id} at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
      await apiInstance.delete(`StudentApplication/${id}`);
      setApplications(applications.filter((app) => app.id !== id));
      console.log(
        `Dashboard: Application ${id} deleted successfully at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
    } catch (err) {
      console.error(
        `Dashboard: Delete failed for application ${id}: ${
          err.message
        } at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
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

        {applications.length > 0 ? (
          <>
            <h3>{applications.length} Applications Found</h3>
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
                >
                  ➕ Start New Application
                </button>
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
              >
                ➕ Start Document Submission
              </button>
            </>

            {/* <div className="mt-4 text-center">
              <p className="text-muted">
                Can't find a program of interest yet? Start your application
                anyway:
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={() => setCurrentStep("personal-info")}
              >
                📝 Start Application
              </button>
            </div>
            */}
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
          ) : applications.length === 0 ? (
            <p className="p-2">No applications found.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th></th>
                  <th>School Name</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td data-label="Select">
                      <input type="checkbox" />
                    </td>
                    <td data-label="School Name">
                      {app.school || "University of Greater Manchester"}
                    </td>
                    <td data-label="Course">
                      {app.description || "Industrial Chemistry"}
                    </td>
                    <td data-label="Action" className="actions">
                      <button className="icon-btn">
                        <i className="fas fa-envelope"></i>
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => setCurrentStep("personal-info")}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleDelete(app.id)}
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
        <h3 className="section-title">🎓 Available Programs</h3>
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
                  <th>School</th>
                  <th>Course</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {availableApplications.map((app, index) => (
                  <tr key={index}>
                    <td>{app.school || "Others"}</td>
                    <td>{app.description || "General"}</td>
                    <td>
                      <button
                        className="apply-btn"
                        onClick={() => setCurrentStep("personal-info")}
                      >
                        ➕ Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Debug info - only visible in development */}
      {/*
      {process.env.NODE_ENV === "development" && (
        <div
          className="debug-info mt-3"
          style={{
            fontSize: "0.8rem",
            color: "#666",
            background: "#f8f9fa",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Debug Info:</strong> Applications: {applications.length},
            Available Programs: {availableApplications.length}
          </p>
          <p style={{ margin: 0 }}>
            User ID: {userId || "Not set"} | Date/Time: {getCurrentDateTime()} |
            User: {getCurrentUser()}
          </p>
        </div>
      )}
        */}
    </div>
  );
}
