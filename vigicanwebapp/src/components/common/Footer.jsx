import React from "react";
import footerLogo from "../../assets/images/logo-footer.png";
import "../../styles/Footer.css";

const Footer = () => (
  <footer className="footer-section footer-variant-2">
    <div className="container">
      <div className="footer-header-row d-flex justify-content-between align-items-start mb-3">
        <div className="footer-logo mb-3">
          <div className="logo-icon-variant2 d-flex align-items-center justify-content-center">
            <img
              src={footerLogo}
              alt="Vigica Consult Ltd"
              className="me-2"
              style={{ width: "60px", height: "auto" }}
            />
          </div>
          <div className="logo-text-variant2">
            <strong>VigIca Consult</strong>
            <span>Limited</span>
          </div>
        </div>
        <div className="footer-social-icons mt-1">
          <a href="#" className="footer-social-btn">
            <i className="fa-brands fa-telegram"></i>
          </a>
          <a href="#" className="footer-social-btn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="#" className="footer-social-btn">
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="#" className="footer-social-btn">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
        </div>
      </div>
      <hr className="footer-divider-variant2" />

      <div className="row mt-4">
        <div className="col-lg-5 col-md-6 mb-4">
          <div className="footer-column">
            <h4 className="footer-title-variant2">About Us</h4>
            <p className="footer-description-variant2">
              Lorem ipsumroin porta ex et nisl condorm posuere.
              Vivamussodalerders pellentesque ullamcorper mollis velit porta ex
              et nisl condorm nisl ullamcorper condorm posuere. Lorem ipsumroin
              porta ex et nisl condorm posuere. Vivamussodalerders pellentesque
              ullamcorper mollis velit porta ex et nisl condorm nisl ullamcorper
              condorm posuere. corper mollis velit porta ex et nisl condorm nisl
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
            <h4 className="footer-title-variant2">Subscribe Our Newsletter</h4>
            <p className="footer-description-variant2">
              Lorem ipsumroin porta ex et nisl condorm posuere.
              Vivamussodalerders pellentesque ullamcorper mollis.
            </p>
            <form className="footer-newsletter-form-variant2 d-flex align-items-center">
              <input
                type="email"
                className="form-control newsletter-input-variant2"
                placeholder="Your E-mail"
              />
              <button className="btn newsletter-btn-variant2" type="button">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
