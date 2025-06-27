import React from "react";
import "./styles/DashboardNavbar.css";

export default function DashboardNavbar() {
  return (
    <nav className="dashboard-navbar d-flex align-items-center px-3 px-md-4">
      {/* Logo Section */}
      <div className="d-flex align-items-center me-4">
        <img
          src="/assets/images/logo.png" // Replace with your logo path
          alt="Vigica Logo"
          className="dashboard-navbar-logo"
        />
        <div className="d-none d-md-block ms-2">
          <span className="dashboard-navbar-brand fw-bold">VIGICA</span>
          <div
            className="dashboard-navbar-sub text-white-50"
            style={{ fontSize: 10 }}
          >
            CONSULT LIMITED
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <form className="dashboard-navbar-search flex-grow-1 mx-2 mx-md-4">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-0 ps-3">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2" />
              <path
                d="M20 20L16.65 16.65"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="text"
            className="form-control bg-transparent border-0 text-white"
            style={{ fontWeight: 500, fontSize: 16 }}
            placeholder="Search"
            aria-label="Search"
          />
        </div>
      </form>
      {/* User Section */}
      <div className="d-flex align-items-center ms-auto">
        <img
          src="/assets/images/user-profile.jpg" // Replace with the user's profile image path
          alt="User"
          className="dashboard-navbar-avatar me-2"
        />
        <div className="d-none d-md-block">
          <span
            className="dashboard-navbar-user fw-medium text-white"
            style={{ fontSize: 15 }}
          >
            Charles Sopuruchi
          </span>
          <div
            className="dashboard-navbar-email text-white-50"
            style={{ fontSize: 12 }}
          >
            charles_sopuruchukwu26@gmail.com
          </div>
        </div>
      </div>
    </nav>
  );
}
