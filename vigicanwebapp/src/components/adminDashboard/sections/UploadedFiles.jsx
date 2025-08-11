import React, { useState, useEffect } from "react";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import profile from "../../../assets/images/default-profile.jpg";
import apiInstance from "../../../utils/axios";
import Swal from "sweetalert2";

import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Upload,
  FileText,
  Image,
  File,
  CheckCircle,
  XCircle,
  Edit,
  MessageSquare,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin as LocationIcon,
  CreditCard,
} from "lucide-react";
import "../styles/UploadedFiles.css";

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// Document fields and their API endpoints
const docFields = [
  {
    key: "degreeCertificateurl",
    label: "Degree Certificate",
    apiEndpoint: "DegreeCert",
    downloadKey: "degreeCertificatedownloadurl",
    viewKey: "degreeCertificategoogledocviewurl",
    category: "Academic Documents",
  },
  {
    key: "officialTranscripturl",
    label: "Official Transcript",
    apiEndpoint: "OfficialTranscript",
    downloadKey: "officialTranscriptdownloadurl",
    viewKey: "officialTranscriptgoogledocviewurl",
    category: "Academic Documents",
  },
  {
    key: "cvOrResumeurl",
    label: "CV/Resume",
    apiEndpoint: "CvOrResume",
    downloadKey: "cvOrResumedownloadurl",
    viewKey: "cvOrResumegoogledocviewurl",
    category: "Professional Documents",
  },
  {
    key: "academicReferenceurl",
    label: "Academic Reference",
    apiEndpoint: "AcademicReferenceDoc",
    downloadKey: "academicReferencedownloadurl",
    viewKey: "academicReferencegoogledocviewurl",
    category: "References",
  },
  {
    key: "professionalReferenceurl",
    label: "Professional Reference",
    apiEndpoint: "ProfessionalReference",
    downloadKey: "professionalReferencedownloadurl",
    viewKey: "professionalReferencegoogledocviewurl",
    category: "References",
  },
  {
    key: "waecOrNecoCertificateurl",
    label: "WAEC/NECO Certificate",
    apiEndpoint: "WaecOrNeco",
    downloadKey: "waecOrNecoCertificatedownloadurl",
    viewKey: "waecOrNecoCertificategoogledocviewurl",
    category: "Certificates",
  },
  {
    key: "personalStatementurl",
    label: "Personal Statement",
    apiEndpoint: "PersonalStatement",
    downloadKey: "personalStatementdownloadurl",
    viewKey: "personalStatementgoogledocviewurl",
    category: "Statements",
  },
  {
    key: "englishProficiencyProofurl",
    label: "English Proficiency Proof",
    apiEndpoint: "EnglishProof",
    downloadKey: "englishProficiencyProofdownloadurl",
    viewKey: "englishProficiencyProofgoogledocviewurl",
    category: "Certificates",
  },
  {
    key: "workExperienceurl",
    label: "Work Experience",
    apiEndpoint: "WorkExperience",
    downloadKey: "workExperiencedownloadurl",
    viewKey: "workExperiencegoogledocviewurl",
    category: "Professional Documents",
  },
  {
    key: "internationalPassporturl",
    label: "International Passport",
    apiEndpoint: "InternationalPassport",
    downloadKey: "internationalPassportdownloadurl",
    viewKey: "internationalPassportgoogledocviewurl",
    category: "Certificates",
  },
];

// Document status mapping
const documentStatusMap = {
  1: "uploaded",
  2: "under review",
  3: "rejected",
  4: "approved",
};

