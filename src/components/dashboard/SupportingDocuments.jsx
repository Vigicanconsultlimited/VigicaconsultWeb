import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";
import "./styles/SupportingDocuments.css";

// Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

const DOCUMENTS = {
  "Personal Statement (PS) or SOP": {
    uploadUrl: "PersonalStatement",
    statusUrl: "PersonalStatement/document",
    deleteUrl: "PersonalStatement",
    viewKey: "personalStatementurlDocumentgoogledocviewurl",
    downloadKey: "personalStatementDocumentdownloadurl",
  },
  "CV/Resume": {
    uploadUrl: "CvOrResume",
    statusUrl: "CvOrResume/document",
    deleteUrl: "CvOrResume",
    viewKey: "cvOrResumeDocumentgoogledocviewurl",
    downloadKey: "cvOrResumeDocumentdownloadurl",
  },
  "Academic References": {
    uploadUrl: "AcademicReferenceDoc",
    statusUrl: "AcademicReferenceDoc/document",
    deleteUrl: "AcademicReferenceDoc",
    viewKey: "academicReferenceDocumentgoogledocviewurl",
    downloadKey: "academicReferenceDocumentdownloadurl",
  },
  "Professional References": {
    uploadUrl: "ProfessionalReference",
    statusUrl: "ProfessionalReference/document",
    deleteUrl: "ProfessionalReference",
    viewKey: "professionalReferenceDocumentgoogledocviewurl",
    downloadKey: "professionalReferenceDocumentdownloadurl",
  },
  "Work Experience": {
    uploadUrl: "WorkExperience",
    statusUrl: "WorkExperience/document",
    deleteUrl: "WorkExperience",
    viewKey: "workExperienceDocumentgoogledocviewurl",
    downloadKey: "workExperienceDocumentdownloadurl",
  },
  "International Passport": {
    uploadUrl: "InternationalPassport",
    statusUrl: "InternationalPassport/document",
    deleteUrl: "InternationalPassport",
    viewKey: "internationalPassportDocumentgoogledocviewurl",
    downloadKey: "internationalPassportDocumentdownloadurl",
  },
};

// Helper: map label to display "View <Something>"
const getViewLabel = (label) => {
  switch (label) {
    case "Personal Statement (PS) or SOP":
      return "View Personal Statement";
    case "CV/Resume":
      return "View CV/Resume";
    case "Academic References":
      return "View Academic References";
    case "Professional References":
      return "View Professional References";
    case "Work Experience":
      return "View Work Experience";
    case "International Passport":
      return "View International Passport";
    default:
      return `View ${label}`;
  }
};

