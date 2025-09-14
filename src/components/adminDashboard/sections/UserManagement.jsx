import React, { useState, useEffect, useCallback } from "react";
import Button from "../../shared/Button";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import profile from "../../../assets/images/default-profile.jpg";
import apiInstance from "../../../utils/axios";
import "../styles/UserManagement.css";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Users,
  Download,
  RefreshCw,
  MoreVertical,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from "lucide-react";

export default function UserManagement() {
  //const getCurrentDateTime = () => "2025-08-10 22:35:25";
  //const getCurrentUser = () => "NeduStack";

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "active",
    phone: "",
    address: "",
    postCode: "",
    middleName: "",
  });

  const roles = ["Student", "Moderator", "Instructor", "Support"];
  const statuses = ["active", "inactive", "suspended", "pending"];

  // Enhanced API integration
  const fetchUsers = useCallback(async (isRefresh = false) => {
    const loadingState = isRefresh ? setRefreshing : setLoadingUsers;
    loadingState(true);
    setError(null);

    try {
      const res = await apiInstance.get("StudentPersonalInfo");
      if (res?.data?.statusCode === 200 && Array.isArray(res.data.result)) {
        const mapped = res.data.result.map((user) => ({
          id: user.id,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email ||
            "Unnamed",
          email: user.email,
          role: user.role === "Admin" ? "Student" : user.role || "Student",
          status: user.status || "active",
          lastLogin: user.lastLogin || "Never",
          joinDate: user.dateCreated
            ? new Date(user.dateCreated).toLocaleDateString()
            : "",
          avatar: user.avatar || profile,
          applications: user.applications || 0,
          phone: user.phoneNumber || "",
          address: user.address || "",
          postCode: user.postalCode || "",
          middleName: user.middleName || "",
          dob: user.dateOfBirth || "",
          isOnline: Math.random() > 0.7,
        }));
        setUsers(mapped);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      loadingState(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(false);
  }, [fetchUsers]);

  // Enhanced utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "inactive":
        return "badge-gray";
      case "suspended":
        return "badge-danger";
      case "pending":
        return "badge-warning";
      default:
        return "badge-gray";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Moderator":
        return "badge-purple";
      case "Instructor":
        return "badge-blue";
      case "Support":
        return "badge-orange";
      case "Student":
        return "badge-gray";
      default:
        return "badge-gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={12} />;
      case "inactive":
        return <XCircle size={12} />;
      case "suspended":
        return <AlertCircle size={12} />;
      case "pending":
        return <Clock size={12} />;
      default:
        return <XCircle size={12} />;
    }
  };

  // Enhanced filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // CRUD operations
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      setError("Name and email are required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const createdUser = {
        ...newUser,
        id: Date.now(),
        lastLogin: "Never",
        joinDate: new Date().toLocaleDateString(),
        avatar: profile,
        applications: 0,
        isOnline: false,
      };

      setUsers([createdUser, ...users]);
      setNewUser({
        name: "",
        email: "",
        role: "Student",
        status: "active",
        phone: "",
        address: "",
        postCode: "",
        middleName: "",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      setError("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setError("Failed to update user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUsers(users.filter((u) => u.id !== userId));
      } catch (error) {
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      const newStatus = user.status === "active" ? "inactive" : "active";

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (error) {
      setError("Failed to update user status. Please try again.");
    }
  };

  const handleExportUsers = () => {
    const csvContent = filteredUsers
      .map((user) =>
        [
          user.name,
          user.email,
          user.role,
          user.status,
          user.joinDate,
          user.applications,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const getUserStats = () => ({
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    students: users.filter((u) => u.role === "Student").length,
    moderators: users.filter((u) => u.role === "Moderator").length,
  });

  const stats = getUserStats();

  return (
    <div className="user-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">User Management</h1>
          <div className="header-actions">
            <button
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              className="btn btn-sm btn-outline"
            >
              <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={handleExportUsers}
              className="btn btn-sm btn-outline"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-sm btn-primary"
            >
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-alert">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-icon">
              <Users size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <span className="stat-label">Active</span>
              <span className="stat-value">{stats.active}</span>
            </div>
            <div className="stat-icon stat-success">
              <UserCheck size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <span className="stat-label">Students</span>
              <span className="stat-value">{stats.students}</span>
            </div>
            <div className="stat-icon stat-blue">
              <Users size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <span className="stat-label">Moderators</span>
              <span className="stat-value">{stats.moderators}</span>
            </div>
            <div className="stat-icon stat-purple">
              <UserCheck size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section - Updated Layout */}
      <div className="filters-section">
        {/* Search Row - Full Width */}
        <div className="search-row">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="search-clear"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Row - Side by Side on Desktop, Stacked on Mobile */}
        <div className="filters-row">
          <div className="filter-controls">
            <div className="filter-group">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="btn btn-sm btn-outline">
                <X size={14} />
                Clear
              </button>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-toggle">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="btn btn-sm btn-outline mobile-only"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="mobile-filters">
            <div className="mobile-filter-group">
              <label>Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-filter-group">
              <label>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-filter-actions">
              <button onClick={clearFilters} className="btn btn-sm btn-outline">
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn btn-sm btn-primary"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loadingUsers ? (
          <div className="loading-state">
            <LoadingSpinner size="lg" />
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No users found</h3>
            <p>Try adjusting your search criteria or add a new user.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Add First User
            </button>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="hide-mobile">Applications</th>
                    <th className="hide-mobile">Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar-container">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="user-avatar"
                            />
                            {user.isOnline && <div className="online-dot" />}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(user.status)}`}
                        >
                          {getStatusIcon(user.status)}
                          {user.status}
                        </span>
                      </td>
                      <td className="hide-mobile">{user.applications}</td>
                      <td className="hide-mobile">{user.joinDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="action-btn"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="action-btn"
                            title="Edit User"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className="action-btn"
                            title={
                              user.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            {user.status === "active" ? (
                              <UserX size={14} />
                            ) : (
                              <UserCheck size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="action-btn action-danger"
                            title="Delete User"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </div>
                <div className="pagination-controls">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-sm btn-outline"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 2),
                      Math.min(totalPages, currentPage + 1)
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-sm ${
                          currentPage === page ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-sm btn-outline"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="md"
      >
        <div className="modal-content">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter full name..."
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter email address..."
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="form-select"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({ ...newUser, status: e.target.value })
                }
                className="form-select"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateUser}
              disabled={!newUser.name || !newUser.email || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create User
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="md"
      >
        {selectedUser && (
          <div className="modal-content">
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="form-select"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: e.target.value,
                    })
                  }
                  className="form-select"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="modal-content">
            <div className="user-profile">
              <div className="profile-header">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  <div className="profile-badges">
                    <span
                      className={`badge ${getRoleColor(selectedUser.role)}`}
                    >
                      {selectedUser.role}
                    </span>
                    <span
                      className={`badge ${getStatusColor(selectedUser.status)}`}
                    >
                      {getStatusIcon(selectedUser.status)}
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="user-stats">
                <div className="stat-item">
                  <label>Applications</label>
                  <span>{selectedUser.applications}</span>
                </div>
                <div className="stat-item">
                  <label>Last Login</label>
                  <span>{selectedUser.lastLogin}</span>
                </div>
                <div className="stat-item">
                  <label>Join Date</label>
                  <span>{selectedUser.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => window.open(`mailto:${selectedUser.email}`)}
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
