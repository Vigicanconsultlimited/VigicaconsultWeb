import React, { useState } from "react";
import AdminHeader from "../components/adminDashboard/AdminHeader";
import AdminSidebar from "../components/adminDashboard/AdminSidebar";
import Overview from "../components/adminDashboard/sections/Overview";
import DocumentReview from "../components/adminDashboard/sections/DocumentReview";
import UserManagement from "../components/adminDashboard/sections/UserManagement";
import UploadedFiles from "../components/adminDashboard/sections/UploadedFiles";
import QuestionCenter from "../components/adminDashboard/sections/QuestionCenter";
import Inbox from "../components/adminDashboard/sections/Inbox";
import SentMessages from "../components/adminDashboard/sections/SentMessages";
import "../components/adminDashboard/styles/AdminDashboard.css";
//import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [currentStep, setCurrentStep] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "overview":
        return <Overview />;
      case "document-review":
        return <DocumentReview />;
      case "user-management":
        return <UserManagement />;
      case "uploaded-files":
        return <UploadedFiles />;
      case "question-center":
        return <QuestionCenter />;
      case "inbox":
        return <Inbox />;
      case "sent":
        return <SentMessages />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader toggleSidebar={toggleSidebar} />

      <div className="admin-dashboard-layout">
        <AdminSidebar
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className="admin-main-content">
          <div className="admin-content-wrapper">{renderCurrentStep()}</div>
        </main>
      </div>
    </div>
  );
}
