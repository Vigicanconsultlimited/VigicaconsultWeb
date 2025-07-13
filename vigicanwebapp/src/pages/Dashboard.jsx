import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { setUser } from "../utils/auth";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import SidebarMenu from "../components/dashboard/SidebarMenu";
import PersonalInfo from "../components/dashboard/PersonalInfo";
import AcademicDocuments from "../components/dashboard/AcademicDocuments";
import SupportingDocuments from "../components/dashboard/SupportingDocuments";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import SavedPersonalInfo from "../components/dashboard/SavedPersonalInfo";
import SavedAcademicDocuments from "../components/dashboard/SavedAcademicDocuments";
import SavedSupportingDocuments from "../components/dashboard/SavedSupportingDocuments";
import SavedApplication from "../components/dashboard/SavedApplication";

import Inbox from "../components/dashboard/Inbox";
import "bootstrap/dist/css/bootstrap.min.css";
import ApplicationStatus from "../components/dashboard/ApplicationStatus";
import apiInstance from "../utils/axios";
import ApplicationSummary from "../components/dashboard/ApplicationSummary";

function Dashboard() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.allUserData);

  const setAllUserData = useAuthStore((state) => state.setAllUserData);
  const [currentStep, setCurrentStep] = useState("dashboard-home");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token && !user) {
        try {
          const res = await apiInstance.get("/Auth/user");
          setUser(res.data);
          console.log("User data fetched after login:", res.data);
        } catch (err) {
          console.error("Failed to fetch user data after login:", err);
        }
      }
    };
    fetchUserData();
  }, [user, setAllUserData]);

  useEffect(() => {
    setUser();
  }, []);

  const steps = {
    "dashboard-home": {
      component: <StudentDashboard setCurrentStep={setCurrentStep} />,
    },
    "personal-info": {
      component: (
        <PersonalInfo
          userEmail={user?.email}
          userId={user?.UserId}
          onContinue={() => setCurrentStep("academic-documents")}
          onBack={() => setCurrentStep("dashboard-home")}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
    "academic-documents": {
      component: (
        <AcademicDocuments
          onContinue={() => setCurrentStep("supporting-documents")}
          onBack={() => setCurrentStep("personal-info")}
        />
      ),
    },
    "supporting-documents": {
      component: (
        <SupportingDocuments
          onContinue={() => setCurrentStep("summary")}
          onBack={() => setCurrentStep("academic-documents")}
        />
      ),
    },
    summary: {
      component: <ApplicationSummary setCurrentStep={setCurrentStep} />,
    },

    // ✅ SAVED COMPONENTS
    "application-status": {
      component: <ApplicationStatus />,
    },
    "saved-application": {
      component: <SavedApplication userId={user?.uid} />,
    },

    "saved-personal-info": {
      component: (
        <SavedPersonalInfo onBack={() => setCurrentStep("dashboard-home")} />
      ),
    },
    "saved-academic-documents": {
      component: (
        <SavedAcademicDocuments
          onBack={() => setCurrentStep("dashboard-home")}
        />
      ),
    },
    "saved-supporting-documents": {
      component: (
        <SavedSupportingDocuments
          onBack={() => setCurrentStep("dashboard-home")}
        />
      ),
    },

    // ✅ Inbox page
    inbox: {
      component: <Inbox />,
    },
  };

  return (
    <>
      {isLoggedIn() ? (
        <>
          <DashboardNavbar />
          <div className="d-flex" style={{ height: "100vh" }}>
            <SidebarMenu setCurrentStep={setCurrentStep} />
            <div
              className="flex-grow-1 p-4"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              {steps[currentStep]?.component || <h3>Invalid step</h3>}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <h1>Welcome</h1>
          <Link to="/register" className="btn btn-primary me-2">
            Register
          </Link>
          <Link to="/login" className="btn btn-outline-primary">
            Login
          </Link>
        </div>
      )}
    </>
  );
}

export default Dashboard;
