<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState, useEffect, useCallback } from "react";
>>>>>>> main
import Button from "../../shared/Button";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import profile from "../../../assets/images/default-profile.jpg";
import apiInstance from "../../../utils/axios";
<<<<<<< HEAD
=======
import "../styles/UserManagement.css";
>>>>>>> main
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
<<<<<<< HEAD
  Shield,
  Users,
} from "lucide-react";

export default function UserManagement() {
=======
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
  // Current timestamp: 2025-08-10 22:35:25 UTC by NeduStack
  const getCurrentDateTime = () => "2025-08-10 22:35:25";
  const getCurrentUser = () => "NeduStack";

>>>>>>> main
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
=======
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
>>>>>>> main
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "active",
<<<<<<< HEAD
  });
  const [loadingUsers, setLoadingUsers] = useState(false);

  const roles = ["Student", "Admin", "Moderator"];
  const statuses = ["active", "inactive", "suspended"];

  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const res = await apiInstance.get("StudentPersonalInfo");
        if (res?.data?.statusCode === 200 && Array.isArray(res.data.result)) {
          // Map API data to expected user object
          const mapped = res.data.result.map((user, idx) => ({
            id: user.id,
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.email ||
              "Unnamed",
            email: user.email,
            role: "Student",
            status: "active",
            lastLogin: "",
            joinDate: user.dob || "",
            avatar: profile,
            applications: 0,
            phone: user.phone,
            address: user.address,
            postCode: user.postCode,
            middleName: user.middleName,
            dob: user.dob,
          }));
          setUsers(mapped);
        }
      } catch (e) {
        setUsers([]);
      }
      setLoadingUsers(false);
    }
    fetchUsers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
=======
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
>>>>>>> main
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
<<<<<<< HEAD
      case "Admin":
        return "bg-blue-100 text-blue-800";
      case "Moderator":
        return "bg-purple-100 text-purple-800";
      case "Student":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield size={16} />;
      case "Moderator":
        return <UserCheck size={16} />;
      case "Student":
        return <Users size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
=======
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
>>>>>>> main
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

<<<<<<< HEAD
  const handleCreateUser = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id || 0)) + 1 : 1;
      const createdUser = {
        ...newUser,
        id: newId,
        lastLogin: "Never",
        joinDate: new Date().toISOString().split("T")[0],
        avatar: profile,
        applications: 0,
      };
      setUsers([createdUser, ...users]);
      setNewUser({ name: "", email: "", role: "Student", status: "active" });
      setIsCreateModalOpen(false);
      setIsLoading(false);
    }, 1000);