export default function SupportingDocuments({ onContinue, onBack }) {
  const authData = useAuthStore((s) => s.allUserData);
  const [studentId, setStudentId] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [documents, setDocuments] = useState({});
  const [expanded, setExpanded] = useState("Personal Statement (PS) or SOP");
  const [progress, setProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const getStatusText = (status) => {
    const map = {
      1: "Submitted",
      2: "Pending",
      3: "Under Review",
      4: "Rejected",
      5: "Approved",
    };
    return map[status] || "Unknown";
  };

  const canEdit =
    applicationStatus === null ||
    applicationStatus === 2 ||
    applicationStatus === 4;

  useEffect(() => {
    const init = async () => {
      if (!authData) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await apiInstance.get(
          `StudentPersonalInfo/user/${authData.uid}`
        );
        const sid = data?.result?.id;
        if (!sid) throw new Error("StudentPersonalInformationId missing");
        setStudentId(sid);

        try {
          const appResp = await apiInstance.get(
            `StudentApplication/application?StudentPersonalInformationId=${sid}`
          );
          if (appResp?.data?.result) {
            setApplicationStatus(appResp.data.result.applicationStatus);
          } else {
            setApplicationStatus(2);
          }
        } catch {
          setApplicationStatus(2);
        }

        for (const [label, cfg] of Object.entries(DOCUMENTS)) {
          try {
            const idResp = await apiInstance.get(`${cfg.uploadUrl}/${sid}`);
            const docId = idResp?.data?.result?.id;
            if (!docId) continue;
            const det = await apiInstance.get(
              `${cfg.statusUrl}?DocId=${docId}`
            );
            const res = det?.data?.result;
            if (!res) continue;
            setDocuments((prev) => ({
              ...prev,
              [label]: {
                name: res[cfg.downloadKey]?.split("/").pop(),
                docId: res.id,
                url: res[cfg.downloadKey],
                viewUrl: res[cfg.viewKey],
                locked: !canEdit,
              },
            }));
          } catch {
            // ignore each doc failure
          }
        }
      } catch (e) {
        console.warn("Initialization error:", e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [authData, canEdit]);

  const uploadHandler = async (label, file) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Status: ${getStatusText(applicationStatus)}`,
      });
      return;
    }
    if (!studentId) return;

    const cfg = DOCUMENTS[label];
    const fd = new FormData();
    fd.append("Document", file);
    fd.append("StudentPersonalInformationId", studentId);

    try {
      setErrors((p) => ({ ...p, [label]: null }));
      await apiInstance.post(cfg.uploadUrl, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress((prev) => ({ ...prev, [label]: pct }));
        },
      });

      try {
        const fileIdResp = await apiInstance.get(
          `${cfg.uploadUrl}/${studentId}`
        );
        const docId = fileIdResp?.data?.result?.id;
        if (docId) {
          const det = await apiInstance.get(`${cfg.statusUrl}?DocId=${docId}`);
          const res = det?.data?.result;
          if (res) {
            setDocuments((prev) => ({
              ...prev,
              [label]: {
                name: res[cfg.downloadKey]?.split("/").pop() || file.name,
                docId: res.id,
                url: res[cfg.downloadKey],
                viewUrl: res[cfg.viewKey],
                locked: false,
              },
            }));
          }
        }
      } catch {
        setDocuments((prev) => ({
          ...prev,
          [label]: {
            name: file.name,
            url: "#",
            viewUrl: "#",
            locked: false,
          },
        }));
      }

      Toast.fire({ icon: "success", title: `${label} uploaded` });
    } catch (e) {
      const msg = e?.response?.data?.message || "Upload failed";
      setErrors((p) => ({ ...p, [label]: msg }));
      Toast.fire({ icon: "error", title: msg });
    } finally {
      setProgress((prev) => ({ ...prev, [label]: null }));
    }
  };

  const fileChange = (label, file) => {
    if (!file) return;
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      const msg = "Only PDF or DOCX allowed";
      setErrors((p) => ({ ...p, [label]: msg }));
      return Toast.fire({ icon: "warning", title: msg });
    }
    uploadHandler(label, file);
  };

  const deleteHandler = async (label) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Status: ${getStatusText(applicationStatus)}`,
      });
      return;
    }
    const cfg = DOCUMENTS[label];
    const docId = documents[label]?.docId;
    if (!docId) return;

    const confirm = await Swal.fire({
      title: `Delete "${label}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await apiInstance.delete(`${cfg.deleteUrl}/${docId}`);
      setDocuments((prev) => {
        const cp = { ...prev };
        delete cp[label];
        return cp;
      });
      Toast.fire({ icon: "success", title: `${label} deleted` });
    } catch (e) {
      const msg = e?.response?.data?.message || "Deletion failed";
      setErrors((p) => ({ ...p, [label]: msg }));
      Toast.fire({ icon: "error", title: msg });
    }
  };

  const onDrop = (e, label) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    fileChange(label, file);
  };
  const onDragOver = (e) => e.preventDefault();

  const summaryChips = Object.keys(DOCUMENTS).map((label) => {
    const uploaded = !!documents[label];
    return { label, uploaded };
  });

  if (loading)
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner" />
          <p>Loading your Documents...</p>
        </div>
      </div>
    );

  return (
    <form
      className="supporting-docs-form"
      onSubmit={(e) => {
        e.preventDefault();
        onContinue && onContinue();
      }}
      noValidate
    >
      <h2 className="supporting-title">Supporting Documents</h2>

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

      <div className="supporting-desc">
        {!canEdit && (
          <div className="alert alert-primary compact-alert mb-2">
            <strong>Notice:</strong> Editing disabled at current status.
          </div>
        )}
        Upload or review each required document below.
      </div>

      {/* Mobile summary chips */}
      <div className="supporting-chips">
        {summaryChips.map((chip) => (
          <div
            key={chip.label}
            className={`sup-chip ${
              chip.uploaded ? "sup-chip--ok" : "sup-chip--pending"
            }`}
            onClick={() =>
              setExpanded((prev) => (prev === chip.label ? null : chip.label))
            }
          >
            <span className="sup-chip-label">
              {chip.label === "Personal Statement (PS) or SOP"
                ? "Personal Statement"
                : chip.label}
            </span>
            <span className="sup-chip-status">{chip.uploaded ? "✓" : "•"}</span>
          </div>
        ))}
      </div>

      <div className="supporting-accordion">
        {Object.keys(DOCUMENTS).map((label) => {
          const isOpen = expanded === label;
          const doc = documents[label];
          return (
            <div
              key={label}
              className={`sup-acc-item ${isOpen ? "open" : ""} ${
                doc ? "has-file" : ""
              }`}
            >
              <button
                type="button"
                className="sup-acc-header"
                aria-expanded={isOpen}
                onClick={() =>
                  setExpanded((prev) => (prev === label ? null : label))
                }
              >
                <span className="sup-acc-title">{label}</span>
                <span className="sup-acc-meta">
                  {doc ? (
                    <span className="badge-uploaded">Uploaded</span>
                  ) : (
                    <span className="badge-missing">Pending</span>
                  )}
                  <span className="chevron">{isOpen ? "▲" : "▼"}</span>
                </span>
              </button>

              {isOpen && (
                <div
                  className="sup-acc-body"
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, label)}
                >
                  <label
                    className={`sup-upload-box ${!canEdit ? "disabled" : ""} ${
                      doc ? "has-file" : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      disabled={!canEdit}
                      className="sup-hidden-input"
                      onChange={(e) => fileChange(label, e.target.files[0])}
                    />
                    <div className="sup-upload-text">
                      {canEdit
                        ? doc
                          ? "Replace file (PDF / DOCX)"
                          : "📎 Tap or drag file (PDF / DOCX)"
                        : "🔒 Editing locked"}
                    </div>
                  </label>

                  {progress[label] != null && (
                    <div className="sup-progress-wrap">
                      <div className="sup-progress-bar">
                        <div
                          className="sup-progress-fill"
                          style={{ width: `${progress[label]}%` }}
                        />
                      </div>
                      <span className="sup-progress-val">
                        {progress[label]}%
                      </span>
                    </div>
                  )}

                  {errors[label] && (
                    <div className="sup-error-text">{errors[label]}</div>
                  )}

                  {doc && (
                    <div className="sup-file-card">
                      <div className="sup-file-info">
                        {/* Show uniform "View <Doc Label>" instead of saved filename */}
                        <span
                          className="sup-file-name"
                          title={getViewLabel(label)}
                        >
                          {getViewLabel(label)}
                        </span>
                        <div className="sup-file-actions">
                          <a
                            className="sup-view-link"
                            href={doc.viewUrl || doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={getViewLabel(label)}
                          >
                            Open
                          </a>
                          {canEdit && !doc.locked && (
                            <button
                              type="button"
                              className="sup-remove-btn"
                              onClick={() => deleteHandler(label)}
                              aria-label={`Remove ${label}`}
                            >
                              ✖
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="form-footer non-fixed-footer sup-footer">
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
