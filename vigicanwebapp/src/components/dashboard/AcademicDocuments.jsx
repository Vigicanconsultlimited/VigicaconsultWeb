import React, { useState } from "react";
import "./styles/AcademicDocuments.css";

const documentTypes = [
  "Degree Certificate",
  "WAEC Certificate",
  "NECO Certificate",
  "Official Transcript",
  "Proof of English Proficiency",
];

export default function AcademicDocuments({ onContinue, onBack }) {
  const [expanded, setExpanded] = useState("Degree Certificate");
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleToggle = (type) => {
    setExpanded((prev) => (prev === type ? null : type));
  };

  const handleFileUpload = (type, file) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleRemoveFile = (type) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue && onContinue();
  };

  return (
    <form className="academic-docs-form p-3 p-md-4" onSubmit={handleSubmit}>
      <h2 className="academic-docs-title">Academic Documents</h2>
      <div className="academic-docs-desc">
        Click a drop-down to upload the relevant document.
      </div>

      {documentTypes.map((type) => (
        <div key={type} className="accordion-item mb-2">
          <div
            className={`accordion-header ${
              expanded === type ? "expanded" : ""
            }`}
            onClick={() => handleToggle(type)}
          >
            {type}
            <span className="chevron">{expanded === type ? "▲" : "▼"}</span>
          </div>

          {expanded === type && (
            <div className="accordion-body">
              <label className="upload-box">
                <input
                  type="file"
                  className="d-none"
                  onChange={(e) => handleFileUpload(type, e.target.files[0])}
                />
                <div className="upload-area">📎 Attach file or drag & drop</div>
              </label>

              {uploadedFiles[type] && (
                <div className="uploaded-file">
                  {uploadedFiles[type].name}
                  <span
                    className="remove-file"
                    onClick={() => handleRemoveFile(type)}
                  >
                    ✖
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-between align-items-center gap-2 pt-4 pb-1 academic-docs-footer">
        <button
          type="button"
          className="btn btn-outline-primary px-4"
          onClick={onBack}
        >
          ← Back
        </button>
        <div>
          <button type="button" className="btn btn-outline-secondary px-4 me-2">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary px-4">
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
