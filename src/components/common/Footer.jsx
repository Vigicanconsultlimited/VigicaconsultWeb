import React from "react";
//import footerLogo from "../../assets/images/logo-footer.png";
import footerLogo from "../../assets/images/vigica-v2w.png";
import "../../styles/Footer.css";

const Footer = () => (
  <footer className="footer-section footer-variant-2">
    <div className="container">
      <div className="footer-header-row d-flex justify-content-between align-items-start mb-3">
        <img src={footerLogo} alt="Vigica Consult Ltd" className="w-35 h-12" />
        <div className="footer-social-icons mt-1">
          <a href="http://t.me/vigica_1" className="footer-social-btn">
            <i className="fa-brands fa-telegram"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/vigica-consult-limited/about/?viewAsMember=true"
            className="footer-social-btn"
          >
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a
            href="https://x.com/vigicaconsult?t=_E90eYcUQ-mPotS-MhX4Mw&s=09"
            className="footer-social-btn"
          >
            <i className="fa-brands fa-twitter"></i>
          </a>

          <a
            href="https://www.instagram.com/vigicaconsult/"
            className="footer-social-btn"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61579196807381"
            className="footer-social-btn"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a
            href="http://tiktok.com/@vigicaconsult"
            className="footer-social-btn"
          >
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>
      </div>
      <hr className="footer-divider-variant2" />

      <div className="row mt-4">
        <div className="col-lg-5 col-md-6 mb-4">
          <div className="footer-column">
            <h4 className="footer-title-variant2">About Us</h4>
            <p className="footer-description-variant2">
              Vigica Consult is your trusted partner for study abroad, travel,
              and hotel bookings. We provide personalized visa application
              guidance, scholarship support, and pre-departure orientation. Our
              team is dedicated to making your study abroad journey smooth and
              successful.
            </p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="footer-column">
            <h4 className="footer-title-variant2">Service Menu</h4>
            <ul className="footer-links-variant2">
              <li>
                <i className="fa-solid fa-check"></i> University Finder
              </li>
              <li>
                <i className="fa-solid fa-check"></i> Student Application
              </li>
              <li>
                <i className="fa-solid fa-check"></i> Document Review
              </li>
              <li>
                <i className="fa-solid fa-check"></i> Visa Assistance
              </li>
              <li>
                <i className="fa-solid fa-check"></i> Flight Booking
              </li>
              <li>
                <i className="fa-solid fa-check"></i> Hotel Reservation
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 mb-4">
          <div className="footer-column">
            <h4 className="text-2xl font-bold text-white mb-3">
              Subscribe Our Newsletter
            </h4>
            <p className="text-base text-gray-200 mb-5">
              Stay updated with the latest news and offers from Vigica Consult.
              Subscribe to our newsletter for exclusive content and updates.
            </p>

            {/* Minimalist form with small icon button */}
            <form className="mt-4 w-full max-w-md">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your E-mail"
                  aria-label="Your email address"
                  required
                  className="w-full py-3 px-4 rounded-lg text-gray-700 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-transparent text-blue-600 hover:text-blue-800 focus:outline-none transition-colors duration-200"
                >
                  <i className="fas fa-arrow-right text-lg"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
