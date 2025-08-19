import React, { useState } from "react";
//import logo from "../../assets/images/vigica.png";
import logo from "../../assets/images/vigica-vertical-w.png";
import {
  BarChart3,
  FileText,
  Users,
  Upload,
  HelpCircle,
  MessageSquare,
  LogOut,
  Inbox as InboxIcon,
  Send as SendIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./styles/AdminSidebar.css";
import { Link } from "react-router-dom";

export default function AdminSidebar({
  currentStep,
  setCurrentStep,
  isOpen,
  toggleSidebar,
}) {
  const [messagesDropdownOpen, setMessagesDropdownOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "document-review", label: "Document Review", icon: FileText },
    { id: "user-management", label: "User Management", icon: Users },
    { id: "uploaded-files", label: "Uploaded Files", icon: Upload },
    { id: "creation-center", label: "Creation Center", icon: HelpCircle },
    // Messages menu handled below
  ];

  const handleMenuClick = (itemId) => {
    setCurrentStep(itemId);
    if (window.innerWidth < 992 && toggleSidebar) {
      toggleSidebar();
    }
  };

  const handleMessagesDropdown = () => {
    setMessagesDropdownOpen((open) => !open);
  };

  // Determine if inbox/sent is active from currentStep
  const isInboxActive = currentStep === "inbox";
  const isSentActive = currentStep === "sent";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar-redesign ${isOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-content">
          {/* Logo Section */}
          <div className="sidebar-logo-section">
            <div className="sidebar-logo-cicle">
              <img
                src={logo}
                className="sidebar-logo-img me-2"
                alt="Vigica Consult Ltd"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
          </div>
          {/* Make nav scrollable so Logout stays at the bottom */}
          <div className="sidebar-nav-scrollable">
            <nav className="sidebar-nav">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`sidebar-menu-item-redesign ${
                      currentStep === item.id ? "active" : ""
                    }`}
                  >
                    <Icon size={20} className="menu-icon" />
                    <span className="menu-text">{item.label}</span>
                  </button>
                );
              })}
              {/* Messages Dropdown */}
              <div className="sidebar-dropdown-container">
                <button
                  className={`sidebar-menu-item-redesign sidebar-dropdown-toggle ${
                    isInboxActive || isSentActive ? "active" : ""
                  }`}
                  onClick={handleMessagesDropdown}
                  aria-expanded={messagesDropdownOpen}
                >
                  <MessageSquare size={20} className="menu-icon" />
                  <span className="menu-text">Messages</span>
                  {messagesDropdownOpen ? (
                    <ChevronUp size={18} style={{ marginLeft: "auto" }} />
                  ) : (
                    <ChevronDown size={18} style={{ marginLeft: "auto" }} />
                  )}
                </button>
                {messagesDropdownOpen && (
                  <div className="sidebar-dropdown-list">
                    <button
                      onClick={() => handleMenuClick("inbox")}
                      className={`sidebar-menu-item-redesign sidebar-dropdown-item ${
                        isInboxActive ? "active" : ""
                      }`}
                    >
                      <InboxIcon size={17} className="menu-icon" />
                      <span className="menu-text">Inbox</span>
                    </button>
                    <button
                      onClick={() => handleMenuClick("sent")}
                      className={`sidebar-menu-item-redesign sidebar-dropdown-item ${
                        isSentActive ? "active" : ""
                      }`}
                    >
                      <SendIcon size={17} className="menu-icon" />
                      <span className="menu-text">Sent</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
          {/* Logout always at bottom */}
          <div className="sidebar-logout-container">
            <button
              onClick={() => handleMenuClick("logout")}
              className="sidebar-menu-item-redesign logout-btn"
            >
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
