import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/SidebarMenu.css";
//import logo from "../../assets/images/vigica-vertical-w.png";
import { FileText } from "lucide-react";

export default function SidebarMenu({ setCurrentStep }) {
  const [docsOpen, setDocsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Toggle sidebar and prevent body scroll when sidebar is open
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        document.body.classList.remove("sidebar-open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("sidebar-open");
    };
  }, []);

  // Close sidebar when a menu item is clicked on mobile
  const handleMenuItemClick = (step) => {
    setCurrentStep(step);
    if (window.innerWidth < 768) {
      setIsOpen(false);
      document.body.classList.remove("sidebar-open");
    }
  };

  // Close sidebar when component unmounts
  useEffect(() => {
    return () => {
      setIsOpen(false);
      document.body.classList.remove("sidebar-open");
    };
  }, []);

  return (
    <>
      {/* Enhanced Hamburger Button with ref */}
      <button
        ref={hamburgerRef}
        className="hamburger-btn d-md-none"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <i className={`fas fa-${isOpen ? "times" : "bars"}`}></i>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay d-md-none"></div>}

      <aside
        ref={sidebarRef}
        className={`sidebar-menu d-flex flex-column justify-content-between px-2 py-3 ${
          isOpen ? "open" : ""
        }`}
      >
        {/* Close button for mobile */}
        <button
          className="sidebar-close-btn d-md-none"
          onClick={() => {
            setIsOpen(false);
            document.body.classList.remove("sidebar-open");
          }}
          aria-label="Close menu"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* User Information */}

        <nav>
          {/*<div className="sidebar-header mb-4">
            <div className="sidebar-logo">
              <img src={logo} alt="Logo" style={{ height: "40px" }} />
            </div>
            <span className="sidebar-link-text">Menu</span>
          </div>*/}

          <ul className="sidebar-list list-unstyled mb-0">
            {/* Dashboard */}
            <li className="sidebar-item mb-2 mt-6 sidebar-first-text">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => {
                  window.location.href = "/dashboard";
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                    document.body.classList.remove("sidebar-open");
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <span className="sidebar-icon me-2">
                  <i className="fas fa-tachometer-alt"></i>
                </span>
                <span className="sidebar-link-text">Dashboard</span>
              </span>
            </li>

            {/* My Application */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => handleMenuItemClick("personal-info")}
              >
                <span className="sidebar-icon me-2">
                  <i className="fas fa-file-alt"></i>
                </span>
                <span className="sidebar-link-text fw-bold">
                  My Application
                </span>
              </span>
            </li>

            {/* Application Status */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => handleMenuItemClick("application-status")}
              >
                <span className="sidebar-icon me-2">
                  <i className="fas fa-tasks"></i>
                </span>
                <span className="sidebar-link-text">Document Status</span>
              </span>
            </li>

            {/* Inbox */}
            <li className="sidebar-item mb-2">
              <span
                className="sidebar-link d-flex align-items-center"
                onClick={() => handleMenuItemClick("inbox")}
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
                  <i className="fas fa-cog"></i>
                </span>
                <span className="sidebar-link-text">Settings</span>
              </span>
            </li>
            <li className="sidebar-item mb-2">
              <span className="sidebar-link d-flex align-items-center">
                <span className="sidebar-icon me-2">
                  <i className="fas fa-question-circle"></i>
                </span>
                <span className="sidebar-link-text">Get Help</span>
              </span>
            </li>
            <li className="sidebar-item">
              <Link
                to="/logout"
                className="sidebar-link d-flex align-items-center text-decoration-none"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                    document.body.classList.remove("sidebar-open");
                  }
                }}
              >
                <span className="sidebar-icon me-2">
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                <span className="sidebar-link-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
