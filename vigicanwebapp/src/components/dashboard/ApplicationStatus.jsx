import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
    statusUrl: "CV/document",
    getUrl: "CV",
    viewKey: "cvDocumentgoogledocviewurl",
    nameKey: "cvDocumentdownloadurl",
  },
  "Academic References": {
    statusUrl: "AcademicReference/document",
    getUrl: "AcademicReference",
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
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-sm">
          Loading document statuses...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {uploadedDocs.map((doc, index) => (
        <Card
          key={index}
          className="p-5 border border-gray-200 rounded-2xl shadow-md transition hover:shadow-lg"
        >
          <div className="flex flex-col gap-3">
            <div className="text-lg font-semibold text-gray-800">
              {doc.type}
            </div>

            <div className="text-sm text-blue-600 truncate">
              {doc.url ? (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {doc.name}
                </a>
              ) : (
                <span className="italic text-gray-400">No file uploaded</span>
              )}
            </div>

            <Badge
              className={`w-fit px-3 py-1 text-sm rounded-full ${
                doc.status === "Uploaded"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {doc.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationStatus;
