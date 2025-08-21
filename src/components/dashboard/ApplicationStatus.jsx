import React, { useEffect, useState, useMemo } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import "./styles/ApplicationStatus.css";

/*
  Enhanced, mobile‑friendly & compact ApplicationStatus component
  Features:
  - Responsive compact mobile layout (accordion style)
  - Desktop enhancements: status summary chips, legend, search + filter, view mode toggle (Grid/List)
  - Consistent status color + icon mapping
  - Accessibility: role attributes, focus styles, keyboard toggling
  - Graceful handling of missing docs
*/

const documentTypes = [
  "Degree Certificate",
  "WAEC Certificate",
  "Personal Statement",
  "Official Transcript",
  "Proof of English Proficiency",
  "CV/Resume",
  "Academic References",
  "Professional References",
  "Work Experience",
  "International Passport",
];

const documentAPIMap = {
  "Degree Certificate": {
    statusUrl: "DegreeCert/document",
    getUrl: "DegreeCert",
    viewKey: "degreeCertificategoogledocviewurl",
    nameKey: "degreeCertificatedownloadurl",
  },
  "WAEC Certificate": {
    statusUrl: "WaecOrNeco/document",
    getUrl: "WaecOrNeco",
    viewKey: "waecOrNecoCertificateDucumentgoogledocviewurl",
    nameKey: "waecOrNecoCertificateDucumentdownloadurl",
  },
  "Personal Statement": {
    statusUrl: "PersonalStatement/document",
    getUrl: "PersonalStatement",
    viewKey: "personalStatementurlDocumentgoogledocviewurl",
    nameKey: "personalStatementDocumentdownloadurl",
  },
  "Official Transcript": {
    statusUrl: "OfficialTranscript/document",
    getUrl: "OfficialTranscript",
    viewKey: "officialTranscriptDocumentgoogledocviewurl",
    nameKey: "officialTranscriptDocumentdownloadurl",
  },
  "Proof of English Proficiency": {
    statusUrl: "EnglishProof/document",
    getUrl: "EnglishProof",
    viewKey: "englishProficiencyProofDocumentgoogledocviewurl",
    nameKey: "englishProficiencyProofDocumentdownloadurl",
  },
  "CV/Resume": {
    statusUrl: "CvOrResume/document",
    getUrl: "CvOrResume",
    viewKey: "cvOrResumeDocumentgoogledocviewurl",
    nameKey: "cvOrResumeDocumentdownloadurl",
  },
  "Academic References": {
    statusUrl: "AcademicReferenceDoc/document",
    getUrl: "AcademicReferenceDoc",
    viewKey: "academicReferenceDocumentgoogledocviewurl",
    nameKey: "academicReferenceDocumentdownloadurl",
  },
  "Professional References": {
    statusUrl: "ProfessionalReference/document",
    getUrl: "ProfessionalReference",
    viewKey: "professionalReferenceDocumentgoogledocviewurl",
    nameKey: "professionalReferenceDocumentdownloadurl",
  },
  "Work Experience": {
    statusUrl: "WorkExperience/document",
    getUrl: "WorkExperience",
    viewKey: "workExperienceDocumentgoogledocviewurl",
    nameKey: "workExperienceDocumentdownloadurl",
  },
  "International Passport": {
    statusUrl: "InternationalPassport/document",
    getUrl: "InternationalPassport",
    viewKey: "internationalPassportDocumentgoogledocviewurl",
    nameKey: "internationalPassportDocumentdownloadurl",
  },
};

// Status code -> internal key
const statusKeyMap = {
  1: "uploaded",
  2: "under-review",
  3: "rejected",
  4: "approved",
};

// Colors + icons
const statusMeta = {
  uploaded: { label: "Uploaded", color: "#198754", icon: "📤" },
  "under-review": { label: "Under Review", color: "#0d6efd", icon: "🔍" },
  rejected: { label: "Rejected", color: "#dc3545", icon: "❌" },
  approved: { label: "Approved", color: "#20c997", icon: "✅" },
  pending: { label: "Pending", color: "#ffc107", icon: "⏳" },
};

// Convert API status code to key
const mapStatusKey = (code) => statusKeyMap[code] || "pending";

// Truncate helper
const truncate = (str, max = 42) =>
  !str ? "" : str.length > max ? str.slice(0, max - 1) + "…" : str;

