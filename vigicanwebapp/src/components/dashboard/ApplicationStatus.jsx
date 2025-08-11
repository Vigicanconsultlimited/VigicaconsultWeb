import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import "./styles/ApplicationStatus.css";

// Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-08-11 19:06:18
// Current User's Login: NeduStack

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

// Document status mapping based on API response
const documentStatusMap = {
  1: "uploaded",
  2: "under review",
  3: "rejected",
  4: "approved",
};

// Color mapping for each status
const statusColorMap = {
  uploaded: "#198754", // Green
  "under review": "#0d6efd", // Blue
  rejected: "#dc3545", // Red
  approved: "#20c997", // Teal/Green
  pending: "#ffc107", // Yellow/Orange
};

// Helper function to get status text with proper casing
const getStatusText = (statusCode) => {
  const status = documentStatusMap[statusCode];
  if (!status) return "pending";

  // Convert to proper case for display
  return status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to get status class for CSS
const getStatusClass = (statusCode) => {
  const status = documentStatusMap[statusCode];
  if (!status) return "pending";

  // Return lowercase with hyphens for CSS class
  return status.replace(/\s+/g, "-").toLowerCase();
};

const ApplicationStatus = () => {
  const authData = useAuthStore((state) => state.allUserData);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userId = authData?.uid;
        const res = await apiInstance.get(`StudentPersonalInfo/user/${userId}`);
        const studentId = res.data?.result?.id;

        console.log(
          `Fetching documents for student ID: ${studentId} at 2025-08-11 19:06:18 by NeduStack`
        );

        const docPromises = documentTypes.map(async (type) => {
          const { getUrl, statusUrl, viewKey, nameKey } = documentAPIMap[type];

          try {
            // First, get the document to check if it exists
            const docRes = await apiInstance.get(`${getUrl}/${studentId}`);
            console.log(`Document response for ${type}:`, docRes.data);

            const docId = docRes?.data?.result?.id;
            if (!docId) {
              console.log(`No document ID found for ${type}`);
              return {
                type,
                status: "pending",
                statusText: "Pending",
                statusCode: null,
              };
            }

            // Get detailed document information including status
            const detailsRes = await apiInstance.get(
              `${statusUrl}?DocId=${docId}`
            );
            console.log(`Document details for ${type}:`, detailsRes.data);

            const details = detailsRes?.data?.result;

            if (!details) {
              console.log(`No details found for ${type}`);
              return {
                type,
                status: "pending",
                statusText: "Pending",
                statusCode: null,
              };
            }

            const statusCode = details.status;
            const statusText = getStatusText(statusCode);
            const statusClass = getStatusClass(statusCode);

            console.log(
              `${type} - Status Code: ${statusCode}, Status Text: ${statusText}, Status Class: ${statusClass}`
            );

            return {
              type,
              name: details[nameKey]?.split("/").pop() || "View File",
              url: details[viewKey] || details[nameKey],
              status: statusClass,
              statusText: statusText,
              statusCode: statusCode,
              documentId: docId,
              createdAt: details.createdAt,
              updatedAt: details.updatedAt,
            };
          } catch (err) {
            console.log(`Error fetching ${type}:`, err.message);
            return {
              type,
              status: "pending",
              statusText: "Pending",
              statusCode: null,
            };
          }
        });

        const results = await Promise.all(docPromises);
        console.log("All document results:", results);
        setUploadedDocs(results);
      } catch (error) {
        console.error(
          `Error fetching documents at 2025-08-11 19:06:18 by NeduStack:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (authData?.uid) {
      fetchDocuments();
    }
  }, [authData]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading Application Status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row g-3">
        {uploadedDocs.map((doc, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-4">
            <div
              className="p-3 h-100 bg-white doc-card-hover"
              style={{
                borderLeftColor:
                  statusColorMap[doc.status] || statusColorMap.pending,
                borderLeftWidth: "4px",
                borderLeftStyle: "solid",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div className="fs-6 doc-title mb-2 fw-bold">{doc.type}</div>

              <div
                className="text-truncate mb-2"
                style={{ fontSize: ".99rem" }}
              >
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-link text-decoration-none"
                    style={{ color: "#0d6efd" }}
                  >
                    📄 View {doc.type}
                  </a>
                ) : (
                  <span className="fst-italic text-muted">
                    📭 No file uploaded
                  </span>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span
                  className={`doc-status badge ${doc.status}`}
                  style={{
                    backgroundColor:
                      statusColorMap[doc.status] || statusColorMap.pending,
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "4px 8px",
                    borderRadius: "12px",
                  }}
                >
                  {doc.statusText}
                </span>

                {doc.statusCode && (
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Code: {doc.statusCode}
                  </small>
                )}
              </div>

              {/* Optional: Show dates if available */}
              {doc.createdAt && (
                <div className="mt-2">
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                  </small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatus;
