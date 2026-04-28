import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Swal from "sweetalert2";
import RentalHouse from "../../assets/images/houserental.jpg";
import Modal from "./Modal";
import FlightBookingModal from "./FlightBookingModal";
import OrlandoSilver from "../../assets/images/OrlandoSilverRooms.webp";
import OrlandoExternal from "../../assets/images/OrlandoVillageExternal.webp";
import EnquiryForm from "./EnquiryForm";
import {
  GraduationCap, FileCheck, Search, Shield, Phone, Clock, MapPin, Info,
  Star, CheckCircle, ArrowRight, ChevronDown, Clock3, Users, ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Partners from "./Partners";
import VigicaLoader from "../shared/VigicaLoader";
import { Email } from "@mui/icons-material";

// ─── SweetAlert Toast ─────────────────────────────────────────────────────────
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    container: "swal-mobile-container",
    popup: "swal-mobile-popup",
    title: "swal-mobile-title",
  },
});

// ─── Static data ──────────────────────────────────────────────────────────────
const statsData = [
  { number: "850+", label: "Documents Reviewed", icon: FileCheck },
  { number: "96%", label: "Successful Visa Process Rate", icon: CheckCircle },
  { number: "48hrs", label: "Application Approval Time", icon: Clock3 },
];

const servicesData = [
  { title: "Course Finder", icon: Search, points: ["Assessing Course Studied", "Work Experience", "Career Change", "Scholarships"] },
  { title: "University Finder", icon: GraduationCap, points: ["Foundation Study", "Undergraduate", "Postgraduate Taught (MSc)", "Research (MRes/PhD)"] },
  { title: "University Application Support", icon: FileCheck, points: ["Document Preparation", "Document Reviews", "Submission Support", "Pre-CAS Interview & Prep"] },
  { title: "Visa Application Assistance", icon: Shield, points: ["Document Review", "CAS Application Assist", "Credibility Interview (UKVI)"] },
  { title: "Accommodation Support", icon: Users, points: ["Short Stay", "Airbnb", "Long Stay"] },
  { title: "Partnership & Collaboration", icon: ArrowRight, points: ["Government Scholarships", "Institutional Programmes"] },
];

// ─── Testimonial Carousel ─────────────────────────────────────────────────────
const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentIndex, testimonials.length]);

  const handlePrevious = () => { setDirection("left"); setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1)); };
  const handleNext = () => { setDirection("right"); setCurrentIndex((prev) => (prev + 1) % testimonials.length); };
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrevious();
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir === "right" ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir === "right" ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div key={currentIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} className="w-24 h-24 rounded-full mx-auto md:mx-0 mb-4 shadow-xl object-cover" />
              <h4 className="text-xl font-bold mb-1">{testimonials[currentIndex].university}</h4>
              <p className="text-blue-100">{testimonials[currentIndex].name}</p>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />))}
              </div>
              <blockquote className="text-xl leading-relaxed">"{testimonials[currentIndex].text}"</blockquote>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button onClick={handlePrevious} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full -ml-4 md:ml-0 focus:outline-none" aria-label="Previous testimonial"><ChevronLeft className="w-6 h-6" /></button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button onClick={handleNext} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full -mr-4 md:mr-0 focus:outline-none" aria-label="Next testimonial"><ChevronRight className="w-6 h-6" /></button>
      </div>
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-2">
        {testimonials.map((_, index) => (
          <button key={index} onClick={() => { setDirection(index > currentIndex ? "right" : "left"); setCurrentIndex(index); }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/30 hover:bg-white/50"}`}
            aria-label={`Go to testimonial ${index + 1}`} aria-current={index === currentIndex} />
        ))}
      </div>
    </div>
  );
};