const ApplicationStatus = () => {
  const authData = useAuthStore((s) => s.allUserData);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [expandedMobile, setExpandedMobile] = useState(null); // for mobile accordion

  // Fetch
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!authData?.uid) return;
      setLoading(true);
      try {
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${authData.uid}`
        );
        const studentId = personalRes?.data?.result?.id;
        if (!studentId) {
          setDocs([]);
          return;
        }

        const results = await Promise.all(
          documentTypes.map(async (type) => {
            const { getUrl, statusUrl, viewKey, nameKey } =
              documentAPIMap[type];
            try {
              const baseRes = await apiInstance.get(`${getUrl}/${studentId}`);
              const docId = baseRes?.data?.result?.id;
              if (!docId) {
                return {
                  type,
                  fileName: null,
                  url: null,
                  statusKey: "pending",
                  createdAt: null,
                  updatedAt: null,
                };
              }
              const detailRes = await apiInstance.get(
                `${statusUrl}?DocId=${docId}`
              );
              const detail = detailRes?.data?.result;
              if (!detail) {
                return {
                  type,
                  fileName: null,
                  url: null,
                  statusKey: "pending",
                  createdAt: null,
                  updatedAt: null,
                };
              }
              const statusKey = mapStatusKey(detail.status);
              return {
                type,
                fileName: detail[nameKey]?.split("/").pop() || "View File",
                url: detail[viewKey] || detail[nameKey] || null,
                statusKey,
                createdAt: detail.createdAt,
                updatedAt: detail.updatedAt,
              };
            } catch {
              return {
                type,
                fileName: null,
                url: null,
                statusKey: "pending",
                createdAt: null,
                updatedAt: null,
              };
            }
          })
        );
        setDocs(results);
      } catch (e) {
        console.error("Document fetch error:", e.message);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [authData]);

  // Derived counts
  const statusCounts = useMemo(() => {
    const base = {
      uploaded: 0,
      "under-review": 0,
      rejected: 0,
      approved: 0,
      pending: 0,
    };
    docs.forEach((d) => {
      base[d.statusKey] = (base[d.statusKey] || 0) + 1;
    });
    return base;
  }, [docs]);

  // Filtered docs
  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const matchesText =
        !search ||
        d.type.toLowerCase().includes(search.toLowerCase()) ||
        (d.fileName || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || d.statusKey === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [docs, search, statusFilter]);

  const toggleExpandMobile = (type) => {
    setExpandedMobile((prev) => (prev === type ? null : type));
  };

  if (loading) {
    return (
      <div className="loading-overlay app-status-loading">
        <div className="spinner-container">
          <div className="loading-spinner" />
          <p>Loading Application Status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-status-wrapper">
      {/* Header / Summary (desktop & tablet) */}
      <div className="app-status-header">
        <h2 className="app-status-title">Application Document Status</h2>
        <p className="app-status-subtitle">
          Track each required document’s review progress.
        </p>

        <div className="status-summary-chips">
          {Object.entries(statusCounts).map(([key, count]) => (
            <div
              key={key}
              className={`status-chip chip-${key}`}
              title={statusMeta[key].label}
            >
              <span className="chip-icon">{statusMeta[key].icon}</span>
              <span className="chip-label">
                {statusMeta[key].label}
                <span className="chip-count">{count}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="toolbar-group search-group">
            <input
              type="text"
              className="search-input"
              placeholder="Search document or filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-group select-group">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="uploaded">Uploaded</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="toolbar-group view-toggle-group" role="group">
            <button
              type="button"
              className={`view-toggle-btn ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              ⬚
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${
                viewMode === "list" ? "active" : ""
              }`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              ☰
            </button>
          </div>
        </div>

        <div className="legend-row">
          {["pending", "uploaded", "under-review", "approved", "rejected"].map(
            (k) => (
              <div key={k} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: statusMeta[k].color }}
                ></span>
                <span>{statusMeta[k].label}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Desktop / tablet view */}
      <div
        className={`cards-region ${
          viewMode === "list" ? "list-mode" : "grid-mode"
        } desktop-cards`}
      >
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No documents match your filter.</p>
          </div>
        )}
        {filtered.map((doc) => {
          const meta = statusMeta[doc.statusKey];
          return (
            <div
              key={doc.type}
              className={`doc-card card-status-${doc.statusKey}`}
              style={{ "--status-color": meta.color }}
            >
              <div className="doc-card-top">
                <div className="doc-type" title={doc.type}>
                  {meta.icon} {doc.type}
                </div>
                <span className={`status-pill pill-${doc.statusKey}`}>
                  {meta.icon} {meta.label}
                </span>
              </div>

              <div className="doc-file-line">
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-file-link"
                  >
                    {truncate(doc.fileName || `View ${doc.type}`, 38)}
                  </a>
                ) : (
                  <span className="no-file">No file uploaded</span>
                )}
              </div>

              <div className="doc-meta">
                <span>
                  Uploaded:{" "}
                  {doc.createdAt
                    ? new Date(doc.createdAt).toLocaleDateString()
                    : "—"}
                </span>
                <span>
                  Updated:{" "}
                  {doc.updatedAt
                    ? new Date(doc.updatedAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile accordion view */}
      <div className="mobile-accordion">
        {filtered.length === 0 && (
          <div className="empty-state mobile">
            <p>No documents found.</p>
          </div>
        )}
        {filtered.map((doc) => {
          const meta = statusMeta[doc.statusKey];
          const open = expandedMobile === doc.type;
          return (
            <div
              key={doc.type}
              className={`acc-item acc-${doc.statusKey} ${open ? "open" : ""}`}
            >
              <button
                className="acc-header"
                onClick={() => toggleExpandMobile(doc.type)}
                aria-expanded={open}
              >
                <span className="acc-left">
                  <span
                    className="acc-status-dot"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="acc-title">{doc.type}</span>
                </span>
                <span className="acc-right">
                  <span className={`mini-pill pill-${doc.statusKey}`}>
                    {meta.label}
                  </span>
                  <span className="chevron">{open ? "▲" : "▼"}</span>
                </span>
              </button>
              <div
                className="acc-body"
                style={{ maxHeight: open ? "260px" : "0px" }}
              >
                <div className="acc-row">
                  <span className="label">File:</span>
                  <span className="value">
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="acc-link"
                      >
                        {truncate(doc.fileName || "View", 26)}
                      </a>
                    ) : (
                      <span className="no-file-inline">None</span>
                    )}
                  </span>
                </div>
                <div className="acc-row">
                  <span className="label">Uploaded:</span>
                  <span className="value">
                    {doc.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="acc-row">
                  <span className="label">Updated:</span>
                  <span className="value">
                    {doc.updatedAt
                      ? new Date(doc.updatedAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="acc-row">
                  <span className="label">Status:</span>
                  <span
                    className={`value status-inline status-inline-${doc.statusKey}`}
                  >
                    {meta.icon} {meta.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationStatus;
