import React from "react";
import usaCityImage from "../../assets/images/usa.png";
import australiaCityImage from "../../assets/images/australia.png";
import europeCityImage from "../../assets/images/europe.png";
import ukCityImage from "../../assets/images/uk.png";
import australiaFlag from "../../assets/images/australia-flag.png";
import usaFlag from "../../assets/images/usa-flag.png";
import europeFlag from "../../assets/images/europe-flag.png";
import ukFlag from "../../assets/images/uk-flag.png";
import visaApply from "../../assets/images/visa-apply.jpg";

import "./TravelVisaSection.css";

const countries = [
  {
    name: "AUSTRALIA",
    flag: australiaFlag,
    image: australiaCityImage,
    description: "Student Immigration Lorem ipsum dolor sit amet, Lorem ips",
  },
  {
    name: "UNITED STATES",
    flag: usaFlag,
    image: usaCityImage,
    description: "Student Immigration Lorem ipsum dolor sit amet, Lorem ips",
  },
  {
    name: "EUROPE",
    flag: europeFlag,
    image: europeCityImage,
    description: "Student Immigration Lorem ipsum dolor sit amet, Lorem ips",
  },
  {
    name: "UNITED KINGDOM",
    flag: ukFlag,
    image: ukCityImage,
    description: "Student Immigration Lorem ipsum dolor sit amet, Lorem ips",
  },
];

const TravelVisaSection = () => (
  <section className="travel-visa-section">
    <div className="container">
      {/* Main Title Section */}
      <div className="visa-header">
        <span className="visa-subtitle">— Visa Guide</span>
        <h2 className="visa-title">
          Travel Visa Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit
        </h2>
        <div className="airplane-icons">
          <i className="fas fa-plane airplane-left"></i>
          <i className="fas fa-plane airplane-right"></i>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="row justify-content-center">
        {countries.map((country, index) => (
          <div key={country.name} className="col-lg-3 col-md-6">
            <div className="country-card">
              <div className="country-image-container mb-0 pb-0">
                <img
                  src={country.image}
                  alt={country.name}
                  className="country-image"
                />
                <div className="country-flag">
                  <span className="flag-emoji">
                    <img
                      src={country.flag}
                      alt={`${country.name} flag`}
                      className="flag-img"
                    />
                  </span>
                </div>
              </div>
              <div className="country-content">
                <h4 className="country-name">{country.name}</h4>
                <p className="country-description">{country.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* CTA Section */}
      <div className="visa-cta-section">
        <div className="row align-items-center">
          <div className="col-lg-4 cta-image-container">
            <img src={visaApply} alt="Consultation" className="cta-image" />
          </div>
          <div className="col-lg-8">
            <div className="cta-content">
              <span className="cta-subtitle">
                Get Free Online Visa Assessment Today!
              </span>
              <h3 className="cta-title">
                Lorem Ipsum Dolor Si Elium Vigica Consult Ipsum Consect
              </h3>
              <button
                style={{
                  fontFamily: "Poppins, Arial, sans-serif",
                  fontWeight: 600,
                  backgroundColor: "#fff",
                  color: "#2135b0",
                  padding: "0.7rem 1.4rem",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "1rem",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
                className="btn hero-button py-2 px-4 py-md-3 px-md-3 border-0 d-inline-flex align-items-center"
              >
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
                      fill="#2135b0"
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
                      fill="#fff"
                    />
                  </svg>
                </span>
                Apply Visa Online
              </button>
              <div className="cta-icon">
                <i className="fas fa-plane"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TravelVisaSection;
