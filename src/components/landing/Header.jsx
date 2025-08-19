import React, { useState, useEffect } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import vigicaLogo from "../../assets/images/vigicaV2.png";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "study", label: "Study Abroad" },
  { id: "flights", label: "Flights" },
  { id: "accommodation", label: "Accommodation" },
  //{ id: "visa", label: "Visa" },
  { id: "contact", label: "Contact" },
];

function Header() {
  const [currentSection, setCurrentSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scrolling effect for the fixed header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update current section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      if (sections.length > 0) {
        const scrollPosition = window.scrollY + 100; // Add offset for header height

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.offsetTop <= scrollPosition) {
            setCurrentSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset to account for fixed header height
      const headerHeight = document.querySelector("header").offsetHeight;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setCurrentSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Contact Bar */}
      <div
        className={`bg-blue-600 text-white py-2 transition-all duration-300 ${
          scrolled ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Address */}
            <div className="flex items-center justify-center md:justify-start mb-2 md:mb-0">
              <FaMapMarkerAlt className="mr-2" />
              <span className="text-sm">
                Plot 114/115, Okay Water, Lugbe, Abuja
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-2 md:mb-0">
              <a
                href="tel:+2348186482048"
                className="text-white no-underline flex items-center text-sm"
              >
                <FaPhone className="mr-2" />
                <span>+234 901 445 6659</span>
              </a>

              <a
                href="mailto:info@vigicaconsult.com"
                className="text-white no-underline flex items-center text-sm"
              >
                <FaEnvelope className="mr-2" />
                <span>info@vigicaconsult.com</span>
              </a>
            </div>

            {/* Hours & Social */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center text-sm">
                <FaClock className="mr-2" />
                <span>Mon. - Sat: 9:00am-6:00pm</span>
              </div>

              <div className="flex gap-3">
                <a
                  href="http://t.me/vigica_1"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaTelegramPlane />
                </a>
                <a
                  href="https://www.linkedin.com/company/vigica-consult-limited/about/?viewAsMember=true"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://x.com/vigicaconsult?t=_E90eYcUQ-mPotS-MhX4Mw&s=09"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.instagram.com/vigicaconsult/"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaInstagram />
                </a>

                {/*
                <a
                  href="#"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaFacebook />
                </a>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav
        className={`bg-white backdrop-blur-xl border-b border-gray-100 transition-all duration-300 ${
          scrolled ? "shadow-lg py-2" : "shadow-sm py-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
            {/* Logo */}
            <div className="flex items-center w-48">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                {/*}
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  VIGICA CONSULT
                </span>
                */}
                <img
                  src={vigicaLogo}
                  alt="Vigica Consult Logo"
                  className="w-35 h-12"
                />
              </motion.div>
            </div>

            {/* Desktop Navigation - Properly spaced with underline hover effect */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="flex items-center">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative text-sm font-medium px-1 py-2 mx-2 transition-all duration-300
                      hover:text-blue-600 group ${
                        currentSection === item.id
                          ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                          : "text-gray-600"
                      }`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Get Started Button */}
            <div className="hidden md:flex items-center justify-end w-48">
              <Link to="/register" className="text-decoration-none">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button - always visible on small screens */}
            <div className="md:hidden flex items-center justify-end flex-1">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      currentSection === item.id
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  onClick={() => scrollToSection("contact")}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Header;
