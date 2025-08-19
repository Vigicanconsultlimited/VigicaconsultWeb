import React, { useState, useEffect } from "react";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import apiInstance from "../../../utils/axios";
import Swal from "sweetalert2";

import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  GraduationCap,
  Building,
  BookOpen,
  Clock,
  MapPin,
  Globe,
  Users,
  FileText,
  Calendar,
  Award,
  Briefcase,
  RefreshCw,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  School,
} from "lucide-react";
import "../styles/CreationCenter.css";

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

export default function CreationCenter() {
  // State management
  const [activeTab, setActiveTab] = useState("programs");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [programModal, setProgramModal] = useState({
    open: false,
    mode: "create",
    data: null,
  });
  const [courseModal, setCourseModal] = useState({
    open: false,
    mode: "create",
    data: null,
  });
  const [schoolModal, setSchoolModal] = useState({
    open: false,
    mode: "create",
    data: null,
  });

  // Data states
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schools, setSchools] = useState([]);

  // Form states
  const [programForm, setProgramForm] = useState({
    description: "",
    programLevel: 0,
    durationInYears: 1,
    faculty: "",
    schoolId: null,
  });

  const [courseForm, setCourseForm] = useState({
    name: "",
    academicProgramId: null,
  });

  const [schoolForm, setSchoolForm] = useState({
    name: "",
    addresss: "", // Note: API uses 'addresss' not 'address'
    town: "",
    county: "",
    postCode: "",
  });

  // Get JWT token
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

  // Program level options based on API data
  const programLevels = [
    { value: 0, label: "Bachelor's Degree" },
    { value: 1, label: "Master's Degree" },
    { value: 2, label: "PhD/Doctorate" },
    { value: 3, label: "Certificate" },
    { value: 4, label: "Diploma" },
  ];

  // API endpoints configuration
  const apiEndpoints = {
    programs: "AcademicProgram",
    courses: "CourseOfInterest",
    schools: "School",
  };

  // Fetch data from APIs
  const fetchData = async (type) => {
    setLoading(true);
    try {
      //console.log(`CreationCenter: Fetching ${type}`);

      const endpoint = apiEndpoints[type];
      if (!endpoint) {
        throw new Error(`No API endpoint configured for ${type}`);
      }

      const response = await apiInstance.get(endpoint);

      if (
        response?.data?.statusCode === 200 &&
        Array.isArray(response.data.result)
      ) {
        const data = response.data.result;

        switch (type) {
          case "programs":
            // Transform API data to match component structure
            const transformedPrograms = data.map((program) => ({
              ...program,
              isActive: true, // Default to active since API doesn't provide this field
              createdAt:
                program.createdAt !== "0001-01-01T00:00:00"
                  ? new Date(program.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString(),
            }));
            setPrograms(transformedPrograms);
            break;

          case "courses":
            const transformedCourses = data.map((course) => ({
              ...course,
              isActive: true,
              createdAt:
                course.createdAt !== "0001-01-01T00:00:00"
                  ? new Date(course.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString(),
            }));
            setCourses(transformedCourses);

            break;

          case "schools":
            const transformedSchools = data.map((school) => ({
              ...school,
              isActive: true,
              type: "University", // Default type since API doesn't provide this
              country: "Nigeria", // Default country, could be made dynamic
              createdAt:
                school.createdAt !== "0001-01-01T00:00:00"
                  ? new Date(school.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString(),
            }));
            setSchools(transformedSchools);
            break;
        }
      } else {
        throw new Error(`Invalid response format from ${type} API`);
      }
    } catch (error) {
      console.error(`CreationCenter Error fetching ${type}:`, error);

      // Set empty array on error
      switch (type) {
        case "programs":
          setPrograms([]);
          break;
        case "courses":
          setCourses([]);
          break;
        case "schools":
          setSchools([]);
          break;
      }

      Toast.fire({
        icon: "error",
        title: `Failed to load ${type}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    //console.log(`CreationCenter: Refreshing ${activeTab}`);
    await fetchData(activeTab);
    setRefreshing(false);
    Toast.fire({
      icon: "success",
      title: "Data refreshed successfully",
    });
  };

  // Form handlers with toast notifications
  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //console.log(`CreationCenter: Program ${programModal.mode} initiated`);

      // Show toast for unimplemented functionality
      Toast.fire({
        icon: "info",
        title: `Program ${
          programModal.mode === "create" ? "creation" : "update"
        } will be implemented later`,
      });

      setProgramModal({ open: false, mode: "create", data: null });
      resetProgramForm();
    } catch (error) {
      console.error(`CreationCenter Program Error:`, error);
      Toast.fire({
        icon: "error",
        title: "Failed to save program",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //console.log(`CreationCenter: Course ${courseModal.mode} initiated`);

      Toast.fire({
        icon: "info",
        title: `Course ${
          courseModal.mode === "create" ? "creation" : "update"
        } will be implemented later`,
      });

      setCourseModal({ open: false, mode: "create", data: null });
      resetCourseForm();
    } catch (error) {
      console.error(`CreationCenter Course Error:`, error);
      Toast.fire({
        icon: "error",
        title: "Failed to save course",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //console.log(`CreationCenter: School ${schoolModal.mode} initiated`);

      Toast.fire({
        icon: "info",
        title: `School ${
          schoolModal.mode === "create" ? "creation" : "update"
        } will be implemented later`,
      });

      setSchoolModal({ open: false, mode: "create", data: null });
      resetSchoolForm();
    } catch (error) {
      console.error(`CreationCenter School Error:`, error);
      Toast.fire({
        icon: "error",
        title: "Failed to save school",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form functions
  const resetProgramForm = () => {
    setProgramForm({
      description: "",
      programLevel: 0,
      durationInYears: 1,
      faculty: "",
      schoolId: null,
    });
  };

  const resetCourseForm = () => {
    setCourseForm({
      name: "",
      academicProgramId: null,
    });
  };

  const resetSchoolForm = () => {
    setSchoolForm({
      name: "",
      addresss: "",
      town: "",
      county: "",
      postCode: "",
    });
  };

  // Edit handlers
  const handleEdit = (item, type) => {
    //console.log(`CreationCenter: Edit ${type} initiated`);

    switch (type) {
      case "program":
        setProgramForm({
          description: item.description || "",
          programLevel: item.programLevel || 0,
          durationInYears: item.durationInYears || 1,
          faculty: item.faculty || "",
          schoolId: item.schoolId || null,
        });
        setProgramModal({ open: true, mode: "edit", data: item });
        break;
      case "course":
        setCourseForm({
          name: item.name || "",
          academicProgramId: item.academicProgramId || null,
        });
        setCourseModal({ open: true, mode: "edit", data: item });
        break;
      case "school":
        setSchoolForm({
          name: item.name || "",
          addresss: item.addresss || "",
          town: item.town || "",
          county: item.county || "",
          postCode: item.postCode || "",
        });
        setSchoolModal({ open: true, mode: "edit", data: item });
        break;
    }
  };

  // Delete handlers
  const handleDelete = async (id, type) => {
    try {
      const result = await Swal.fire({
        title: "Delete Item",
        text: "Are you sure you want to delete this item? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        //console.log(`CreationCenter: Delete ${type} (ID: ${id})`);

        // Show toast for unimplemented functionality
        Toast.fire({
          icon: "info",
          title: "Delete functionality will be implemented later",
        });
      }
    } catch (error) {
      console.error(`CreationCenter Delete Error:`, error);
      Toast.fire({
        icon: "error",
        title: "Failed to delete item",
      });
    }
  };

  // Filter data based on search and status
  const getFilteredData = (data) => {
    return data.filter((item) => {
      const matchesSearch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && item.isActive !== false) ||
        (filterStatus === "inactive" && item.isActive === false);

      return matchesSearch && matchesStatus;
    });
  };

  const getProgramLevelText = (level) => {
    const levelObj = programLevels.find((l) => l.value === level);
    return levelObj ? levelObj.label : "Unknown";
  };

  const getStatusBadge = (isActive) => (
    <span
      className={`status-badge ${isActive !== false ? "active" : "inactive"}`}
    >
      {isActive !== false ? "Active" : "Inactive"}
    </span>
  );

  return (
    <div className="creation-center">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Creation Center</h1>
          </div>
          <div className="header-actions">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="btn btn-outline"
              title="Refresh data"
            >
              <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
              <span className="btn-text">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === "programs" ? "active" : ""}`}
          onClick={() => setActiveTab("programs")}
        >
          <GraduationCap size={18} />
          <span>Programs</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <BookOpen size={18} />
          <span>Courses</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "schools" ? "active" : ""}`}
          onClick={() => setActiveTab("schools")}
        >
          <Building size={18} />
          <span>Schools</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={() => {
              //console.log(
              //  `CreationCenter: Create new ${activeTab.slice(0, -1)} initiated`
              //);
              switch (activeTab) {
                case "programs":
                  resetProgramForm();
                  setProgramModal({ open: true, mode: "create", data: null });
                  break;
                case "courses":
                  resetCourseForm();
                  setCourseModal({ open: true, mode: "create", data: null });
                  break;
                case "schools":
                  resetSchoolForm();
                  setSchoolModal({ open: true, mode: "create", data: null });
                  break;
              }
            }}
          >
            <Plus size={16} />
            <span className="btn-text">Add {activeTab.slice(0, -1)}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {loading ? (
          <div className="loading-state">
            <LoadingSpinner size="lg" />
            <p>Loading {activeTab}...</p>
          </div>
        ) : (
          <>
            {/* Programs Table */}
            {activeTab === "programs" && (
              <div className="table-container">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Program Description</th>
                        <th className="mobile-hide">Level</th>
                        <th className="mobile-hide">Duration</th>
                        <th className="mobile-hide">Faculty</th>
                        <th className="mobile-hide">School ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData(programs).map((program) => (
                        <tr key={program.id}>
                          <td className="description-cell">
                            <div className="cell-content">
                              <div className="main-text">
                                {program.description}
                              </div>
                              <div className="mobile-details">
                                <span className="detail-badge">
                                  {getProgramLevelText(program.programLevel)}
                                </span>
                                <span className="detail-text">
                                  {program.durationInYears} year
                                  {program.durationInYears > 1 ? "s" : ""}
                                </span>
                                <span className="detail-text">
                                  {program.faculty}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="mobile-hide">
                            {getProgramLevelText(program.programLevel)}
                          </td>
                          <td className="mobile-hide">
                            {program.durationInYears} year
                            {program.durationInYears > 1 ? "s" : ""}
                          </td>
                          <td className="mobile-hide">{program.faculty}</td>
                          <td className="mobile-hide">
                            {program.schoolId || "Not assigned"}
                          </td>
                          <td>{getStatusBadge(program.isActive)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn edit-btn"
                                onClick={() => handleEdit(program, "program")}
                                title="Edit Program"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() =>
                                  handleDelete(program.id, "program")
                                }
                                title="Delete Program"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {getFilteredData(programs).length === 0 && (
                  <div className="empty-state">
                    <GraduationCap size={48} />
                    <h3>No Programs Found</h3>
                    <p>No programs match your search criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Courses Table */}
            {activeTab === "courses" && (
              <div className="table-container">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Course Name</th>
                        <th className="mobile-hide">Academic Program ID</th>
                        <th className="mobile-hide">Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData(courses).map((course) => (
                        <tr key={course.id}>
                          <td className="description-cell">
                            <div className="cell-content">
                              <div className="main-text">{course.name}</div>
                              <div className="mobile-details">
                                <span className="detail-text">
                                  {course.academicProgramId || "Not assigned"}
                                </span>
                                <span className="detail-text">
                                  {course.createdAt}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="mobile-hide">
                            {course.academicProgramId || "Not assigned"}
                          </td>
                          <td className="mobile-hide">{course.createdAt}</td>
                          <td>{getStatusBadge(course.isActive)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn edit-btn"
                                onClick={() => handleEdit(course, "course")}
                                title="Edit Course"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() =>
                                  handleDelete(course.id, "course")
                                }
                                title="Delete Course"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {getFilteredData(courses).length === 0 && (
                  <div className="empty-state">
                    <BookOpen size={48} />
                    <h3>No Courses Found</h3>
                    <p>No courses match your search criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Schools Table */}
            {activeTab === "schools" && (
              <div className="table-container">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>School Name</th>
                        <th className="mobile-hide">Town</th>
                        <th className="mobile-hide">County</th>
                        <th className="mobile-hide">Post Code</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData(schools).map((school) => (
                        <tr key={school.id}>
                          <td className="description-cell">
                            <div className="cell-content">
                              <div className="main-text">{school.name}</div>
                              <div className="mobile-details">
                                <span className="detail-text">
                                  {school.town}
                                </span>
                                <span className="detail-text">
                                  {school.county}
                                </span>
                                <span className="detail-text">
                                  {school.postCode}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="mobile-hide">{school.town}</td>
                          <td className="mobile-hide">{school.county}</td>
                          <td className="mobile-hide">{school.postCode}</td>
                          <td>{getStatusBadge(school.isActive)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn edit-btn"
                                onClick={() => handleEdit(school, "school")}
                                title="Edit School"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() =>
                                  handleDelete(school.id, "school")
                                }
                                title="Delete School"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {getFilteredData(schools).length === 0 && (
                  <div className="empty-state">
                    <Building size={48} />
                    <h3>No Schools Found</h3>
                    <p>No schools match your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Program Modal */}
      <Modal
        isOpen={programModal.open}
        onClose={() =>
          setProgramModal({ open: false, mode: "create", data: null })
        }
        title={`${
          programModal.mode === "create" ? "Create New" : "Edit"
        } Program`}
        size="lg"
      >
        <form onSubmit={handleProgramSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Program Description *</label>
              <textarea
                value={programForm.description}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter program description..."
                required
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>Program Level *</label>
              <select
                value={programForm.programLevel}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    programLevel: parseInt(e.target.value),
                  })
                }
                required
                className="form-select"
              >
                {programLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Duration (Years) *</label>
              <input
                type="number"
                min="1"
                max="10"
                value={programForm.durationInYears}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    durationInYears: parseInt(e.target.value),
                  })
                }
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Faculty *</label>
              <input
                type="text"
                value={programForm.faculty}
                onChange={(e) =>
                  setProgramForm({ ...programForm, faculty: e.target.value })
                }
                placeholder="Enter faculty name..."
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>School</label>
              <select
                value={programForm.schoolId || ""}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    schoolId: e.target.value || null,
                  })
                }
                className="form-select"
              >
                <option value="">Select School (Optional)</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() =>
                setProgramModal({ open: false, mode: "create", data: null })
              }
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>
                    {programModal.mode === "create"
                      ? "Creating..."
                      : "Updating..."}
                  </span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>
                    {programModal.mode === "create"
                      ? "Create Program"
                      : "Update Program"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Course Modal */}
      <Modal
        isOpen={courseModal.open}
        onClose={() =>
          setCourseModal({ open: false, mode: "create", data: null })
        }
        title={`${
          courseModal.mode === "create" ? "Create New" : "Edit"
        } Course`}
        size="lg"
      >
        <form onSubmit={handleCourseSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Course Name *</label>
              <input
                type="text"
                value={courseForm.name}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, name: e.target.value })
                }
                placeholder="Enter course name..."
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Academic Program</label>
              <select
                value={courseForm.academicProgramId || ""}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    academicProgramId: e.target.value || null,
                  })
                }
                className="form-select"
              >
                <option value="">Select Program (Optional)</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() =>
                setCourseModal({ open: false, mode: "create", data: null })
              }
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>
                    {courseModal.mode === "create"
                      ? "Creating..."
                      : "Updating..."}
                  </span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>
                    {courseModal.mode === "create"
                      ? "Create Course"
                      : "Update Course"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* School Modal */}
      <Modal
        isOpen={schoolModal.open}
        onClose={() =>
          setSchoolModal({ open: false, mode: "create", data: null })
        }
        title={`${
          schoolModal.mode === "create" ? "Create New" : "Edit"
        } School`}
        size="lg"
      >
        <form onSubmit={handleSchoolSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>School Name *</label>
              <input
                type="text"
                value={schoolForm.name}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, name: e.target.value })
                }
                placeholder="Enter school name..."
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={schoolForm.addresss}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, addresss: e.target.value })
                }
                placeholder="Enter address..."
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Town/City *</label>
              <input
                type="text"
                value={schoolForm.town}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, town: e.target.value })
                }
                placeholder="Enter town/city..."
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>County/State *</label>
              <input
                type="text"
                value={schoolForm.county}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, county: e.target.value })
                }
                placeholder="Enter county/state..."
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Post Code</label>
              <input
                type="text"
                value={schoolForm.postCode}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, postCode: e.target.value })
                }
                placeholder="Enter post code..."
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() =>
                setSchoolModal({ open: false, mode: "create", data: null })
              }
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>
                    {schoolModal.mode === "create"
                      ? "Creating..."
                      : "Updating..."}
                  </span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>
                    {schoolModal.mode === "create"
                      ? "Create School"
                      : "Update School"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
