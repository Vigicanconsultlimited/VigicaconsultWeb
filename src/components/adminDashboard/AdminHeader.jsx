import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
//import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";
//import logo from "../../assets/images/vigica.png";
import logo from "../../assets/images/vigica-vertical-w.png";
import profile from "../../assets/images/default-profile.jpg";
import { ChevronDown, Menu } from "lucide-react";
import "./styles/AdminHeader.css";

export default function AdminHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarUrl = profile;

  // Auth store usage
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.allUserData);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Only fetch if user is logged in and role is Admin
    const fetchAdminInfo = async () => {
      try {
        const userRole =
          user?.userRole ||
          user?.[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        const userRsponse = user?.userRsponse || user;

        if (userRole === "Admin") {
          setIsAdmin(true);
          setAdminRole(userRole);
          setAdminEmail(userRsponse?.email || "");
          setAdminName(
            userRsponse?.firstName && userRsponse?.lastName
              ? `${userRsponse.firstName} ${userRsponse.lastName}`
              : userRsponse?.email || "Admin"
          );
        } else {
          setIsAdmin(false);
          setAdminRole(userRole || "");
          setAdminEmail(userRsponse?.email || "");
          setAdminName(userRsponse?.email || "User");
        }
      } catch (error) {
        setIsAdmin(false);
        setAdminRole("");
        setAdminEmail("");
        setAdminName("Admin");
        //console.warn("Failed to fetch admin info:", error);
      }
    };

    if (isLoggedIn() && user) {
      fetchAdminInfo();
    }
  }, [isLoggedIn, user]);

  return (
    <header className="admin-header-redesign">
      <div className="admin-header-bar">
        {/* Hamburger for mobile */}
        <button
          className="header-hamburger-btn"
          aria-label="Open sidebar"
          onClick={toggleSidebar}
        >
          <Menu size={28} />
        </button>

        {/* Mobile: Vigica logo and brand */}
        <div className="admin-header-mobile-logo">
          <img
            src={logo}
            className="mobile-logo-img me-2"
            alt="Vigica Consult Ltd"
          />
        </div>
        <div className="admin-name-container">
          <div className="sidebar-brand">
            Hello, {adminName ? adminName.split(" ")[0] : "Admin"}
          </div>
          <div className="sidebar-subbrand">
            {adminRole ? adminRole : "Administrator"}
          </div>
        </div>

        {/* Desktop: Admin profile and dropdown */}
        <div className="admin-header-desktop-profile">
          <img
            className="profile-avatar"
            src={avatarUrl}
            alt={adminName}
            onClick={() => setDropdownOpen((o) => !o)}
            style={{ cursor: "pointer" }}
          />
          <div className="profile-details">
            <span className="admin-name">{adminName || "Admin"}</span>
            <span className="admin-email">{adminEmail || "Guest"}</span>
          </div>
          <button
            className="header-action-btn arrow desktop"
            aria-label="Expand"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <ChevronDown size={22} />
          </button>
          {dropdownOpen && (
            <div className="admin-header-desktop-dropdown-menu">
              <button className="dropdown-item">Settings</button>
              <button className="dropdown-item">Account</button>
              <button className="dropdown-item">
                <Link to="/logout" className="text-decoration-none">
                  Logout
                </Link>
              </button>
            </div>
          )}
        </div>

        {/* Mobile: Only avatar, name, dropdown */}
        <div className="admin-header-mobile">
          <div className="admin-header-mobile-profile">
            <img className="profile-avatar" src={avatarUrl} alt={adminName} />
            <div className="admin-name">
              {adminName ? adminName.split(" ")[0] : "Admin"}
            </div>
          </div>
          <div className="admin-header-mobile-dropdown">
            <button
              className="header-action-btn arrow"
              aria-label="Expand"
              onClick={() => setDropdownOpen((o) => !o)}
            >
              <ChevronDown size={22} />
            </button>
            {dropdownOpen && (
              <div className="admin-header-mobile-dropdown-menu">
                <button className="dropdown-item">Settings</button>
                <button className="dropdown-item">Account</button>
                <button className="dropdown-item">
                  <Link
                    to="/logout"
                    className="text-decoration-none text-reset"
                  >
                    Logout
                  </Link>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
