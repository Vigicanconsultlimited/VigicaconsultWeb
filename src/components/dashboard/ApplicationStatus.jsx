import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import "./styles/ApplicationStatus.css";

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

const statusColorMap = {
  Uploaded: "#198754",
  Pending: "#ffc107",
  Rejected: "#dc3545",
  "Under Review": "#0d6efd",
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

        const docPromises = documentTypes.map(async (type) => {
          const { getUrl, statusUrl, viewKey, nameKey } = documentAPIMap[type];

          try {
            const docRes = await apiInstance.get(`${getUrl}/${studentId}`);
            console.log(`Fetching document for ${type}:`, docRes.data);

            const docId = docRes?.data?.result?.id;
            if (!docId) return { type, status: "Pending" };

            const detailsRes = await apiInstance.get(
              `${statusUrl}?DocId=${docId}`
            );
            const details = detailsRes?.data?.result;

            return {
              type,
              name: details[nameKey]?.split("/").pop() || "View File",
              url: details[viewKey] || details[nameKey],
              status: "Uploaded",
            };
          } catch (err) {
            return { type, status: "Pending" };
          }
        });

        const results = await Promise.all(docPromises);
        setUploadedDocs(results);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
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
                borderLeftColor: statusColorMap[doc.status] || "#6c757d", // fallback: gray
              }}
            >
              <div className="fs-6 doc-title mb-0">{doc.type}</div>

              <div
                className="text-truncate mb-1"
                style={{ fontSize: ".99rem" }}
              >
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-link"
                  >
                    View {doc.type}
                  </a>
                ) : (
                  <span className="fst-italic text-muted">
                    No file uploaded
                  </span>
                )}
              </div>

              <span
                className={`doc-status ${
                  doc.status === "Uploaded" ? "uploaded" : "pending"
                }`}
              >
                {doc.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatus;
