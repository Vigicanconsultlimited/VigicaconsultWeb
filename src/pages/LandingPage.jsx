import React from "react";
import Footer from "../components/common/Footer";
import LandingPageBody from "../components/landing/LandingPageBody";

// Ensure to load fonts in your index.html or via CSS-in-JS
const LandingPage = () => (
  <main style={{ width: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
    <LandingPageBody />
    <Footer />
  </main>
);

export default LandingPage;
