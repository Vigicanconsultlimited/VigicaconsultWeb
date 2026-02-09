import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";
import { teamApi } from "../utils/teamApi";
import Header from "../components/landing/Header";
import "../styles/TeamMemberProfile.css";

// Default profile image
const defaultProfile = "/default-profile.jpg";

function TeamMemberProfile() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const data = await teamApi.getTeamMemberDetails(id);
      setMember(data);
    } catch (err) {
      console.error("Error fetching member details:", err);
      setError("Failed to load team member details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Header />
        <div className="error-container">
          <p>{error}</p>
          <Link to="/team" className="back-btn">
            <FaArrowLeft className="mr-2" />
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="profile-page">
        <Header />
        <div className="error-container">
          <p>Team member not found.</p>
          <Link to="/team" className="back-btn">
            <FaArrowLeft className="mr-2" />
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />

      {/* Profile Content */}
      <section className="profile-content">
        <div className="container mx-auto px-4 py-12">
          <Link to="/team" className="back-link">
            <FaArrowLeft className="mr-2" />
            Back to Team
          </Link>

          <motion.div
            className="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="profile-header">
              <div className="profile-image-container">
                <img
                  src={member.profile_picture_url || defaultProfile}
                  alt={member.full_name}
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = defaultProfile;
                  }}
                />
              </div>

              <div className="profile-info">
                <h1 className="member-name">{member.full_name}</h1>
                <p className="member-position">{member.position}</p>
                {member.department && (
                  <p className="member-department">{member.department}</p>
                )}

                {/* Contact Info */}
                <div className="contact-info">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="contact-item">
                      <FaEnvelope />
                      <span>{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="contact-item">
                      <FaPhone />
                      <span>{member.phone}</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                <div className="social-links-profile">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                      title="LinkedIn"
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
                      title="Twitter"
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
                      title="Facebook"
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
                      title="Instagram"
                    >
                      <FaInstagram />
                    </a>
                  )}
                  {member.website_url && (
                    <a
                      href={member.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link website"
                      title="Website"
                    >
                      <FaGlobe />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Biography Section */}
            <div className="profile-bio">
              <h2>About</h2>
              <p className="short-bio">{member.short_bio}</p>
              {member.full_bio && (
                <div className="full-bio">
                  {member.full_bio.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default TeamMemberProfile;
