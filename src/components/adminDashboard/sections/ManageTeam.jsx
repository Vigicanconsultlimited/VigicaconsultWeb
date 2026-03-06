import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTags,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingSpinner from "../../shared/LoadingSpinner";

const API_BASE_URL = import.meta.env.PROD
  ? "https://teamapi-production.up.railway.app/api/v1"
  : "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth error response interceptor — will be enhanced per-component with navigate
let authErrorHandler = null;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (authErrorHandler) authErrorHandler(error);
    }
    return Promise.reject(error);
  },
);

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const ManageTeam = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");
  const [members, setMembers] = useState([]); // all members (unfiltered)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [positions, setPositions] = useState([]);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityMember, setActivityMember] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Register auth error handler for navigation redirect
  useEffect(() => {
    authErrorHandler = (error) => {
      const status = error.response?.status;
      const message =
        status === 401
          ? "Your session has expired. Please log in again."
          : "You don't have permission to access this resource.";
      alert(message);
      // Clear tokens
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      navigate("/login", { replace: true });
    };
    return () => {
      authErrorHandler = null;
    };
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "members") {
      fetchMembers();
    } else if (activeTab === "categories") {
      fetchCategories();
    } else if (activeTab === "positions") {
      fetchPositions();
    }
  }, [activeTab]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/team/admin/team/");
      const data = response.data.results || response.data;
      setMembers(data);
      setStats({
        total: data.length,
        approved: data.filter((m) => m.status === "approved").length,
        pending: data.filter((m) => m.status === "pending").length,
        rejected: data.filter((m) => m.status === "rejected").length,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/team/admin/categories/");
      const data = response.data.results || response.data;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memberId) => {
    try {
      await api.post(`/team/admin/team/${memberId}/approve/`, {
        status: "approved",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error approving member:", error);
      alert("Failed to approve member");
    }
  };

  const handleReject = async (memberId) => {
    const notes = prompt("Enter rejection reason (optional):");
    try {
      await api.post(`/team/admin/team/${memberId}/approve/`, {
        status: "rejected",
        admin_notes: notes || "",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error rejecting member:", error);
      alert("Failed to reject member");
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await api.delete(`/team/admin/team/${memberId}/`);
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member");
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        await api.put(
          `/team/admin/categories/${editingCategory.id}/`,
          categoryData,
        );
      } else {
        await api.post("/team/admin/categories/", categoryData);
      }
      fetchCategories();
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  };

  const fetchMemberActivity = async (member) => {
    setActivityMember(member);
    setShowActivityModal(true);
    setActivityLoading(true);
    setActivityData(null);
    try {
      const response = await api.get(`/team/admin/team/${member.id}/activity/`);
      setActivityData(response.data);
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setActivityLoading(false);
    }
  };

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/team/admin/positions/");
      const data = response.data.results || response.data;
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePosition = async (positionData) => {
    try {
      if (editingPosition) {
        await api.put(
          `/team/admin/positions/${editingPosition.id}/`,
          positionData,
        );
      } else {
        await api.post("/team/admin/positions/", positionData);
      }
      fetchPositions();
      setShowPositionModal(false);
      setEditingPosition(null);
    } catch (error) {
      console.error("Error saving position:", error);
      alert("Failed to save position");
    }
  };

  const handleDeletePosition = async (positionId) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    try {
      await api.delete(`/team/admin/positions/${positionId}/`);
      fetchPositions();
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Failed to delete position");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/team/admin/categories/${categoryId}/`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const filteredMembers = members.filter((member) => {
    if (statusFilter !== "all" && member.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      member.first_name?.toLowerCase().includes(search) ||
      member.last_name?.toLowerCase().includes(search) ||
      member.email?.toLowerCase().includes(search) ||
      member.position?.toLowerCase().includes(search)
    );
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Pagination calculations
  const totalFilteredItems = filteredMembers.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalFilteredItems);
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Generate page numbers for pagination controls
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { bg: "#dcfce7", color: "#166534", text: "Approved" },
      pending: { bg: "#fef9c3", color: "#854d0e", text: "Pending" },
      rejected: { bg: "#fee2e2", color: "#991b1b", text: "Rejected" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "20px",
          backgroundColor: badge.bg,
          color: badge.color,
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div className="manage-team-section">
      <div className="section-header">
        <h2>
          <FaUsers /> Manage Team
        </h2>
        <p>Manage team members and categories</p>
      </div>

      {/* Tabs */}
      <div className="team-tabs">
        <button
          className={`tab-btn ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <FaUsers /> Team Members
        </button>
        <button
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <FaTags /> Categories
        </button>
        <button
          className={`tab-btn ${activeTab === "positions" ? "active" : ""}`}
          onClick={() => setActiveTab("positions")}
        >
          <FaChartBar /> Positions
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 0",
          }}
        >
          <LoadingSpinner size="xl" text="Loading..." />
        </div>
      ) : activeTab === "members" ? (
        <>
          {/* Stats Cards */}
          <div className="team-stats">
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Members</span>
              </div>
            </div>
            <div className="stat-card approved">
              <FaUserCheck className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.approved}</span>
                <span className="stat-label">Approved</span>
              </div>
            </div>
            <div className="stat-card pending">
              <FaUserClock className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            <div className="stat-card rejected">
              <FaUserTimes className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.rejected}</span>
                <span className="stat-label">Rejected</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="team-filters">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-select">
              <FaFilter />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="team-table-container">
            {filteredMembers.length === 0 ? (
              <div className="no-data">No team members found</div>
            ) : (
              <>
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Position</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="member-info">
                            <img
                              src={
                                member.profile_picture_url ||
                                "/default-profile.jpg"
                              }
                              alt={member.first_name}
                              className="member-avatar"
                            />
                            <div>
                              <div className="member-name">
                                {member.first_name} {member.last_name}
                              </div>
                              <div className="member-email">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{member.position}</td>
                        <td>{member.category_name || "—"}</td>
                        <td>{getStatusBadge(member.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowMemberModal(true);
                              }}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="action-btn activity"
                              onClick={() => fetchMemberActivity(member)}
                              title="View Activity"
                            >
                              <FaChartBar />
                            </button>
                            {member.status === "pending" && (
                              <>
                                <button
                                  className="action-btn approve"
                                  onClick={() => handleApprove(member.id)}
                                  title="Approve"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  className="action-btn reject"
                                  onClick={() => handleReject(member.id)}
                                  title="Reject"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            )}
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteMember(member.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="pagination-container">
                  <div className="pagination-info">
                    <span>
                      Showing {totalFilteredItems === 0 ? 0 : startIndex + 1}–
                      {endIndex} of {totalFilteredItems} members
                    </span>
                    <div className="items-per-page">
                      <label>Per page:</label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-buttons">
                      <button
                        className="page-btn"
                        disabled={safePage === 1}
                        onClick={() => setCurrentPage(1)}
                        title="First page"
                      >
                        <FaAngleDoubleLeft />
                      </button>
                      <button
                        className="page-btn"
                        disabled={safePage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        title="Previous page"
                      >
                        <FaChevronLeft />
                      </button>

                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          className={`page-btn page-num ${safePage === page ? "active" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        className="page-btn"
                        disabled={safePage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        title="Next page"
                      >
                        <FaChevronRight />
                      </button>
                      <button
                        className="page-btn"
                        disabled={safePage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        title="Last page"
                      >
                        <FaAngleDoubleRight />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      ) : activeTab === "categories" ? (
        <>
          {/* Categories Tab */}
          <div className="categories-header">
            <h3>Team Categories</h3>
            <button
              className="add-category-btn"
              onClick={() => {
                setEditingCategory(null);
                setShowCategoryModal(true);
              }}
            >
              <FaPlus /> Add Category
            </button>
          </div>

          <div className="categories-list">
            {categories.length === 0 ? (
              <div className="no-data">
                No categories found. Create one to get started.
              </div>
            ) : (
              categories.map((category, index) => (
                <div key={category.id} className="category-card">
                  <div className="category-info">
                    <div className="category-order">
                      <button
                        disabled={index === 0}
                        onClick={() => {
                          const newOrder = category.display_order - 1;
                          api
                            .patch(`/team/admin/categories/${category.id}/`, {
                              display_order: newOrder,
                            })
                            .then(() => fetchCategories());
                        }}
                      >
                        <FaArrowUp />
                      </button>
                      <span>{category.display_order}</span>
                      <button
                        disabled={index === categories.length - 1}
                        onClick={() => {
                          const newOrder = category.display_order + 1;
                          api
                            .patch(`/team/admin/categories/${category.id}/`, {
                              display_order: newOrder,
                            })
                            .then(() => fetchCategories());
                        }}
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                    <div className="category-details">
                      <div className="category-title-row">
                        {category.icon && (
                          <span className="category-icon">{category.icon}</span>
                        )}
                        <h4 style={{ color: category.color || "#1a365d" }}>
                          {category.name}
                        </h4>
                      </div>
                      <p className="category-slug">/{category.slug}</p>
                      <p className="category-description">
                        {category.description || "No description"}
                      </p>
                    </div>
                    <div className="category-meta">
                      <span className="member-count">
                        {category.member_count || 0} members
                      </span>
                      <span
                        className={`status-badge ${category.is_active ? "active" : "inactive"}`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryModal(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Positions Tab */}
          <div className="categories-header">
            <h3>Team Positions</h3>
            <button
              className="add-category-btn"
              onClick={() => {
                setEditingPosition(null);
                setShowPositionModal(true);
              }}
            >
              <FaPlus /> Add Position
            </button>
          </div>

          <div className="categories-list">
            {positions.length === 0 ? (
              <div className="no-data">
                No positions found. Create one to get started.
              </div>
            ) : (
              positions.map((position, index) => (
                <div key={position.id} className="category-card">
                  <div className="category-info">
                    <div className="category-order">
                      <button
                        disabled={index === 0}
                        onClick={() => {
                          const newOrder = position.display_order - 1;
                          api
                            .patch(`/team/admin/positions/${position.id}/`, {
                              display_order: newOrder,
                            })
                            .then(() => fetchPositions());
                        }}
                      >
                        <FaArrowUp />
                      </button>
                      <span>{position.display_order}</span>
                      <button
                        disabled={index === positions.length - 1}
                        onClick={() => {
                          const newOrder = position.display_order + 1;
                          api
                            .patch(`/team/admin/positions/${position.id}/`, {
                              display_order: newOrder,
                            })
                            .then(() => fetchPositions());
                        }}
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                    <div className="category-details">
                      <h4>{position.name}</h4>
                      <p className="category-slug">/{position.slug}</p>
                      <p className="category-description">
                        {position.description || "No description"}
                      </p>
                    </div>
                    <div className="category-meta">
                      <span
                        className={`status-badge ${position.is_active ? "active" : "inactive"}`}
                      >
                        {position.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingPosition(position);
                        setShowPositionModal(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeletePosition(position.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Member Detail Modal */}
      {showMemberModal && selectedMember && (
        <div
          className="modal-overlay"
          onClick={() => setShowMemberModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Member Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowMemberModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="member-detail-header">
                <img
                  src={
                    selectedMember.profile_picture_url || "/default-profile.jpg"
                  }
                  alt={selectedMember.first_name}
                  className="detail-avatar"
                />
                <div>
                  <h4>
                    {selectedMember.first_name} {selectedMember.last_name}
                  </h4>
                  <p>{selectedMember.position}</p>
                  {getStatusBadge(selectedMember.status)}
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Email</label>
                  <span>{selectedMember.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{selectedMember.phone || "—"}</span>
                </div>
                <div className="detail-item">
                  <label>Category</label>
                  <span>{selectedMember.category_name || "—"}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Short Bio</label>
                  <span>{selectedMember.short_bio || "—"}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Full Bio</label>
                  <span>{selectedMember.full_bio || "—"}</span>
                </div>
                {selectedMember.admin_notes && (
                  <div className="detail-item full-width">
                    <label>Admin Notes</label>
                    <span>{selectedMember.admin_notes}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              {selectedMember.status === "pending" && (
                <>
                  <button
                    className="approve-btn"
                    onClick={() => {
                      handleApprove(selectedMember.id);
                      setShowMemberModal(false);
                    }}
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => {
                      handleReject(selectedMember.id);
                      setShowMemberModal(false);
                    }}
                  >
                    <FaTimes /> Reject
                  </button>
                </>
              )}
              <button
                className="close-modal-btn"
                onClick={() => setShowMemberModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && activityMember && (
        <div
          className="modal-overlay"
          onClick={() => setShowActivityModal(false)}
        >
          <div
            className="modal-content activity-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <FaChartBar style={{ marginRight: 8 }} />
                Activity — {activityMember.first_name}{" "}
                {activityMember.last_name}
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowActivityModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {activityLoading ? (
                <div className="loading">Loading activity data…</div>
              ) : activityData ? (
                <>
                  {/* Stats Grid */}
                  <div className="activity-stats-grid">
                    {[
                      {
                        label: "Total",
                        value: activityData.stats?.total ?? 0,
                        color: "#1a56db",
                      },
                      {
                        label: "Upcoming",
                        value: activityData.stats?.upcoming ?? 0,
                        color: "#0d9488",
                      },
                      {
                        label: "This Month",
                        value: activityData.stats?.this_month ?? 0,
                        color: "#db2777",
                      },
                      {
                        label: "Pending",
                        value: activityData.stats?.pending ?? 0,
                        color: "#d97706",
                      },
                      {
                        label: "Confirmed",
                        value: activityData.stats?.confirmed ?? 0,
                        color: "#0891b2",
                      },
                      {
                        label: "Completed",
                        value: activityData.stats?.completed ?? 0,
                        color: "#059669",
                      },
                      {
                        label: "Cancelled",
                        value: activityData.stats?.cancelled ?? 0,
                        color: "#dc2626",
                      },
                      {
                        label: "No Show",
                        value: activityData.stats?.no_show ?? 0,
                        color: "#7c3aed",
                      },
                    ].map((s) => (
                      <div key={s.label} className="activity-stat-card">
                        <div
                          className="activity-stat-value"
                          style={{ color: s.color }}
                        >
                          {s.value}
                        </div>
                        <div className="activity-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Appointments */}
                  <div className="activity-section">
                    <h4 className="activity-section-title">
                      Upcoming Appointments ({activityData.stats?.upcoming ?? 0}
                      )
                    </h4>
                    {activityData.upcoming_appointments?.length > 0 ? (
                      <table className="activity-table">
                        <thead>
                          <tr>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityData.upcoming_appointments.map((appt) => (
                            <tr key={appt.id}>
                              <td>
                                <div style={{ fontWeight: 500 }}>
                                  {appt.client_name}
                                </div>
                                <div style={{ fontSize: 11, color: "#6b7280" }}>
                                  {appt.client_email}
                                </div>
                              </td>
                              <td>{appt["service_type__name"] || "—"}</td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                {appt.start_datetime
                                  ? new Date(
                                      appt.start_datetime,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "—"}
                                <div style={{ fontSize: 11, color: "#6b7280" }}>
                                  {appt.start_datetime
                                    ? new Date(
                                        appt.start_datetime,
                                      ).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })
                                    : ""}
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`appt-pill appt-pill-${appt.status}`}
                                >
                                  {appt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="activity-empty">
                        No upcoming appointments.
                      </p>
                    )}
                  </div>

                  {/* Recent Appointments */}
                  <div className="activity-section">
                    <h4 className="activity-section-title">
                      Recent Appointments (last 10)
                    </h4>
                    {activityData.recent_appointments?.length > 0 ? (
                      <table className="activity-table">
                        <thead>
                          <tr>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityData.recent_appointments
                            .slice(0, 10)
                            .map((appt) => (
                              <tr key={appt.id}>
                                <td>
                                  <div style={{ fontWeight: 500 }}>
                                    {appt.client_name}
                                  </div>
                                  <div
                                    style={{ fontSize: 11, color: "#6b7280" }}
                                  >
                                    {appt.client_email}
                                  </div>
                                </td>
                                <td>{appt["service_type__name"] || "—"}</td>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  {appt.start_datetime
                                    ? new Date(
                                        appt.start_datetime,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "—"}
                                </td>
                                <td style={{ color: "#6b7280" }}>
                                  {appt.start_datetime && appt.end_datetime
                                    ? Math.round(
                                        (new Date(appt.end_datetime) -
                                          new Date(appt.start_datetime)) /
                                          60000,
                                      ) + " min"
                                    : "—"}
                                </td>
                                <td>
                                  <span
                                    className={`appt-pill appt-pill-${appt.status}`}
                                  >
                                    {appt.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="activity-empty">No appointments yet.</p>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="activity-section">
                    <h4 className="activity-section-title">
                      Weekly Availability
                    </h4>
                    {activityData.availability?.length > 0 ? (
                      <div className="avail-chips">
                        {activityData.availability.map((slot, i) => (
                          <div key={i} className="avail-chip">
                            <span className="avail-chip-day">
                              {slot.weekday_name}
                            </span>
                            <span className="avail-chip-time">
                              {slot.start_time} – {slot.end_time}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="activity-empty">
                        No availability configured.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="activity-empty" style={{ padding: 40 }}>
                  Failed to load activity data.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="close-modal-btn"
                onClick={() => setShowActivityModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Position Modal */}
      {showPositionModal && (
        <PositionModal
          position={editingPosition}
          onSave={handleSavePosition}
          onClose={() => {
            setShowPositionModal(false);
            setEditingPosition(null);
          }}
        />
      )}

      <style>{`
        .manage-team-section {
          padding: 20px;
        }
        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }
        .section-header p {
          color: #666;
          margin-bottom: 20px;
        }
        .team-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 10px;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          background: #f5f5f5;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: #1a365d;
          color: white;
        }
        .tab-btn:hover:not(.active) {
          background: #e0e0e0;
        }
        .team-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .stat-card .stat-icon {
          font-size: 24px;
          color: #1a365d;
        }
        .stat-card.approved .stat-icon { color: #166534; }
        .stat-card.pending .stat-icon { color: #854d0e; }
        .stat-card.rejected .stat-icon { color: #991b1b; }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 600;
        }
        .stat-label {
          font-size: 13px;
          color: #666;
        }
        .team-filters {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .search-box, .filter-select {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }
        .search-box input, .filter-select select {
          border: none;
          outline: none;
          font-size: 14px;
          min-width: 150px;
        }
        .team-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .team-table {
          width: 100%;
          border-collapse: collapse;
        }
        .team-table th, .team-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }
        .team-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }
        .member-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .member-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
        }
        .member-name {
          font-weight: 500;
        }
        .member-email {
          font-size: 12px;
          color: #666;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .action-btn.view { background: #e0f2fe; color: #0369a1; }
        .action-btn.approve { background: #dcfce7; color: #166534; }
        .action-btn.reject { background: #fef3c7; color: #92400e; }
        .action-btn.delete { background: #fee2e2; color: #991b1b; }
        .action-btn.activity { background: #f3e8ff; color: #7c3aed; }
        .action-btn:hover { transform: scale(1.1); }
        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .add-category-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1a365d;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .category-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .category-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .category-order {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .category-order button {
          width: 24px;
          height: 24px;
          border: none;
          background: #f0f0f0;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .category-order button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .category-details h4 {
          margin: 0 0 5px 0;
        }
        .category-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }
        .category-icon {
          font-size: 20px;
        }
        .category-slug {
          font-size: 12px;
          color: #666;
          margin: 0 0 5px 0;
        }
        .category-description {
          font-size: 13px;
          color: #888;
          margin: 0;
        }
        .category-meta {
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: flex-end;
        }
        .member-count {
          font-size: 13px;
          color: #666;
        }
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
        }
        .status-badge.active { background: #dcfce7; color: #166534; }
        .status-badge.inactive { background: #f3f4f6; color: #6b7280; }
        .category-actions {
          display: flex;
          gap: 10px;
        }
        .edit-btn, .delete-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }
        .edit-btn { background: #e0f2fe; color: #0369a1; }
        .delete-btn { background: #fee2e2; color: #991b1b; }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        .modal-header h3 { margin: 0; }
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
        }
        .modal-body {
          padding: 20px;
        }
        .member-detail-header {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .detail-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .detail-item.full-width {
          grid-column: span 2;
        }
        .detail-item label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
        .detail-item span {
          font-size: 14px;
        }
        .modal-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding: 20px;
          border-top: 1px solid #e0e0e0;
        }
        .approve-btn, .reject-btn, .close-modal-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .approve-btn { background: #166534; color: white; }
        .reject-btn { background: #991b1b; color: white; }
        .close-modal-btn { background: #f0f0f0; color: #333; }
        .loading, .no-data {
          padding: 40px;
          text-align: center;
          color: #666;
        }
        /* ── Activity Modal ── */
        .activity-modal-content {
          max-width: 860px;
        }
        .activity-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .activity-stat-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 10px;
          text-align: center;
        }
        .activity-stat-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }
        .activity-stat-label {
          font-size: 11px;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .activity-section {
          margin-bottom: 24px;
        }
        .activity-section-title {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 10px;
          padding-bottom: 6px;
          border-bottom: 2px solid #e5e7eb;
        }
        .activity-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .activity-table th {
          background: #f9fafb;
          padding: 8px 12px;
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: #6b7280;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
        }
        .activity-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
          vertical-align: middle;
        }
        .activity-table tr:last-child td { border-bottom: none; }
        .activity-table tr:hover td { background: #f9fafb; }
        .appt-pill {
          display: inline-block;
          padding: 2px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }
        .appt-pill-pending   { background: #fef3c7; color: #92400e; }
        .appt-pill-confirmed { background: #dbeafe; color: #1e40af; }
        .appt-pill-completed { background: #d1fae5; color: #065f46; }
        .appt-pill-cancelled { background: #fee2e2; color: #991b1b; }
        .appt-pill-no_show   { background: #ede9fe; color: #5b21b6; }
        .avail-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .avail-chip {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          color: #1e40af;
          min-width: 160px;
        }
        .avail-chip-day { font-weight: 700; display: block; margin-bottom: 2px; }
        .avail-chip-time { color: #3b82f6; font-size: 12px; }
        .activity-empty {
          color: #9ca3af;
          font-size: 13px;
          margin: 0;
          padding: 12px 0;
        }
        /* ── Pagination ── */
        .pagination-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          gap: 12px;
        }
        .pagination-info {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          color: #6b7280;
        }
        .items-per-page {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .items-per-page label {
          font-size: 13px;
          color: #6b7280;
        }
        .items-per-page select {
          padding: 4px 8px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          background: white;
          cursor: pointer;
          outline: none;
        }
        .items-per-page select:focus {
          border-color: #1a365d;
          box-shadow: 0 0 0 2px rgba(26,54,93,0.15);
        }
        .pagination-buttons {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .page-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          color: #374151;
          font-size: 13px;
          transition: all 0.15s ease;
        }
        .page-btn:hover:not(:disabled):not(.active) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .page-btn.active {
          background: #1a365d;
          color: white;
          border-color: #1a365d;
          font-weight: 600;
        }
        .page-btn.page-num {
          min-width: 34px;
        }
        @media (max-width: 640px) {
          .pagination-container {
            flex-direction: column;
            align-items: stretch;
          }
          .pagination-info {
            justify-content: space-between;
          }
          .pagination-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    icon: category?.icon || "",
    color: category?.color || "#1a365d",
    display_order: category?.display_order || 0,
    is_active: category?.is_active ?? true,
    collapsed_by_default: category?.collapsed_by_default ?? false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Auto-generate slug from name
      ...(name === "name" && !category
        ? {
            slug: value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
          }
        : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{category ? "Edit Category" : "Add Category"}</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Leadership Team"
              />
            </div>
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="e.g., leadership-team"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g., 👨‍💼, 💻, 🎨"
                  maxLength={10}
                />
                <small className="form-hint">
                  Use an emoji to represent this category
                </small>
              </div>
              <div className="form-group">
                <label>Header Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="#1a365d"
                    className="color-text"
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  Active (visible on team page)
                </label>
              </div>
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="collapsed_by_default"
                  checked={formData.collapsed_by_default}
                  onChange={handleChange}
                />
                Collapsed by default (hide members until expanded)
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {category ? "Update" : "Create"} Category
            </button>
          </div>
        </form>

        <style>{`
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            font-size: 14px;
          }
          .form-group input[type="text"],
          .form-group input[type="number"],
          .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
          }
          .form-hint {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
            display: block;
          }
          .color-input-group {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .color-picker {
            width: 50px;
            height: 40px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            cursor: pointer;
            padding: 2px;
          }
          .color-text {
            flex: 1;
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .form-group.checkbox label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }
          .cancel-btn, .save-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
          }
          .cancel-btn { background: #f0f0f0; }
          .save-btn { background: #1a365d; color: white; }
        `}</style>
      </div>
    </div>
  );
};

const PositionModal = ({ position, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: position?.name || "",
    slug: position?.slug || "",
    description: position?.description || "",
    display_order: position?.display_order || 0,
    is_active: position?.is_active ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !position
        ? {
            slug: value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
          }
        : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{position ? "Edit Position" : "Add Position"}</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Position Title *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Consultant"
              />
            </div>
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="e.g., senior-consultant"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this position"
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  Active (available for selection)
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {position ? "Update" : "Create"} Position
            </button>
          </div>
        </form>

        <style>{`
          .form-group { margin-bottom: 15px; }
          .form-group label { display: block; margin-bottom: 5px; font-weight: 500; font-size: 14px; }
          .form-group input[type="text"],
          .form-group input[type="number"],
          .form-group textarea { width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
          .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .form-group.checkbox label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
          .cancel-btn, .save-btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
          .cancel-btn { background: #f0f0f0; }
          .save-btn { background: #1a365d; color: white; }
        `}</style>
      </div>
    </div>
  );
};

export default ManageTeam;
