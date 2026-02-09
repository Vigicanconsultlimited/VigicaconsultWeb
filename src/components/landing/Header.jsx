import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import vigicaLogo from "../../assets/images/vigicaV2.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
  FaTiktok,
  FaFacebook,
  FaLinkedin,
  FaUserCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/auth";
import "./styles/Header.css";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "study", label: "Study Abroad" },
  { id: "flights", label: "Flights" },
  { id: "accommodation", label: "Accommodation" },
  { id: "partners", label: "Partners" },
  { id: "staff", label: "Our Team", isLink: true, to: "/team" },
  { id: "contact", label: "Contact" },
];

function Header() {
  const [currentSection, setCurrentSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.allUserData);

  const email =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const userId = user?.uid;

  useEffect(() => {
    const fetchName = async () => {
      if (!userId) return;
      try {
        const apiInstance = (await import("../../utils/axios")).default;
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`,
        );
        const personalInfoId = personalRes?.data?.result?.id;
        if (personalInfoId) {
          const submittedAppRes = await apiInstance.get(
            `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`,
          );
          const personalData =
            submittedAppRes?.data?.result?.personalInformation;
          if (personalData?.firstName)
            setDisplayName(`${personalData.firstName}`);
        }
      } catch (error) {
        console.warn("Failed to fetch display name:", error);
      }
    };
    if (userId) fetchName();
  }, [userId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);
      if (sections.length > 0) {
        const scrollPosition = window.scrollY + 100;
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
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // Handle hash navigation when coming from another page
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const sectionId = location.hash.replace("#", "");
      // Wait for page to render before scrolling
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const headerEl = document.querySelector("header");
          const headerHeight = headerEl ? headerEl.offsetHeight : 0;
          el.style.scrollMarginTop = `${headerHeight + 8}px`;
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setCurrentSection(sectionId);
        }
      }, 100);
    }
  }, [location]);

  //scrollToSection
  const scrollToSection = async (sectionId) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      // Compute the current header height after menu has closed
      const headerEl = document.querySelector("header");
      const headerHeight = headerEl ? headerEl.offsetHeight : 0;

      // Use scroll-margin-top so smooth scroll positions correctly under a fixed header
      el.style.scrollMarginTop = `${headerHeight + 8}px`; // +8px breathing room
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      setCurrentSection(sectionId);
    };

    // If not on the landing page, navigate there first with the section hash
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    // If on mobile and menu is open, close it first and wait for the collapse animation
    const isMobile = window.innerWidth < 768;
    if (isMobile && isMenuOpen) {
      setIsMenuOpen(false);
      // Wait for your duration-300 collapse animation to finish before measuring header height
      setTimeout(doScroll, 320);
    } else {
      doScroll();
    }
  };

  const renderAuthButton = () => {
    if (isLoggedIn && isLoggedIn()) {
      return (
        <Link to="/dashboard" className="text-decoration-none">
          <Button className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
            <FaUserCircle className="text-lg" />
            Dashboard
          </Button>
        </Link>
      );
    }
    return (
      <Link to="/register" className="text-decoration-none">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          Get Started
        </Button>
      </Link>
    );
  };

  const renderMobileAuthButton = () => {
    if (isLoggedIn && isLoggedIn()) {
      return (
        <Link to="/dashboard" className="block w-full">
          <Button className="w-full mt-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg flex items-center justify-center gap-2">
            <FaUserCircle /> Dashboard
          </Button>
        </Link>
      );
    }
    return (
      <Link to="/register" className="block w-full">
        <Button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          Get Started
        </Button>
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Contact Bar */}
      <div
        className={`bg-blue-600 text-white transition-all duration-300 ${
          scrolled
            ? "opacity-0 h-0 py-0 overflow-hidden"
            : "opacity-100 py-1 md:py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Mobile: two lines, compact, no scrolling */}
          <div className="md:hidden py-1">
            {/* Line 1: Phone • Email */}
            <div className="mobile-contact-row">
              <a href="tel:+2349014456659" className="mc-link">
                <FaPhone className="mc-icon" />
                <span className="mc-text">+234 901 445 6659</span>
              </a>
              <span className="mc-dot" aria-hidden="true">
                |
              </span>
              <a href="mailto:info@vigicaconsult.com" className="mc-link">
                <FaEnvelope className="mc-icon" />
                <span className="mc-text">info@vigicaconsult.com</span>
              </a>
            </div>
            {/* Line 2: Social icons */}
            <div className="mobile-contact-row">
              <div className="mc-socials">
                <a
                  href="http://t.me/vigica_1"
                  className="mc-social"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <FaTelegramPlane />
                </a>
                <a
                  href="https://www.linkedin.com/company/vigica-consult-limited/about/?viewAsMember=true"
                  className="mc-social"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://x.com/vigicaconsult?t=_E90eYcUQ-mPotS-MhX4Mw&s=09"
                  className="mc-social"
                  aria-label="Twitter/X"
                  title="Twitter/X"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.instagram.com/vigicaconsult/"
                  className="mc-social"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61579196807381"
                  className="mc-social"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FaFacebook />
                </a>
                <a
                  href="http://tiktok.com/@vigicaconsult"
                  className="mc-social"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <FaTiktok />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop: full contact bar */}
          <div className="desktop-only justify-between items-center py-2">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span className="text-sm">
                Plot 114/115, Okay Water, Lugbe, Abuja
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="tel:+2349014456659"
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

            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm">
                <FaClock className="mr-2" />
                <span>Mon. - Sat: 9:00am-6:00pm</span>
              </div>
              <div className="flex gap-3 text-base">
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
                  href="https://www.instagram.com/VIGICA_Consult/"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.facebook.com/VIGICAConsult"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="http://tiktok.com/@vigicaconsult"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaTiktok />
                </a>
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
                <img
                  src={vigicaLogo}
                  alt="Vigica Consult Logo"
                  className="w-35 h-12"
                />
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-only flex-1 items-center justify-center">
              <div className="flex items-center">
                {navItems.map((item) =>
                  item.isLink ? (
                    <Link
                      key={item.id}
                      to={item.to}
                      className={`relative text-sm font-medium px-1 py-2 mx-2 transition-all duration-300 hover:text-blue-600 text-gray-600 no-underline`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`relative text-sm font-medium px-1 py-2 mx-2 transition-all duration-300 hover:text-blue-600 group ${
                        currentSection === item.id
                          ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Auth Button */}
            <div className="desktop-only items-center justify-end w-48">
              {renderAuthButton()}
            </div>

            {/* Mobile menu button */}
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
                {navItems.map((item) =>
                  item.isLink ? (
                    <Link
                      key={item.id}
                      to={item.to}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-blue-600 hover:bg-blue-50 no-underline`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
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
                  ),
                )}
                {renderMobileAuthButton()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Header;
