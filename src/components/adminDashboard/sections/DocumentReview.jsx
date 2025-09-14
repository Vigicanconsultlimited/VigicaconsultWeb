import React, { useEffect, useState, useRef } from "react";
import profile from "../../../assets/images/default-profile.jpg";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  RefreshCw,
  Clock,
  ChevronDown,
  Settings,
  GraduationCap,
  BookOpen,
  Building,
  MapPin,
  ChevronUp,
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin as LocationIcon,
  CreditCard,
  UserCheck as StatusIcon,
  Download,
  RotateCw,
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
const statusHints = [
  { key: "pending", label: "Pending", color: "#ffd54f" },
  { key: "submitted", label: "Submitted", color: "#b3e5fc" },
  { key: "under review", label: "Under Review", color: "#64b5f6" },
  { key: "approved", label: "Approved", color: "#81c784" },
  { key: "rejected", label: "Rejected", color: "#ef5350" },
];

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
  Pending: 0,
  Uploaded: 1,
  UnderReview: 2,
  Rejected: 3,
  Approved: 4,
};

// Document status mapping for display
const documentStatusMap = {
  0: "pending",
  1: "uploaded",
  2: "under review",
  3: "rejected",
  4: "approved",
};

const statusColors = {
  submitted: "#b3e5fc",
  pending: "#ffd54f",
  "under review": "#64b5f6",
  rejected: "#ef5350",
  approved: "#81c784",
  uploaded: "#aed581",
};

// Mappings for API enum values
const languageOptions = [
  "English",
  "French",
  "Spanish",
  "Arabic",
  "Mandarin",
  "Hindi",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Portuguese",
  "Russian",
  "Bengali",
  "Japanese",
  "German",
  "Other",
];
const pronounOptions = ["He/Him", "She/Her", "They/Them", "Prefer not to say"];
const genderOptions = ["Male", "Female", "Prefer not to say", "Other"];
const getStatusColor = (status) => statusColors[status] || "#eeeeee";

