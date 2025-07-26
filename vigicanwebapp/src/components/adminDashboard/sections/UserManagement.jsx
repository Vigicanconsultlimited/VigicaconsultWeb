import React, { useState, useEffect } from "react";
import Button from "../../shared/Button";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import profile from "../../../assets/images/default-profile.jpg";
import apiInstance from "../../../utils/axios";
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
  Shield,
  Users,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "active",
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
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
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
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

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
  };

  const handleEditUser = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
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
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

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
          </div>
        </div>
      </div>

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
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-filter-container">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="md"
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
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="editUserEmail">Email Address</label>
              <input
                id="editUserEmail"
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="editUserRole">Role</label>
              <select
                id="editUserRole"
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
              <label htmlFor="editUserStatus">Status</label>
              <select
                id="editUserStatus"
                value={selectedUser.status}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, status: e.target.value })
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
        )}
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
        size="md"
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
                </div>
              </div>
            </div>

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
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
