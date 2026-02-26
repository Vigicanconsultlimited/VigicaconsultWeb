import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import { Link } from "react-router-dom";
import logo from "../../assets/images/vigica-white-spread.png";
import profile from "../../assets/images/default-profile.jpg";
import { ChevronDown, Menu } from "lucide-react";
import "./styles/TeamHeader.css";

export default function TeamHeader({ toggleSidebar, teamUser }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarUrl = teamUser?.profile_picture_url || profile;

  const userName =
    teamUser?.first_name && teamUser?.last_name
      ? `${teamUser.first_name} ${teamUser.last_name}`
      : teamUser?.email || "Team Member";

  const userPosition = teamUser?.position || "Team Member";

  return (
    <header className="team-header-redesign">
      <div className="team-header-bar">
        {/* Hamburger for mobile */}
        <button
          className="header-hamburger-btn"
          aria-label="Open sidebar"
          onClick={toggleSidebar}
        >
          <Menu size={28} />
        </button>

        {/* Mobile: Vigica logo and brand */}
        <div className="team-header-mobile-logo">
          <img
            src={logo}
            className="mobile-logo-img me-2"
            alt="Vigica Consult Ltd"
          />
        </div>
        <div className="team-name-container">
          <div className="sidebar-brand">Hello, {userName.split(" ")[0]}</div>
          <div className="sidebar-subbrand">{userPosition}</div>
        </div>

        {/* Desktop: Profile and dropdown */}
        <div className="team-header-desktop-profile">
          <img
            className="profile-avatar"
            src={avatarUrl}
            alt={userName}
            onClick={() => setDropdownOpen((o) => !o)}
            style={{ cursor: "pointer" }}
            onError={(e) => {
              e.target.src = profile;
            }}
          />
          <div className="profile-details">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userPosition}</span>
          </div>
          <ChevronDown
            size={18}
            className={`dropdown-chevron ${dropdownOpen ? "open" : ""}`}
            onClick={() => setDropdownOpen((o) => !o)}
            style={{ cursor: "pointer" }}
          />

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <img
                  src={avatarUrl}
                  alt={userName}
                  onError={(e) => {
                    e.target.src = profile;
                  }}
                />
                <div>
                  <p className="dropdown-name">{userName}</p>
                  <p className="dropdown-email">{teamUser?.email}</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/team" className="dropdown-item">
                View Team Page
              </Link>
              <Link to="/logout" className="dropdown-item logout">
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
