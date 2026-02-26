import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import { authApi } from "../utils/teamAuthApi";
import Header from "../components/landing/Header";
import "../styles/TeamAuth.css";

function TeamLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authApi.login(formData.email, formData.password);
      navigate("/team/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Invalid email or password",
      );
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
              <FaSignInAlt className="auth-icon" />
              <h1>Team Member Login</h1>
              <p>Access your team dashboard</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/team/register">Register here</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default TeamLogin;