export default function UploadedFiles() {
  // Current date/time and user as specified
  const getCurrentDateTime = () => {
    return "2025-08-10 23:48:19";
  };

  const getCurrentUser = () => {
    return "NeduStack";
  };

  const [files, setFiles] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [studentModal, setStudentModal] = useState({
    open: false,
    student: null,
  });
  const [docReviewStates, setDocReviewStates] = useState({
    approve: false,
    reject: false,
    comment: false,
  });

  const categories = [
    "Academic Documents",
    "Professional Documents",
    "Certificates",
    "References",
    "Statements",
  ];

  // Get JWT token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const getAuthToken = () => {
    const token =
      getCookie("token") || getCookie("authToken") || getCookie("access_token");
    return token || "";
  };

  // Fetch all students first
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await apiInstance.get("StudentPersonalInfo");

      if (res?.data?.statusCode === 200 && Array.isArray(res.data.result)) {
        const studentsData = res.data.result.map((student) => ({
          id: student.id,
          name:
            `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
            student.email ||
            "Unnamed",
          email: student.email,
          phone: student.phoneNumber || "Not provided",
          address: student.address || "Not provided",
          postCode: student.postalCode || "Not provided",
          language: student.preferredLanguage || "Not specified",
          dateOfBirth: student.dateOfBirth || "Not provided",
          joined: student.dateCreated
            ? new Date(student.dateCreated).toLocaleDateString()
            : "Not available",
          avatar: profile,
          documents: [],
        }));

        setStudents(studentsData);
        return studentsData;
      } else {
        throw new Error("Invalid students API response");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to load students",
      });
      return [];
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch all documents from all endpoints
  const fetchAllDocuments = async (studentsData) => {
    setLoadingFiles(true);
    try {
      const allFiles = [];

      // Fetch documents from each endpoint
      for (const docField of docFields) {
        try {
          const res = await apiInstance.get(docField.apiEndpoint);

          if (res?.data?.statusCode === 200 && Array.isArray(res.data.result)) {
            const documents = res.data.result.map((doc) => {
              // Find the student who owns this document
              const owner = studentsData.find(
                (student) => student.id === doc.studentPersonalInformationId
              );

              // Extract file size from URL or set default
              const getFileSize = (url) => {
                // This is a placeholder - you might want to make a HEAD request to get actual file size
                // For now, we'll generate a reasonable size based on document type
                const randomSize = (Math.random() * 3 + 0.5).toFixed(1);
                return `${randomSize} MB`;
              };

              // Determine file type from URL
              const getFileType = (url) => {
                if (url?.includes(".pdf")) return "pdf";
                if (url?.includes(".doc") || url?.includes(".docx"))
                  return "document";
                if (
                  url?.includes(".jpg") ||
                  url?.includes(".jpeg") ||
                  url?.includes(".png")
                )
                  return "image";
                return "file";
              };

              const downloadUrl =
                doc[docField.downloadKey] || doc.downloadUrl || "";
              const viewUrl =
                doc[docField.viewKey] || doc.viewUrl || downloadUrl;

              return {
                id: doc.id,
                documentId: doc.id,
                name: docField.label,
                type: getFileType(downloadUrl),
                size: getFileSize(downloadUrl),
                uploadedBy: owner?.name || "Unknown User",
                uploadedById: doc.studentPersonalInformationId,
                uploadDate: doc.createdAt
                  ? new Date(doc.createdAt).toLocaleDateString()
                  : getCurrentDateTime().split(" ")[0],
                category: docField.category,
                status: documentStatusMap[doc.status] || "uploaded",
                rawStatus: doc.status,
                ownerAvatar: owner?.avatar || profile,
                downloadUrl: downloadUrl,
                viewUrl: viewUrl,
                apiEndpoint: docField.apiEndpoint,
                owner: owner,
              };
            });

            allFiles.push(...documents);
          }
        } catch (error) {
          console.error(`Error fetching ${docField.label} documents:`, error);
        }
      }

      // Update students with their documents
      const studentsWithDocs = studentsData.map((student) => ({
        ...student,
        documents: allFiles.filter((file) => file.uploadedById === student.id),
      }));

      setStudents(studentsWithDocs);
      setFiles(allFiles);

      console.log(
        `Loaded ${allFiles.length} documents from ${studentsData.length} students`
      );
    } catch (error) {
      console.error("Error fetching documents:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to load documents",
      });
    } finally {
      setLoadingFiles(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      const studentsData = await fetchStudents();
      if (studentsData.length > 0) {
        await fetchAllDocuments(studentsData);
      }
    };

    loadData();
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    const studentsData = await fetchStudents();
    if (studentsData.length > 0) {
      await fetchAllDocuments(studentsData);
    }
    setRefreshing(false);

    Toast.fire({
      icon: "success",
      title: "Data refreshed successfully",
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
      case "document":
        return <FileText size={20} className="file-icon" />;
      case "image":
        return <Image size={20} className="file-icon" />;
      default:
        return <File size={20} className="file-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-badge approved";
      case "rejected":
        return "status-badge rejected";
      case "pending":
      case "uploaded":
        return "status-badge pending";
      case "under review":
        return "status-badge pending";
      default:
        return "status-badge";
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (file) => {
    if (file.downloadUrl) {
      // Open download URL in new tab
      window.open(file.downloadUrl, "_blank");
      Toast.fire({
        icon: "success",
        title: `Downloading ${file.name}`,
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Download URL not available",
      });
    }
  };

  const handleView = (file) => {
    if (file.viewUrl || file.downloadUrl) {
      // Open view URL in new tab
      window.open(file.viewUrl || file.downloadUrl, "_blank");
      Toast.fire({
        icon: "success",
        title: `Viewing ${file.name}`,
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "View URL not available",
      });
    }
  };

  const handleDelete = async (file) => {
    const token = getAuthToken();
    if (!token) {
      Toast.fire({
        icon: "error",
        title: "Authentication required",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Delete Document",
        text: `Are you sure you want to delete ${file.name}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await apiInstance.delete(
          `${file.apiEndpoint}/${file.documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response?.data?.statusCode === 200 || response?.status === 200) {
          // Remove file from state
          setFiles(files.filter((f) => f.id !== file.id));

          // Update students documents
          setStudents(
            students.map((student) => ({
              ...student,
              documents: student.documents.filter((doc) => doc.id !== file.id),
            }))
          );

          Toast.fire({
            icon: "success",
            title: `${file.name} deleted successfully`,
          });
        } else {
          throw new Error("Failed to delete document");
        }
      }
    } catch (error) {
      console.error(`Error deleting document: ${error.message}`);
      Toast.fire({
        icon: "error",
        title: "Failed to delete document",
      });
    }
  };

  const handleUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setIsUploading(true);

    // This is a placeholder for upload functionality
    // You would implement actual upload logic here
    setTimeout(() => {
      Toast.fire({
        icon: "info",
        title: "Upload functionality to be implemented",
      });
      setIsUploading(false);
      setIsUploadModalOpen(false);
    }, 2000);
  };

  const handleStudentClick = (uploadedById) => {
    const student = students.find((s) => s.id === uploadedById);
    if (student) {
      setStudentModal({
        open: true,
        student: student,
      });
    }
  };

  const handleDocReviewToggle = (type) => {
    setDocReviewStates((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));

    // Placeholder for review action
    Toast.fire({
      icon: "info",
      title: `${type} action to be implemented`,
    });
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not provided") return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="uploaded-files-section">
      <div className="section-header">
        <div className="header-content">
          <h1 className="section-title">Uploaded Files</h1>
          <div className="header-actions">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loadingFiles || loadingStudents}
              className="btn filter-btn"
              title="Refresh files"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "refresh-spinning" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              className="btn primary"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload size={16} style={{ marginRight: 6 }} />
              Upload Files
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-filter-container">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search files or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button className="btn filter-btn">
            <Filter size={16} style={{ marginRight: 6 }} />
            Filter
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div className="files-table-container">
        {loadingFiles || loadingStudents ? (
          <div className="loading-state">
            <LoadingSpinner size="lg" />
            <p>Loading files and student data...</p>
          </div>
        ) : (
          <table className="files-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Owner</th>
                <th>Date Created</th>
                <th>Type</th>
                <th>Size</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id}>
                  <td>
                    <span className="file-table-icon">
                      {getFileIcon(file.type)}
                    </span>
                    {file.name}
                  </td>
                  <td>
                    <span
                      className="owner-cell"
                      onClick={() => handleStudentClick(file.uploadedById)}
                      title={`View ${file.uploadedBy}'s details`}
                    >
                      <img
                        src={file.ownerAvatar}
                        alt={file.uploadedBy}
                        className="owner-avatar"
                      />
                      {file.uploadedBy}
                    </span>
                  </td>
                  <td>{file.uploadDate}</td>
                  <td className="file-type-cell">{file.type.toUpperCase()}</td>
                  <td>{file.size}</td>
                  <td>{file.category}</td>
                  <td>
                    <span className={getStatusClass(file.status)}>
                      {file.status.charAt(0).toUpperCase() +
                        file.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleDownload(file)}
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="action-btn"
                      title="View"
                      onClick={() => handleView(file)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(file)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && !loadingFiles && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      color: "#607d8b",
                      padding: "2rem",
                    }}
                  >
                    {files.length === 0
                      ? "No files uploaded yet"
                      : "No files match your search criteria"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Files"
        size="md"
      >
        <div className="upload-modal-content">
          <div className="upload-area">
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="file-input"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="upload-label">
              {isUploading ? (
                <div className="uploading-state">
                  <LoadingSpinner size="lg" />
                  <p>Processing upload...</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={48} className="upload-icon" />
                  <h3>Choose files to upload</h3>
                  <p>or drag and drop them here</p>
                  <p className="upload-hint">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>
      </Modal>

      {/* Enhanced Student Details Modal */}
      <Modal
        isOpen={studentModal.open}
        onClose={() => setStudentModal({ open: false, student: null })}
        title={
          studentModal.student?.name
            ? `Student: ${studentModal.student.name}`
            : ""
        }
        size="lg"
      >
        {studentModal.student && (
          <div className="student-modal-content">
            <div className="student-modal-header">
              <img
                src={studentModal.student.avatar}
                className="profile-avatar-large"
                alt={studentModal.student.name}
              />
              <h3 className="applicant-details-name">
                {studentModal.student.name}
              </h3>
            </div>

            {/* Enhanced Personal Information */}
            <div className="enhanced-details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <Mail size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">
                    {studentModal.student.email || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Phone size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">
                    {studentModal.student.phone}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <LocationIcon size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">
                    {studentModal.student.address}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <CreditCard size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Post Code</span>
                  <span className="detail-value">
                    {studentModal.student.postCode}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Globe size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Preferred Language</span>
                  <span className="detail-value">
                    {studentModal.student.language}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-value">
                    {formatDate(studentModal.student.dateOfBirth)}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Date Joined</span>
                  <span className="detail-value">
                    {formatDate(studentModal.student.joined)}
                  </span>
                </div>
              </div>
            </div>

            <div className="student-review-actions">
              <button
                className={`toggle-btn ${
                  docReviewStates.approve ? "active" : ""
                }`}
                onClick={() => handleDocReviewToggle("approve")}
              >
                <CheckCircle size={14} />
                Approve
              </button>
              <button
                className={`toggle-btn ${
                  docReviewStates.reject ? "active" : ""
                }`}
                onClick={() => handleDocReviewToggle("reject")}
              >
                <XCircle size={14} />
                Reject
              </button>
              <button
                className={`toggle-btn ${
                  docReviewStates.comment ? "active" : ""
                }`}
                onClick={() => handleDocReviewToggle("comment")}
              >
                <MessageSquare size={14} />
                Comment
              </button>
              <button className="toggle-btn edit-btn">
                <Edit size={14} />
                Edit
              </button>
            </div>

            <div className="uploaded-documents-card student-files-list">
              <div className="uploaded-documents-header">
                <span>Uploaded Documents</span>
                <span className="document-count">
                  {studentModal.student.documents.length}
                </span>
              </div>
              <table className="uploaded-documents-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {studentModal.student.documents.map((doc, idx) => (
                    <tr key={idx}>
                      <td>{doc.name}</td>
                      <td>
                        <span className={getStatusClass(doc.status)}>
                          {doc.status.charAt(0).toUpperCase() +
                            doc.status.slice(1)}
                        </span>
                      </td>
                      <td>{doc.uploadDate}</td>
                    </tr>
                  ))}
                  {studentModal.student.documents.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        style={{ textAlign: "center", color: "#607d8b" }}
                      >
                        No documents uploaded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
