import React from "react";
import "./styles/ApplicationSummary.css";

function ApplicationSummary({ setCurrentStep }) {
  return (
    <div className="application-summary-container">
      <h2 className="application-summary-title">
        🎉 Thank You for Submitting!
      </h2>
      <p className="application-summary-text">
        Your documents have been uploaded successfully and are now under review.
      </p>
      <button
        onClick={() => setCurrentStep("dashboard-home")}
        className="btn btn-primary application-summary-button"
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default ApplicationSummary;
