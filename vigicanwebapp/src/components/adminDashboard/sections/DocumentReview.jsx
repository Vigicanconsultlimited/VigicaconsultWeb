import React, { useState } from "react";
import profile from "../../../assets/images/default-profile.jpg";
import { Eye, Trash2, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import "../styles/DocumentReview.css";

const students = [
  {
    id: 1,
    name: "Fizy Edwards",
    avatar: profile,
    documents: [
      { name: "Degree Cert", status: "approved" },
      { name: "SOP", status: "pending" },
      { name: "Resume", status: "rejected" },
    ],
    email: "fizy@gmail.com",
    phone: "+234 801 111 1111",
    address: "No. 2 Main Street, City, State",
    postCode: "90021",
    language: "English",
    dateOfBirth: "16th May, 2000",
    joined: "4th March, 2025",
  },
  {
    id: 2,
    name: "Charles ANC",
    avatar: profile,
    documents: [
      { name: "Degree Cert", status: "approved" },
      { name: "Transcript", status: "approved" },
    ],
    email: "anc@gmail.com",
    phone: "+234 802 222 2222",
    address: "No. 3 Main Street, City, State",
    postCode: "90022",
    language: "English",
    dateOfBirth: "1st Jan, 1999",
    joined: "12th March, 2025",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "/api/placeholder/22/22",
    documents: [
      { name: "Recommendation", status: "pending" },
      { name: "Degree Cert", status: "approved" },
    ],
    email: "mike.johnson@email.com",
    phone: "+234 803 333 3333",
    address: "No. 4 Main Street, City, State",
    postCode: "90023",
    language: "English",
    dateOfBirth: "23rd Feb, 2001",
    joined: "22nd March, 2025",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    avatar: "/api/placeholder/22/22",
    documents: [
      { name: "Personal Statement", status: "pending" },
      { name: "Degree Cert", status: "rejected" },
    ],
    email: "sarah.wilson@email.com",
    phone: "+234 804 444 4444",
    address: "No. 5 Main Street, City, State",
    postCode: "90024",
    language: "English",
    dateOfBirth: "10th May, 2002",
    joined: "1st April, 2025",
  },
  {
    id: 5,
    name: "Charles Nwosu",
    avatar: "/api/placeholder/22/22",
    documents: [
      { name: "Degree Cert", status: "approved" },
      { name: "Resume", status: "approved" },
    ],
    email: "charles.nwosu@email.com",
    phone: "+234 805 555 5555",
    address: "No. 6 Main Street, City, State",
    postCode: "90025",
    language: "English",
    dateOfBirth: "5th Jun, 1998",
    joined: "2nd April, 2025",
  },
];

export default function DocumentReview() {
  const [studentList, setStudentList] = useState(students);
  const [selectedStudent, setSelectedStudent] = useState(studentList[0]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [toggleStates, setToggleStates] = useState({
    approve: false,
    reject: false,
    comment: false,
  });
  const [docToggleStates, setDocToggleStates] = useState({
    approve: false,
    reject: false,
    comment: false,
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-badge approved";
      case "pending":
        return "status-badge pending";
      case "rejected":
        return "status-badge rejected";
      default:
        return "status-badge";
    }
  };

  // Derive main status from documents: approved if any doc approved, rejected if all rejected, else pending
  const deriveStatus = (student) => {
    if (student.documents.some((d) => d.status === "approved"))
      return "approved";
    if (student.documents.every((d) => d.status === "rejected"))
      return "rejected";
    return "pending";
  };

  const handleDeleteStudent = (id) => {
    const filtered = studentList.filter((s) => s.id !== id);
    setStudentList(filtered);
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(filtered[0] || null);
      setSelectedDocument(null);
    }
  };

  const handleToggle = (type) => {
    setToggleStates((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleDocToggle = (type) => {
    setDocToggleStates((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleDeleteDocument = (idx) => {
    if (!selectedStudent) return;
    const updatedDocs = selectedStudent.documents.filter((_, i) => i !== idx);
    const updatedStudent = { ...selectedStudent, documents: updatedDocs };
    const newList = studentList.map((s) =>
      s.id === selectedStudent.id ? updatedStudent : s
    );
    setStudentList(newList);
    setSelectedStudent(updatedStudent);
    setSelectedDocument(null);
  };

  return (
    <>
      <h1
        className="section-title mb-2"
        style={{
          color: "#264de4",
          fontSize: "1.5rem",
          marginBottom: "1rem",
          marginTop: 0,
          textAlign: "left",
          display: "inline-block",
          fontWeight: 700,
        }}
      >
        Document Review
      </h1>
      <div className="document-review-section">
        {/* Left: Students List */}
        <div className="documents-table-container">
          <div className="table-wrapper">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student) => (
                  <tr
                    key={student.id}
                    className={
                      selectedStudent?.id === student.id ? "selected" : ""
                    }
                    onClick={() => {
                      setSelectedStudent(student);
                      setSelectedDocument(null);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="student-name">
                      <img
                        src={student.avatar}
                        className="student-avatar"
                        alt={student.name}
                      />
                      <span>{student.name}</span>
                    </td>
                    <td>
                      <span className={getStatusClass(deriveStatus(student))}>
                        {deriveStatus(student).charAt(0).toUpperCase() +
                          deriveStatus(student).slice(1)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Student"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(student.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {studentList.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Middle: Student Info & Documents, Review Actions */}
        <div className="review-details-panel">
          {selectedStudent ? (
            <>
              <img
                src={selectedStudent.avatar}
                className="profile-avatar-large"
                alt={selectedStudent.name}
              />
              <div className="details-info">
                <h3 className="applicant-details-name">
                  {selectedStudent.name}
                </h3>
                <p>Email: {selectedStudent.email}</p>
                <p>Phone: {selectedStudent.phone}</p>
                <p>Address: {selectedStudent.address}</p>
                <p>Post Code: {selectedStudent.postCode}</p>
                <p>Preferred Language: {selectedStudent.language}</p>
                <p>Date of Birth: {selectedStudent.dateOfBirth}</p>
                <p>Joined: {selectedStudent.joined}</p>
              </div>
              <div
                className="document-preview-actions"
                style={{ marginTop: "0.7rem", marginBottom: "0.5rem" }}
              >
                <button
                  className={`toggle-btn ${
                    toggleStates.approve ? "active" : ""
                  }`}
                  onClick={() => handleToggle("approve")}
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
                <button
                  className={`toggle-btn ${
                    toggleStates.reject ? "active" : ""
                  }`}
                  onClick={() => handleToggle("reject")}
                >
                  <XCircle size={14} />
                  Reject
                </button>
                <button
                  className={`toggle-btn ${
                    toggleStates.comment ? "active" : ""
                  }`}
                  onClick={() => handleToggle("comment")}
                >
                  <MessageSquare size={14} />
                  Comment
                </button>
              </div>
              <div className="uploaded-documents-card">
                <div className="uploaded-documents-header">
                  <span>Uploaded Documents</span>
                  <span className="document-count">
                    {selectedStudent.documents.length}
                  </span>
                </div>
                <table className="uploaded-documents-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.documents.map((doc, idx) => (
                      <tr key={idx}>
                        <td>{doc.name}</td>
                        <td>
                          <span className={getStatusClass(doc.status)}>
                            {doc.status.charAt(0).toUpperCase() +
                              doc.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-btn view-btn"
                            title="View"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <Eye size={14} />
                            <span className="action-label">View</span>
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Delete Document"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(idx);
                            }}
                          >
                            <Trash2 size={14} />
                            <span className="action-label">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedStudent.documents.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center" }}>
                          No documents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              Select a student to view details
            </div>
          )}
        </div>

        {/* Right: Document Preview */}
        <div className="document-preview-panel">
          {selectedDocument ? (
            <>
              <div className="document-preview-header">
                <span className="document-preview-title">Document Preview</span>
              </div>
              <div className="document-preview-content">
                <div className="pdf-preview-image">
                  <img src="/pdf-preview.png" alt="PDF Preview" />
                </div>
                <div className="document-preview-info">
                  <div className="doc-meta">
                    <div>
                      <span>File name:</span> {selectedDocument.name}.pdf
                    </div>
                    <div>
                      <span>Status:</span>
                      <span className={getStatusClass(selectedDocument.status)}>
                        {selectedDocument.status.charAt(0).toUpperCase() +
                          selectedDocument.status.slice(1)}
                      </span>
                    </div>
                    <div className="download-link">
                      <a href="#" download>
                        Click to download file
                      </a>
                    </div>
                  </div>
                  {/* Document Review Actions */}
                  <div
                    className="document-preview-actions"
                    style={{ marginTop: "0.7rem", marginBottom: "0.5rem" }}
                  >
                    <button
                      className={`toggle-btn ${
                        docToggleStates.approve ? "active" : ""
                      }`}
                      onClick={() => handleDocToggle("approve")}
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                    <button
                      className={`toggle-btn ${
                        docToggleStates.reject ? "active" : ""
                      }`}
                      onClick={() => handleDocToggle("reject")}
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                    <button
                      className={`toggle-btn ${
                        docToggleStates.comment ? "active" : ""
                      }`}
                      onClick={() => handleDocToggle("comment")}
                    >
                      <MessageSquare size={14} />
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="document-preview-header">
              <span className="document-preview-title">
                Select a document to preview
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
