import React from "react";
//import "../../styles/Contactbar.css";
import {
  FaPhone,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ContactBar = () => {
  return (
    <div className="contact-bar bg-primary text-white py-2">
      <div className="container">
        <div className="row align-items-center gx-2 mx-0 px-2 px-md-0">
          {/* Address - shows on all screens */}
          <div className="col-12 col-md-auto py-1 py-md-0 text-center text-md-start me-md-4">
            <div className="text-white text-decoration-none d-inline-flex align-items-center contact-item">
              <FaMapMarkerAlt className="me-2" />
              <span>Plot 114/115, Okay Water, Lugbe, Abuja</span>
            </div>
          </div>

          {/* Contact Info - stacks on mobile */}
          <div className="col-12 col-md-auto py-1 py-md-0 me-md-5">
            <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
              <a
                href="tel:+2348186482048"
                className="text-white text-decoration-none d-inline-flex align-items-center contact-item"
              >
                <FaPhone className="me-2" />
                <span>+234 818 648 2048</span>
              </a>

              <a
                href="mailto:info@vigicaconsult.com"
                className="text-white text-decoration-none d-inline-flex align-items-center contact-item"
              >
                <FaEnvelope className="me-2" />
                <span>info@vigicaconsult.com</span>
              </a>
            </div>
          </div>

          {/* Hours & Social - stacks on mobile */}
          <div className="col-12 col-md-auto py-1 py-md-0 ms-md-6">
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 gap-md-4">
              <div className="d-flex align-items-center hours me-md-4">
                <FaClock className="me-1" />
                <small>Mon. - Sat: 9:00am-6:00pm</small>
              </div>

              <div className="social-icons d-flex gap-3">
                <a href="#" className="text-white">
                  <FaInstagram />
                </a>
                <a href="#" className="text-white">
                  <FaTwitter />
                </a>
                <a href="#" className="text-white">
                  <FaFacebook />
                </a>
                <a href="#" className="text-white">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