// ─── Flight Booking Form ──────────────────────────────────────────────────────
const FlightBookingForm = ({ flightForm, setFlightForm, flightLoading, setFlightLoading }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const swapLocations = () => {
    setFlightForm((prev) => ({ ...prev, origin: prev.destination, destination: prev.origin }));
  };

  const handleSubmit = async () => {
    if (!flightForm.origin || !flightForm.destination || !flightForm.departureDate || !flightForm.fullName || !flightForm.email || !flightForm.phone) {
      Toast.fire({ icon: "warning", title: "Please fill in all required fields" });
      return;
    }
    setFlightLoading(true);
    try {
      const response = await fetch("https://vigica-001-site1.qtempurl.com/api/Enquiry/flight-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightForm),
      });
      const data = await response.json();
      if (response.ok) {
        Toast.fire({ icon: "success", title: data.message || "Flight enquiry sent successfully!" });
        setFlightForm({
          tripType: "one-way", origin: "", destination: "", departureDate: "", returnDate: "",
          cabinClass: "Economy", preferredAirline: "Any Airline", priceMin: "", priceMax: "",
          departureTime: "Departure", arrivalTime: "Arrival", fullName: "", email: "", phone: "",
        });
      } else {
        Toast.fire({ icon: "error", title: data.message || "Something went wrong." });
      }
    } catch (err) {
      Toast.fire({ icon: "error", title: "Network error. Please check your connection." });
    } finally {
      setFlightLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-1/2 h-32 bg-gradient-to-l from-blue-100 to-transparent opacity-50 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-24 bg-gradient-to-r from-indigo-100 to-transparent opacity-50 rounded-tr-full" />

        <div className="relative p-8 md:p-10">
          {/* Trip Type */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
            {[{ id: "one-way", label: "One Way" }, { id: "round-trip", label: "Round Trip" }, { id: "multi-city", label: "Multi-City" }].map((type) => (
              <button key={type.id} onClick={() => setFlightForm({ ...flightForm, tripType: type.id })}
                className={`relative inline-flex items-center ${flightForm.tripType === type.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} px-6 py-3 rounded-full font-medium cursor-pointer transition-all duration-200`}>
                {type.label}
              </button>
            ))}
            <div className="ml-auto hidden md:block">
              <div className="relative">
                <button onClick={() => document.getElementById("cabin-dropdown").classList.toggle("hidden")}
                  className="relative inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium cursor-pointer transition-all duration-200">
                  <span>{flightForm.cabinClass}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                <div id="cabin-dropdown" className="absolute mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10 hidden">
                  {["Economy", "Premium Economy", "Business", "First Class"].map((cabin) => (
                    <button key={cabin} onClick={() => { setFlightForm({ ...flightForm, cabinClass: cabin }); document.getElementById("cabin-dropdown").classList.add("hidden"); }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      {cabin}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Date Fields */}
          <div className="grid md:grid-cols-12 gap-6 mb-6">
            <div className="md:col-span-5 grid md:grid-cols-2 gap-2 relative">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 font-medium mb-1">From <span className="text-red-500">*</span></p>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <input type="text" placeholder="City or airport" value={flightForm.origin} onChange={(e) => setFlightForm({ ...flightForm, origin: e.target.value })} className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg" />
                </div>
              </div>
              <button onClick={swapLocations} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </button>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 font-medium mb-1">To <span className="text-red-500">*</span></p>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <input type="text" placeholder="City or airport" value={flightForm.destination} onChange={(e) => setFlightForm({ ...flightForm, destination: e.target.value })} className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg" />
                </div>
              </div>
            </div>

            <div className="md:col-span-4 grid md:grid-cols-2 gap-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 font-medium mb-1">Departure <span className="text-red-500">*</span></p>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <input type="date" value={flightForm.departureDate} onChange={(e) => setFlightForm({ ...flightForm, departureDate: e.target.value })} className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg" />
                </div>
              </div>
              <div className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow ${flightForm.tripType === "one-way" ? "opacity-50" : ""}`}>
                <p className="text-sm text-blue-600 font-medium mb-1">Return</p>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <input type="date" value={flightForm.returnDate} onChange={(e) => setFlightForm({ ...flightForm, returnDate: e.target.value })} disabled={flightForm.tripType === "one-way"} className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg" />
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full h-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl flex items-center justify-center font-medium text-lg transition-all">
                <Search className="h-5 w-5 mr-2" /> Options
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-blue-600 font-medium mb-1">Full Name <span className="text-red-500">*</span></p>
              <input type="text" placeholder="Your full name" value={flightForm.fullName} onChange={(e) => setFlightForm({ ...flightForm, fullName: e.target.value })} className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-base" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-blue-600 font-medium mb-1">Email <span className="text-red-500">*</span></p>
              <input type="email" placeholder="your@email.com" value={flightForm.email} onChange={(e) => setFlightForm({ ...flightForm, email: e.target.value })} className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-base" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-blue-600 font-medium mb-1">Phone <span className="text-red-500">*</span></p>
              <input type="tel" placeholder="+234 000 000 0000" value={flightForm.phone} onChange={(e) => setFlightForm({ ...flightForm, phone: e.target.value })} className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-base" />
            </div>
          </div>

          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Advanced Options
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Airlines</label>
                    <select value={flightForm.preferredAirline} onChange={(e) => setFlightForm({ ...flightForm, preferredAirline: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Any Airline</option>
                      <option>Emirates</option>
                      <option>Qatar Airways</option>
                      <option>Delta</option>
                      <option>British Airways</option>
                      <option>Air France</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" value={flightForm.priceMin} onChange={(e) => setFlightForm({ ...flightForm, priceMin: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <span className="text-gray-500">-</span>
                      <input type="number" placeholder="Max" value={flightForm.priceMax} onChange={(e) => setFlightForm({ ...flightForm, priceMax: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Flight Times</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select value={flightForm.departureTime} onChange={(e) => setFlightForm({ ...flightForm, departureTime: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Departure</option>
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>
                      <select value={flightForm.arrivalTime} onChange={(e) => setFlightForm({ ...flightForm, arrivalTime: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Arrival</option>
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-gray-100 mt-6">
          <div className="p-6 flex justify-end">
            <button onClick={handleSubmit} disabled={flightLoading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl px-10 py-3.5 font-medium text-lg shadow-lg hover:shadow-xl transition-all flex items-center">
              {flightLoading ? "Sending..." : "Submit Enquiry"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>

      <FlightBookingModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showAccomForm, setShowAccomForm] = useState(false);

  const [accomForm, setAccomForm] = useState({
    fullName: "", gender: "", contactTelephone: "", email: "",
    destination: "", accommodationType: "", budget: "",
  });
  const [accomLoading, setAccomLoading] = useState(false);

  const [flightForm, setFlightForm] = useState({
    tripType: "one-way", origin: "", destination: "", departureDate: "", returnDate: "",
    cabinClass: "Economy", preferredAirline: "Any Airline", priceMin: "", priceMax: "",
    departureTime: "Departure", arrivalTime: "Arrival", fullName: "", email: "", phone: "",
  });
  const [flightLoading, setFlightLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {loading ? (
        <VigicaLoader variant="inline" size="md" text="Loading your global opportunities..." />
      ) : (
        <>
          <Header />

          {/* ── Hero ── */}
          <style>{`
            .hero-bg {
              background-image: url('https://res.cloudinary.com/dd4bl9gwo/image/upload/v1777327100/ChatGPT_Image_Apr_27_2026_10_55_37_PM_i0ggjd.png');
              background-size: cover;
              background-position: center right;
            }
            @media (max-width: 768px) {
              .hero-bg { background-position: center center; }
            }
          `}</style>

          <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 hero-bg">
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(18, 37, 60, 0.92) 45%, rgba(18, 37, 60, 0.2) 100%)" }} />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
                <div className="flex items-start justify-between gap-8">
                  <motion.h1
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: "clamp(40px,5vw,64px)", fontWeight: 700, lineHeight: 1.12, color: "#fff", maxWidth: 720, marginBottom: 24, letterSpacing: "-0.5px" }}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    Your trusted pathway to{" "}
                    <em style={{ fontStyle: "italic", color: "#fed016" }}>GLOBAL OPPORTUNITIES</em>
                  </motion.h1>
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="hidden md:flex flex-shrink-0 pt-[227px] ml-52">
                    <Link to="/register" className="text-decoration-none">
                      <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 hover:-translate-y-1 transition-all duration-300 group">
                        Start Your Application <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
                <motion.p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                  A multidimensional consultancy firm offering specialized services in international education recruitment, advisory, programme coordination, travel logistics, and accommodation solutions.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="md:hidden">
                  <Link to="/register" className="text-decoration-none">
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 hover:-translate-y-1 transition-all duration-300 group">
                      Start Your Application <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ── Stats ── */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {statsData.map((stat, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="text-center text-white">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"><stat.icon className="w-8 h-8" /></div>
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-white">
                  <h3 className="text-xl font-bold mb-3">Admission & Immigration Services</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">A dependable partner in education, travel, and hospitality. Our tailored services, unwavering commitment to quality, and excellent client relations make us a preferred consultancy in Nigeria and beyond.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── About ── */}
          <section id="about" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                  <div className="relative">
                    <img src="https://res.cloudinary.com/dd4bl9gwo/image/upload/v1777145221/WEB_1_062247.jpg_hazony.jpg" alt="Students collaborating" className="w-full rounded-2xl shadow-2xl" />
                    <div className="absolute -bottom-6 -right-6 w-48 h-32 bg-white rounded-xl shadow-xl p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
                        <div className="text-gray-600 text-sm">Happy Students</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                  <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">About Us</Badge>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">A Multi-dimensional Consultancy Firm</h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">Specialized services in international education recruitment, advisory, programme coordination, travel logistics, and accommodation solutions. We also facilitate transnational partnership and collaboration between institutions. Strategically headquartered in Abuja, Nigeria, we pride ourselves on delivering tailored, high-impact services that meet the dynamic needs of students, institutions, travelers, and corporate partners.</p>
                  <Link to="/register" className="text-decoration-none">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── Services ── */}
          <section id="services" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">Our Services</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Unparalleled Consultancy from Seasoned Experts</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Empowering individuals and institutions globally by providing comprehensive educational consultancy, streamlined visa and travel solutions, and exceptional accommodation and partnership services.</p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesData.map((service, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-2">
                      <CardContent className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                          <service.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                        <ul className="space-y-2 mb-6">
                          {service.points.map((point, i) => (
                            <li key={i} className="flex items-center text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />{point}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                          onClick={() => setShowEnquiry(true)}
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Enquiry Modal ── */}
          {showEnquiry && (
            <Modal open={showEnquiry} onClose={() => setShowEnquiry(false)} title="Make an Enquiry" size="md">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <EnquiryForm />
              </motion.div>
            </Modal>
          )}

          {/* ── Study Abroad ── */}
          <section id="study" className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">Study Abroad</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Visa advisory, Scholarship support, & Pre-departure orientation</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Personalized visa application guidance and documentation support, comprehensive orientation, airport pickup, and arrival guidance.</p>
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    Start Your Application <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                  <img src="https://res.cloudinary.com/dd4bl9gwo/image/upload/v1777145582/IMG_9633_1_afisjd.jpg" alt="University campus" className="w-full rounded-2xl shadow-2xl" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
                  {[
                    { title: "Expert Guidance", desc: "Get personalized advice from our experienced consultants" },
                    { title: "Document Support", desc: "Complete assistance with application documents and requirements" },
                    { title: "Visa Success", desc: "96% success rate in visa applications across all countries" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── Flights ── */}
          <section id="flights" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">Flight Booking</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Start Booking Your Flight Now</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get the best deals on flights with our premium booking service. We ensure competitive prices and personalized support throughout your journey.</p>
              </motion.div>

              <FlightBookingForm
                flightForm={flightForm}
                setFlightForm={setFlightForm}
                flightLoading={flightLoading}
                setFlightLoading={setFlightLoading}
              />

              <motion.div className="mt-16 rounded-3xl overflow-hidden shadow-2xl relative" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <img src="https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1200&h=400&q=80" alt="Airplane in flight" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60 flex items-center">
                  <div className="px-10 md:px-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience World-Class Service</h3>
                    <p className="text-blue-100 text-lg mb-6 max-w-2xl">Book your flights with confidence knowing that our dedicated team is committed to making your journey as smooth and comfortable as possible.</p>
                    <button onClick={() => scrollToSection("contact")} className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium shadow-lg transition-all">Contact Us About Flights</button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Accommodation ── */}
          <section id="accommodation" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Badge className="bg-purple-100 text-purple-700 mb-4 px-3 py-1">Accommodation</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Find Your Perfect Stay</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">We offer a range of accommodation options from budget-friendly hostels to luxury hotels, ensuring you find the perfect place to stay during your travels or studies abroad.</p>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" onClick={() => setShowAccomForm(true)}>
                  Accommodation Enquiry
                </Button>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[
                  { title: "Student Hostels", image: OrlandoExternal, desc: "Affordable accommodation options specially designed for students near universities." },
                  { title: "Serviced Apartments", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop", desc: "Fully furnished apartments with amenities for short or long-term stays." },
                  { title: "Student Apartments", image: OrlandoSilver, desc: "Luxury accommodations with premium services for business travelers." },
                ].map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }} className="bg-white rounded-xl overflow-hidden shadow-lg group hover:-translate-y-2 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 sm:p-8 md:p-12">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Accommodation Booking Assistance</h3>
                    <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">Our team work with local estate agents and landlords to ensure we meet all your accommodation needs. All you need to do is to complete the accommodation form.</p>
                    <Button onClick={() => setShowAccomForm(true)} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white py-2.5">Book Accommodation Now</Button>
                  </div>
                  <div className="flex flex-col">
                    <div className="relative h-48 sm:h-64 md:min-h-[360px] lg:min-h-[420px]">
                      <img src={RentalHouse} alt="Accommodation" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/40" />
                      <div className="absolute inset-0 hidden sm:flex items-center justify-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 max-w-sm mx-6 text-center">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Need Special Arrangements?</h4>
                          <p className="text-gray-700 text-sm sm:text-base">We can arrange family accommodations, accessible rooms, or group bookings with special requirements.</p>
                        </div>
                      </div>
                    </div>
                    <div className="sm:hidden px-4 py-3">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                        <h4 className="text-base font-semibold text-gray-900 mb-1.5">Need Special Arrangements?</h4>
                        <p className="text-gray-700 text-sm">We can arrange family accommodations, accessible rooms, or group bookings with special requirements.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Accommodation Modal ── */}
          <Modal open={showAccomForm} onClose={() => setShowAccomForm(false)} title="Accommodation Booking Assistance" size="md">
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              if (!accomForm.fullName || !accomForm.gender || !accomForm.contactTelephone || !accomForm.email || !accomForm.destination || !accomForm.accommodationType || !accomForm.budget) {
                Toast.fire({ icon: "warning", title: "Please fill in all fields" });
                return;
              }
              setAccomLoading(true);
              try {
                const response = await fetch("https://vigica-001-site1.qtempurl.com/api/Enquiry/accomodation", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    fullName: accomForm.fullName,
                    gender: accomForm.gender,
                    contactTelephone: accomForm.contactTelephone,
                    email: accomForm.email,
                    destination: accomForm.destination,
                    accommodationType: accomForm.accommodationType,
                    budget: accomForm.budget,
                  }),
                });
                const data = await response.json();
                if (response.ok) {
                  Toast.fire({ icon: "success", title: data.message || "Enquiry sent successfully!" });
                  setShowAccomForm(false);
                  setAccomForm({ fullName: "", gender: "", contactTelephone: "", email: "", destination: "", accommodationType: "", budget: "" });
                } else {
                  Toast.fire({ icon: "error", title: data.message || "Something went wrong. Please try again." });
                }
              } catch (err) {
                Toast.fire({ icon: "error", title: "Network error. Please check your connection." });
              } finally {
                setAccomLoading(false);
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input type="text" className="w-full" value={accomForm.fullName} onChange={(e) => setAccomForm({ ...accomForm, fullName: e.target.value })} placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white" value={accomForm.gender} onChange={(e) => setAccomForm({ ...accomForm, gender: e.target.value })}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Telephone</label>
                <Input type="tel" className="w-full" value={accomForm.contactTelephone} onChange={(e) => setAccomForm({ ...accomForm, contactTelephone: e.target.value })} placeholder="+44 7000 000000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" className="w-full" value={accomForm.email} onChange={(e) => setAccomForm({ ...accomForm, email: e.target.value })} placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white" value={accomForm.destination} onChange={(e) => setAccomForm({ ...accomForm, destination: e.target.value })}>
                  <option value="">Select Destination</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Ireland">Ireland</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white" value={accomForm.accommodationType} onChange={(e) => setAccomForm({ ...accomForm, accommodationType: e.target.value })}>
                  <option value="">Select Accommodation Type</option>
                  <option value="Student Hostel (10 months) tenor">Student Hostel (10 months) tenor</option>
                  <option value="1-Bedroom apartment (6 months) assured tenancy (AST)">1-Bedroom apartment (6 months) AST</option>
                  <option value="2-Bedroom apartments (6 months) assured tenancy (AST)">2-Bedroom apartments (6 months) AST</option>
                  <option value="3-Bedroom apartments (6 months) assured tenancy (AST)">3-Bedroom apartments (6 months) AST</option>
                  <option value="Service accommodation (short stay)">Service accommodation (short stay)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget (per night/month)</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white" value={accomForm.budget} onChange={(e) => setAccomForm({ ...accomForm, budget: e.target.value })}>
                  <option value="">Select Budget Range</option>
                  <option value="Under £500">Under £500</option>
                  <option value="£500 - £800">£500 - £800</option>
                  <option value="£800 - £1,200">£800 - £1,200</option>
                  <option value="£1,200 - £1,800">£1,200 - £1,800</option>
                  <option value="£1,800 - £2,500">£1,800 - £2,500</option>
                  <option value="£2,500+">£2,500+</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={accomLoading} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5">
                  {accomLoading ? "Sending..." : "Request Options"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAccomForm(false)}>Cancel</Button>
              </div>
            </form>
          </Modal>

          {/* ── Partners ── */}
          <Partners />

          {/* ── Contact ── */}
          <section id="contact" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">Contact Us</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Book a Free Consultation Today</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get personalized guidance for your study abroad journey, travel plans, or hotel bookings. Our experts are here to assist you with all your needs.</p>
              </motion.div>
              <div className="grid lg:grid-cols-2 gap-16">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                  {[
                    { icon: Phone, title: "Requesting A Call", text: "+234 913 543 0319" },
                    { icon: Clock, title: "Open Hours", text: "Mon. - Sat: 9:00am - 6:00pm" },
                    { icon: MapPin, title: "Location", text: "Okay Centre, Okay Water Federal Housing Authority, Lugbe, Abuja." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Got issues? Call Our Tech Team</h3>
                      <p className="text-gray-600 flex items-center gap-2"><Email className="w-4 h-4" /> info@vigicaconsult.com</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                  <EnquiryForm />
                </motion.div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
