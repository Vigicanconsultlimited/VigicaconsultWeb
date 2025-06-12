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
              <button className="btn btn-light visa-apply-btn">
                <i className="fas fa-file-alt me-2"></i>
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
