import React from "react";
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta ex
          et nisl condimentum posuere. Vivamus sodales pellentesque velit.
        </p>
        <button className="btn hero-button text-white py-2 px-4 py-md-3 px-md-3 border-0 rounded-pill d-inline-flex align-items-center mb-5">
          <span className="hero-button-icon me-2">📄</span>
          Start Your Application
        </button>

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
            <div className="stat-number">95%</div>
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
              Lorem ipsumroin porta ex et nisl condorm postere. Vivamus sodales
              pellentesque ullamcorper mollis velit porta ex et nisl condorm.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default HeroSection;