=======
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
>>>>>>> main
  };

  const handleEditUser = async () => {
    setIsLoading(true);
<<<<<<< HEAD
    // Simulate API call
    setTimeout(() => {
=======
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
>>>>>>> main
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
<<<<<<< HEAD
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
=======
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
>>>>>>> main
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

<<<<<<< HEAD
  return (
    <div className="user-management-section">
      <div className="section-header">
        <div className="header-content">
          <h1 className="section-title">User Management</h1>
          <div className="header-actions">
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add User
            </Button>
=======
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
>>>>>>> main
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Statistics Cards */}
      <div className="user-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Users</h3>
              <div className="stat-value">{users.length}</div>
            </div>
            <div className="stat-icon">
              <Users size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Active Users</h3>
              <div className="stat-value">
                {users.filter((u) => u.status === "active").length}
              </div>
            </div>
            <div className="stat-icon">
              <UserCheck size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Students</h3>
              <div className="stat-value">
                {users.filter((u) => u.role === "Student").length}
              </div>
            </div>
            <div className="stat-icon">
              <Users size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Admins</h3>
              <div className="stat-value">
                {users.filter((u) => u.role === "Admin").length}
              </div>
            </div>
            <div className="stat-icon">
              <Shield size={24} />
=======
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
>>>>>>> main
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Filters */}
      <div className="filters-section">
        <div className="search-filter-container">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
=======
      {/* Enhanced Filters Section - Updated Layout */}
      <div className="filters-section">
        {/* Search Row - Full Width */}
        <div className="search-row">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
>>>>>>> main
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
<<<<<<< HEAD
          </div>

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

          <Button variant="outline" leftIcon={<Filter size={16} />}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div className="table-wrapper">
          {loadingUsers ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              Loading users...
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th>Last Login</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-info">
                      <div className="user-details">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="user-avatar"
                        />
                        <div className="user-text">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="role-container">
                        <span
                          className={`role-badge ${getRoleColor(user.role)}`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="applications-count">{user.applications}</td>
                    <td className="last-login">{user.lastLogin}</td>
                    <td className="join-date">{user.joinDate}</td>
                    <td className="actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="action-btn"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(user)}
                        className="action-btn"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className="action-btn"
                      >
                        {user.status === "active" ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="action-btn delete-btn"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
=======
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
>>>>>>> main
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="md"
<<<<<<< HEAD
        footer={
          <div className="modal-footer-actions">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateUser}
              disabled={!newUser.name || !newUser.email || isLoading}
              leftIcon={
                isLoading ? <LoadingSpinner size="sm" /> : <Plus size={16} />
              }
            >
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        }
      >
        <div className="user-form">
          <div className="form-group">
            <label htmlFor="userName">Full Name</label>
            <input
              id="userName"
              type="text"
              placeholder="Enter full name..."
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">Email Address</label>
            <input
              id="userEmail"
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
            <label htmlFor="userRole">Role</label>
            <select
              id="userRole"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
            <label htmlFor="userStatus">Status</label>
            <select
              id="userStatus"
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
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="md"
        footer={
          <div className="modal-footer-actions">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditUser}
              disabled={isLoading}
              leftIcon={
                isLoading ? <LoadingSpinner size="sm" /> : <Edit size={16} />
              }
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      >
        {selectedUser && (
          <div className="user-form">
            <div className="form-group">
              <label htmlFor="editUserName">Full Name</label>
              <input
                id="editUserName"
                type="text"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
=======
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
>>>>>>> main
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
<<<<<<< HEAD
              <label htmlFor="editUserEmail">Email Address</label>
              <input
                id="editUserEmail"
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
=======
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter email address..."
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
>>>>>>> main
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
<<<<<<< HEAD
              <label htmlFor="editUserRole">Role</label>
              <select
                id="editUserRole"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
=======
              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
>>>>>>> main
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
<<<<<<< HEAD
              <label htmlFor="editUserStatus">Status</label>
              <select
                id="editUserStatus"
                value={selectedUser.status}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, status: e.target.value })
=======
              <label>Status</label>
              <select
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({ ...newUser, status: e.target.value })
>>>>>>> main
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
<<<<<<< HEAD
=======

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
>>>>>>> main
        )}
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
        size="md"
<<<<<<< HEAD
        footer={
          <div className="modal-footer-actions">
            <Button variant="outline" leftIcon={<Mail size={16} />}>
              Send Email
            </Button>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedUser && (
          <div className="user-details-view">
            <div className="user-profile">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="profile-avatar-large"
              />
              <div className="profile-info">
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
                <div className="profile-badges">
                  <span
                    className={`role-badge ${getRoleColor(selectedUser.role)}`}
                  >
                    {getRoleIcon(selectedUser.role)}
                    {selectedUser.role}
                  </span>
                  <span
                    className={`status-badge ${getStatusColor(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status}
                  </span>
=======
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
>>>>>>> main
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="user-stats-details">
              <div className="stat-item">
                <label>Applications Submitted</label>
                <value>{selectedUser.applications}</value>
              </div>
              <div className="stat-item">
                <label>Last Login</label>
                <value>{selectedUser.lastLogin}</value>
              </div>
              <div className="stat-item">
                <label>Join Date</label>
                <value>
                  {selectedUser.joinDate}
                  {selectedUser.dob &&
                  selectedUser.joinDate === selectedUser.dob
                    ? ` (${selectedUser.dob})`
                    : ""}
                </value>
              </div>
              <div className="stat-item">
                <label>Phone</label>
                <value>{selectedUser.phone}</value>
              </div>
              <div className="stat-item">
                <label>Address</label>
                <value>{selectedUser.address}</value>
              </div>
              <div className="stat-item">
                <label>Post Code</label>
                <value>{selectedUser.postCode}</value>
              </div>
              <div className="stat-item">
                <label>Middle Name</label>
                <value>{selectedUser.middleName}</value>
              </div>
=======
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
>>>>>>> main
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
