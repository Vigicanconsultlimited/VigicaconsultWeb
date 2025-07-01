import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles/AcademicDocuments.css";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";

const documentTypes = [
  "Degree Certificate",
  "WAEC Certificate",
  "Personal Statement",
  "Official Transcript",
  "Proof of English Proficiency",
];

const documentAPIMap = {
  "Degree Certificate": {
    uploadUrl: "DegreeCert",
    statusUrl: "DegreeCertificate/document",
    deleteUrl: "DegreeCertificate",
  },
  "WAEC Certificate": {
    uploadUrl: "WaecOrNeco",
    statusUrl: "WAECCertificate/document",
    deleteUrl: "WAECCertificate",
  },
  "Personal Statement": {
    uploadUrl: "PersonalStatement",
    statusUrl: "PersonalStatement/document",
    deleteUrl: "PersonalStatement",
  },
  "Official Transcript": {
    uploadUrl: "OfficialTranscript",
    statusUrl: "OfficialTranscript/document",
    deleteUrl: "OfficialTranscript",
  },
  "Proof of English Proficiency": {
    uploadUrl: "EnglishProof",
    statusUrl: "EnglishProof/document",
    deleteUrl: "EnglishProof",
  },
};

export default function AcademicDocuments({ onContinue, onBack }) {
  const authData = useAuthStore((state) => state.allUserData);

  const [appId, setAppId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState("Degree Certificate");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
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

  const handleToggle = (type) => {
    setExpanded((prev) => (prev === type ? null : type));
  };

  // Function to upload a file for a specific document type
  const uploadFile = async (type, file) => {
    const { uploadUrl } = documentAPIMap[type];
    const formData = new FormData();
    formData.append("Document", file);
    formData.append("StudentPersonalInformationId", appId);

    try {
      setErrors((prev) => ({ ...prev, [type]: null }));

      const response = await apiInstance.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({ ...prev, [type]: percent }));
        },
      });

      console.log(`Upload response for ${type}:`, response.data);

      const result = response.data.result;

      setUploadedFiles((prev) => ({
        ...prev,
        [type]: {
          name: file.name,
          url:
            result.englishProficiencyProofDocumentdownloadurl ||
            result.url ||
            "#",
          docId: result.id,
          locked: false,
        },
      }));
    } catch (err) {
      const message =
        err?.response?.data?.message || "Upload failed. Please try again.";
      setErrors((prev) => ({ ...prev, [type]: message }));
    } finally {
      setUploadProgress((prev) => ({ ...prev, [type]: null }));
    }
  };

  const handleFileChange = (type, file) => {
    if (
      file &&
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      uploadFile(type, file);
    } else {
      setErrors((prev) => ({
        ...prev,
        [type]: "Only PDF or DOCX files are allowed.",
      }));
    }
  };

  const handleRemoveFile = async (type) => {
    const { deleteUrl } = documentAPIMap[type];
    const docId = uploadedFiles[type]?.docId;

    try {
      await apiInstance.delete(`${deleteUrl}/${docId}`);
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[type];
        return updated;
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Error deleting file.";
      setErrors((prev) => ({ ...prev, [type]: msg }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(type, file);
  };

  const handleDragOver = (e) => e.preventDefault();

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
            <div
              className="accordion-body"
              onDrop={(e) => handleDrop(e, type)}
              onDragOver={handleDragOver}
              ref={dropRef}
            >
              <label className="upload-box">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="d-none"
                  onChange={(e) => handleFileChange(type, e.target.files[0])}
                />
                <div className="upload-area">📎 Attach file or drag & drop</div>
              </label>

              {uploadProgress[type] && (
                <div className="progress-bar mt-2">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${uploadProgress[type]}%` }}
                  ></div>
                </div>
              )}

              {errors[type] && (
                <div className="error-text mt-2">{errors[type]}</div>
              )}

              {uploadedFiles[type] && (
                <div className="uploaded-file mt-2">
                  <a
                    href={uploadedFiles[type].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {uploadedFiles[type].name || "View File"}
                  </a>
                  {!uploadedFiles[type].locked && (
                    <span
                      className="remove-file"
                      onClick={() => handleRemoveFile(type)}
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
