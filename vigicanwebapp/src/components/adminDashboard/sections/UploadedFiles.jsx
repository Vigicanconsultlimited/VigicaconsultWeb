import React, { useState } from "react";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import profile from "../../../assets/images/default-profile.jpg";

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
} from "lucide-react";
import "../styles/UploadedFiles.css";

// Short file names for demo
const fileNames = [
  "Degree Certificate",
  "Statement of Purpose",
  "Academic Reference",
  "International Passport",
  "Transcript",
  "Resume",
];

const initialFiles = [
  {
    id: 1,
    name: "Degree Certificate",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Fizy Edward",
    uploadDate: "2024-01-15",
    category: "Academic Documents",
    status: "approved",
    ownerAvatar: profile,
  },
  {
    id: 2,
    name: "Statement of Purpose",
    type: "pdf",
    size: "1.8 MB",
    uploadedBy: "ANC Charles",
    uploadDate: "2024-01-14",
    category: "Statements",
    status: "pending",
    ownerAvatar: profile,
  },
  {
    id: 3,
    name: "Academic Reference",
    type: "document",
    size: "0.9 MB",
    uploadedBy: "Mike Johnson",
    uploadDate: "2024-01-13",
    category: "References",
    status: "rejected",
    ownerAvatar: "/api/placeholder/22/22",
  },
  {
    id: 4,
    name: "International Passport",
    type: "image",
    size: "1.2 MB",
    uploadedBy: "Sarah Wilson",
    uploadDate: "2024-01-12",
    category: "Certificates",
    status: "approved",
    ownerAvatar: "/api/placeholder/22/22",
  },
];

const studentDetailsMap = {
  "John Smith": {
    name: "John Smith",
    avatar: "/api/placeholder/38/38",
    phone: "+234 801 111 1111",
    address: "No. 2 Main Street, City, State",
    postCode: "90021",
    language: "English",
    dateOfBirth: "16th May, 2000",
    joined: "4th March, 2025",
    documents: [
      { name: "Degree Certificate", status: "approved" },
      { name: "Transcript", status: "pending" },
    ],
  },
  "Jane Doe": {
    name: "Jane Doe",
    avatar: "/api/placeholder/38/38",
    phone: "+234 802 222 2222",
    address: "No. 3 Main Street, City, State",
    postCode: "90022",
    language: "English",
    dateOfBirth: "1st Jan, 1999",
    joined: "12th March, 2025",
    documents: [
      { name: "Statement of Purpose", status: "pending" },
      { name: "Resume", status: "approved" },
    ],
  },
  "Mike Johnson": {
    name: "Mike Johnson",
    avatar: "/api/placeholder/38/38",
    phone: "+234 803 333 3333",
    address: "No. 4 Main Street, City, State",
    postCode: "90023",
    language: "English",
    dateOfBirth: "23rd Feb, 2001",
    joined: "22nd March, 2025",
    documents: [{ name: "Academic Reference", status: "rejected" }],
  },
  "Sarah Wilson": {
    name: "Sarah Wilson",
    avatar: "/api/placeholder/38/38",
    phone: "+234 804 444 4444",
    address: "No. 5 Main Street, City, State",
    postCode: "90024",
    language: "English",
    dateOfBirth: "10th May, 2002",
    joined: "1st April, 2025",
    documents: [{ name: "International Passport", status: "approved" }],
  },
};

export default function UploadedFiles() {
  const [files, setFiles] = useState(initialFiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
    "Certificates",
    "References",
    "Statements",
  ];

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
    window.alert(`Downloading ${file.name}`);
  };

  const handleDelete = (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setFiles(files.filter((f) => f.id !== fileId));
    }
  };

  const handleUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setIsUploading(true);

    setTimeout(() => {
      const newFiles = uploadedFiles.map((file, index) => ({
        id: Math.max(...files.map((f) => f.id)) + index + 1,
        name: fileNames[index % fileNames.length],
        type: file.type.includes("image") ? "image" : "document",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: "Admin",
        uploadDate: new Date().toISOString().split("T")[0],
        category: "Admin Uploads",
        status: "approved",
        ownerAvatar: "/api/placeholder/22/22",
      }));

      setFiles([...newFiles, ...files]);
      setIsUploading(false);
      setIsUploadModalOpen(false);
    }, 2000);
  };

  const handleStudentClick = (uploadedBy) => {
    setStudentModal({
      open: true,
      student: studentDetailsMap[uploadedBy],
    });
  };

  const handleDocReviewToggle = (type) => {
    setDocReviewStates((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="uploaded-files-section">
      <div className="section-header">
        <div className="header-content">
          <h1 className="section-title">Uploaded Files</h1>
          <div className="header-actions">
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
              placeholder="Search files..."
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
                    onClick={() => handleStudentClick(file.uploadedBy)}
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
                <td>{file.type}</td>
                <td>{file.size}</td>
                <td>{file.category}</td>
                <td>
                  <span className={getStatusClass(file.status)}>
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
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
                    onClick={() => handleStudentClick(file.uploadedBy)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(file.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFiles.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", color: "#607d8b" }}
                >
                  No files found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                  <p>Uploading files...</p>
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

      {/* Student Details Modal */}
      <Modal
        isOpen={studentModal.open}
        onClose={() => setStudentModal({ open: false, student: null })}
        title={
          studentModal.student?.name
            ? `Student: ${studentModal.student.name}`
            : ""
        }
        size="md"
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
            <div className="details-info">
              <p>Phone: {studentModal.student.phone}</p>
              <p>Address: {studentModal.student.address}</p>
              <p>Post Code: {studentModal.student.postCode}</p>
              <p>Preferred Language: {studentModal.student.language}</p>
              <p>Date of Birth: {studentModal.student.dateOfBirth}</p>
              <p>Joined: {studentModal.student.joined}</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
