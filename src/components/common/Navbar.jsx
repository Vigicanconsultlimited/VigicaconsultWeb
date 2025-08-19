import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Navbar.css";
<<<<<<< HEAD
//import logo from "../../assets/images/vigica.png";
import logo2 from "../../assets/images/vigicaV2.png";
=======
import logo from "../../assets/images/vigica.png";
>>>>>>> 1748a5e68d38906a8dfe30d72ef9dec426031c60

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
<<<<<<< HEAD
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-0">
=======
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
>>>>>>> 1748a5e68d38906a8dfe30d72ef9dec426031c60
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Logo Image - adjust width/height as needed */}
          <img
<<<<<<< HEAD
            src={logo2}
            alt="Vigica Consult Ltd"
            className="me-2"
            style={{ width: "200px", height: "auto" }}
          />

          {/* Company Name Text */}
          {/*}
=======
            src={logo}
            alt="Vigica Consult Ltd"
            className="me-2"
            style={{ width: "60px", height: "auto" }}
          />

          {/* Company Name Text */}
>>>>>>> 1748a5e68d38906a8dfe30d72ef9dec426031c60
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
<<<<<<< HEAD
          */}
=======
>>>>>>> 1748a5e68d38906a8dfe30d72ef9dec426031c60
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
<<<<<<< HEAD
                Accommodation Services
=======
                Hotel services
>>>>>>> 1748a5e68d38906a8dfe30d72ef9dec426031c60
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
