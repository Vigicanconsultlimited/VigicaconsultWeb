import React from "react";
import HeroSection from "../components/landing/HeroSection";
import AboutSection from "../components/landing/AboutSection";
import ServiceCategoriesSection from "../components/landing/ServiceCategoriesSection";
import StudyAbroadSection from "../components/landing/StudyAbroadSection";
import Header from "../components/landing/Header";
import FlightBookingSection from "../components/landing/FlightBookingSection";
import HotelBookingSection from "../components/landing/HotelBookingSection";
import AboutUsSection from "../components/landing/AboutUsSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import ConsultationSection from "../components/landing/ConsultationSection";
import Footer from "../components/common/Footer";
import TravelVisaSection from "../components/landing/TravelVisaSection";

// Ensure to load fonts in your index.html or via CSS-in-JS
const LandingPage = () => (
  <main style={{ width: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
    <Header />
    <HeroSection />
    <AboutSection />
    <ServiceCategoriesSection />
    <StudyAbroadSection />
    <TravelVisaSection />
    <FlightBookingSection />
    <HotelBookingSection />
    <AboutUsSection />
    <TestimonialsSection />
    <ConsultationSection />
    <Footer />
  </main>
);

export default LandingPage;
