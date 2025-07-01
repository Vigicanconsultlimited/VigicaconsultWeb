import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "./styles/StudentDashboard.css";

export default function StudentDashboard(setCurrentStep) {
  const authData = useAuthStore((state) => state.allUserData);
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = authData?.uid;
  const userEmail =
    authData?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`
        );
        const applicationId = personalRes?.data?.result?.id;
        const applicationDetails = await apiInstance.get(
          `StudentPersonalInfo/${applicationId}`
        );
        setApplication(applicationDetails?.data?.result);

        const documentsRes = await apiInstance.get(
          `UploadFile/list-by-user/${userId}`
        );
        setDocuments(documentsRes?.data?.result || []);
      } catch (err) {
        console.warn("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const handleEdit = () => {
    navigate("/dashboard", { state: { step: "saved-personal-info" } });
  };

  const handleStartNew = () => {
    navigate("/application/start");
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {authData?.fullName || userEmail}</h2>
      <p className="dashboard-subtitle">This is your application dashboard.</p>

      {loading ? (
        <p>Loading your application...</p>
      ) : application ? (
        <div className="dashboard-section">
          <h3>Submitted Application</h3>
          <ul className="dashboard-list">
            <li>
              <strong>Name:</strong> {application.firstName}{" "}
              {application.lastName}
            </li>
            <li>
              <strong>Email:</strong> {application.email}
            </li>
            <li>
              <strong>DOB:</strong> {application.dob?.split("T")[0]}
            </li>
            <li>
              <strong>Phone:</strong> {application.phone}
            </li>
            <li>
              <strong>Address:</strong> {application.address}
            </li>
            {/* <li>
              <strong>Type of Application:</strong>{" "}
              {application.applicationType || "N/A"}
            </li>
            <li>
              <strong>Submitted At:</strong>{" "}
              {new Date(application.createdAt).toLocaleString()}
            </li>*/}
          </ul>

          {/* <div className="mt-4">
            <h4>Uploaded Documents</h4>
            {documents.length > 0 ? (
              <ul className="dashboard-doc-list">
                {documents.map((doc, index) => (
                  <li key={index}>
                    <strong>{doc.fileName}</strong> ({doc.fileType}) - Uploaded
                    on {new Date(doc.uploadedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents uploaded yet.</p>
            )}
          </div> */}

          <button
            className="btn btn-primary mt-3"
            onClick={() => setCurrentStep("saved-personal-info")}
          >
            ✏️ Go to Saved Application to Edit
          </button>
        </div>
      ) : (
        <div className="dashboard-section">
          <h3>No Application Found</h3>
          <p>You haven't submitted any personal information yet.</p>
          <button className="btn btn-success" onClick={handleStartNew}>
            ➕ Start New Application
          </button>
        </div>
      )}
    </div>
  );
}
