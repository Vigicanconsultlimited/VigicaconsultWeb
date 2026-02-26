import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserPlus,
  FaArrowLeft,
} from "react-icons/fa";
import { authApi } from "../utils/teamAuthApi";
import Header from "../components/landing/Header";
import "../styles/TeamAuth.css";

function TeamRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Validate passwords match
    if (formData.password !== formData.password_confirm) {
      setFieldErrors({ password_confirm: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      await authApi.register(formData);
      navigate("/team/dashboard");
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          setFieldErrors(data);
          setError("Please fix the errors below");
        } else {
          setError(data.detail || "Registration failed");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-auth-page">
      <Header />

      <section className="auth-content">
        <div className="container mx-auto px-4 py-12">
          <Link to="/team" className="back-link">
            <FaArrowLeft className="mr-2" />
            Back to Team
          </Link>

          <motion.div
            className="auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="auth-header">
              <FaUserPlus className="auth-icon" />
              <h1>Team Member Registration</h1>
              <p>Create your team account</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">
                    <FaUser /> First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                  {fieldErrors.first_name && (
                    <span className="field-error">
                      {fieldErrors.first_name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">
                    <FaUser /> Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                  {fieldErrors.last_name && (
                    <span className="field-error">{fieldErrors.last_name}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={8}
                />
                {fieldErrors.password && (
                  <span className="field-error">{fieldErrors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password_confirm">
                  <FaLock /> Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirm"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                {fieldErrors.password_confirm && (
                  <span className="field-error">
                    {fieldErrors.password_confirm}
                  </span>
                )}
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <Link to="/team/login">Sign in here</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default TeamRegister;
