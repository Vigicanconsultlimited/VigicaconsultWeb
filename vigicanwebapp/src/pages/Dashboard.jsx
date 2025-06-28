import React, { useState } from "react";
import { useAuthStore } from "../store/auth";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import SidebarMenu from "../components/dashboard/SidebarMenu";
import PersonalInfo from "../components/dashboard/PersonalInfo";
import AcademicDocuments from "../components/dashboard/AcademicDocuments";
import SupportingDocuments from "../components/dashboard/SupportingDocuments";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.allUserData);

  const [currentStep, setCurrentStep] = useState("personal-info");

  //console.log("User Email:", user?.email);

  const steps = {
    "personal-info": {
      component: (
        <PersonalInfo
          userEmail={user?.email}
          userId={user?.UserId}
          onContinue={() => setCurrentStep("academic-documents")}
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
      component: (
        <div>
          <h2>All steps completed 🎉</h2>
          <button
            onClick={() => setCurrentStep("supporting-documents")}
            className="btn btn-secondary mt-3"
          >
            ⬅ Back
          </button>
        </div>
      ),
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
