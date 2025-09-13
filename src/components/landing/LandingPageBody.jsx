import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import precious from "../../assets/images/img/vigica-img6.jpg";
import mercy from "../../assets/images/mercy.png";
import lolo from "../../assets/images/lolo.webp";
import kelvin from "../../assets/images/Kelvin.png";
import john from "../../assets/images/john.jpg";
import RentalHouse from "../../assets/images/houserental.jpg";
import Modal from "./Modal";
import FlightBookingModal from "./FlightBookingModal";
import OrlandoSilver from "../../assets/images/OrlandoSilverRooms.webp";
import OrlandoBronze from "../../assets/images/OrlandoVillageBronzePlus.webp";
import OrlandoExternal from "../../assets/images/OrlandoVillageExternal.webp";
import {
  GraduationCap,
  FileCheck,
  Search,
  Shield,
  Phone,
  Clock,
  MapPin,
  Plane,
  X,
  Info,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Clock3,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import LoadingSpinner from "./LoadingSpinner";
import { Email } from "@mui/icons-material";
import apiInstance from "../../utils/axios";

// SweetAlert Toast configuration
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

const statsData = [
  { number: "850+", label: "Documents Reviewed", icon: FileCheck },
  { number: "96%", label: "Successful Visa Process Rate", icon: CheckCircle },
  { number: "48hrs", label: "Application Approval Time", icon: Clock3 },
];

const servicesData = [
  {
    title: "University Finder",
    icon: GraduationCap,
    points: ["F1 Student Visa", "Non Academic Visa", "Exchange Visitor Visa"],
  },
  {
    title: "Student Application",
    icon: FileCheck,
    points: [
      "Document Preparation",
      "Application Review",
      "Submission Support",
    ],
  },
  {
    title: "Document Review",
    icon: Search,
    points: ["Comprehensive Analysis", "Error Detection", "Compliance Check"],
  },
  {
    title: "Visa Assistance",
    icon: Shield,
    points: ["Expert Guidance", "Interview Preparation", "Success Guarantee"],
  },
];

const countriesData = [
  {
    name: "Australia",
    flag: "🇦🇺",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Subclass 500 - Student Visa",
    color: "from-green-400 to-blue-600",
  },
  {
    name: "United States",
    flag: "🇺🇸",
    image:
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop",
    description: "F-1 & M-1 United States Student Visas",
    color: "from-red-400 to-blue-600",
  },
  {
    name: "Europe",
    flag: "🇪🇺",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop",
    description: "National Visa (Type D), MVV Visa, Schengen Visa",
    color: "from-blue-400 to-purple-600",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
    description: "Student Visa (Tier 4) and Short-term Study Visa",
    color: "from-purple-400 to-pink-600",
  },
];

const testimonials = [
  {
    name: "Precious Nweze",
    university: "University of Greater Manchester",
    image: precious,
    text: "Vigica Consult made my study abroad journey seamless. From visa application to accommodation, their support was invaluable.",
    rating: 5,
  },

  {
    name: "Oji Ojii",
    university: "University of Greater Manchester",
    image: mercy,
    text: "Vigica Consult made my study abroad journey seamless. From visa application to accommodation, their support was invaluable.",
    rating: 5,
  },
];

// Testimonial Carousel Component
const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-rotation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection("right");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearTimeout(timer);
  }, [currentIndex, testimonials.length]);

  const handlePrevious = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX.current;

    if (difference > 50) {
      // Swiped left - go to next
      handleNext();
    } else if (difference < -50) {
      // Swiped right - go to previous
      handlePrevious();
    }
  };

  // Variants for slide animations
  const slideVariants = {
    enter: (direction) => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-24 h-24 rounded-full mx-auto md:mx-0 mb-4 shadow-xl object-cover"
              />
              <h4 className="text-xl font-bold mb-1">
                {testimonials[currentIndex].university}
              </h4>
              <p className="text-blue-100">{testimonials[currentIndex].name}</p>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-xl leading-relaxed">
                "{testimonials[currentIndex].text}"
              </blockquote>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={handlePrevious}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full -ml-4 md:ml-0 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={handleNext}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full -mr-4 md:mr-0 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? "right" : "left");
              setCurrentIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-white"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
};

