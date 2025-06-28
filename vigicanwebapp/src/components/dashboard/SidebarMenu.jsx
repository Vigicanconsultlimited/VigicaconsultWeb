import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/SidebarMenu.css";

export default function SidebarMenu() {
  const [docsOpen, setDocsOpen] = useState(true);

  return (
    <aside className="sidebar-menu d-flex flex-column justify-content-between px-3 py-3">
      <nav>
        <div className="sidebar-section-title mb-4">MENU</div>
        <ul className="sidebar-list list-unstyled mb-0">
          <li className="sidebar-item mb-2">
            <span className="sidebar-link d-flex align-items-center">
              <span className="sidebar-icon me-2">
                {/* Onboarding Icon */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="10"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <path
                    d="M11 13.5c2.5 0 4.5 1 4.5 2.5v1H6.5v-1c0-1.5 2-2.5 4.5-2.5z"
                    fill="#fff"
                  />
                  <circle cx="11" cy="9" r="2" fill="#fff" />
                </svg>
              </span>
              <span className="sidebar-link-text">Onboarding</span>
            </span>
          </li>
          <li className="sidebar-item mb-2">
            <span
              className="sidebar-link d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => setDocsOpen((v) => !v)}
            >
              <span className="sidebar-icon me-2">
                {/* Documents Icon */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="10"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 11.5l2 2 4-4"
                    stroke="#fff"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
              <span className="sidebar-link-text fw-bold">My Documents</span>
              <span className="ms-auto">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transition: "transform 0.2s",
                    transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
            {docsOpen && (
              <ul className="sidebar-sub-list list-unstyled ms-4 mt-2">
                <li className="sidebar-sub-item mb-1">
                  <span className="sidebar-sub-link">Required Documents</span>
                </li>
                <li className="sidebar-sub-item mb-1">
                  <span className="sidebar-sub-link">Upload Document</span>
                </li>
                <li className="sidebar-sub-item">
                  <span className="sidebar-sub-link">Document Status</span>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <ul className="sidebar-list list-unstyled mb-0">
          <li className="sidebar-item mb-2">
            <span className="sidebar-link d-flex align-items-center">
              <span className="sidebar-icon me-2">
                {/* Logout Icon */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="10"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <rect
                    x="6"
                    y="6"
                    width="6"
                    height="10"
                    rx="2"
                    stroke="#fff"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M15.5 11H9.5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13.5 9L15.5 11L13.5 13"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sidebar-link-text text-decoration-none text-white">
                <Link to="/logout">Logout</Link>
              </span>
            </span>
          </li>
          <li className="sidebar-item mb-2">
            <span className="sidebar-link d-flex align-items-center">
              <span className="sidebar-icon me-2">
                {/* Settings Icon */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="10"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <path
                    d="M11 8v5M8 11h6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="sidebar-link-text">Settings</span>
            </span>
          </li>
          <li className="sidebar-item">
            <span className="sidebar-link d-flex align-items-center">
              <span className="sidebar-icon me-2">
                {/* Help Icon */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="10"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <path
                    d="M11 15h0M11 13.5V14m0-5.75a2.25 2.25 0 0 1 2.25 2.25c0 1.5-2.25 2-2.25 2"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="sidebar-link-text">Get Help</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
