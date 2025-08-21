import React, { useState, useEffect, useRef } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import "./styles/AcademicDocuments.css";
import Swal from "sweetalert2";

// Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// Base document types (Research Proposal appended dynamically for PhD)
const baseDocumentTypes = [
  "Degree Certificate",
  "WAEC Certificate",
  "Official Transcript",
  "Proof of English Proficiency",
];

const documentAPIMap = {
  "Degree Certificate": {
    uploadUrl: "DegreeCert",
    statusUrl: "DegreeCert/document",
    deleteUrl: "DegreeCert",
    viewKey: "degreeCertificategoogledocviewurl",
    downloadKey: "degreeCertificatedownloadurl",
  },
  "WAEC Certificate": {
    uploadUrl: "WaecOrNeco",
    statusUrl: "WaecOrNeco/document",
    deleteUrl: "WaecOrNeco",
    viewKey: "waecOrNecoCertificateDucumentgoogledocviewurl",
    downloadKey: "waecOrNecoCertificateDucumentdownloadurl",
  },
  "Official Transcript": {
    uploadUrl: "OfficialTranscript",
    statusUrl: "OfficialTranscript/document",
    deleteUrl: "OfficialTranscript",
    viewKey: "officialTranscriptDocumentgoogledocviewurl",
    downloadKey: "officialTranscriptDocumentdownloadurl",
  },
  "Proof of English Proficiency": {
    uploadUrl: "EnglishProof",
    statusUrl: "EnglishProof/document",
    deleteUrl: "EnglishProof",
    viewKey: "englishProficiencyProofDocumentgoogledocviewurl",
    downloadKey: "englishProficiencyProofDocumentdownloadurl",
  },
  "Research Proposal": {
    uploadUrl: "ResearchProposal",
    statusUrl: "ResearchProposal/document",
    deleteUrl: "ResearchProposal",
    viewKey: "researchProposalgoogledocviewurl",
    downloadKey: "researchProposaldownloadurl",
  },
};

