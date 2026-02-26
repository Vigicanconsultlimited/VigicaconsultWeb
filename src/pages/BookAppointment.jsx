import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheck,
} from "react-icons/fa";
import { publicBookingApi } from "../utils/teamAuthApi";
import Header from "../components/landing/Header";
import "../styles/BookAppointment.css";

// Default profile image
const defaultProfile = "/default-profile.jpg";

function BookAppointment() {
  const { teamMemberId } = useParams();
  const [step, setStep] = useState(1); // 1: Select Date, 2: Select Time, 3: Enter Details, 4: Confirmation
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    title: "",
    description: "",
  });
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, [teamMemberId]);

  const loadInitialData = async () => {
    try {
      const [membersData, servicesData] = await Promise.all([
        publicBookingApi.getTeamMembers(),
        publicBookingApi.getServices(),
      ]);

      setTeamMembers(membersData);
      setServices(servicesData.results || servicesData);

      // If teamMemberId is provided, pre-select that member
      if (teamMemberId) {
        const member = membersData.find(
          (m) => m.team_member_id === teamMemberId,
        );
        if (member) {
          setSelectedMember(member);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load booking data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlotsLoading(true);

    try {
      const data = await publicBookingApi.getAvailableSlots(
        selectedMember.team_member_id,
        date,
        selectedService?.id,
      );
      setAvailableSlots(data.slots || []);
    } catch (err) {
      console.error("Error loading slots:", err);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const appointmentData = {
        team_member_id: selectedMember.team_member_id,
        service_type: selectedService?.id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        title:
          formData.title ||
          `Appointment with ${selectedMember.team_member_name}`,
        description: formData.description,
        start_datetime: selectedSlot.start,
        end_datetime: selectedSlot.end,
      };

      const result = await publicBookingApi.bookAppointment(appointmentData);
      setBookingResult(result.appointment);
      setStep(4);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Failed to book appointment. Please try again.",
      );
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="book-appointment-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment-page">
      <Header />

      <section className="booking-content">
        <div className="container mx-auto px-4 py-12">
          <Link to="/team" className="back-link">
            <FaArrowLeft className="mr-2" />
            Back to Team
          </Link>

          <motion.div
            className="booking-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress Steps */}
            <div className="booking-steps">
              <div className={`step ${step >= 1 ? "active" : ""}`}>
                <span className="step-number">1</span>
                <span className="step-label">Select Team Member</span>
              </div>
              <div className={`step ${step >= 2 ? "active" : ""}`}>
                <span className="step-number">2</span>
                <span className="step-label">Choose Time</span>
              </div>
              <div className={`step ${step >= 3 ? "active" : ""}`}>
                <span className="step-number">3</span>
                <span className="step-label">Your Details</span>
              </div>
              <div className={`step ${step >= 4 ? "active" : ""}`}>
                <span className="step-number">4</span>
                <span className="step-label">Confirmation</span>
              </div>
            </div>

            {error && <div className="booking-error">{error}</div>}

            {/* Step 1: Select Team Member */}
            {step === 1 && (
              <div className="step-content">
                <h2>Select a Team Member</h2>
                <p className="step-desc">
                  Choose who you'd like to book an appointment with
                </p>

                {teamMembers.length === 0 ? (
                  <p className="no-data">
                    No team members available for booking
                  </p>
                ) : (
                  <div className="team-members-grid">
                    {teamMembers.map((member) => (
                      <div
                        key={member.team_member_id}
                        className={`member-option ${
                          selectedMember?.team_member_id ===
                          member.team_member_id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => setSelectedMember(member)}
                      >
                        <img
                          src={member.profile_picture_url || defaultProfile}
                          alt={member.team_member_name}
                          onError={(e) => (e.target.src = defaultProfile)}
                        />
                        <h4>{member.team_member_name}</h4>
                        <p>{member.position || "Team Member"}</p>
                      </div>
                    ))}
                  </div>
                )}

                {services.length > 0 && selectedMember && (
                  <div className="service-selection">
                    <h3>Select Service (Optional)</h3>
                    <div className="services-list">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`service-option ${
                            selectedService?.id === service.id ? "selected" : ""
                          }`}
                          onClick={() => setSelectedService(service)}
                        >
                          <span className="service-name">{service.name}</span>
                          <span className="service-duration">
                            {service.duration_minutes} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="step-actions">
                  <button
                    className="btn-primary"
                    onClick={() => setStep(2)}
                    disabled={!selectedMember}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 2 && (
              <div className="step-content">
                <h2>Choose Date & Time</h2>
                <p className="step-desc">
                  Booking with {selectedMember?.team_member_name}
                </p>

                <div className="datetime-selection">
                  <div className="date-picker">
                    <label>
                      <FaCalendarAlt /> Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                    />
                  </div>

                  {selectedDate && (
                    <div className="time-slots">
                      <label>
                        <FaClock /> Available Times
                      </label>
                      {slotsLoading ? (
                        <div className="slots-loading">
                          Loading available times...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <p className="no-slots">
                          No available times for this date. Please select
                          another date.
                        </p>
                      ) : (
                        <div className="slots-grid">
                          {availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              className={`slot-btn ${
                                selectedSlot?.start === slot.start
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              {slot.start_time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => setStep(3)}
                    disabled={!selectedSlot}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Enter Details */}
            {step === 3 && (
              <div className="step-content">
                <h2>Your Details</h2>
                <p className="step-desc">
                  Please enter your contact information
                </p>

                <form onSubmit={handleSubmit} className="booking-form">
                  <div className="form-group">
                    <label>
                      <FaUser /> Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_name: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FaEnvelope /> Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FaPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.client_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_phone: e.target.value,
                        })
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Subject/Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="What is this appointment about?"
                    />
                  </div>

                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="booking-summary">
                    <h3>Booking Summary</h3>
                    <div className="summary-item">
                      <span>Team Member:</span>
                      <strong>{selectedMember?.team_member_name}</strong>
                    </div>
                    {selectedService && (
                      <div className="summary-item">
                        <span>Service:</span>
                        <strong>{selectedService.name}</strong>
                      </div>
                    )}
                    <div className="summary-item">
                      <span>Date:</span>
                      <strong>
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </strong>
                    </div>
                    <div className="summary-item">
                      <span>Time:</span>
                      <strong>
                        {selectedSlot?.start_time} - {selectedSlot?.end_time}
                      </strong>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn-primary">
                      Book Appointment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && bookingResult && (
              <div className="step-content confirmation">
                <div className="confirmation-icon">
                  <FaCheck />
                </div>
                <h2>Appointment Booked!</h2>
                <p className="step-desc">
                  Your appointment has been successfully scheduled
                </p>

                <div className="confirmation-details">
                  <div className="detail-item">
                    <span>Confirmation ID:</span>
                    <strong>{bookingResult.id?.slice(0, 8)}...</strong>
                  </div>
                  <div className="detail-item">
                    <span>With:</span>
                    <strong>{bookingResult.team_member_name}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Date & Time:</span>
                    <strong>
                      {new Date(bookingResult.start_datetime).toLocaleString()}
                    </strong>
                  </div>
                  <div className="detail-item">
                    <span>Status:</span>
                    <span className={`status-badge ${bookingResult.status}`}>
                      {bookingResult.status}
                    </span>
                  </div>
                </div>

                <p className="confirmation-note">
                  A confirmation email will be sent to {formData.client_email}
                </p>

                <div className="step-actions">
                  <Link to="/team" className="btn-primary">
                    Back to Team Page
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default BookAppointment;
