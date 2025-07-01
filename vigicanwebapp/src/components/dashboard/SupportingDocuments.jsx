import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/auth";

import "./styles/SupportingDocuments.css";
import apiInstance from "../../utils/axios";

const documentAPIMap = {
  "Personal Statement (PS) or SOP": {
    uploadUrl: "PersonalStatement",
    statusUrl: "PersonalStatement/document",
    deleteUrl: "PersonalStatement",
  },
  "CV/Resume": {
    uploadUrl: "CvOrResume",
    statusUrl: "CvOrResume/document",
    deleteUrl: "CvOrResume",
  },
  "Academic References": {
    uploadUrl: "AcademicReferenceDoc",
    statusUrl: "AcademicReferenceDoc/document",
    deleteUrl: "AcademicReferenceDoc",
  },
  "Professional References": {
    uploadUrl: "ProfessionalReference",
    statusUrl: "ProfessionalReference/document",
    deleteUrl: "ProfessionalReference",
  },
  "Work Experience": {
    uploadUrl: "WorkExperience",
    statusUrl: "WorkExperience/document",
    deleteUrl: "WorkExperience",
  },

  "International Passport": {
    uploadUrl: "InternationalPssport",
    statusUrl: "InternationalPssport/document",
    deleteUrl: "InternationalPssport",
  },
};

export default function SupportingDocuments({ onContinue, onBack }) {
  const authData = useAuthStore((state) => state.allUserData);
  const [appId, setAppId] = useState(null);

  const [expanded, setExpanded] = useState("Academic References");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const dropRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authData) return;
      setLoading(true);

      const userId = authData["uid"];

      try {
        const res = await apiInstance.get(`StudentPersonalInfo/user/${userId}`);
        const appData = res.data;
        const fetchedAppId = appData?.result?.id;

        if (!fetchedAppId) throw new Error("No application ID found");

        setAppId(fetchedAppId);
        // You can fetch document statuses here if you have DocIds stored or retrievable
      } catch (error) {
        console.error("Error fetching application ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authData]);

  const handleToggle = (section) => {
    setExpanded((prev) => (prev === section ? null : section));
  };

  const uploadFile = async (section, file) => {
    const { uploadUrl } = documentAPIMap[section];
    const formData = new FormData();
    formData.append("Document", file);
    formData.append("studentInfoId", appId); // ✅ Add studentInfoId

    try {
      setErrors((prev) => ({ ...prev, [section]: null }));

      const response = await apiInstance.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({ ...prev, [section]: percent }));
        },
      });

      const result = response.data.result;

      setUploadedFiles((prev) => ({
        ...prev,
        [section]: {
          name: file.name,
          url: result?.url || "#",
          docId: result?.id,
          locked: false,
        },
      }));
    } catch (err) {
      const message =
        err?.response?.data?.message || "Upload failed. Please try again.";
      setErrors((prev) => ({ ...prev, [section]: message }));
    } finally {
      setUploadProgress((prev) => ({ ...prev, [section]: null }));
    }
  };

  const handleFileChange = (section, file) => {
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      uploadFile(section, file);
    } else {
      setErrors((prev) => ({
        ...prev,
        [section]: "Only PDF or DOC/DOCX files are allowed.",
      }));
    }
  };

  const handleRemoveFile = async (section) => {
    const { deleteUrl } = documentAPIMap[section];
    const docId = uploadedFiles[section]?.docId;

    try {
      await apiInstance.delete(`${deleteUrl}/${docId}`);
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[section];
        return updated;
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Error deleting file.";
      setErrors((prev) => ({ ...prev, [section]: msg }));
    }
  };

  const handleDrop = (e, section) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(section, file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue && onContinue();
  };

  return (
    <form className="supporting-docs p-3 p-md-4" onSubmit={handleSubmit}>
      <h2 className="title">Supporting Documents</h2>
      <p className="subtitle">Click drop-down to upload file.</p>
      <div className="divider"></div>

      {Object.keys(documentAPIMap).map((section) => (
        <div key={section} className="accordion-item mb-2">
          <div
            className={`accordion-header ${expanded === section ? "open" : ""}`}
            onClick={() => handleToggle(section)}
          >
            <span>{section}</span>
            <span className="chevron">{expanded === section ? "▲" : "▼"}</span>
          </div>

          {expanded === section && (
            <div
              className="accordion-body"
              onDrop={(e) => handleDrop(e, section)}
              onDragOver={handleDragOver}
              ref={dropRef}
            >
              <label className="upload-box">
                <input
                  type="file"
                  className="d-none"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(section, e.target.files[0])}
                />
                <div className="upload-placeholder">
                  📎 Attach file <br /> Drag & drop file
                </div>
              </label>

              {uploadProgress[section] && (
                <div className="progress-bar mt-2">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${uploadProgress[section]}%` }}
                  ></div>
                </div>
              )}

              {errors[section] && (
                <div className="error-text mt-2">{errors[section]}</div>
              )}

              {uploadedFiles[section] && (
                <div className="uploaded-file mt-2">
                  <a
                    href={uploadedFiles[section].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {uploadedFiles[section].name || "View File"}
                  </a>
                  {!uploadedFiles[section].locked && (
                    <span
                      className="remove-file"
                      onClick={() => handleRemoveFile(section)}
                    >
                      ✖
                    </span>
                  )}
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
