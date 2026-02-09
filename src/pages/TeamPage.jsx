import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaUserPlus,
} from "react-icons/fa";
import { teamApi } from "../utils/teamApi";
import Header from "../components/landing/Header";
import "../styles/TeamPage.css";

// Default profile image
const defaultProfile = "/default-profile.jpg";

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await teamApi.getTeamMembers();
      const members = data.results || data;
      setTeamMembers(members);

      // Extract unique departments
      const uniqueDepartments = [
        ...new Set(members.map((m) => m.department).filter(Boolean)),
      ];
      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers =
    filter === "all"
      ? teamMembers
      : filter === "featured"
        ? teamMembers.filter((m) => m.is_featured)
        : teamMembers.filter((m) => m.department === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="team-page">
      <Header />

      {/* Hero Section */}
      <section className="team-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Dedicated professionals committed to your success
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="team-content">
        <div className="container mx-auto px-4 py-12">
          {/* Filter & Actions Bar */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div className="filter-buttons flex flex-wrap gap-2">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === "featured" ? "active" : ""}`}
                onClick={() => setFilter("featured")}
              >
                Featured
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  className={`filter-btn ${filter === dept ? "active" : ""}`}
                  onClick={() => setFilter(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>

            <Link to="/team/apply" className="join-team-btn">
              <FaUserPlus className="mr-2" />
              Join Our Team
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading team members...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchTeamMembers} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredMembers.length === 0 && (
            <div className="empty-container">
              <p>No team members found.</p>
            </div>
          )}

          {/* Team Grid */}
          {!loading && !error && filteredMembers.length > 0 && (
            <motion.div
              className="team-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="team-card"
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {member.is_featured && (
                    <div className="featured-badge">Featured</div>
                  )}

                  <div className="card-image">
                    <img
                      src={member.profile_picture_url || defaultProfile}
                      alt={member.full_name}
                      onError={(e) => {
                        e.target.src = defaultProfile;
                      }}
                    />
                  </div>

                  <div className="card-content">
                    <h3 className="member-name">{member.full_name}</h3>
                    <p className="member-position">{member.position}</p>
                    {member.department && (
                      <p className="member-department">{member.department}</p>
                    )}
                    <p className="member-bio">{member.short_bio}</p>

                    {/* Social Links */}
                    <div className="social-links">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link linkedin"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a
                          href={member.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link twitter"
                        >
                          <FaTwitter />
                        </a>
                      )}
                      {member.facebook_url && (
                        <a
                          href={member.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link facebook"
                        >
                          <FaFacebook />
                        </a>
                      )}
                      {member.instagram_url && (
                        <a
                          href={member.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/team/${member.id}`}
                      className="view-profile-btn"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Back to Home */}
      <div className="back-home-container">
        <Link to="/" className="back-home-btn">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default TeamPage;
