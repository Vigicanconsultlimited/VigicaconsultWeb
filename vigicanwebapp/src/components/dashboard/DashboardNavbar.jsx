import React, { useEffect, useState } from "react";
import logo from "../../assets/images/vigica.png";
import profile from "../../assets/images/default-profile.jpg";
import "./styles/DashboardNavbar.css";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";

export default function DashboardNavbar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.allUserData);

  const email =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const userId = user?.uid;

  const [displayName, setDisplayName] = useState("");

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
    <nav className="dashboard-navbar d-flex align-items-center px-3 px-md-4 mb-3">
      {/* Logo Section */}
      <div className="d-flex align-items-center me-4">
        <img src={logo} alt="Vigica Logo" className="dashboard-navbar-logo" />
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
          src={profile}
          alt="User"
          className="dashboard-navbar-avatar me-2"
        />
        <div className="d-none d-md-block">
          <span
            className="dashboard-navbar-user fw-medium text-white"
            style={{ fontSize: 15 }}
          >
            {isLoggedIn()
              ? displayName || user?.fullName || email || "Hi"
              : "Guest User"}
          </span>
          <div
            className="dashboard-navbar-email text-white"
            style={{ fontSize: 12 }}
          >
            {email || "guest@example.com"}
          </div>
        </div>
      </div>
    </nav>
  );
}
