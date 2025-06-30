import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "./styles/StudentDashboard.css";

export default function StudentDashboard() {
  const authData = useAuthStore((state) => state.allUserData);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = authData?.uid;
  const userEmail =
    authData?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await apiInstance.get(`StudentPersonalInfo/${userId}`);
        setApplication(response.data);
      } catch (err) {
        console.warn("No application found or error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchApplication();
    }
  }, [userId]);

  const handleEdit = () => {
    navigate("/edit/personal-info"); // adjust this route as needed
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
          </ul>
          <button className="btn btn-primary mt-2" onClick={handleEdit}>
            ✏️ Edit Application
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