// Flight Booking Form Component
const FlightBookingForm = () => {
  const [tripType, setTripType] = useState("one-way");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  //const [travelers, setTravelers] = useState(1);
  const [fareType, setFareType] = useState("regular");
  const [directOnly, setDirectOnly] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [showModal, setShowModal] = useState(false);

  // Show alert when flight booking button is clicked
  const handleFlightBookingClick = () => {
    Swal.fire({
      icon: "info",
      title: "We are working to make this service functional",
      text: "This feature is coming soon!",
      confirmButtonText: "OK",
    });
  };

  // Function to swap origin and destination
  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
      >
        {/* Background pattern for visual interest */}
        <div className="absolute top-0 right-0 w-1/2 h-32 bg-gradient-to-l from-blue-100 to-transparent opacity-50 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-24 bg-gradient-to-r from-indigo-100 to-transparent opacity-50 rounded-tr-full"></div>

        <div className="relative p-8 md:p-10">
          {/* Trip Type Selection */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
            {[
              { id: "one-way", label: "One Way" },
              { id: "round-trip", label: "Round Trip" },
              { id: "multi-city", label: "Multi-City" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setTripType(type.id)}
                className={`relative inline-flex items-center ${
                  tripType === type.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } px-6 py-3 rounded-full font-medium cursor-pointer transition-all duration-200`}
              >
                {type.label}
              </button>
            ))}

            <div className="ml-auto hidden md:block">
              <div className="relative">
                <button
                  onClick={() =>
                    document
                      .getElementById("cabin-dropdown")
                      .classList.toggle("hidden")
                  }
                  className="relative inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium cursor-pointer transition-all duration-200"
                >
                  <span>{cabinClass}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                <div
                  id="cabin-dropdown"
                  className="absolute mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10 hidden"
                >
                  {[
                    "Economy",
                    "Premium Economy",
                    "Business",
                    "First Class",
                  ].map((cabin) => (
                    <button
                      key={cabin}
                      onClick={() => {
                        setCabinClass(cabin);
                        document
                          .getElementById("cabin-dropdown")
                          .classList.add("hidden");
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {cabin}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location and Date Fields */}
          <div className="grid md:grid-cols-12 gap-6 mb-10">
            {/* From-To Fields */}
            <div className="md:col-span-5 grid md:grid-cols-2 gap-2 relative">
              {/* From Field */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 font-medium mb-1">From</p>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="City or airport"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg"
                  />
                </div>
              </div>

              {/* Exchange button */}
              <button
                onClick={swapLocations}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block"
              >
                <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
              </button>

              {/* To Field */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 font-medium mb-1">To</p>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="City or airport"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Date Fields */}
            <div className="md:col-span-4 grid md:grid-cols-2 gap-2">
              {/* Departure Date */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Departure
                </p>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg"
                  />
                </div>
              </div>

              {/* Return Date */}
              <div
                className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow ${
                  tripType === "one-way" ? "opacity-50" : ""
                }`}
              >
                <p className="text-sm text-blue-600 font-medium mb-1">Return</p>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={tripType === "one-way"}
                    className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Travelers & Search Button */}
            <div className="md:col-span-3 grid md:grid-cols-3 gap-2">
              {/* Search Button - Updated to open modal */}
              <div className="md:col-span-2">
                <button
                  onClick={handleFlightBookingClick}
                  //onClick={() => setShowModal(true)}
                  className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center font-medium text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Flights
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Advanced Options
          </button>

          {/* Advanced options section */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 border border-gray-200 rounded-xl bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Airlines
                    </label>
                    <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Any Airline</option>
                      <option>Emirates</option>
                      <option>Qatar Airways</option>
                      <option>Delta</option>
                      <option>British Airways</option>
                      <option>Air France</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flight Times
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Departure</option>
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>
                      <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
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

        {/* Footer with Continue Button */}
        <div className="border-t border-gray-100 mt-6">
          <div className="p-6 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 py-3.5 font-medium text-lg shadow-lg hover:shadow-xl transition-all flex items-center">
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <FlightBookingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showAccomForm, setShowAccomForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Accommodation button handler
  const handleAccomButtonClick = () => {
    Swal.fire({
      icon: "info",
      title: "We are working to make this service functional",
      text: "This feature is coming soon!",
      confirmButtonText: "OK",
    });
  };

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    message: "",
  });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.email || !formData.fullName || !formData.message) {
      Toast.fire({
        icon: "error",
        title: "Please fill in all required fields (Email, Name, and Message)",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Toast.fire({
        icon: "error",
        title: "Please enter a valid email address",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // --- Send to Vigica API ---
      const vigicaForm = new FormData();
      vigicaForm.append("FullName", formData.fullName);
      vigicaForm.append("SendersEmail", formData.email);
      vigicaForm.append("SendersPhone", formData.phone);
      vigicaForm.append("Message", formData.message);

      await apiInstance.post("Enquiry", vigicaForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Toast.fire({
        icon: "success",
        title: "Message sent successfully! We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        email: "",
        phone: "",
        fullName: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      Toast.fire({
        icon: "error",
        title:
          "Failed to send message. Please try again or contact us directly at +234 901 445 6659",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Header />

          {/* Hero Section - adjusted to work with the header */}
          <section
            id="home"
            className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Your trusted pathway to{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    GLOBAL OPPORTUNITIES
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  A multidimensional consultancy firm offering specialized
                  services in international education recruitment, advisory,
                  programme coordination, travel logistics, and accommodation
                  solutions.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link to="/register" className="text-decoration-none">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 hover:-translate-y-1 transition-all duration-300 group"
                    >
                      Start Your Application
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center text-white"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-white"
                >
                  <h3 className="text-xl font-bold mb-3">
                    Admission & Immigration Services
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    A dependable partner in education, travel, and hospitality.
                    Our tailored services, unwavering commitment to quality, and
                    excellent client relations make us a preferred consultancy
                    in Nigeria and beyond.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop"
                      alt="Students collaborating"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                    <div className="absolute -bottom-6 -right-6 w-48 h-32 bg-white rounded-xl shadow-xl p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          500+
                        </div>
                        <div className="text-gray-600 text-sm">
                          Happy Students
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">
                    About Us
                  </Badge>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    A Multi-dimensional Consultancy Firm
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Specialized services in international education recruitment,
                    advisory, programme coordination, travel logistics, and
                    accommodation solutions. We also facilitate transnational
                    partnership and collaboration between institutions.
                    Strategically headquartered in Abuja, Nigeria, we pride
                    ourselves on delivering tailored, high-impact services that
                    meet the dynamic needs of students, institutions, travelers,
                    and corporate partners.
                  </p>
                  <Link to="/register" className="text-decoration-none">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      Start Your Journey
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">
                  Our Services
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Unparalleled Consultancy from Seasoned Experts
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Empowering individuals and institutions globally by providing
                  comprehensive educational consultancy, streamlined visa and
                  travel solutions, and exceptional accommodation and
                  partnership services.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {servicesData.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-2">
                      <CardContent className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                          <service.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {service.title}
                        </h3>
                        <ul className="space-y-2 mb-6">
                          {service.points.map((point, pointIndex) => (
                            <li
                              key={pointIndex}
                              className="flex items-center text-gray-600"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
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

          {/* Study Abroad Section */}
          <section
            id="study"
            className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">
                  Study Abroad
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Visa advisory, Scholarship support, & Pre-departure
                  orientation
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Personalized visa application guidance and documentation
                  support, comprehensive orientation, airport pickup, and
                  arrival guidance.
                </p>

                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    Start Your Application
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                    alt="University campus"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  {[
                    {
                      title: "Expert Guidance",
                      desc: "Get personalized advice from our experienced consultants",
                    },
                    {
                      title: "Document Support",
                      desc: "Complete assistance with application documents and requirements",
                    },
                    {
                      title: "Visa Success",
                      desc: "96% success rate in visa applications across all countries",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Flight Booking Section */}
          <section
            id="flights"
            className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">
                  Flight Booking
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Start Booking Your Flight Now
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get the best deals on flights with our premium booking
                  service. We ensure competitive prices and personalized support
                  throughout your journey.
                </p>
              </motion.div>

              <FlightBookingForm />

              {/* Flight Banner */}
              <motion.div
                className="mt-16 rounded-3xl overflow-hidden shadow-2xl relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1200&h=400&q=80"
                  alt="Airplane in flight"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60 flex items-center">
                  <div className="px-10 md:px-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Experience World-Class Service
                    </h3>
                    <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                      Book your flights with confidence knowing that our
                      dedicated team is committed to making your journey as
                      smooth and comfortable as possible.
                    </p>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium shadow-lg transition-all"
                    >
                      Contact Us About Flights
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Accommodation Section */}
          <section
            id="accommodation"
            className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="bg-purple-100 text-purple-700 mb-4 px-3 py-1">
                  Accommodation
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Find Your Perfect Stay
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  We offer a range of accommodation options from budget-friendly
                  hostels to luxury hotels, ensuring you find the perfect place
                  to stay during your travels or studies abroad.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  onClick={handleAccomButtonClick}
                >
                  Browse Accommodations
                </Button>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    title: "Student Hostels",
                    image: OrlandoExternal,
                    desc: "Affordable accommodation options specially designed for students near universities.",
                  },
                  {
                    title: "Serviced Apartments",
                    image:
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
                    desc: "Fully furnished apartments with amenities for short or long-term stays.",
                  },
                  {
                    title: "Student Apartments",
                    image: OrlandoSilver,
                    desc: "Luxury accommodations with premium services for business travelers.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg group hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 sm:p-8 md:p-12">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                      Accommodation Booking Assistance
                    </h3>
                    <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
                      Our team work with local estate agents and landlords to
                      ensure we meet all your accommodation needs. All you need
                      to do is to complete the accommodation form.
                    </p>
                    <Button
                      onClick={() => setShowAccomForm(true)}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white py-2.5"
                    >
                      Book Accommodation Now
                    </Button>
                  </div>

                  <div className="flex flex-col">
                    <div className="relative h-48 sm:h-64 md:min-h-[360px] lg:min-h-[420px]">
                      <img
                        src={RentalHouse}
                        alt="Accommodation"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/40" />

                      <div className="absolute inset-0 hidden sm:flex items-center justify-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 max-w-sm mx-6 text-center">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            Need Special Arrangements?
                          </h4>
                          <p className="text-gray-700 text-sm sm:text-base">
                            We can arrange family accommodations, accessible
                            rooms, or group bookings with special requirements.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:hidden px-4 py-3">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                        <h4 className="text-base font-semibold text-gray-900 mb-1.5">
                          Need Special Arrangements?
                        </h4>
                        <p className="text-gray-700 text-sm">
                          We can arrange family accommodations, accessible
                          rooms, or group bookings with special requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Accommodation Form Modal */}
          <Modal
            open={showAccomForm}
            onClose={() => setShowAccomForm(false)}
            title="Accommodation Booking Assistance"
            size="md"
          >
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input type="text" className="w-full mb-2" />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select className="w-full mb-2 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Contact Telephone
                </label>
                <Input type="tel" className="w-full mb-2" />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" className="w-full mb-2" />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <Input
                  type="text"
                  placeholder="City, Country"
                  className="w-full mb-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accommodation Type
                </label>
                <select className="w-full mb-2 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <option>Select Accommodation Type</option>
                  <option>Student Hostel (10 months) tenor</option>
                  <option>
                    1-Bedroom apartment (6 months) assured tenancy (AST)
                  </option>
                  <option>
                    2-Bedroom apartments (6 months) assured tenancy (AST)
                  </option>
                  <option>
                    3-Bedroom apartments (6 months) assured tenancy (AST)
                  </option>
                  <option>Service accommodation (short stay)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (per night/month)
                </label>
                <Input
                  type="text"
                  placeholder="Budget range"
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5">
                  Request Options
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAccomForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Modal>

          {/* Contact Section */}
          <section id="contact" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">
                  Contact Us
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Book a Free Consultation Today
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get personalized guidance for your study abroad journey,
                  travel plans, or hotel bookings. Our experts are here to
                  assist you with all your needs.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Requesting A Call
                      </h3>
                      <p className="text-gray-600">+234 901 445 6659</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Info className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Got issues? Call Our Tech Team
                      </h3>
                      <div className="text-gray-600 flex flex-col lg:flex-row lg:items-center lg:gap-4 gap-2">
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" /> +44 730 979 4839
                        </p>
                        <span className="hidden lg:inline">|</span>
                        <p className="flex items-center gap-2">
                          <Email className="w-4 h-4" />{" "}
                          signalls247@vigicaconsult.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Open Hours
                      </h3>
                      <p className="text-gray-600">
                        8 am - 9pm (Closed on Sunday)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Location
                      </h3>
                      <p className="text-gray-600">
                        Plot 114/115, Okay Water, Lugbe, Abuja
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Contact form */}

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card className="border-0 shadow-2xl">
                    <CardContent className="p-8">
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Your Email *
                            </label>
                            <Input
                              type="email"
                              placeholder="Enter Email Address"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Your Phone
                            </label>
                            <Input
                              type="tel"
                              placeholder="Enter Phone No."
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Your Full Name *
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter name"
                            value={formData.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Message *
                          </label>
                          <Textarea
                            placeholder="Write your message here..."
                            rows={4}
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="mr-2">Sending...</span>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </>
                          ) : (
                            "Book Free Consultation"
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
