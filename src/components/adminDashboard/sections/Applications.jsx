import React, { useState, useEffect, useCallback } from "react";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import profile from "../../../assets/images/default-profile.jpg";
import apiInstance from "../../../utils/axios";
import "../styles/Applications.css";
import {
  Search,
  Download,
  RefreshCw,
  Eye,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
} from "lucide-react";

const statusMap = {
  1: "Submitted",
  2: "Pending",
  3: "Under Review",
  4: "Rejected",
  5: "Approved",
};

const statusBadgeClass = {
  1: "badge-success",
  2: "badge-warning",
  3: "badge-blue",
  4: "badge-danger",
  5: "badge-success",
};

const programLevelMap = {
  1: "Master's",
  2: "PhD",
  3: "Bachelor's",
  4: "Certificate",
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [programLevelFilter, setProgramLevelFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch paginated applications for display
  const fetchApplications = useCallback(
    async (page = 1, isRefresh = false) => {
      const loadingState = isRefresh ? setRefreshing : setLoadingApps;
      loadingState(true);
      setError(null);

      try {
        const res = await apiInstance.get(
          `StudentApplication/allapplicationspagenation?pageNumber=${page}&pageSize=${pageSize}`
        );
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setApplications(res.data.data);
          setTotalCount(res.data.totalCount || 0);
          setTotalPages(res.data.totalPages || 1);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        setError("Failed to load applications. Please try again.");
        setApplications([]);
      } finally {
        loadingState(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage, fetchApplications]);

  // Get unique schools and program levels for filters
  const schools = Array.from(
    new Set(
      applications.map(
        (app) =>
          app.academic?.schoolResponse?.name &&
          app.academic.schoolResponse.name.trim()
      )
    )
  ).filter(Boolean);

  const programLevels = Array.from(
    new Set(applications.map((app) => app.academic?.program?.programLevel))
  ).filter(Boolean);

  const filteredApplications = applications.filter((app) => {
    const { personalInformation, academic } = app;
    const fullName = [
      personalInformation.firstName,
      personalInformation.middleName,
      personalInformation.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
    const matchesSearch = fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || `${app.applicationStatus}` === statusFilter;
    const matchesSchool =
      schoolFilter === "all" ||
      (academic?.schoolResponse?.name &&
        academic.schoolResponse.name.trim() === schoolFilter);
    const matchesProgramLevel =
      programLevelFilter === "all" ||
      `${academic?.program?.programLevel}` === programLevelFilter;

    return (
      matchesSearch && matchesStatus && matchesSchool && matchesProgramLevel
    );
  });

  // Helper function to generate CSV row
  const generateCSVRow = (app) => {
    const pi = app.personalInformation || {};
    const ac = app.academic || {};
    const fullName = [pi.firstName, pi.middleName, pi.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    // Extract research proposal URL (convert from Google Docs view URL to download URL)
    let proposalDownloadUrl = "";
    if (app.researchProposalurl) {
      // Convert Google Docs view URL to direct download URL
      const match = app.researchProposalurl.match(/url=([^&]+)/);
      if (match) {
        proposalDownloadUrl = decodeURIComponent(match[1]);
      }
    }

    return [
      `"${fullName}"`,
      `"${pi.email || ""}"`,
      `"${pi.phone || ""}"`,
      `"${ac.schoolResponse?.name || ""}"`,
      `"${ac.schoolResponse?.addresss || ""}"`,
      `"${ac.program?.description || ""}"`,
      `"${statusMap[app.applicationStatus] || ""}"`,
      `"${ac.courseOfInterest?.name || ""}"`,
      `"${pi.dob || ""}"`,
      `"${ac.researchTopic || ""}"`,
      `"${proposalDownloadUrl}"`,
    ].join(",");
  };

  // Export current filtered page
  const handleExport = () => {
    const csvHeader = [
      "Full Name",
      "Email",
      "Phone",
      "School",
      "School Address",
      "Program",
      "Status",
      "Course of Interest",
      "Date of Birth",
      "Research Topic",
      "PhD Proposal Download Link",
    ].join(",");

    const csvContent =
      csvHeader + "\n" + filteredApplications.map(generateCSVRow).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  // Fetch all applications using totalPages
  const fetchAllApplications = async () => {
    try {
      // First, get the first page to determine total pages
      const firstPageRes = await apiInstance.get(
        `StudentApplication/allapplicationspagenation?pageNumber=1&pageSize=${pageSize}`
      );

      if (!firstPageRes?.data?.data) {
        throw new Error("Invalid response format");
      }

      const totalPages = firstPageRes.data.totalPages || 1;
      let allApplications = [...firstPageRes.data.data];

      // If there are more pages, fetch them
      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            apiInstance.get(
              `StudentApplication/allapplicationspagenation?pageNumber=${page}&pageSize=${pageSize}`
            )
          );
        }

        const remainingPages = await Promise.all(pagePromises);
        remainingPages.forEach((res) => {
          if (res?.data?.data && Array.isArray(res.data.data)) {
            allApplications = [...allApplications, ...res.data.data];
          }
        });
      }

      return allApplications;
    } catch (error) {
      console.error("Error fetching all applications:", error);
      throw error;
    }
  };

  // Export ALL applications using totalPages
  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      const allApplications = await fetchAllApplications();

      const csvHeader = [
        "Full Name",
        "Email",
        "Phone",
        "School",
        "School Address",
        "Program",
        "Status",
        "Course of Interest",
        "Date of Birth",
        "Research Topic",
        "PhD Proposal Download Link",
      ].join(",");

      const csvContent =
        csvHeader + "\n" + allApplications.map(generateCSVRow).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications-export-all-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
    } catch (error) {
      alert("Failed to fetch all applications for export.");
    } finally {
      setExportingAll(false);
    }
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setIsViewModalOpen(true);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSchoolFilter("all");
    setProgramLevelFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="applications">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Student Applications</h1>
          <div className="header-actions">
            <button
              onClick={() => fetchApplications(1, true)}
              disabled={refreshing}
              className="btn btn-sm btn-outline"
            >
              <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={handleExport} className="btn btn-sm btn-outline">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={handleExportAll}
              disabled={exportingAll}
              className="btn btn-sm btn-outline"
            >
              <Download size={16} />
              {exportingAll ? "Exporting..." : "Export All"}
            </button>
          </div>
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="error-alert">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-row">
          <div className="search-box">
            <Search
              size={18}
              className="search-icon"
              style={{ opacity: 0.6 }}
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="search-clear"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="status-select">Status:</label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">ALL STATUS</option>
              {Object.entries(statusMap).map(([code, label]) => (
                <option key={code} value={code}>
                  {label.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="school-select">School:</label>
            <select
              id="school-select"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">ALL SCHOOLS</option>
              {schools.map((school) => (
                <option key={school} value={school}>
                  {school.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="program-level-select">Program Level:</label>
            <select
              id="program-level-select"
              value={programLevelFilter}
              onChange={(e) => setProgramLevelFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">ALL LEVELS</option>
              {programLevels.map((level) => (
                <option key={level} value={level}>
                  {programLevelMap[level]?.toUpperCase() || level}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-actions">
            <button onClick={clearFilters} className="btn btn-sm btn-outline">
              <X size={16} style={{ marginRight: "0.6em" }} />
              Clear
            </button>
          </div>
        </div>
      </div>
      {/* Applications Table */}
      <div className="table-container">
        {loadingApps ? (
          <div className="loading-state">
            <LoadingSpinner size="lg" />
            <p>Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No applications found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th style={{ width: "18%" }}>Full Name</th>
                    <th style={{ width: "16%" }}>School</th>
                    <th style={{ width: "14%" }}>Program</th>
                    <th style={{ width: "30%" }}>Research Topic</th>
                    <th style={{ width: "12%" }}>Status</th>
                    <th style={{ width: "10%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const pi = app.personalInformation || {};
                    const ac = app.academic || {};
                    const fullName = [pi.firstName, pi.middleName, pi.lastName]
                      .filter(Boolean)
                      .join(" ")
                      .trim();
                    return (
                      <tr key={pi.id}>
                        <td className="user-name-cell">
                          <div className="user-info">
                            <img
                              src={profile}
                              alt={fullName}
                              className="user-avatar"
                            />
                            <span className="user-name">{fullName}</span>
                          </div>
                        </td>
                        <td className="school-cell">
                          {ac.schoolResponse?.name || ""}
                        </td>
                        <td className="program-cell">
                          {ac.program?.description || ""}
                        </td>
                        <td className="research-topic-cell">
                          {ac.researchTopic ? (
                            ac.researchTopic
                          ) : (
                            <span style={{ color: "#aaa" }}>—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              statusBadgeClass[app.applicationStatus] ||
                              "badge-gray"
                            }`}
                          >
                            {statusMap[app.applicationStatus] || ""}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewApplication(app)}
                            className="action-btn"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <div className="pagination-info">
                Page {currentPage} of {totalPages} ({totalCount} applications)
              </div>
              <div className="pagination-controls">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* View Application Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Application Details"
        size="md"
      >
        {selectedApplication && (
          <div className="modal-content">
            <div className="user-profile">
              <div className="profile-header">
                <img src={profile} alt="Profile" className="profile-avatar" />
                <div className="profile-info">
                  <h3>
                    {[
                      selectedApplication.personalInformation.firstName,
                      selectedApplication.personalInformation.middleName,
                      selectedApplication.personalInformation.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")
                      .trim()}
                  </h3>
                  <p>
                    <Mail size={14} />{" "}
                    {selectedApplication.personalInformation.email}
                  </p>
                  <p>
                    <Phone size={14} />{" "}
                    {selectedApplication.personalInformation.phone}
                  </p>
                  <p>
                    <MapPin size={14} />{" "}
                    {selectedApplication.personalInformation.address}
                  </p>
                  <p>
                    <Calendar size={14} />{" "}
                    {selectedApplication.personalInformation.dob}
                  </p>
                  <div style={{ marginTop: "0.5em" }}>
                    <span
                      className={`badge ${
                        statusBadgeClass[
                          selectedApplication.applicationStatus
                        ] || "badge-gray"
                      }`}
                    >
                      {statusMap[selectedApplication.applicationStatus]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="user-stats">
                <div className="stat-item">
                  <label>Program</label>
                  <span>
                    {selectedApplication.academic?.program?.description ||
                      "Not specified"}
                  </span>
                </div>
                <div className="stat-item">
                  <label>School</label>
                  <span>
                    {selectedApplication.academic?.schoolResponse?.name ||
                      "Not specified"}
                  </span>
                </div>
                <div className="stat-item">
                  <label>School Address</label>
                  <span>
                    {selectedApplication.academic?.schoolResponse?.addresss ||
                      "Not specified"}
                  </span>
                </div>
                <div className="stat-item">
                  <label>Course of Interest</label>
                  <span>
                    {selectedApplication.academic?.courseOfInterest?.name ||
                      "Not specified"}
                  </span>
                </div>
                {!!selectedApplication.academic?.researchTopic && (
                  <div className="stat-item">
                    <label>Research Topic</label>
                    <span>{selectedApplication.academic.researchTopic}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() =>
                  window.open(
                    `mailto:${selectedApplication.personalInformation.email}`
                  )
                }
                className="btn btn-outline"
              >
                <Mail size={16} />
                Send Email
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
