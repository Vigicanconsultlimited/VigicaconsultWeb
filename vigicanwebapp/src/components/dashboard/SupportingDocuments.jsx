import React, { useState } from "react";
import "./styles/SupportingDocuments.css";

const documentSections = [
  "Personal Statement (PS) or SOP",
  "CV/Resume",
  "Academic References",
  "Professional References",
  "Work Experience",
];

export default function SupportingDocuments({ onContinue, onBack }) {
  const [expanded, setExpanded] = useState("Academic References");
  const [uploadedFiles, setUploadedFiles] = useState({
    "Academic References": { name: "my-reference-letter.pdf" },
  });

  const handleToggle = (section) => {
    setExpanded((prev) => (prev === section ? null : section));
  };

  const handleFileChange = (section, file) => {
    setUploadedFiles((prev) => ({ ...prev, [section]: file }));
  };

  const handleRemoveFile = (section) => {
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[section];
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue && onContinue();
  };

  return (
    <form className="supporting-docs p-3 p-md-4" onSubmit={handleSubmit}>
      <h2 className="title">Supporting Documents</h2>
      <p className="subtitle">Click drop-down to upload file.</p>
      <div className="divider"></div>

      {documentSections.map((section) => (
        <div key={section} className="accordion-item">
          <div
            className={`accordion-header ${expanded === section ? "open" : ""}`}
            onClick={() => handleToggle(section)}
          >
            <span>{section}</span>
            <span className="chevron">{expanded === section ? "▲" : "▼"}</span>
          </div>

          {expanded === section && (
            <div className="accordion-body">
              <label className="upload-box">
                <input
                  type="file"
                  className="d-none"
                  onChange={(e) => handleFileChange(section, e.target.files[0])}
                />
                <div className="upload-placeholder">
                  📎 Attach file <br /> Drag & drop file
                </div>
              </label>

              {uploadedFiles[section] && (
                <div className="uploaded-file">
                  {uploadedFiles[section].name}
                  <span
                    className="remove-file"
                    onClick={() => handleRemoveFile(section)}
                  >
                    ✖
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="footer d-flex justify-content-between align-items-center pt-4">
        <button type="button" className="btn back-btn" onClick={onBack}>
          ← Back
        </button>
        <div>
          <button type="button" className="btn draft-btn me-2">
            💾 Save as Draft
          </button>
          <button type="submit" className="btn continue-btn">
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
