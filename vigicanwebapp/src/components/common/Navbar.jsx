import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Navbar.css";
import logo from "../../assets/images/VIGICAlogo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Logo Image - adjust width/height as needed */}
          <img
            src={logo}
            alt="Vigica Consult Ltd"
            className="me-2"
            style={{ width: "60px", height: "auto" }}
          />

          {/* Company Name Text */}
          <div>
            <span
              className="d-block fs-3 fw-extrabold"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: "#2135b0",
              }}
            >
              VIGICA CONSULT
            </span>
            <span
              className="d-block fs-4"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#2135b0" }}
            >
              Limited
            </span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul
            className="navbar-nav ms-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/about">
                About us
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/study-abroad">
                Study Abroad
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/visa-guide">
                Visa Guide
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/flight-booking">
                Flight Booking
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/hotel-services">
                Hotel services
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
