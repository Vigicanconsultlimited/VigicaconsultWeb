import React, { useEffect, useState } from "react";
import logo from "../../assets/images/vigica-vertical-w.png";
import profile from "../../assets/images/default-profile.jpg";
import "./styles/DashboardNavbar.css";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";


export default function DashboardNavbar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.allUserData);
  const [displayName, setDisplayName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [logoError, setLogoError] = useState(false);

  const email =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const userId = user?.uid;

  useEffect(() => {
    const fetchName = async () => {
      try {
        if (!userId) return;
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`
        );
        const personalInfoId = personalRes?.data?.result?.id;
        if (!personalInfoId) return;
        const submittedAppRes = await apiInstance.get(
          `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
        );
        const personalData = submittedAppRes?.data?.result?.personalInformation;
        if (personalData?.firstName) setDisplayName(personalData.firstName);
      } catch (e) {
        console.warn("Failed to fetch display name:", e);
      }
    };
    fetchName();
  }, [userId]);

  return (
    <nav className="dashboard-navbar px-3 px-md-4 mb-3">
      <div className="dashboard-navbar-container">
        {/* Desktop Section */}
        <div className="navbar-desktop d-none d-lg-flex align-items-center w-100">
          {/* Left: Desktop Logo */}
          <div className="dashboard-navbar-left">
            <a href="/" className="desktop-logo-wrapper">
              {!logoError ? (
                <img
                  src={logo}
                  alt="Vigica Consult Ltd"
                  className="desktop-logo"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="logo-fallback-text">Vigica</span>
              )}
            </a>
          </div>

          {/* Center: Desktop Search */}
          <div className="dashboard-navbar-center flex-grow-1 d-flex justify-content-center">
            <form
              className="dashboard-navbar-search w-100"
              style={{ maxWidth: 500 }}
              autoComplete="off"
            >
              <div className="input-group dashboard-search-group">
                <span className="input-group-text dashboard-search-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                      stroke="#fff"
                      strokeWidth="2"
                    />
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
                  className="dashboard-search-input-working"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right: Desktop Profile */}
          <div className="dashboard-navbar-right d-flex align-items-center">

            <img
              src={profile}
              alt="User"
              className="dashboard-navbar-avatar me-2"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <div className="text-white">
              <span className="dashboard-navbar-user fw-medium">
                {isLoggedIn()
                  ? displayName || user?.fullName || email || "Hi"
                  : "Guest User"}
              </span>
              <div className="dashboard-navbar-email text-white-50">
                {email || "guest@example.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Section */}
        <div className="navbar-mobile d-lg-none">
          <div className="nav-mobile-inner">
            {/* Left placeholder (e.g., menu button slot) */}
            <div className="nav-mobile-left">
              {/* If you have a hamburger, place it here. Example placeholder box:
              <button className="menu-btn" aria-label="Menu">☰</button>
              */}
            </div>

            {/* Centered Logo (absolutely centered) */}
            <div className="nav-mobile-center">
              {!logoError ? (
                <img
                  src={logo}
                  alt="Vigica Consult Ltd"
                  className="mobile-logo"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="logo-fallback-text small">Vigica</span>
              )}
            </div>

            {/* Right: User mini profile */}
            <div className="nav-mobile-right">
              <img
                src={profile}
                alt="User"
                className="dashboard-navbar-avatar mobile-avatar"
              />
              <div className="mobile-user-info text-white">
                <div className="mobile-user-line">
                  {isLoggedIn() ? displayName || email || "Hi" : "Guest"}
                </div>
                <div className="mobile-user-sub text-white-50">
                  {(isLoggedIn() && email) || "guest@example.com"}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Mobile Section */}

      </div>
    </nav>
  );
}
