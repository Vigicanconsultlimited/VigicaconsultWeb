import React, { useEffect, useState } from "react";
import profile from "../../../assets/images/default-profile.jpg";
import { Eye, Trash2, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import apiInstance from "../../../utils/axios";
import "../styles/DocumentReview.css";

// Application status mapping
const statusMap = {
  1: "submitted",
  2: "pending",
  3: "under review",
  4: "rejected",
  5: "approved",
};

// Document fields and their pretty names
const docFields = [
  { key: "degreeCertificateurl", label: "Degree Certificate" },
  { key: "officialTranscripturl", label: "Official Transcript" },
  { key: "cvOrResumeurl", label: "CV/Resume" },
  { key: "academicReferenceurl", label: "Academic Reference" },
  { key: "professionalReferenceurl", label: "Professional Reference" },
  { key: "waecOrNecoCertificateurl", label: "WAEC/NECO Certificate" },
  { key: "personalStatementurl", label: "Personal Statement" },
  { key: "englishProficiencyProofurl", label: "English Proficiency Proof" },
  { key: "workExperienceurl", label: "Work Experience" },
  { key: "internationalPassporturl", label: "International Passport" },
];

export default function DocumentReview() {
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
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
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch all students on mount
  useEffect(() => {
    async function fetchStudents() {
      setLoadingStudents(true);
      try {
        const res = await apiInstance.get("StudentPersonalInfo");
        if (res?.data?.statusCode === 200 && Array.isArray(res.data.result)) {
          // Map to UI format, default avatar if missing
          const students = res.data.result.map((student) => ({
            id: student.id,
            name:
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
              student.email ||
              "Unnamed",
            avatar: profile,
            documents: [],
            email: student.email,
            phone: student.phoneNumber,
            address: student.address,
            postCode: student.postalCode,
            language: student.preferredLanguage,
            dateOfBirth: student.dateOfBirth,
            joined: student.dateCreated
              ? new Date(student.dateCreated).toLocaleDateString()
              : "",
            applicationStatus: "pending",
          }));
          setStudentList(students);
          setSelectedStudent(students[0] || null);
        }
      } catch (e) {
        setStudentList([]);
      }
      setLoadingStudents(false);
    }
    fetchStudents();
  }, []);

  // Fetch selected student's application & docs
  useEffect(() => {
    async function fetchStudentApplication() {
      if (!selectedStudent) return;
      setLoadingDetails(true);
      try {
        const res = await apiInstance.get(
          `StudentApplication/application?StudentPersonalInformationId=${selectedStudent.id}`
        );
        const result = res?.data?.result;
        if (result) {
          // Documents: parse all *_url fields that are present
          const documents = docFields
            .filter((doc) => result[doc.key])
            .map((doc) => ({
              name: doc.label,
              url: result[doc.key],
              status: statusMap[result.applicationStatus] || "pending",
            }));

          // Use nested personalInformation for details if available, otherwise fallback to list
          const p = result.personalInformation || selectedStudent;
          setSelectedStudent((prev) =>
            prev
              ? {
                  ...prev,
                  name:
                    `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                    p.email ||
                    "Unnamed",
                  email: p.email || prev.email,
                  phone: p.phoneNumber || prev.phone,
                  address: p.address || prev.address,
                  postCode: p.postalCode || prev.postCode,
                  language: p.preferredLanguage || prev.language,
                  dateOfBirth: p.dob || prev.dateOfBirth,
                  joined: prev.joined,
                  documents,
                  applicationStatus:
                    statusMap[result.applicationStatus] || "pending",
                }
              : prev
          );
        } else {
          setSelectedStudent((prev) =>
            prev
              ? { ...prev, documents: [], applicationStatus: "pending" }
              : prev
          );
        }
      } catch (e) {
        setSelectedStudent((prev) =>
          prev ? { ...prev, documents: [], applicationStatus: "pending" } : prev
        );
      }
      setSelectedDocument(null);
      setLoadingDetails(false);
    }
    if (selectedStudent) fetchStudentApplication();
    // eslint-disable-next-line
  }, [selectedStudent?.id]);

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-badge approved";
      case "pending":
        return "status-badge pending";
      case "rejected":
        return "status-badge rejected";
      case "under review":
        return "status-badge pending";
      case "submitted":
        return "status-badge pending";
      default:
        return "status-badge";
    }
  };

  // Derive main status using applicationStatus if available
  const deriveStatus = (student) => {
    if (student && student.applicationStatus) return student.applicationStatus;
    if (!student.documents || !student.documents.length) return "pending";
    if (student.documents.some((d) => d.status === "approved"))
      return "approved";
    if (student.documents.every((d) => d.status === "rejected"))
      return "rejected";
    return "pending";
  };

  const handleDeleteStudent = async (id) => {
    try {
      await apiInstance.delete(`StudentPersonalInfo/delete/${id}`);
      const filtered = studentList.filter((s) => s.id !== id);
      setStudentList(filtered);
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent(filtered[0] || null);
        setSelectedDocument(null);
      }
    } catch (e) {
      // handle error as needed
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

  // Remove document from UI only (no API, as per original)
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
            {loadingStudents ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Loading students...
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Middle: Student Info & Documents, Review Actions */}
        <div className="review-details-panel">
          {loadingDetails ? (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              Loading student details...
            </div>
          ) : selectedStudent ? (
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
                <p>
                  Application Status:{" "}
                  <span
                    className={getStatusClass(deriveStatus(selectedStudent))}
                  >
                    {selectedStudent.applicationStatus
                      ? selectedStudent.applicationStatus
                          .charAt(0)
                          .toUpperCase() +
                        selectedStudent.applicationStatus.slice(1)
                      : deriveStatus(selectedStudent).charAt(0).toUpperCase() +
                        deriveStatus(selectedStudent).slice(1)}
                  </span>
                </p>
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
                    {selectedStudent.documents
                      ? selectedStudent.documents.length
                      : 0}
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
                    {selectedStudent.documents &&
                    selectedStudent.documents.length > 0 ? (
                      selectedStudent.documents.map((doc, idx) => (
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
                              {/* <span className="action-label">View</span> */}
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
                              {/*<span className="action-label">Delete</span> */}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
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
                  <iframe
                    title="Document Preview"
                    src={selectedDocument.url}
                    style={{ width: "100%", height: "320px", border: "none" }}
                  />
                </div>
                <div className="document-preview-info">
                  <div className="doc-meta">
                    <div>
                      <span>File name:</span> {selectedDocument.name}
                    </div>
                    <div>
                      <span>Status:</span>
                      <span className={getStatusClass(selectedDocument.status)}>
                        {selectedDocument.status.charAt(0).toUpperCase() +
                          selectedDocument.status.slice(1)}
                      </span>
                    </div>
                    <div className="download-link">
                      <a
                        href={selectedDocument.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
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
