import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "./styles/StudentDashboard.css";

export default function StudentDashboard({ setCurrentStep }) {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Get StudentPersonalInformationId
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`
        );
        const personalInfo = personalRes?.data?.result;
        const personalInfoId = personalInfo?.id;

        let submittedApps = [];
        let personalInfoData = null;

        // Step 2: Get submitted application with that ID
        if (personalInfoId) {
          const submittedAppRes = await apiInstance.get(
            `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
          );

          submittedApps = submittedAppRes?.data?.result || [];
          personalInfoData = submittedAppRes?.data?.result?.personalInformation;

          setApplications(
            Array.isArray(submittedApps) ? submittedApps : [submittedApps]
          );

          if (personalInfoData?.firstName && personalInfoData?.lastName) {
            setDisplayName(
              `${personalInfoData.firstName} ${personalInfoData.lastName}`
            );
          }
        }

        // Step 3: Get available programs
        const availableRes = await apiInstance.get(`/AvailableApplications`);
        setAvailableApplications(availableRes?.data?.result || []);
      } catch (err) {
        console.warn("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    if (userId) fetchData();
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
      await apiInstance.delete(`StudentApplication/${id}`);
      setApplications(applications.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStartApplication = (schoolName, course) => {
    navigate("/application/start", {
      state: { schoolName, course },
    });
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
        <h2>Welcome, {displayName || authData?.fullName || userEmail}</h2>
        <p className="subtitle">This is your application dashboard</p>

        {applications.length > 0 && (
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
        )}

        {availableApplications.length > 0 ? (
          <>
            <h3>{availableApplications.length} Available Program(s)</h3>
            <p>New programs are available. You can start a new application.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/application/start")}
            >
              ➕ Start New Application
            </button>
          </>
        ) : (
          <div className="info-banner">
            📢 No new programs available right now. You'll be able to apply once
            new programs are added.
          </div>
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
            <p>No applications found.</p>
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
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{app.schoolName || "—"}</td>
                    <td>{app.course || "—"}</td>
                    <td className="actions">
                      <button className="icon-btn">📧</button>
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
                        🗑️
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
            <p>No available programs at the moment.</p>
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
                    <td>{app.schoolName}</td>
                    <td>{app.course}</td>
                    <td>
                      <button
                        className="apply-btn"
                        onClick={() =>
                          handleStartApplication(app.schoolName, app.course)
                        }
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
    </div>
  );
}
