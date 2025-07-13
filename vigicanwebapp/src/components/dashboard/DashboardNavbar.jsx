import React, { useEffect, useState } from "react";
import logo from "../../assets/images/vigica.png";
import profile from "../../assets/images/default-profile.jpg";
import "./styles/DashboardNavbar.css";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";

export default function DashboardNavbar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.allUserData);
  const [displayName, setDisplayName] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const email =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const userId = user?.uid;

  useEffect(() => {
    const fetchName = async () => {
      try {
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`
        );
        const personalInfoId = personalRes?.data?.result?.id;

        if (personalInfoId) {
          const submittedAppRes = await apiInstance.get(
            `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
          );
          const personalData =
            submittedAppRes?.data?.result?.personalInformation;

          if (personalData?.firstName) {
            setDisplayName(`${personalData.firstName}`);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch display name:", error);
      }
    };

    if (userId) fetchName();
  }, [userId]);

  return (
    <nav className="dashboard-navbar d-flex align-items-center justify-content-between px-3 px-md-4 mb-3">
      <div className="dashboard-navbar-container d-flex align-items-center w-100">
        <div className="dashboard-navbar-left d-flex align-items-center">
          {/* Mobile Centered Logo */}
          <div className="d-flex d-lg-none flex-column text-center w-100">
            <img
              src={logo}
              alt="Vigica Logo"
              className="dashboard-navbar-logo mx-auto mb-1"
            />
            <span className="dashboard-navbar-brand fw-bold text-white">
              VIGICA
            </span>
            <div
              className="dashboard-navbar-sub text-white-50"
              style={{ fontSize: 10 }}
            >
              CONSULT LIMITED
            </div>
          </div>

          {/* Desktop Left Logo */}
          <div className="d-none d-lg-flex align-items-center">
            <img
              src={logo}
              alt="Vigica Logo"
              className="dashboard-navbar-logo me-2"
            />
            <div className="d-none d-md-block">
              <span className="dashboard-navbar-brand fw-bold text-white">
                VIGICA
              </span>
              <div
                className="dashboard-navbar-sub text-white-50"
                style={{ fontSize: 10 }}
              >
                CONSULT LIMITED
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Search */}
        <div className="dashboard-navbar-center flex-grow-1 d-none d-lg-flex justify-content-center">
          <form
            className="dashboard-navbar-search"
            style={{ maxWidth: "500px", width: "100%" }}
          >
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
                className="form-control dashboard-search-input bg-transparent border-0 text-white"
                placeholder="Search"
                aria-label="Search"
              />
            </div>
          </form>
        </div>

        {/* Right: Profile and Mobile Search Icon */}
        <div className="dashboard-navbar-right d-flex align-items-center ms-auto">
          {/*}
          <button
            className="btn d-lg-none me-2"
            onClick={() => setIsSearchActive(true)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2" />
              <path
                d="M20 20L16.65 16.65"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          */}
          <div className="d-flex align-items-center">
            <img
              src={profile}
              alt="User"
              className="dashboard-navbar-avatar me-2"
            />
            <div className="d-none d-md-block text-white">
              <span className="dashboard-navbar-user fw-medium">
                {isLoggedIn()
                  ? displayName || user?.fullName || email || "Hi"
                  : "Guest User"}
              </span>
              <div
                className="dashboard-navbar-email text-white-50"
                style={{ fontSize: 12 }}
              >
                {email || "guest@example.com"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search View 
      {isSearchActive && (
        <div className="d-flex align-items-center w-100 d-lg-none mt-2">
          <button className="btn me-2" onClick={() => setIsSearchActive(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 5L5 19M5 5l14 14"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <form className="flex-grow-1">
            <input
              type="text"
              className="form-control dashboard-search-input bg-transparent border-0 text-white"
              placeholder="Search..."
              autoFocus
            />
          </form>
        </div>
      )}
        */}
    </nav>
  );
}
