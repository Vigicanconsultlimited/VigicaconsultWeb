import React, { useState } from "react";
import logo from "../../assets/images/vigica.png";
import profile from "../../assets/images/default-profile.jpg";
import { ChevronDown, Menu } from "lucide-react";
import "./styles/AdminHeader.css";

export default function AdminHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarUrl = profile;
  const adminName = "Fizy Edward Chinedu";
  const adminEmail = "cbpips@gmail.com";

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
            alt="Vigica Logo"
            className="mobile-logo-img"
            height={32}
          />
          <div>
            <div className="sidebar-brand">VIGICA</div>
            <div className="sidebar-subbrand">CONSULT LIMITED</div>
          </div>
        </div>
        <div className="admin-name-container">
          <div className="sidebar-brand">Hello, Fizy</div>
          <div className="sidebar-subbrand">Administrator</div>
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
            <span className="admin-name">{adminName}</span>
            <span className="admin-email">{adminEmail}</span>
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
              <button className="dropdown-item">Logout</button>
            </div>
          )}
        </div>

        {/* Mobile: Only avatar, name, dropdown */}
        <div className="admin-header-mobile">
          <div className="admin-header-mobile-profile">
            <img className="profile-avatar" src={avatarUrl} alt={adminName} />
            <div className="admin-name">Fizy Edward</div>
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
                <button className="dropdown-item">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
