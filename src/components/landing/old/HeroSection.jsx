import React from "react";
import { Link } from "react-router-dom";

import "./HeroSection.css";
import heroBackgroundImage from "../../assets/images/hero_image.png";
import scrollIcon from "../../assets/images/scroll_icon.png";

const HeroSection = () => (
  <>
    {/* Hero Image Area */}
    <section
      className="hero-section-container position-relative text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.1) 100%), url(${heroBackgroundImage})`,
      }}
    >
      {/* Main Content Box */}
      <div className="hero-content-box z-1 p-4 rounded d-flex flex-column align-items-start text-start mx-3 mx-md-auto mb-5">
        <h2 className="hero-headline m-0">
          Your trusted pathway to
          <br />
          <span className="hero-headline-strong d-block">
            GLOBAL OPPORTUNITIES
          </span>
          with Personal Touch
        </h2>
        <br />
        <p className="hero-paragraph text-white mb-2">
          A multidimensional consultancy firm offering specialized services in
          international education recruitment, advisory, programme coordination,
          travel logistics, and accommodation solutions.
        </p>
        <Link to="/register" className="text-decoration-none">
          <button className="btn hero-button text-white py-2 px-4 py-md-3 px-md-3 border-0 d-inline-flex align-items-center mb-5">
            <span
              className="hero-button-icon me-2 d-inline-flex align-items-center justify-content-center"
              style={{
                background: "none",
                borderRadius: 8,
                width: 30,
                height: 30,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Calendar (blue) */}
              <svg
                width="30"
                height="17"
                viewBox="0 0 29 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  display: "block",
                  width: "85%",
                  height: "85%",

                  left: 0,
                  top: 0,
                }}
              >
                <path
                  d="M26.9476 0H22.261V3.5H19.9178V0H15.2312V3.5H12.888V0H8.20144V3.5H5.85817V0H1.17163C0.860897 0 0.562888 0.122916 0.343164 0.341709C0.12344 0.560501 0 0.857247 0 1.16667L0 22.1667C0 22.4761 0.12344 22.7728 0.343164 22.9916C0.562888 23.2104 0.860897 23.3333 1.17163 23.3333H26.9476C27.2583 23.3333 27.5563 23.2104 27.7761 22.9916C27.9958 22.7728 28.1192 22.4761 28.1192 22.1667V1.16667C28.1192 0.857247 27.9958 0.560501 27.7761 0.341709C27.5563 0.122916 27.2583 0 26.9476 0Z"
                  fill="#FEFEFE"
                />
              </svg>
              {/* House (white) */}
              <svg
                width="15"
                height="12"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  display: "block",
                  width: "100%",
                  left: "54%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  zIndex: 1,
                }}
              >
                <path
                  d="M11.041 7.9494L9.379 6.7667V9.6667C9.379 9.9761 9.2556 10.2728 9.0358 10.4916C8.8161 10.7104 8.5181 10.8333 8.2074 10.8333H5.2784V6.1667C5.2784 5.8572 5.1549 5.5605 4.9352 5.3417C4.7155 5.1229 4.4175 5 4.1067 5H2.9351C2.6244 5 2.3263 5.1229 2.1066 5.3417C1.8869 5.5605 1.7635 5.8572 1.7635 6.1667V10.8333H-1.1657C-1.4764 10.8333 -1.7744 10.7104 -1.9941 10.4916C-2.2138 10.2728 -2.3372 9.9761 -2.3372 9.6667V6.7667L-3.9995 7.9494L-5.3615 6.0506L2.8399 0.21729C3.0394 0.07799 3.2772 0.00325 3.5209 0.00325C3.7646 0.00325 4.0024 0.07799 4.2019 0.21729L12.4034 6.0506L11.041 7.9494Z"
                  fill="#2135b0"
                />
              </svg>
            </span>
            Start Your Application
          </button>
        </Link>

        <div className="mt-3 d-flex flex-column align-items-center gap-1 align-self-center">
          <span
            className="hero-scroll-text fs-6 mb-1"
            style={{
              animation: "fadeInOut 2s infinite",
              opacity: 0.7,
            }}
          >
            Scroll
          </span>
          <div
            className="hero-scroll-icon mb-5"
            style={{
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              style={{ display: "block" }}
            >
              {/* Animated circle */}
              <circle
                cx="18"
                cy="18"
                r="17"
                fill="white"
                stroke="white"
                strokeWidth="1.5"
                style={{
                  animation: "pulse 2s infinite",
                  transformOrigin: "center",
                }}
              />

              {/* Animated Hollow V */}
              <path
                d="M12 14L18 20L24 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  animation: "bounceV 1.5s infinite",
                  transformOrigin: "center",
                }}
              />

              {/* Animated Down arrow */}
              <path
                d="M18 25L13 20M18 25L23 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  animation: "bounceArrow 1.5s infinite",
                  animationDelay: "0.2s",
                  transformOrigin: "center",
                }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <div className="stats-section container p-0 m-0 mw-100">
      <div className="row g-0 align-items-stretch">
        {" "}
        {/* Stat Item 1 */}
        <div className="col-md-2">
          <div className="stat-item h-100">
            {" "}
            {/* Full height */}
            <div className="stat-number">350+</div>
            <div className="stat-label">Documents Reviewed</div>
          </div>
        </div>
        {/* Stat Item 2 */}
        <div className="col-md-2">
          <div className="stat-item h-100">
            <div className="stat-number">96%</div>
            <div className="stat-label">Successful Visa Process Rate</div>
          </div>
        </div>
        {/* Stat Item 3 */}
        <div className="col-md-2">
          <div className="stat-item h-100">
            <div className="stat-number">48hrs</div>
            <div className="stat-label">Application Approval Time</div>
          </div>
        </div>
        {/* Description Section - Now in same row */}
        <div className="col-md-6">
          <div className="description-section h-100 mx-auto p-4">
            <h2 className="service-title">Admission & Immigration Services</h2>
            <p className="service-description">
              A dependable partner in education, travel, and hospitality. Our
              tailored services, unwavering commitment to quality, and excellent
              client relations make us a preferred consultancy in Nigeria and
              beyond.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default HeroSection;
