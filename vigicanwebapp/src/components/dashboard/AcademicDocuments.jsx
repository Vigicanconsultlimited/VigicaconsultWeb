import React, { useState, useEffect, useRef } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import "./styles/AcademicDocuments.css";
import Swal from "sweetalert2";

// Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-08-11 17:24:51
// Current User's Login: NeduStack

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

const documentTypes = [
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
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">Loading your documents...</p>
    </div>
  </div>
);

export default function AcademicDocuments({ onContinue, onBack }) {
  const authData = useAuthStore((state) => state.allUserData);
  const [appId, setAppId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState("Degree Certificate");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [applicationStatus, setApplicationStatus] = useState(null);
  const dropRef = useRef(null);

  // Helper function to get status text
  const getStatusText = (status) => {
    const statusMap = {
      1: "Submitted",
      2: "Pending",
      3: "Under Review",
      4: "Rejected",
      5: "Approved",
    };
    return statusMap[status] || "Unknown";
  };

  // Check if application status allows editing (only Pending or Rejected)
  const canEdit =
    applicationStatus === null ||
    applicationStatus === 2 ||
    applicationStatus === 4;

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!authData) return;
      try {
        const userId = authData["uid"];
        const res = await apiInstance.get(`StudentPersonalInfo/user/${userId}`);
        const studentId = res.data?.result?.id;

        if (!studentId) throw new Error("Student ID not found");
        setAppId(studentId);

        // Fetch application status
        if (studentId) {
          try {
            const appResponse = await apiInstance.get(
              `StudentApplication/application?StudentPersonalInformationId=${studentId}`
            );

            if (appResponse?.data?.result) {
              // Status codes: 1=Submitted, 2=Pending, 3=UnderReview, 4=Rejected, 5=Approved
              const status = appResponse.data.result.applicationStatus;
              setApplicationStatus(status);
            }
          } catch (err) {
            console.log(`No application found or error: ${err.message}`);
            // If no application exists yet, it's effectively pending
            setApplicationStatus(2); // Pending
          }
        }

        // Create an array of promises for all document fetches
        const documentPromises = documentTypes.map(async (type) => {
          const { uploadUrl, statusUrl, viewKey, downloadKey } =
            documentAPIMap[type];
          try {
            const fileRes = await apiInstance.get(`${uploadUrl}/${studentId}`);
            const docId = fileRes.data?.result?.id;
            if (!docId) return null;

            const docDetailsRes = await apiInstance.get(
              `${statusUrl}?DocId=${docId}`
            );
            const data = docDetailsRes.data?.result;
            if (!data) return null;

            return {
              type,
              fileData: {
                name: data[downloadKey]?.split("/").pop(),
                url: data[downloadKey],
                viewUrl: data[viewKey],
                docId: data.id,
                locked: !canEdit,
              },
            };
          } catch (err) {
            console.warn(`Error fetching document for ${type}: ${err.message}`);
            return null;
          }
        });

        // Wait for all document fetches to complete
        const results = await Promise.all(documentPromises);

        // Update uploaded files state with all results
        const newUploadedFiles = {};
        results.forEach((result) => {
          if (result) {
            newUploadedFiles[result.type] = result.fileData;
          }
        });

        setUploadedFiles(newUploadedFiles);
      } catch (err) {
        console.error(`Error fetching student data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [authData]);

  const handleToggle = (type) => {
    setExpanded((prev) => (prev === type ? null : type));
  };

  const uploadFile = async (type, file) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Application status: ${getStatusText(
          applicationStatus
        )}`,
      });
      return;
    }

    const { uploadUrl, downloadKey, viewKey } = documentAPIMap[type];
    const formData = new FormData();
    formData.append("Document", file);
    formData.append("StudentPersonalInformationId", appId);

    try {
      setErrors((prev) => ({ ...prev, [type]: null }));

      const res = await apiInstance.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress((prev) => ({ ...prev, [type]: percent }));
        },
      });

      const result = res.data.result;
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: {
          name: file.name,
          url: result[downloadKey],
          viewUrl: result[viewKey],
          docId: result.id,
          locked: false,
        },
      }));

      Toast.fire({ icon: "success", title: `${type} uploaded successfully` });
    } catch (err) {
      const msg = err?.response?.data?.message || "Upload failed.";
      setErrors((prev) => ({ ...prev, [type]: msg }));
      Toast.fire({ icon: "error", title: msg });
    } finally {
      setUploadProgress((prev) => ({ ...prev, [type]: null }));
    }
  };

  const handleFileChange = (type, file) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Application status: ${getStatusText(
          applicationStatus
        )}`,
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
      setErrors((prev) => ({
        ...prev,
        [type]: "Only PDF or DOCX files are allowed.",
      }));
    }
  };

  const handleRemoveFile = async (type) => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Application status: ${getStatusText(
          applicationStatus
        )}`,
      });
      return;
    }

    const { deleteUrl } = documentAPIMap[type];
    const docId = uploadedFiles[type]?.docId;

    if (!docId) return;

    const confirm = await Swal.fire({
      title: `Delete ${type}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await apiInstance.delete(`${deleteUrl}/${docId}`);
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[type];
        return updated;
      });
      Toast.fire({ icon: "success", title: `${type} deleted` });
    } catch (err) {
      const msg = err?.response?.data?.message || "Error deleting file.";
      setErrors((prev) => ({ ...prev, [type]: msg }));
      Toast.fire({ icon: "error", title: msg });
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Application status: ${getStatusText(
          applicationStatus
        )}`,
      });
      return;
    }
    const file = e.dataTransfer.files[0];
    handleFileChange(type, file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue && onContinue();
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading your Documents...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="academic-docs-form p-3 p-md-4 mb-4"
      onSubmit={handleSubmit}
    >
      <h2 className="academic-docs-title">Academic Documents</h2>

      {/* Application Status Display */}
      {applicationStatus && (
        <div
          className={`application-status ${getStatusText(applicationStatus)
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          <p>
            Current Application Status:{" "}
            <strong>{getStatusText(applicationStatus)}</strong>
          </p>
        </div>
      )}

      <div className="academic-docs-desc">
        {!canEdit && (
          <div className="alert alert-primary mb-2 mt-0 p-2">
            <p>
              <strong>Notice:</strong> Your application cannot be edited at this
              time.
            </p>
          </div>
        )}
        Click a drop-down to upload/view the document.
      </div>
      <div className="divider" />

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
              <label className={`upload-box ${!canEdit ? "disabled" : ""}`}>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="d-none"
                  onChange={(e) => handleFileChange(type, e.target.files[0])}
                  disabled={!canEdit}
                />
                <div className="upload-area">
                  {canEdit
                    ? "📎 Attach file or drag & drop"
                    : "🔒 Application submitted, you cannot edit this document."}
                </div>
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
                    href={
                      uploadedFiles[type].viewUrl || uploadedFiles[type].url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View {type}
                  </a>
                  {!uploadedFiles[type].locked && canEdit && (
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

      <div className="d-flex justify-content-between align-items-center gap-2 p-2 pb-1 academic-docs-footer">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onBack}
        >
          ← Back
        </button>
        <div>
          <button type="submit" className="btn btn-primary px-4">
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
