import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";
import "./styles/SupportingDocuments.css";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">Loading your documents...</p>
    </div>
  </div>
);

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
  "Proof of English Proficiency": {
    uploadUrl: "EnglishProof",
    statusUrl: "EnglishProof/document",
    deleteUrl: "EnglishProof",
    viewKey: "englishProficiencyProofDocumentgoogledocviewurl",
    downloadKey: "englishProficiencyProofDocumentdownloadurl",
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

export default function SupportingDocuments({ onContinue, onBack }) {
  const authData = useAuthStore((state) => state.allUserData);
  const [studentId, setStudentId] = useState(null);
  const [documents, setDocuments] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [progress, setProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!authData) return;
      try {
        const { data } = await apiInstance.get(
          `StudentPersonalInfo/user/${authData.uid}`
        );
        const sid = data.result?.id;
        if (!sid) throw new Error("StudentPersonalInformationId missing");
        setStudentId(sid);

        for (const [label, cfg] of Object.entries(DOCUMENTS)) {
          try {
            const fileIdRes = await apiInstance.get(`${cfg.uploadUrl}/${sid}`);
            const fileId = fileIdRes.data.result?.id;
            if (!fileId) continue;

            const det = await apiInstance.get(
              `${cfg.statusUrl}?DocId=${fileId}`
            );
            const obj = det.data.result;
            setDocuments((prev) => ({
              ...prev,
              [label]: {
                name: obj[cfg.downloadKey]?.split("/").pop(),
                url: obj[cfg.downloadKey],
                viewUrl: obj[cfg.viewKey],
                docId: obj.id,
              },
            }));
          } catch {
            // No existing file — ignore
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [authData]);

  const uploadHandler = async (label, file) => {
    const cfg = DOCUMENTS[label];
    const fd = new FormData();
    fd.append("Document", file);
    fd.append("StudentPersonalInformationId", studentId);

    try {
      setErrors((prev) => ({ ...prev, [label]: null }));
      const r = await apiInstance.post(cfg.uploadUrl, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress((prev) => ({ ...prev, [label]: pct }));
        },
      });

      const res = r.data.result;
      setDocuments((prev) => ({
        ...prev,
        [label]: {
          name: file.name,
          url: res[cfg.downloadKey],
          viewUrl: res[cfg.viewKey],
          docId: res.id,
        },
      }));

      Toast.fire({ icon: "success", title: `${label} uploaded` });
    } catch (e) {
      const msg = e.response?.data?.message || "Upload failed";
      setErrors((prev) => ({ ...prev, [label]: msg }));
      Toast.fire({ icon: "error", title: msg });
    } finally {
      setProgress((prev) => ({ ...prev, [label]: null }));
    }
  };

  const deleteHandler = async (label) => {
    const cfg = DOCUMENTS[label];
    const id = documents[label]?.docId;
    if (!id) return;

    const confirm = await Swal.fire({
      title: `Delete "${label}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await apiInstance.delete(`${cfg.deleteUrl}/${id}`);
      setDocuments((prev) => {
        const c = { ...prev };
        delete c[label];
        return c;
      });
      Toast.fire({ icon: "success", title: `${label} deleted` });
    } catch (e) {
      const msg = e.response?.data?.message || "Deletion failed";
      setErrors((prev) => ({ ...prev, [label]: msg }));
      Toast.fire({ icon: "error", title: msg });
    }
  };

  const fileChange = (label, file) => {
    if (!file) return;
    const types = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!types.includes(file.type)) {
      const m = "Only PDF or DOCX allowed";
      setErrors((prev) => ({ ...prev, [label]: m }));
      return Toast.fire({ icon: "warning", title: m });
    }
    uploadHandler(label, file);
  };

  if (loading)
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading your Documents...</p>
        </div>
      </div>
    );

  return (
    <form
      className="supporting-docs p-3 p-md-4"
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
    >
      <h2 className="title">Supporting Documents</h2>
      <p className="subtitle">Click each section to upload or view the file.</p>
      <div className="divider" />

      {Object.keys(DOCUMENTS).map((label) => (
        <div key={label} className="accordion-item mb-2">
          <div
            className={`accordion-header ${
              expanded === label ? "expanded" : ""
            }`}
            onClick={() => setExpanded(expanded === label ? null : label)}
          >
            {label}
            <span className="chevron">{expanded === label ? "▲" : "▼"}</span>
          </div>

          {expanded === label && (
            <div
              className="accordion-body"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                fileChange(label, e.dataTransfer.files[0]);
              }}
            >
              <label className="upload-box">
                <input
                  type="file"
                  className="d-none"
                  accept=".pdf,.docx"
                  onChange={(e) => fileChange(label, e.target.files[0])}
                />
                <div className="upload-placeholder">📎 Attach or drop file</div>
              </label>

              {progress[label] != null && (
                <div className="progress-bar mt-2">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress[label]}%` }}
                  />
                </div>
              )}

              {errors[label] && (
                <div className="error-text mt-2">{errors[label]}</div>
              )}

              {documents[label] && (
                <div className="uploaded-file mt-2">
                  <a
                    href={documents[label].viewUrl || documents[label].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View {label}
                  </a>
                  <span
                    className="remove-file"
                    onClick={() => deleteHandler(label)}
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
          <button type="submit" className="btn continue-btn">
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
