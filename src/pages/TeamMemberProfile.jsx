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
import VigicaLoader from "../components/shared/VigicaLoader";
import "../styles/TeamMemberProfile.css";

// Default profile image
const defaultProfile = "/default-profile.jpg";

// Vigica company social links — used as fallback when a member hasn't set their own
const VIGICA_SOCIALS = {
  linkedin:
    "https://www.linkedin.com/company/vigica-consult-limited/about/?viewAsMember=true",
  twitter: "https://x.com/vigicaconsult?t=_E90eYcUQ-mPotS-MhX4Mw&s=09",
  facebook: "https://www.facebook.com/profile.php?id=61587336548001",
  instagram: "https://www.instagram.com/vigica_consult?igsh=MXYzNmR3ZjZ3c3V2Zw==",
};

// Base URL for media files (Django server)
const MEDIA_BASE_URL = import.meta.env.PROD
  ? "" // Production: Cloudinary returns full URLs
  : "http://127.0.0.1:8000"; // Development: Django local server

// Helper to get full image URL
const getImageUrl = (url) => {
  if (!url) return defaultProfile;
  // If it's already a full URL (Cloudinary), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Otherwise, prepend the Django server URL
  return `${MEDIA_BASE_URL}${url}`;
};

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
        <VigicaLoader variant="inline" size="lg" text="Loading profile..." />
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
                  src={getImageUrl(member.profile_picture_url)}
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
                  <a
                    href={member.linkedin_url || VIGICA_SOCIALS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link linkedin"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={member.twitter_url || VIGICA_SOCIALS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link twitter"
                    title="Twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={member.facebook_url || VIGICA_SOCIALS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link facebook"
                    title="Facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href={member.instagram_url || VIGICA_SOCIALS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link instagram"
                    title="Instagram"
                  >
                    <FaInstagram />
                  </a>
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