const handleReloadDocument = () => {
  setDocReloadFlag((v) => v + 1);
  Toast.fire({ icon: "info", title: "Document reloaded!" });
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
  // Mapping functions
  const mapGender = (val) => {
    if (typeof val === "number" && genderOptions[val - 1])
      return genderOptions[val - 1];
    if (typeof val === "string") return val;
    return "Not provided";
  };
  const mapLanguage = (val) => {
    if (typeof val === "number" && languageOptions[val - 1])
      return languageOptions[val - 1];
    if (typeof val === "string") return val;
    return "Not specified";
  };
  const mapPronoun = (val) => {
    if (typeof val === "number" && pronounOptions[val - 1])
      return pronounOptions[val - 1];
    if (typeof val === "string") return val;
    return "Not specified";
  };

  // Document reload flag to force iframe reloads
  const [docReloadFlag, setDocReloadFlag] = useState(0);

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
      //console.log("Auth token found for DocumentReview");
    } else {
      //console.warn("No auth token found in DocumentReview");
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
  const [academicInfo, setAcademicInfo] = useState(null);
  const [loadingAcademicInfo, setLoadingAcademicInfo] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);
  const [personalDropdownOpen, setPersonalDropdownOpen] = useState(true);
  const [applicationDropdownOpen, setApplicationDropdownOpen] = useState(true);

  // --- PAGINATION & FILTER STATE ---
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Track previous values
  const prevSearchText = useRef(searchText);
  const prevFilterStatus = useRef(filterStatus);

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
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  // Ref for dropdown to handle outside clicks
  const dropdownRef = useRef(null);

  // Check token on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      //console.error(
      //  "DocumentReview component loaded without valid authentication token"
      //);
    }
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBulkActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch academic information for a student
  const fetchAcademicInfo = async (personalInformationId) => {
    setLoadingAcademicInfo(true);
    try {
      const res = await apiInstance.get(
        `Academic/StudentInformationId?PersonalInformationId=${personalInformationId}`
      );

      if (res?.data?.statusCode === 201 && res.data.result) {
        const result = res.data.result;
        setAcademicInfo({
          programDescription:
            result.program?.description || "No program information",
          courseOfInterest: result.courseOfInterest?.name || "Not specified",
          researchTopic: result.researchTopic || "",
          schoolName: result.schoolResponse?.name || "Not specified",
          programLevel: result.program?.programLevel || 0,
          duration: result.program?.durationInYears || 0,
          faculty: result.program?.faculty || "Not specified",
          schoolAddress: result.schoolResponse?.addresss || "",
          schoolTown: result.schoolResponse?.town || "",
          schoolCounty: result.schoolResponse?.county || "",
          schoolPostCode: result.schoolResponse?.postCode || "",
        });
      } else {
        setAcademicInfo(null);
      }
    } catch (error) {
      setAcademicInfo(null);
    } finally {
      setLoadingAcademicInfo(false);
    }
  };

  // Utility function to get program level text
  const getProgramLevelText = (level) => {
    switch (level) {
      case 1:
        return "Master's";
      case 2:
        return "Bachelor's";
      case 3:
        return "PhD";
      case 4:
        return "Certificate";
      default:
        return "Unknown";
    }
  };

  // Fetch all students function
  const fetchStudents = async (isRefresh = false) => {
    const loadingState = isRefresh ? setRefreshingStatuses : setLoadingStudents;
    loadingState(true);

    try {
      const res = await apiInstance.get("StudentPersonalInfo");

      if (res?.data?.statusCode === 200 && Array.isArray(res.data.result)) {
        const students = res.data.result.map((student) => ({
          id: student.id,
          name:
            `${student.firstName || ""} ${student.middleName || ""} ${
              student.lastName || ""
            }`.trim() ||
            student.email ||
            "Unnamed",
          avatar: profile,
          documents: [],
          email: student.email,
          phone: student.phone,
          gender: mapGender(student.gender),
          pronoun: mapPronoun(student.preferredPronoun),
          address: student.address,
          postCode: student.postCode,
          language: mapLanguage(student.firstLanguage),
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
              //console.error(
              //  `Error fetching application status for student ${student.id}: ${error.message}`
              //);
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
        //console.error("Invalid students API response:", res?.data);
        throw new Error("Invalid response from students API");
      }
    } catch (error) {
      //console.error(`Error fetching students: ${error.message}`);
      //console.error("Full error:", error);

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

  // --- FILTER & PAGINATE STUDENT LIST ---
  useEffect(() => {
    let filtered = studentList;
    if (searchText) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((s) => s.applicationStatus === filterStatus);
    }
    setFilteredStudentList(filtered);
    // Only reset pagination if search/filter changed
    if (
      prevSearchText.current !== searchText ||
      prevFilterStatus.current !== filterStatus
    ) {
      setCurrentPage(1);
    }
    prevSearchText.current = searchText;
    prevFilterStatus.current = filterStatus;
  }, [searchText, filterStatus, studentList]);

  // --- PAGE DATA ---
  const paginatedStudents = filteredStudentList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredStudentList.length / pageSize);

  useEffect(() => {
    fetchStudents(false);
  }, []);

  const handleRefreshStudents = () => {
    fetchStudents(true);
  };

  // Toggle dropdown functions
  const toggleAcademicDropdown = () => {
    setAcademicDropdownOpen(!academicDropdownOpen);
  };

  const togglePersonalDropdown = () => {
    setPersonalDropdownOpen(!personalDropdownOpen);
  };

  const toggleApplicationDropdown = () => {
    setApplicationDropdownOpen(!applicationDropdownOpen);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
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

  // FIXED: Document View Handler
  const handleViewDocument = (document, event) => {
    //console.log("View document clicked:", document);

    // Prevent event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Validate document object
    if (!document) {
      //console.error("No document provided to view");
      Toast.fire({
        icon: "error",
        title: "No document selected",
      });
      return;
    }

    // Validate document URL
    if (!document.url) {
      //console.error("Document has no URL:", document);
      Toast.fire({
        icon: "error",
        title: "Document URL not available",
      });
      return;
    }

    // Set the selected document for preview
    setSelectedDocument(document);

    //console.log("Document set for preview:", document.name);

    Toast.fire({
      icon: "success",
      title: `Viewing ${document.name}`,
    });
  };

  // FIXED: Legacy View Handler for backward compatibility
  const handleViewUser = (user) => {
    setSelectedStudent(user);
    setIsViewModalOpen && setIsViewModalOpen(true);
  };

  // Fetch selected student's application & docs and academic info
  useEffect(() => {
    async function fetchStudentApplication() {
      if (!selectedStudent) return;
      setLoadingDetails(true);

      // Reset dropdowns when switching students
      setAcademicDropdownOpen(false);
      setPersonalDropdownOpen(true);
      setApplicationDropdownOpen(true);

      // Fetch academic information
      await fetchAcademicInfo(selectedStudent.id);

      try {
        const res = await apiInstance.get(
          `StudentApplication/application?StudentPersonalInformationId=${selectedStudent.id}`
        );

        const result = res?.data?.result;

        if (result) {
          const applicationStatusCode = result.applicationStatus;
          const mappedApplicationStatus =
            statusMap[applicationStatusCode] || "pending";

          // Fetch documents in parallel
          // Fetch documents in parallel
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
                    if (!docData) return null;
                  } else {
                    docData = docRes.data.result;
                  }
                  if (docData && docData.id) {
                    const docStatus =
                      documentStatusMap[docData.status] || "pending";
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
                return null;
              }
            });
          // Research Proposal special fetch
          documentsPromises.push(
            (async () => {
              try {
                const rpRes = await apiInstance.get(
                  `ResearchProposal/${selectedStudent.id}`
                );
                if (
                  rpRes?.data?.statusCode === 200 &&
                  rpRes.data.result &&
                  rpRes.data.result.researchProposalDocumentdownloadurl
                ) {
                  const rp = rpRes.data.result;
                  return {
                    name: "Research Proposal",
                    url:
                      rp.researchProposalDocumentgoogledocviewurl ||
                      rp.researchProposalDocumentdownloadurl,
                    status: documentStatusMap[rp.status] || "pending",
                    apiEndpoint: "ResearchProposal",
                    documentId: rp.id,
                    studentPersonalInformationId: selectedStudent.id,
                    rawStatus: rp.status,
                    fullDocData: rp,
                    downloadUrl: rp.researchProposalDocumentdownloadurl,
                  };
                }
                return null;
              } catch (error) {
                return null;
              }
            })()
          );
          const documentsResults = await Promise.all(documentsPromises);
          const documents = documentsResults.filter((doc) => doc !== null);

          //console.log(
          //  `Loaded ${documents.length} documents for student ${selectedStudent.name}`
          //);

          const p = result.personalInformation || selectedStudent;
          setSelectedStudent((prev) =>
            prev
              ? {
                  ...prev,
                  name:
                    `${p.firstName || ""} ${p.middleName || ""} ${
                      p.lastName || ""
                    }`.trim() ||
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
          //console.warn("No application data found for student");
          setSelectedStudent((prev) =>
            prev
              ? { ...prev, documents: [], applicationStatus: "pending" }
              : prev
          );
        }
      } catch (error) {
        //console.error(`Error fetching application details: ${error.message}`);
        //console.error("Full error:", error);
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
      //console.error(`Error updating application status: ${error.message}`);
      //console.error("Full error:", error);

      if (error.response?.status === 401) {
        //console.error(
        //  "Authentication failed - token may be expired or invalid"
        //);
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
      //console.error("Invalid document information:", document);
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
      //console.error(
      //  `Failed to update document status for ${document.name}: ${error.message}`
      //);
      //console.error("Full error:", error);

      if (error.response?.status === 401) {
        //console.error(
        //  "Authentication failed - token may be expired or invalid"
        //);
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
      //console.error("Invalid document information for deletion:", document);
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
      //console.error(
      //  `Failed to delete document ${document.name}: ${error.message}`
      //);
      //console.error("Full error:", error);

      if (error.response?.status === 401) {
        //console.error(
        //  "Authentication failed - token may be expired or invalid"
        //);
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

  // Delete student function
  //Rest component5

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
          setAcademicInfo(null);
          setAcademicDropdownOpen(false);
          setPersonalDropdownOpen(true);
          setApplicationDropdownOpen(true);
        }

        Toast.fire({
          icon: "success",
          title: "Student deleted successfully",
        });
      }
    } catch (error) {
      //console.error(`Error deleting student: ${error.message}`);
      //console.error("Full error:", error);
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

    // Close dropdown after action
    setBulkActionsOpen(false);
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

  const handleDeleteDocument = (document, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    deleteDocument(document);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    //console.log("Dropdown clicked, current state:", bulkActionsOpen);
    setBulkActionsOpen(!bulkActionsOpen);
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

        {/* --- Status Legend --- */}
        <div className="status-hints-row">
          {statusHints.map((hint) => (
            <span
              key={hint.key}
              className="status-hint-badge"
              style={{
                backgroundColor: hint.color,
                color: "#212121",
                marginRight: "1rem",
                borderRadius: "8px",
                padding: "0.3em 0.8em",
                fontWeight: 500,
                display: "inline-block",
              }}
            >
              {hint.label}
            </span>
          ))}
        </div>

        {/* --- Search and Filter --- */}
        <div className="student-filter-row">
          <input
            type="text"
            className="student-search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search student name..."
            style={{ marginRight: "1em" }}
          />
          <select
            className="student-status-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="under review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
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
                    {/*<th>Status</th>*/}
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr
                      key={student.id}
                      className={
                        selectedStudent?.id === student.id ? "selected" : ""
                      }
                      onClick={() => {
                        setSelectedStudent(student);
                        setSelectedDocument(null);
                        setAcademicInfo(null);
                        setAcademicDropdownOpen(false);
                        setPersonalDropdownOpen(true);
                        setApplicationDropdownOpen(true);
                      }}
                    >
                      <td
                        className="student-name"
                        data-status={deriveStatus(student)}
                        style={{}}
                      >
                        <img
                          src={student.avatar}
                          className="student-avatar"
                          alt={student.name}
                        />
                        <span>{student.name}</span>
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
          {/* --- PAGINATION BUTTONS --- */}
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
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
              {/* Enhanced Profile Header */}
              <div className="enhanced-profile-header">
                <div className="profile-avatar-section">
                  <img
                    src={selectedStudent.avatar}
                    className="enhanced-profile-avatar"
                    alt={selectedStudent.name}
                  />
                  <div className="profile-status-indicator">
                    <div
                      className={`status-dot ${deriveStatus(selectedStudent)}`}
                    ></div>
                  </div>
                </div>
                <div className="profile-title-section">
                  <h2 className="profile-name">{selectedStudent.name}</h2>
                  <p className="profile-subtitle">Student Application Review</p>
                  <div className="profile-status">
                    <span
                      className={`enhanced-status-badge ${getStatusClass(
                        deriveStatus(selectedStudent)
                      )}`}
                    >
                      <StatusIcon size={12} />
                      {selectedStudent.applicationStatus
                        ? selectedStudent.applicationStatus
                            .charAt(0)
                            .toUpperCase() +
                          selectedStudent.applicationStatus.slice(1)
                        : deriveStatus(selectedStudent)
                            .charAt(0)
                            .toUpperCase() +
                          deriveStatus(selectedStudent).slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="enhanced-details-container">
                {/* Personal Information Dropdown Section */}
                <div className="enhanced-info-section personal-section">
                  <div
                    className="enhanced-dropdown-header"
                    onClick={togglePersonalDropdown}
                  >
                    <h4 className="enhanced-section-header clickable">
                      <User size={16} />
                      Personal Information
                      {personalDropdownOpen ? (
                        <ChevronUp size={16} className="dropdown-chevron" />
                      ) : (
                        <ChevronDown size={16} className="dropdown-chevron" />
                      )}
                    </h4>
                  </div>

                  <div
                    className={`enhanced-dropdown-content ${
                      personalDropdownOpen ? "open" : "closed"
                    }`}
                  >
                    <div className="enhanced-details-grid">
                      <div className="detail-item">
                        <div className="detail-icon">
                          <Mail size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Email Address</span>
                          <span className="detail-value">
                            {selectedStudent.email || "Not provided"}
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
                            {selectedStudent.phone || "Not provided"}
                          </span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <div className="detail-icon">
                          <User size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Gender</span>
                          <span className="detail-value">
                            {selectedStudent.gender || "Not provided"}
                          </span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <User size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">
                            Preferred Pronoun
                          </span>
                          <span className="detail-value">
                            {selectedStudent.pronoun || "Not specified"}
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
                            {selectedStudent.address || "Not provided"}
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
                            {selectedStudent.postCode || "Not provided"}
                          </span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <div className="detail-icon">
                          <Globe size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">
                            Preferred Language
                          </span>
                          <span className="detail-value">
                            {selectedStudent.language || "Not specified"}
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
                            {formatDate(selectedStudent.dateOfBirth)}
                          </span>
                        </div>
                      </div>

                      {/*<div className="detail-item">
                        <div className="detail-icon">
                          <Calendar size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Date Joined</span>
                          <span className="detail-value">
                            {formatDate(selectedStudent.joined)}
                          </span>
                        </div>
                      </div>
                      */}
                    </div>
                  </div>
                </div>

                {/* Academic Information Dropdown Section */}
                <div className="enhanced-info-section academic-section">
                  <div
                    className="enhanced-dropdown-header"
                    onClick={toggleAcademicDropdown}
                  >
                    <h4 className="enhanced-section-header clickable">
                      <GraduationCap size={16} />
                      Academic Information
                      {academicDropdownOpen ? (
                        <ChevronUp size={16} className="dropdown-chevron" />
                      ) : (
                        <ChevronDown size={16} className="dropdown-chevron" />
                      )}
                    </h4>
                  </div>

                  <div
                    className={`enhanced-dropdown-content ${
                      academicDropdownOpen ? "open" : "closed"
                    }`}
                  >
                    {loadingAcademicInfo ? (
                      <div className="enhanced-loading">
                        <div className="loading-spinner small"></div>
                        <span>Loading academic details...</span>
                      </div>
                    ) : academicInfo ? (
                      <div className="enhanced-details-grid">
                        <div className="detail-item full-width">
                          <div className="detail-icon">
                            <GraduationCap size={16} />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">
                              Program Description
                            </span>
                            <span
                              className="detail-value"
                              title={academicInfo.programDescription}
                            >
                              {academicInfo.programDescription}
                            </span>
                            {academicInfo.programLevel > 0 && (
                              <div className="program-meta-enhanced">
                                <span className="program-level-badge">
                                  {getProgramLevelText(
                                    academicInfo.programLevel
                                  )}
                                </span>
                                {academicInfo.duration > 0 && (
                                  <span className="program-duration-badge">
                                    {academicInfo.duration} year
                                    {academicInfo.duration > 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="detail-item">
                          <div className="detail-icon">
                            <BookOpen size={16} />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">
                              Course of Interest
                            </span>
                            <span className="detail-value">
                              {academicInfo.courseOfInterest}
                            </span>
                          </div>
                        </div>

                        {academicInfo.programLevel === 2 &&
                          academicInfo.researchTopic && (
                            <div className="detail-item full-width">
                              <div className="detail-icon">
                                <BookOpen size={16} />
                              </div>
                              <div className="detail-content">
                                <span className="detail-label">
                                  Research Topic
                                </span>
                                <span className="detail-value">
                                  {academicInfo.researchTopic}
                                </span>
                              </div>
                            </div>
                          )}

                        <div className="detail-item">
                          <div className="detail-icon">
                            <Building size={16} />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">
                              School/University
                            </span>
                            <span className="detail-value">
                              {academicInfo.schoolName}
                            </span>
                          </div>
                        </div>

                        {academicInfo.faculty !== "Not specified" && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <Building size={16} />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Faculty</span>
                              <span className="detail-value">
                                {academicInfo.faculty}
                              </span>
                            </div>
                          </div>
                        )}

                        {academicInfo.schoolAddress && (
                          <div className="detail-item full-width">
                            <div className="detail-icon">
                              <MapPin size={16} />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">
                                School Address
                              </span>
                              <div className="address-value">
                                <div>{academicInfo.schoolAddress}</div>
                                {academicInfo.schoolTown && (
                                  <div>
                                    {academicInfo.schoolTown}
                                    {academicInfo.schoolCounty &&
                                      `, ${academicInfo.schoolCounty}`}
                                  </div>
                                )}
                                {academicInfo.schoolPostCode && (
                                  <div>{academicInfo.schoolPostCode}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-academic-info-enhanced">
                        <div className="no-info-icon">
                          <GraduationCap size={24} />
                        </div>
                        <p>No academic information available</p>
                        <span>
                          Academic details will appear here once submitted
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Status Section */}
                <div className="enhanced-info-section application-section">
                  <div
                    className="enhanced-dropdown-header"
                    onClick={toggleApplicationDropdown}
                  >
                    <h4 className="enhanced-section-header clickable">
                      <StatusIcon size={16} />
                      Application Status & Actions
                      {applicationDropdownOpen ? (
                        <ChevronUp size={16} className="dropdown-chevron" />
                      ) : (
                        <ChevronDown size={16} className="dropdown-chevron" />
                      )}
                    </h4>
                  </div>

                  <div
                    className={`enhanced-dropdown-content ${
                      applicationDropdownOpen ? "open" : "closed"
                    }`}
                  >
                    <div className="application-status-display">
                      <div className="current-status">
                        <span className="status-label">Current Status:</span>
                        <span
                          className={`enhanced-status-badge large ${getStatusClass(
                            deriveStatus(selectedStudent)
                          )}`}
                        >
                          <StatusIcon size={14} />
                          {selectedStudent.applicationStatus
                            ? selectedStudent.applicationStatus
                                .charAt(0)
                                .toUpperCase() +
                              selectedStudent.applicationStatus.slice(1)
                            : deriveStatus(selectedStudent)
                                .charAt(0)
                                .toUpperCase() +
                              deriveStatus(selectedStudent).slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="enhanced-action-buttons">
                      <button
                        className={`enhanced-action-btn approve-btn ${
                          appToggleStates.approve ? "active" : ""
                        }`}
                        onClick={() => handleAppToggle("approve")}
                        disabled={updatingApplication}
                      >
                        <CheckCircle size={16} />
                        <span>
                          {updatingApplication
                            ? "Approving..."
                            : "Approve Application"}
                        </span>
                      </button>

                      <button
                        className={`enhanced-action-btn reject-btn ${
                          appToggleStates.reject ? "active" : ""
                        }`}
                        onClick={() => handleAppToggle("reject")}
                        disabled={updatingApplication}
                      >
                        <XCircle size={16} />
                        <span>
                          {updatingApplication
                            ? "Rejecting..."
                            : "Reject Application"}
                        </span>
                      </button>

                      <button
                        className={`enhanced-action-btn review-btn ${
                          appToggleStates.underReview ? "active" : ""
                        }`}
                        onClick={() => handleAppToggle("underReview")}
                        disabled={updatingApplication}
                      >
                        <Clock size={16} />
                        <span>
                          {updatingApplication
                            ? "Updating..."
                            : "Mark Under Review"}
                        </span>
                      </button>

                      <button
                        className={`enhanced-action-btn comment-btn ${
                          appToggleStates.comment ? "active" : ""
                        }`}
                        onClick={() => handleAppToggle("comment")}
                      >
                        <MessageSquare size={16} />
                        <span>Add Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Dropdown*/}
              <div className="bulk-actions-dropdown" ref={dropdownRef}>
                <button
                  className="dropdown-trigger enhanced"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBulkActionsOpen(!bulkActionsOpen);
                  }}
                  disabled={updatingDocument || updatingApplication}
                  type="button"
                >
                  <Settings size={16} />
                  <span>Bulk Actions</span>
                  <ChevronDown
                    size={16}
                    className={`chevron-icon ${
                      bulkActionsOpen ? "rotated" : ""
                    }`}
                  />
                </button>

                <div
                  className="dropdown-menu enhanced"
                  style={{
                    display: bulkActionsOpen ? "block" : "none",
                    opacity: bulkActionsOpen ? 1 : 0,
                    visibility: bulkActionsOpen ? "visible" : "hidden",
                  }}
                >
                  <button
                    className="dropdown-item approve-item"
                    onClick={() => handleToggle("approve")}
                    disabled={updatingDocument || updatingApplication}
                    type="button"
                  >
                    <CheckCircle size={16} />
                    <span>
                      {updatingApplication ? "Approving..." : "Approve All"}
                    </span>
                  </button>
                  <button
                    className="dropdown-item reject-item"
                    onClick={() => handleToggle("reject")}
                    disabled={updatingDocument || updatingApplication}
                    type="button"
                  >
                    <XCircle size={16} />
                    <span>
                      {updatingApplication ? "Rejecting..." : "Reject All"}
                    </span>
                  </button>
                  <button
                    className="dropdown-item under-review-item"
                    onClick={() => handleToggle("underReview")}
                    disabled={updatingDocument || updatingApplication}
                    type="button"
                  >
                    <Clock size={16} />
                    <span>
                      {updatingApplication ? "Updating..." : "Review All"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="uploaded-documents-card enhanced">
                <div className="uploaded-documents-header">
                  <div className="documents-title">
                    <h4>Uploaded Documents</h4>
                    <span className="document-count">
                      {selectedStudent.documents
                        ? selectedStudent.documents.length
                        : 0}{" "}
                      documents
                    </span>
                  </div>
                </div>
                <div className="documents-table-wrapper">
                  <table className="uploaded-documents-table enhanced">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.documents &&
                      selectedStudent.documents.length > 0 ? (
                        selectedStudent.documents.map((doc, idx) => (
                          <tr key={`${doc.documentId}-${idx}`}>
                            <td>
                              <div className="document-name">
                                <div className="doc-icon">
                                  <Eye size={14} />
                                </div>
                                <span>{doc.name}</span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`enhanced-status-badge small ${getStatusClass(
                                  doc.status
                                )}`}
                              >
                                {getStatusClass(doc.status).includes(
                                  "approved"
                                ) && <CheckCircle size={12} />}
                                {getStatusClass(doc.status).includes(
                                  "rejected"
                                ) && <XCircle size={12} />}
                                {getStatusClass(doc.status).includes(
                                  "under-review"
                                ) && <Clock size={12} />}
                                {getStatusClass(doc.status).includes(
                                  "pending"
                                ) && <Clock size={12} />}
                                {getStatusClass(doc.status).includes(
                                  "uploaded"
                                ) && <CheckCircle size={12} />}
                                {doc.status.charAt(0).toUpperCase() +
                                  doc.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <div className="document-actions">
                                <button
                                  className="enhanced-doc-action-btn view-btn"
                                  title="View Document"
                                  onClick={(e) => handleViewDocument(doc, e)}
                                  type="button"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  className="enhanced-doc-action-btn delete-btn"
                                  title="Delete Document"
                                  onClick={(e) => handleDeleteDocument(doc, e)}
                                  disabled={deletingDocument === doc.documentId}
                                  type="button"
                                >
                                  {deletingDocument === doc.documentId ? (
                                    <div className="delete-spinner small"></div>
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="empty-state enhanced">
                            <div className="empty-documents">
                              <Eye size={24} />
                              <span>No documents uploaded yet</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state enhanced">
              <div className="empty-selection">
                <User size={48} />
                <h3>Select a Student</h3>
                <p>
                  Choose a student from the list to view their details and
                  documents
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Document Preview */}
        <div className="document-preview-panel">
          {selectedDocument ? (
            <>
              <div className="document-preview-header enhanced">
                <h4 className="document-preview-title">Document Preview</h4>
                <span
                  className={`document-status-indicator ${getStatusClass(
                    selectedDocument.status
                  )}`}
                >
                  {selectedDocument.status.charAt(0).toUpperCase() +
                    selectedDocument.status.slice(1)}
                </span>
              </div>
              <div className="document-preview-content">
                <div className="pdf-preview-image">
                  <iframe
                    key={docReloadFlag}
                    title="Document Preview"
                    src={selectedDocument.url}
                    className="document-iframe"
                  />
                </div>
                <div className="document-preview-info enhanced">
                  <div className="doc-meta enhanced">
                    <div className="meta-item">
                      <span className="meta-label">File name:</span>
                      <span className="meta-value">
                        {selectedDocument.name}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Status:</span>
                      <span
                        className={`enhanced-status-badge small ${getStatusClass(
                          selectedDocument.status
                        )}`}
                      >
                        {selectedDocument.status.charAt(0).toUpperCase() +
                          selectedDocument.status.slice(1)}
                      </span>
                    </div>
                    {/*
                    <div className="download-section">
                      <a
                        href={
                          selectedDocument.name === "Research Proposal"
                            ? selectedDocument.downloadUrl ||
                              selectedDocument.url
                            : selectedDocument.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="download-btn enhanced"
                      >
                        <Download size={16} />
                        Download File
                      </a>
                    </div>
                    */}
                  </div>

                  {/* --- Download and Reload buttons centered --- */}
                  <div className="download-reload-row">
                    <a
                      href={
                        selectedDocument.name === "Research Proposal"
                          ? selectedDocument.downloadUrl || selectedDocument.url
                          : selectedDocument.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="download-btn enhanced"
                    >
                      <Download size={18} />
                      Download File
                    </a>
                    <button
                      className="reload-btn enhanced"
                      onClick={handleReloadDocument}
                    >
                      <RotateCw size={18} />
                      Reload
                    </button>
                  </div>

                  {/* Enhanced Document Review Actions */}
                  <div className="enhanced-document-actions">
                    <h5>Document Review Actions</h5>
                    <div className="document-action-buttons">
                      <button
                        className={`enhanced-doc-review-btn approve-btn ${
                          docToggleStates.approve ? "active" : ""
                        }`}
                        onClick={() => handleDocToggle("approve")}
                        disabled={updatingDocument}
                      >
                        <CheckCircle size={16} />
                        <span>
                          {updatingDocument ? "Updating..." : "Approve"}
                        </span>
                      </button>

                      <button
                        className={`enhanced-doc-review-btn reject-btn ${
                          docToggleStates.reject ? "active" : ""
                        }`}
                        onClick={() => handleDocToggle("reject")}
                        disabled={updatingDocument}
                      >
                        <XCircle size={16} />
                        <span>
                          {updatingDocument ? "Updating..." : "Reject"}
                        </span>
                      </button>

                      <button
                        className={`enhanced-doc-review-btn review-btn ${
                          docToggleStates.underReview ? "active" : ""
                        }`}
                        onClick={() => handleDocToggle("underReview")}
                        disabled={updatingDocument}
                      >
                        <Clock size={16} />
                        <span>
                          {updatingDocument ? "Updating..." : "Under Review"}
                        </span>
                      </button>

                      <button
                        className={`enhanced-doc-review-btn comment-btn ${
                          docToggleStates.comment ? "active" : ""
                        }`}
                        onClick={() => handleDocToggle("comment")}
                      >
                        <MessageSquare size={16} />
                        <span>Add Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="document-preview-header enhanced">
              <div className="no-document-selected">
                <Eye size={48} />
                <h4>No Document Selected</h4>
                <p>Select a document from the list to preview it here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
