import React, { useEffect, useState } from "react";
import profile from "../../../assets/images/default-profile.jpg";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  RefreshCw,
  Clock,
} from "lucide-react";
import apiInstance from "../../../utils/axios";
import "../styles/DocumentReview.css";
import Swal from "sweetalert2";

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// Application status mapping
const statusMap = {
  1: "submitted",
  2: "pending",
  3: "under review",
  4: "rejected",
  5: "approved",
};

// Application Status enum for API calls
const ApplicationStatus = {
  Submitted: 1,
  Pending: 2,
  UnderReview: 3,
  Rejected: 4,
  Approved: 5,
};

// Document status
const DocumentStatus = {
  Uploaded: 1,
  UnderReview: 2,
  Rejected: 3,
  Approved: 4,
};

// Document status mapping for display
const documentStatusMap = {
  1: "uploaded",
  2: "under review",
  3: "rejected",
  4: "approved",
};

// Document fields and their API endpoints
const docFields = [
  {
    key: "degreeCertificateurl",
    label: "Degree Certificate",
    apiEndpoint: "DegreeCert",
  },
  {
    key: "officialTranscripturl",
    label: "Official Transcript",
    apiEndpoint: "OfficialTranscript",
  },
  {
    key: "cvOrResumeurl",
    label: "CV/Resume",
    apiEndpoint: "CvOrResume",
  },
  {
    key: "academicReferenceurl",
    label: "Academic Reference",
    apiEndpoint: "AcademicReferenceDoc",
  },
  {
    key: "professionalReferenceurl",
    label: "Professional Reference",
    apiEndpoint: "ProfessionalReference",
  },
  {
    key: "waecOrNecoCertificateurl",
    label: "WAEC/NECO Certificate",
    apiEndpoint: "WaecOrNeco",
  },
  {
    key: "personalStatementurl",
    label: "Personal Statement",
    apiEndpoint: "PersonalStatement",
  },
  {
    key: "englishProficiencyProofurl",
    label: "English Proficiency Proof",
    apiEndpoint: "EnglishProof",
  },
  {
    key: "workExperienceurl",
    label: "Work Experience",
    apiEndpoint: "WorkExperience",
  },
  {
    key: "internationalPassporturl",
    label: "International Passport",
    apiEndpoint: "InternationalPassport",
  },
];

