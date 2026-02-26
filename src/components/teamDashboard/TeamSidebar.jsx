import React, { useState } from "react";
import logo from "../../assets/images/vigica-vertical-w.png";
import {
  BarChart3,
  Calendar,
  Clock,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  CalendarCheck,
  CalendarClock,
  UserCog,
  Edit3,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./styles/TeamSidebar.css";

export default function TeamSidebar({
  currentSection,
  setCurrentSection,
  isOpen,
  toggleSidebar,
}) {
  const [appointmentsDropdownOpen, setAppointmentsDropdownOpen] = useState(
    currentSection === "appointments" ||
      currentSection === "availability" ||
      currentSection === "upcoming",
  );
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(
    currentSection === "edit-profile" || currentSection === "settings",
  );

  const handleMenuClick = (sectionId) => {
    setCurrentSection(sectionId);
    if (window.innerWidth < 992 && toggleSidebar) {
      toggleSidebar();
    }
  };

  const handleAppointmentsDropdown = () => {
    setAppointmentsDropdownOpen((open) => !open);
  };

  const handleProfileDropdown = () => {
    setProfileDropdownOpen((open) => !open);
  };

  // Determine active states
  const isAppointmentSection = [
    "appointments",
    "availability",
    "upcoming",
  ].includes(currentSection);
  const isProfileSection = ["edit-profile", "settings"].includes(
    currentSection,
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`team-sidebar-redesign ${isOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-content">
          {/* Logo Section */}
          <div className="sidebar-logo-section">
            <div className="sidebar-logo-circle">
              <img
                src={logo}
                className="sidebar-logo-img me-2"
                alt="Vigica Consult Ltd"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="sidebar-nav-scrollable">
            <nav className="sidebar-nav">
              {/* Overview */}
              <button
                onClick={() => handleMenuClick("overview")}
                className={`sidebar-menu-item-redesign ${
                  currentSection === "overview" ? "active" : ""
                }`}
              >
                <BarChart3 size={20} className="menu-icon" />
                <span className="menu-text">Overview</span>
              </button>

              {/* Manage Appointments Dropdown */}
              <div className="sidebar-dropdown-container">
                <button
                  className={`sidebar-menu-item-redesign sidebar-dropdown-toggle ${
                    isAppointmentSection ? "active" : ""
                  }`}
                  onClick={handleAppointmentsDropdown}
                  aria-expanded={appointmentsDropdownOpen}
                >
                  <Calendar size={20} className="menu-icon" />
                  <span className="menu-text">Manage Appointments</span>
                  {appointmentsDropdownOpen ? (
                    <ChevronUp size={18} style={{ marginLeft: "auto" }} />
                  ) : (
                    <ChevronDown size={18} style={{ marginLeft: "auto" }} />
                  )}
                </button>
                {appointmentsDropdownOpen && (
                  <div className="sidebar-dropdown-list">
                    <button
                      onClick={() => handleMenuClick("appointments")}
                      className={`sidebar-menu-item-redesign sidebar-dropdown-item ${
                        currentSection === "appointments" ? "active" : ""
                      }`}
                    >
                      <CalendarCheck size={17} className="menu-icon" />
                      <span className="menu-text">All Appointments</span>
                    </button>
                    <button
                      onClick={() => handleMenuClick("availability")}
                      className={`sidebar-menu-item-redesign sidebar-dropdown-item ${
                        currentSection === "availability" ? "active" : ""
                      }`}
                    >
                      <Clock size={17} className="menu-icon" />
                      <span className="menu-text">Availability</span>
                    </button>
                    <button
                      onClick={() => handleMenuClick("upcoming")}
                      className={`sidebar-menu-item-redesign sidebar-dropdown-item ${
                        currentSection === "upcoming" ? "active" : ""
                      }`}
                    >
                      <CalendarClock size={17} className="menu-icon" />
                      <span className="menu-text">Upcoming</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Manage Profile Dropdown */}
              <div className="sidebar-dropdown-container">
                <button
                  className={`sidebar-menu-item-redesign sidebar-dropdown-toggle ${
                    isProfileSection ? "active" : ""
                  }`}
                  onClick={handleProfileDropdown}
                  aria-expanded={profileDropdownOpen}
                >
                  <User size={20} className="menu-icon" />
                  <span className="menu-text">Manage Profile</span>
                  {profileDropdownOpen ? (
                    <ChevronUp size={18} style={{ marginLeft: "auto" }} />
                  ) : (
                    <ChevronDown size={18} style={{ marginLeft: "auto" }} />
                  )}
                </button>
                {profileDropdownOpen && (
                  <div className="sidebar-dropdown-list">
                    <button
                      onClick={() => handleMenuClick("edit-profile")}
                      className={`sidebar-menu-item-redesign sidebar-dropdown-item ${
                        currentSection === "edit-profile" ? "active" : ""
                      }`}
                    >
                      <Edit3 size={17} className="menu-icon" />
                      <span className="menu-text">Edit Profile</span>
                    </button>
                    <button
                      onClick={() => handleMenuClick("settings")}
                      className={`sidebar-menu-item-redesign sidebar-dropdown-item ${
                        currentSection === "settings" ? "active" : ""
                      }`}
                    >
                      <Settings size={17} className="menu-icon" />
                      <span className="menu-text">Settings</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Logout at bottom */}
          <div className="sidebar-logout-container">
            <button className="sidebar-menu-item-redesign logout-btn">
              <LogOut size={20} className="menu-icon" />
              <span className="menu-text">
                <Link to="/logout" className="text-decoration-none text-reset">
                  Logout
                </Link>
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
