import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/SidebarMenu.css";

export default function SidebarMenu({ setCurrentStep }) {
  const [docsOpen, setDocsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // for mobile toggle

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
            {/* My Application */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => setDocsOpen((v) => !v)}
              >
                <span className="sidebar-icon me-2">📄</span>
                <span className="sidebar-link-text fw-bold">
                  My Application
                </span>
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

            {/* Application Status */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => setCurrentStep("application-status")}
              >
                <span className="sidebar-icon me-2">📊</span>
                <span className="sidebar-link-text">Application Status</span>
              </span>
            </li>

            {/* Inbox */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => setCurrentStep("inbox")}
              >
                <span className="sidebar-icon me-2">📥</span>
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
                <span className="sidebar-icon me-2">🚪</span>
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
