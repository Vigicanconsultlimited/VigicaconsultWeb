import React from "react";
import "../styles/UnderConstructionPage.css";
import Image from "../assets/images/underconstruction.png";

const UnderConstructionPage = () => {
  return (
    <div className="under-construction-page">
      <div className="under-construction-logo">
        <img src={Image} alt="Vigica Logo" className="company-logo" />
      </div>
      <h1 className="under-construction-heading">Vigica Consult Limited</h1>

      <div className="progress-container">
        <div className="progress-label">Development Progress: 55%</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "55%" }}></div>
        </div>
      </div>

      <p className="under-construction-paragraph">
        We're working hard to bring you Vigica Consult Limited an amazing
        advisory System for international students!
      </p>
      <p className="under-construction-paragraph">
        New features and updates will be rolled out periodically. Please check
        back soon!
      </p>
      {/* Notify me when Service is Up via Email */}
    </div>
  );
};

export default UnderConstructionPage;