export default function AcademicDocuments({ onContinue, onBack }) {
  const authData = useAuthStore((s) => s.allUserData);

  const [studentPersonalInfoId, setStudentPersonalInfoId] = useState("");
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isPhDProgram, setIsPhDProgram] = useState(false);

  const [documentTypes, setDocumentTypes] = useState([...baseDocumentTypes]);
  const [expanded, setExpanded] = useState("Degree Certificate");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const dropRef = useRef(null);

  const getStatusText = (status) => {
    const m = {
      1: "Submitted",
      2: "Pending",
      3: "Under Review",
      4: "Rejected",
      5: "Approved",
    };
    return m[status] || "Unknown";
  };

  // Can edit when status is null / Pending / Rejected
  const canEdit =
    applicationStatus === null ||
    applicationStatus === 2 ||
    applicationStatus === 4;

  // Use same "View <Doc>" label pattern as SupportingDocuments
  const getViewLabel = (type) => {
    if (type === "Proof of English Proficiency") return "View English Proof";
    return `View ${type}`;
  };

  // Fetch foundational data
  useEffect(() => {
    const load = async () => {
      if (!authData) {
        setLoading(false);
        return;
      }
      try {
        const userId = authData.uid;
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`
        );
        const personalInfo = personalRes?.data?.result;
        const personalId = personalInfo?.id;
        if (!personalId) {
          setLoading(false);
          return;
        }
        setStudentPersonalInfoId(personalId);

        // Application status
        try {
          const appRes = await apiInstance.get(
            `StudentApplication/application?StudentPersonalInformationId=${personalId}`
          );
          if (appRes?.data?.result) {
            setApplicationStatus(appRes.data.result.applicationStatus);
          } else {
            setApplicationStatus(2);
          }
        } catch {
          setApplicationStatus(2);
        }

        // Academic info for PhD detection
        try {
          const acadRes = await apiInstance.get(
            `Academic/StudentInformationId?PersonalInformationId=${personalId}`
          );
          if (acadRes?.data?.result) {
            const level = acadRes.data.result?.program?.programLevel;
            if (level === 2) {
              setIsPhDProgram(true);
              setDocumentTypes((prev) =>
                prev.includes("Research Proposal")
                  ? prev
                  : [...prev, "Research Proposal"]
              );
            }
          }
        } catch {
          // ignore
        }

        if (!isPhDProgram) {
          const lsFlag = localStorage.getItem("isPhDProgram");
          if (lsFlag === "true") {
            setIsPhDProgram(true);
            setDocumentTypes((prev) =>
              prev.includes("Research Proposal")
                ? prev
                : [...prev, "Research Proposal"]
            );
          }
        }

        // Pre-fetch existing documents
        const allPotentialTypes = [...baseDocumentTypes, "Research Proposal"];
        const fetches = allPotentialTypes.map(async (type) => {
          const meta = documentAPIMap[type];
          if (!meta) return null;
          try {
            const fileRes = await apiInstance.get(
              `${meta.uploadUrl}/${personalId}`
            );
            const docId = fileRes?.data?.result?.id;
            if (!docId) return null;
            const docDetailsRes = await apiInstance.get(
              `${meta.statusUrl}?DocId=${docId}`
            );
            const data = docDetailsRes?.data?.result;
            if (!data) return null;
            return {
              type,
              file: {
                name: data[meta.downloadKey]?.split("/").pop(),
                url: data[meta.downloadKey],
                viewUrl: data[meta.viewKey],
                docId: data.id,
                locked: !canEdit,
              },
            };
          } catch {
            return null;
          }
        });

        const results = await Promise.all(fetches);
        const existing = {};
        results.forEach((r) => {
          if (r) existing[r.type] = r.file;
        });
        setUploadedFiles(existing);
      } catch (err) {
        console.warn("Error initializing docs module:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authData, isPhDProgram, canEdit]);

  const handleToggle = (type) =>
    setExpanded((prev) => (prev === type ? null : type));

  const showBlockingLoader = (title) =>
    Swal.fire({
      title,
      html: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

  const uploadFile = async (type, file) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Status: ${getStatusText(applicationStatus)}`,
      });
      return;
    }
    const meta = documentAPIMap[type];
    if (!meta) return;

    const formData = new FormData();
    formData.append("Document", file);
    formData.append("StudentPersonalInformationId", studentPersonalInfoId);

    try {
      setErrors((p) => ({ ...p, [type]: null }));
      showBlockingLoader(`Uploading ${type}...`);

      await apiInstance.post(meta.uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadProgress((prev) => ({ ...prev, [type]: pct }));
        },
      });

      Swal.close();

      // Refetch doc metadata to get final URLs
      try {
        const fileRes = await apiInstance.get(
          `${meta.uploadUrl}/${studentPersonalInfoId}`
        );
        const docId = fileRes?.data?.result?.id;
        if (docId) {
          const docDetailsRes = await apiInstance.get(
            `${meta.statusUrl}?DocId=${docId}`
          );
          const data = docDetailsRes?.data?.result;
          if (data) {
            setUploadedFiles((prev) => ({
              ...prev,
              [type]: {
                name: data[meta.downloadKey]?.split("/").pop() || file.name,
                url: data[meta.downloadKey],
                viewUrl: data[meta.viewKey],
                docId: data.id,
                locked: !canEdit,
              },
            }));
          }
        }
      } catch {
        // fallback
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: {
            name: file.name,
            url: "#",
            viewUrl: "#",
            locked: !canEdit,
          },
        }));
      }
      Toast.fire({ icon: "success", title: `${type} uploaded` });
    } catch (err) {
      Swal.close();
      const msg =
        err?.response?.data?.message || "Upload failed. Please try again.";
      setErrors((prev) => ({ ...prev, [type]: msg }));
      Toast.fire({ icon: "error", title: msg });
    } finally {
      setUploadProgress((prev) => ({ ...prev, [type]: null }));
    }
  };

  const validateAndUpload = (type, file) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Status: ${getStatusText(applicationStatus)}`,
      });
      return;
    }
    if (
      file &&
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      uploadFile(type, file);
    } else {
      const msg = "Only PDF or DOCX files are allowed.";
      setErrors((p) => ({ ...p, [type]: msg }));
      Toast.fire({ icon: "error", title: msg });
    }
  };

  const handleRemoveFile = async (type) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Status: ${getStatusText(applicationStatus)}`,
      });
      return;
    }
    const meta = documentAPIMap[type];
    if (!meta) return;
    const docId = uploadedFiles[type]?.docId;
    if (!docId) return;

    const confirm = await Swal.fire({
      title: `Delete ${type}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (!confirm.isConfirmed) return;

    try {
      await apiInstance.delete(`${meta.deleteUrl}/${docId}`);
      setUploadedFiles((prev) => {
        const cp = { ...prev };
        delete cp[type];
        return cp;
      });
      Toast.fire({ icon: "success", title: `${type} deleted` });
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Error deleting document file.";
      setErrors((p) => ({ ...p, [type]: msg }));
      Toast.fire({ icon: "error", title: msg });
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndUpload(type, file);
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPhDProgram && !uploadedFiles["Research Proposal"]) {
      Swal.fire({
        icon: "warning",
        title: "Research Proposal Required",
        text: "Upload the Research Proposal before continuing.",
      });
      return;
    }
    onContinue && onContinue();
  };

  // Mobile summary chips
  const mobileSummary = documentTypes.map((t) => {
    const uploaded = !!uploadedFiles[t];
    const required = t === "Research Proposal" && isPhDProgram;
    return { t, uploaded, required };
  });

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner" />
          <p>Loading your Documents...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="academic-docs-form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <h2 className="academic-docs-title">Academic Documents</h2>

      {applicationStatus !== null && (
        <div
          className={`application-status ${getStatusText(applicationStatus)
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          <p>
            Status: <strong>{getStatusText(applicationStatus)}</strong>
          </p>
        </div>
      )}

      <div className="academic-docs-desc">
        {isPhDProgram && (
          <div className="alert alert-info compact-alert mb-2">
            <strong>PhD Program:</strong> Research Proposal is required.
          </div>
        )}
        {!canEdit && (
          <div className="alert alert-primary compact-alert mb-2">
            <strong>Notice:</strong> Editing disabled at current status.
          </div>
        )}
        Upload each required document as PDF or DOCX. Click a section to expand.
      </div>

      {/* Mobile summary chips */}
      <div className="docs-summary-chips">
        {mobileSummary.map(({ t, uploaded, required }) => (
          <div
            key={t}
            className={`doc-chip ${
              uploaded ? "doc-chip--ok" : "doc-chip--pending"
            } ${required ? "doc-chip--required" : ""}`}
            onClick={() => handleToggle(t)}
          >
            <span className="doc-chip-label">
              {t === "Proof of English Proficiency" ? "English Proof" : t}
            </span>
            {required && <span className="doc-chip-req">*</span>}
            <span className="doc-chip-status">
              {uploaded ? "✓" : required ? "!" : "•"}
            </span>
          </div>
        ))}
      </div>

      <div className="docs-accordion-list">
        {documentTypes.map((type) => {
          const isOpen = expanded === type;
          const meta = uploadedFiles[type];
          const isRequired = type === "Research Proposal" && isPhDProgram;
          return (
            <div
              className={`accordion-item-doc ${isOpen ? "open" : ""} ${
                isRequired ? "required-doc" : ""
              }`}
              key={type}
            >
              <button
                type="button"
                className="accordion-header-doc"
                onClick={() => handleToggle(type)}
                aria-expanded={isOpen}
              >
                <span className="acc-title">
                  {type}
                  {isRequired && <span className="required-asterisk">*</span>}
                </span>
                <span className="acc-state">
                  {meta ? (
                    <span className="badge-uploaded">Uploaded</span>
                  ) : (
                    <span className="badge-missing">
                      {isRequired ? "Required" : "Pending"}
                    </span>
                  )}
                  <span className="chevron">{isOpen ? "▲" : "▼"}</span>
                </span>
              </button>

              {isOpen && (
                <div
                  className="accordion-body-doc"
                  onDrop={(e) => handleDrop(e, type)}
                  onDragOver={handleDragOver}
                  ref={dropRef}
                >
                  <label
                    className={`upload-box-doc ${!canEdit ? "disabled" : ""} ${
                      meta ? "has-file" : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      disabled={!canEdit}
                      onChange={(e) =>
                        validateAndUpload(type, e.target.files[0])
                      }
                      className="hidden-input"
                    />
                    <div className="upload-prompt">
                      {canEdit
                        ? meta
                          ? "Replace file (PDF / DOCX)"
                          : "📎 Tap or drag a file here (PDF / DOCX)"
                        : "🔒 Editing disabled."}
                    </div>
                  </label>

                  {uploadProgress[type] && (
                    <div className="progress-wrapper">
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${uploadProgress[type]}%` }}
                        />
                      </div>
                      <span className="progress-text">
                        {uploadProgress[type]}%
                      </span>
                    </div>
                  )}

                  {errors[type] && (
                    <div className="error-text mt-1">{errors[type]}</div>
                  )}

                  {meta && (
                    /* Reuse SupportingDocuments view style classes */
                    <div className="sup-file-card acad-file-card">
                      <div className="sup-file-info">
                        <span
                          className="sup-file-name"
                          title={getViewLabel(type)}
                        >
                          {getViewLabel(type)}
                        </span>
                        <div className="sup-file-actions">
                          <a
                            href={meta.viewUrl || meta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sup-view-link"
                            aria-label={getViewLabel(type)}
                          >
                            Open
                          </a>
                          {!meta.locked && canEdit && (
                            <button
                              type="button"
                              className="sup-remove-btn"
                              onClick={() => handleRemoveFile(type)}
                              title={`Remove ${type}`}
                              aria-label={`Remove ${type}`}
                            >
                              ✖
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {isRequired && (
                    <div className="research-hint">
                      Provide a concise proposal: objectives, methodology,
                      significance, expected outcomes (PDF/DOCX).
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer buttons */}
      <div className="docs-footer form-footer non-fixed-footer">
        <button
          type="button"
          className="btn btn-outline-primary back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="inline-action-pair">
          <button type="submit" className="btn btn-primary next-btn">
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