export default function DocumentReview() {
  // Get JWT token from cookies with debugging
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const getAuthToken = () => {
    const token =
      getCookie("token") || getCookie("authToken") || getCookie("access_token");

    if (token) {
    } else {
      //console.error("No authentication token found in cookies");
      Toast.fire({
        icon: "error",
        title: "Authentication Invalid. Please login again.",
      });
    }

    return token || "";
  };

  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [toggleStates, setToggleStates] = useState({
    approve: false,
    reject: false,
    underReview: false,
    comment: false,
  });
  const [docToggleStates, setDocToggleStates] = useState({
    approve: false,
    reject: false,
    underReview: false,
    comment: false,
  });
  const [appToggleStates, setAppToggleStates] = useState({
    approve: false,
    reject: false,
    underReview: false,
    comment: false,
  });
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingDocument, setUpdatingDocument] = useState(false);
  const [updatingApplication, setUpdatingApplication] = useState(false);
  const [refreshingStatuses, setRefreshingStatuses] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);

  // Check token on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      console.error(
        "DocumentReview component loaded without valid authentication token"
      );
    }
  }, []);

  // Fetch all students function
  const fetchStudents = async (isRefresh = false) => {
    const loadingState = isRefresh ? setRefreshingStatuses : setLoadingStudents;
    loadingState(true);

    try {
      //console.log("Fetching students...");
      const res = await apiInstance.get("StudentPersonalInfo");
      //console.log("Students API response:", res?.data);

      if (res?.data?.statusCode === 200 && Array.isArray(res.data.result)) {
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

        const studentsWithStatus = await Promise.all(
          students.map(async (student) => {
            try {
              const appRes = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${student.id}`
              );

              if (appRes?.data?.statusCode === 200 && appRes.data.result) {
                const applicationStatusCode =
                  appRes.data.result.applicationStatus;
                const mappedApplicationStatus =
                  statusMap[applicationStatusCode] || "pending";

                return {
                  ...student,
                  applicationStatus: mappedApplicationStatus,
                  applicationStatusCode: applicationStatusCode,
                };
              }
            } catch (error) {
              console.error(
                `Error fetching application status for student ${student.id}: ${error.message}`
              );
            }
            return student;
          })
        );

        setStudentList(studentsWithStatus);

        if (!isRefresh && !selectedStudent && studentsWithStatus.length > 0) {
          setSelectedStudent(studentsWithStatus[0]);
        }

        if (isRefresh && selectedStudent) {
          const updatedSelectedStudent = studentsWithStatus.find(
            (s) => s.id === selectedStudent.id
          );
          if (updatedSelectedStudent) {
            setSelectedStudent(updatedSelectedStudent);
          }
        }

        if (isRefresh) {
          Toast.fire({
            icon: "success",
            title: "Student list refreshed successfully",
          });
        }
      } else {
        console.error("Invalid students API response:", res?.data);
        throw new Error("Invalid response from students API");
      }
    } catch (error) {
      console.error(`Error fetching students: ${error.message}`);
      console.error("Full error:", error);

      if (!isRefresh) {
        setStudentList([]);
      }

      Toast.fire({
        icon: "error",
        title: `Failed to ${isRefresh ? "refresh" : "load"} students`,
      });
    }
    loadingState(false);
  };

  useEffect(() => {
    fetchStudents(false);
  }, []);

  const handleRefreshStudents = () => {
    fetchStudents(true);
  };

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
          const applicationStatusCode = result.applicationStatus;
          const mappedApplicationStatus =
            statusMap[applicationStatusCode] || "pending";

          const documentsPromises = docFields
            .filter((doc) => result[doc.key])
            .map(async (doc) => {
              try {
                const docRes = await apiInstance.get(
                  `${doc.apiEndpoint}/${selectedStudent.id}`
                );

                if (docRes?.data?.statusCode === 200 && docRes.data.result) {
                  let docData = null;

                  if (Array.isArray(docRes.data.result)) {
                    docData = docRes.data.result.find(
                      (item) =>
                        item.studentPersonalInformationId === selectedStudent.id
                    );
                    if (!docData) {
                      console.warn(
                        `No matching document found for ${doc.label} and student ${selectedStudent.id}`
                      );
                      return null;
                    }
                  } else {
                    docData = docRes.data.result;
                  }

                  if (docData && docData.id) {
                    const docStatus =
                      documentStatusMap[docData.status] || "uploaded";

                    return {
                      name: doc.label,
                      url: result[doc.key],
                      status: docStatus,
                      apiEndpoint: doc.apiEndpoint,
                      documentId: docData.id,
                      studentPersonalInformationId: selectedStudent.id,
                      rawStatus: docData.status,
                      fullDocData: docData,
                    };
                  }
                }
                return null;
              } catch (error) {
                console.error(
                  `Failed to fetch document ID for ${doc.label}: ${error.message}`
                );
                return null;
              }
            });

          const documentsResults = await Promise.all(documentsPromises);
          const documents = documentsResults.filter((doc) => doc !== null);

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
                  applicationStatus: mappedApplicationStatus,
                  applicationStatusCode: applicationStatusCode,
                  fullApplicationData: result,
                }
              : prev
          );

          setStudentList((prevList) =>
            prevList.map((student) =>
              student.id === selectedStudent.id
                ? {
                    ...student,
                    applicationStatus: mappedApplicationStatus,
                    applicationStatusCode: applicationStatusCode,
                  }
                : student
            )
          );
        } else {
          console.warn("No application data found for student");
          setSelectedStudent((prev) =>
            prev
              ? { ...prev, documents: [], applicationStatus: "pending" }
              : prev
          );
        }
      } catch (error) {
        console.error(`Error fetching application details: ${error.message}`);
        console.error("Full error:", error);
        setSelectedStudent((prev) =>
          prev ? { ...prev, documents: [], applicationStatus: "pending" } : prev
        );
      }
      setSelectedDocument(null);
      setLoadingDetails(false);
    }

    if (selectedStudent) fetchStudentApplication();
  }, [selectedStudent?.id]);

  // Update application status
  const updateApplicationStatus = async (personalInformationId, status) => {
    setUpdatingApplication(true);

    const token = getAuthToken();
    if (!token) {
      setUpdatingApplication(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("PersonalInformationId", personalInformationId);
      formData.append("ApplicationStatus", status);

      const response = await apiInstance.put(
        "StudentApplication/adminapplicationupdate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.statusCode === 200) {
        const newStatus = statusMap[status] || "pending";
        //console.log(`Application status updated successfully to: ${newStatus}`);

        setSelectedStudent((prev) => ({
          ...prev,
          applicationStatus: newStatus,
          applicationStatusCode: status,
        }));

        setStudentList((prev) =>
          prev.map((student) =>
            student.id === personalInformationId
              ? {
                  ...student,
                  applicationStatus: newStatus,
                  applicationStatusCode: status,
                }
              : student
          )
        );

        Toast.fire({
          icon: "success",
          title: `Application ${newStatus} successfully`,
        });
      } else {
        throw new Error("Failed to update application status");
      }
    } catch (error) {
      console.error(`Error updating application status: ${error.message}`);
      console.error("Full error:", error);

      if (error.response?.status === 401) {
        console.error(
          "Authentication failed - token may be expired or invalid"
        );
        Toast.fire({
          icon: "error",
          title: "Authentication failed. Please login again.",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to update application status",
        });
      }
    }
    setUpdatingApplication(false);
  };

  // Update document status
  const updateDocumentStatus = async (document, status) => {
    if (!document || !document.apiEndpoint || !document.documentId) {
      console.error("Invalid document information:", document);
      Toast.fire({
        icon: "error",
        title: "Invalid document information",
      });
      return;
    }

    setUpdatingDocument(true);

    const token = getAuthToken();
    if (!token) {
      setUpdatingDocument(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("DocumentId", document.documentId);
      formData.append("DocumentStatus", status);

      const response = await apiInstance.put(document.apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (response?.data?.statusCode === 200) {
        const newStatus = documentStatusMap[status] || "uploaded";

        setSelectedStudent((prev) => {
          if (!prev) return prev;

          const updatedDocuments = prev.documents.map((doc) =>
            doc.documentId === document.documentId
              ? { ...doc, status: newStatus, rawStatus: status }
              : doc
          );

          return { ...prev, documents: updatedDocuments };
        });

        if (
          selectedDocument &&
          selectedDocument.documentId === document.documentId
        ) {
          setSelectedDocument((prev) => ({
            ...prev,
            status: newStatus,
            rawStatus: status,
          }));
        }

        setStudentList((prev) =>
          prev.map((student) =>
            student.id === selectedStudent.id
              ? { ...student, documents: selectedStudent.documents }
              : student
          )
        );

        Toast.fire({
          icon: "success",
          title: `Document ${
            newStatus === "approved"
              ? "approved"
              : newStatus === "rejected"
              ? "rejected"
              : newStatus === "under review"
              ? "marked as under review"
              : "updated"
          } successfully`,
        });
      } else {
        throw new Error(
          `Failed to update document status. Response: ${JSON.stringify(
            response?.data
          )}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to update document status for ${document.name}: ${error.message}`
      );
      console.error("Full error:", error);

      if (error.response?.status === 401) {
        console.error(
          "Authentication failed - token may be expired or invalid"
        );
        Toast.fire({
          icon: "error",
          title: "Authentication failed. Please login again.",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: `Failed to update ${document.name} status`,
        });
      }
    }
    setUpdatingDocument(false);
  };

  // Delete document function
  const deleteDocument = async (document) => {
    if (!document || !document.apiEndpoint || !document.documentId) {
      console.error("Invalid document information for deletion:", document);
      Toast.fire({
        icon: "error",
        title: "Invalid document information",
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Delete Document",
        text: `Are you sure you want to delete ${document.name}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setDeletingDocument(document.documentId);

        const response = await apiInstance.delete(
          `${document.apiEndpoint}/${document.documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response?.data?.statusCode === 200 || response?.status === 200) {
          setSelectedStudent((prev) => {
            if (!prev) return prev;

            const updatedDocuments = prev.documents.filter(
              (doc) => doc.documentId !== document.documentId
            );

            return { ...prev, documents: updatedDocuments };
          });

          setStudentList((prev) =>
            prev.map((student) =>
              student.id === selectedStudent.id
                ? { ...student, documents: selectedStudent.documents }
                : student
            )
          );

          if (
            selectedDocument &&
            selectedDocument.documentId === document.documentId
          ) {
            setSelectedDocument(null);
          }

          Toast.fire({
            icon: "success",
            title: `${document.name} deleted successfully`,
          });
        } else {
          throw new Error(
            `Failed to delete document. Response: ${JSON.stringify(
              response?.data
            )}`
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to delete document ${document.name}: ${error.message}`
      );
      console.error("Full error:", error);

      if (error.response?.status === 401) {
        console.error(
          "Authentication failed - token may be expired or invalid"
        );
        Toast.fire({
          icon: "error",
          title: "Authentication failed. Please login again.",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: `Failed to delete ${document.name}`,
        });
      }
    } finally {
      setDeletingDocument(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-badge approved";
      case "pending":
        return "status-badge pending";
      case "rejected":
        return "status-badge rejected";
      case "under review":
        return "status-badge under-review";
      case "submitted":
        return "status-badge submitted";
      case "uploaded":
        return "status-badge uploaded";
      default:
        return "status-badge";
    }
  };

  const deriveStatus = (student) => {
    if (student && student.applicationStatus) {
      return student.applicationStatus;
    }
    return "pending";
  };

  const handleDeleteStudent = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Delete Student",
        text: "Are you sure you want to delete this student? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await apiInstance.delete(`StudentPersonalInfo/delete/${id}`);

        const filtered = studentList.filter((s) => s.id !== id);
        setStudentList(filtered);

        if (selectedStudent && selectedStudent.id === id) {
          setSelectedStudent(filtered[0] || null);
          setSelectedDocument(null);
        }

        Toast.fire({
          icon: "success",
          title: "Student deleted successfully",
        });
      }
    } catch (error) {
      console.error(`Error deleting student: ${error.message}`);
      console.error("Full error:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to delete student",
      });
    }
  };

  const handleAppToggle = (type) => {
    setAppToggleStates((prev) => ({
      approve: false,
      reject: false,
      underReview: false,
      comment: false,
      [type]: !prev[type],
    }));

    if (selectedStudent) {
      if (type === "approve" && !appToggleStates.approve) {
        updateApplicationStatus(selectedStudent.id, ApplicationStatus.Approved);
      } else if (type === "reject" && !appToggleStates.reject) {
        updateApplicationStatus(selectedStudent.id, ApplicationStatus.Rejected);
      } else if (type === "underReview" && !appToggleStates.underReview) {
        updateApplicationStatus(
          selectedStudent.id,
          ApplicationStatus.UnderReview
        );
      } else if (type === "comment" && !appToggleStates.comment) {
        Toast.fire({
          icon: "info",
          title: "Comment functionality to be implemented",
        });
      }
    }
  };

  const handleToggle = (type) => {
    setToggleStates((prev) => ({
      approve: false,
      reject: false,
      underReview: false,
      comment: false,
      [type]: !prev[type],
    }));

    if (type === "approve" && !toggleStates.approve) {
      if (selectedStudent) {
        updateApplicationStatus(selectedStudent.id, ApplicationStatus.Approved);
      }

      if (selectedStudent && selectedStudent.documents) {
        selectedStudent.documents.forEach((doc) => {
          updateDocumentStatus(doc, DocumentStatus.Approved);
        });
      }
    } else if (type === "reject" && !toggleStates.reject) {
      if (selectedStudent) {
        updateApplicationStatus(selectedStudent.id, ApplicationStatus.Rejected);
      }

      if (selectedStudent && selectedStudent.documents) {
        selectedStudent.documents.forEach((doc) => {
          updateDocumentStatus(doc, DocumentStatus.Rejected);
        });
      }
    } else if (type === "underReview" && !toggleStates.underReview) {
      if (selectedStudent) {
        updateApplicationStatus(
          selectedStudent.id,
          ApplicationStatus.UnderReview
        );
      }

      if (selectedStudent && selectedStudent.documents) {
        selectedStudent.documents.forEach((doc) => {
          updateDocumentStatus(doc, DocumentStatus.UnderReview);
        });
      }
    }
  };

  const handleDocToggle = (type) => {
    setDocToggleStates((prev) => ({
      approve: false,
      reject: false,
      underReview: false,
      comment: false,
      [type]: !prev[type],
    }));

    if (selectedDocument) {
      if (type === "approve" && !docToggleStates.approve) {
        updateDocumentStatus(selectedDocument, DocumentStatus.Approved);
      } else if (type === "reject" && !docToggleStates.reject) {
        updateDocumentStatus(selectedDocument, DocumentStatus.Rejected);
      } else if (type === "underReview" && !docToggleStates.underReview) {
        updateDocumentStatus(selectedDocument, DocumentStatus.UnderReview);
      }
    }
  };

  const handleDeleteDocument = (document) => {
    deleteDocument(document);
  };

  return (
    <>
      <div className="header-section">
        <h1 className="section-title">Document Review</h1>
        <button
          onClick={handleRefreshStudents}
          disabled={refreshingStatuses || loadingStudents}
          className="refresh-btn"
          title="Refresh student list and statuses"
        >
          <RefreshCw
            size={16}
            className={refreshingStatuses ? "refresh-spinning" : ""}
          />
          {refreshingStatuses ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="document-review-section">
        {/* Left: Students List */}
        <div className="documents-table-container">
          <div className="table-wrapper">
            {loadingStudents ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
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
                      <td colSpan={3} className="empty-state">
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
            <div className="loading-container">
              <div className="loading-spinner"></div>
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

                {/* Application-level approve/reject/under review/comment buttons */}
                <div className="action-buttons-container">
                  <button
                    className={`action-button approve-button ${
                      appToggleStates.approve ? "active" : ""
                    }`}
                    onClick={() => handleAppToggle("approve")}
                    disabled={updatingApplication}
                  >
                    <CheckCircle size={12} />
                    {updatingApplication ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className={`action-button reject-button ${
                      appToggleStates.reject ? "active" : ""
                    }`}
                    onClick={() => handleAppToggle("reject")}
                    disabled={updatingApplication}
                  >
                    <XCircle size={12} />
                    {updatingApplication ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    className={`action-button under-review-button ${
                      appToggleStates.underReview ? "active" : ""
                    }`}
                    onClick={() => handleAppToggle("underReview")}
                    disabled={updatingApplication}
                  >
                    <Clock size={12} />
                    {updatingApplication ? "Updating..." : "Under Review"}
                  </button>
                  <button
                    className={`action-button comment-button ${
                      appToggleStates.comment ? "active" : ""
                    }`}
                    onClick={() => handleAppToggle("comment")}
                  >
                    <MessageSquare size={12} />
                    Comment
                  </button>
                </div>
              </div>

              <div className="action-buttons-container bulk-actions">
                <button
                  className={`action-button approve-button ${
                    toggleStates.approve ? "active" : ""
                  }`}
                  onClick={() => handleToggle("approve")}
                  disabled={updatingDocument || updatingApplication}
                >
                  <CheckCircle size={14} />
                  {updatingApplication ? "Approving..." : "Approve All"}
                </button>
                <button
                  className={`action-button reject-button ${
                    toggleStates.reject ? "active" : ""
                  }`}
                  onClick={() => handleToggle("reject")}
                  disabled={updatingDocument || updatingApplication}
                >
                  <XCircle size={14} />
                  {updatingApplication ? "Rejecting..." : "Reject All"}
                </button>
                <button
                  className={`action-button under-review-button ${
                    toggleStates.underReview ? "active" : ""
                  }`}
                  onClick={() => handleToggle("underReview")}
                  disabled={updatingDocument || updatingApplication}
                >
                  <Clock size={14} />
                  {updatingApplication ? "Updating..." : "Review All"}
                </button>
                <button
                  className={`action-button comment-button ${
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
                              onClick={() => {
                                setSelectedDocument(doc);
                              }}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              title="Delete Document"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDocument(doc);
                              }}
                              disabled={deletingDocument === doc.documentId}
                            >
                              {deletingDocument === doc.documentId ? (
                                <div className="delete-spinner"></div>
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="empty-state">
                          No documents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">Select a student to view details</div>
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
                    className="document-iframe"
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
                  <div className="action-buttons-container document-preview-buttons">
                    <button
                      className={`action-button approve-button ${
                        docToggleStates.approve ? "active" : ""
                      }`}
                      onClick={() => handleDocToggle("approve")}
                      disabled={updatingDocument}
                    >
                      <CheckCircle size={14} />
                      {updatingDocument ? "Updating..." : "Approve"}
                    </button>
                    <button
                      className={`action-button reject-button ${
                        docToggleStates.reject ? "active" : ""
                      }`}
                      onClick={() => handleDocToggle("reject")}
                      disabled={updatingDocument}
                    >
                      <XCircle size={14} />
                      {updatingDocument ? "Updating..." : "Reject"}
                    </button>
                    <button
                      className={`action-button under-review-button ${
                        docToggleStates.underReview ? "active" : ""
                      }`}
                      onClick={() => handleDocToggle("underReview")}
                      disabled={updatingDocument}
                    >
                      <Clock size={14} />
                      {updatingDocument ? "Updating..." : "Under Review"}
                    </button>
                    <button
                      className={`action-button comment-button ${
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
