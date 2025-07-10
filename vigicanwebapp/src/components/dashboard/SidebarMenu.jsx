import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/SidebarMenu.css";
import { FileText } from "lucide-react";

export default function SidebarMenu({ setCurrentStep }) {
  const [docsOpen, setDocsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // for mobile toggle
  const navigate = useNavigate();

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="hamburger-btn d-md-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <aside
        className={`sidebar-menu d-flex flex-column justify-content-between px-2 py-3 ${
          isOpen ? "open" : ""
        }`}
      >
        <nav>
          <div className="sidebar-section-title mb-4">MENU</div>
          <ul className="sidebar-list list-unstyled mb-0">
            {/* Dashboard */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                style={{ cursor: "pointer" }}
              >
                <span className="sidebar-icon me-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-layout"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </span>
                <span className="sidebar-link-text">Dashboard</span>
              </span>
            </li>

            {/* My Applications */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => setDocsOpen((v) => !v)}
              >
                <span className="sidebar-icon me-2">
                  <FileText size={24} color="#fff" />
                </span>
                <span className="sidebar-link-text fw-bold">Application</span>
                <span
                  className="ms-auto"
                  style={{
                    transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </span>
              </span>
              {docsOpen && (
                <ul className="sidebar-sub-list list-unstyled ms-4 mt-2">
                  <li className="sidebar-sub-item mb-1">
                    <span
                      className="sidebar-sub-link"
                      onClick={() => setCurrentStep("personal-info")}
                    >
                      Bio Data
                    </span>
                  </li>
                  <li className="sidebar-sub-item mb-1">
                    <span
                      className="sidebar-sub-link"
                      onClick={() => setCurrentStep("academic-documents")}
                    >
                      Academic Documents
                    </span>
                  </li>
                  <li className="sidebar-sub-item">
                    <span
                      className="sidebar-sub-link"
                      onClick={() => setCurrentStep("supporting-documents")}
                    >
                      Supporting Documents
                    </span>
                  </li>
                </ul>
              )}
            </li>

            {/* Saved Application */}
            {/*}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => setSavedOpen((v) => !v)}
              >
                <span className="sidebar-icon me-2">💾</span>
                <span className="sidebar-link-text fw-bold">
                  Saved Application
                </span>
                <span
                  className="ms-auto"
                  style={{
                    transform: savedOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </span>
              </span>
              {savedOpen && (
                <ul className="sidebar-sub-list list-unstyled ms-4 mt-2">
                  <li className="sidebar-sub-item mb-1">
                    <span
                      className="sidebar-sub-link"
                      onClick={() => setCurrentStep("saved-personal-info")}
                    >
                      Saved Bio Data
                    </span>
                  </li>
                  <li className="sidebar-sub-item mb-1">
                    <span
                      className="sidebar-sub-link"
                      onClick={() => setCurrentStep("saved-academic-documents")}
                    >
                      Saved Academic Documents
                    </span>
                  </li>
                  <li className="sidebar-sub-item">
                    <span
                      className="sidebar-sub-link"
                      onClick={() =>
                        setCurrentStep("saved-supporting-documents")
                      }
                    >
                      Saved Supporting Documents
                    </span>
                  </li>
                </ul>
              )}
            </li> 
            */}

            {/* Application Status */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => setCurrentStep("application-status")}
              >
                <span className="sidebar-icon me-2">
                  <i className="fas fa-tasks"></i>
                </span>
                <span className="sidebar-link-text">Application Status</span>
              </span>
            </li>

            {/* Inbox */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => setCurrentStep("inbox")}
              >
                <span className="sidebar-icon me-2">
                  <i className="fas fa-inbox"></i>
                </span>
                <span className="sidebar-link-text">Inbox</span>
              </span>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <ul className="sidebar-list list-unstyled mb-0">
            <li className="sidebar-item mb-2">
              <span className="sidebar-link d-flex align-items-center">
                <span className="sidebar-icon me-2">
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                <span className="sidebar-link-text">
                  <Link
                    to="/logout"
                    className="text-white text-decoration-none"
                  >
                    Logout
                  </Link>
                </span>
              </span>
            </li>
            <li className="sidebar-item mb-2">
              <span className="sidebar-link d-flex align-items-center">
                <span className="sidebar-icon me-2">⚙️</span>
                <span className="sidebar-link-text">Settings</span>
              </span>
            </li>
            <li className="sidebar-item">
              <span className="sidebar-link d-flex align-items-center">
                <span className="sidebar-icon me-2">❓</span>
                <span className="sidebar-link-text">Get Help</span>
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
