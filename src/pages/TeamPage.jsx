import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaArrowLeft,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { teamApi } from "../utils/teamApi";
import Header from "../components/landing/Header";
import "../styles/TeamPage.css";

// Default profile image
const defaultProfile = "/default-profile.jpg";

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

// Team Member Card Component
const TeamMemberCard = ({
  member,
  cardVariants,
  getImageUrl,
  defaultProfile,
}) => (
  <motion.div
    className="team-card"
    variants={cardVariants}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    {member.is_featured && <div className="featured-badge">Featured</div>}

    <Link to={`/team/${member.id}`} className="card-image">
      <img
        src={getImageUrl(member.profile_picture_url)}
        alt={member.full_name}
        onError={(e) => {
          e.target.src = defaultProfile;
        }}
      />
    </Link>

    <div className="card-content">
      <h3 className="member-name">{member.full_name}</h3>
      <p className="member-position">{member.position}</p>
      {member.department && (
        <p className="member-department">{member.department}</p>
      )}
      {member.category_name && (
        <p className="member-category text-sm text-blue-600">
          {member.category_name}
        </p>
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

      <Link to={`/team/${member.id}`} className="view-profile-btn">
        View Profile
      </Link>
    </div>
  </motion.div>
);

function TeamPage() {
  const [categorizedTeam, setCategorizedTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("categories"); // "categories" or "all"
  const [collapsedCategories, setCollapsedCategories] = useState({});

  useEffect(() => {
    fetchTeamByCategory();
  }, []);

  const fetchTeamByCategory = async () => {
    try {
      setLoading(true);
      const data = await teamApi.getTeamMembersByCategory();
      setCategorizedTeam(data);

      // Initialize collapsed state based on category settings
      const initialCollapsed = {};
      data.forEach((item) => {
        if (item.category) {
          initialCollapsed[item.category.id || "uncategorized"] =
            item.category.collapsed_by_default || false;
        }
      });
      setCollapsedCategories(initialCollapsed);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Get all team members from all categories
  const allMembers = categorizedTeam.flatMap((item) => item.members || []);

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
          {/* View Mode Toggle & Actions Bar */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div className="view-toggle flex gap-2">
              <button
                className={`filter-btn ${viewMode === "categories" ? "active" : ""}`}
                onClick={() => setViewMode("categories")}
              >
                By Category
              </button>
              <button
                className={`filter-btn ${viewMode === "all" ? "active" : ""}`}
                onClick={() => setViewMode("all")}
              >
                All Members
              </button>
            </div>

            <div className="action-buttons">
              <Link to="/book" className="book-btn">
                <FaCalendarAlt className="mr-2" />
                Book Appointment
              </Link>
            </div>
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
              <button onClick={fetchTeamByCategory} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && allMembers.length === 0 && (
            <div className="empty-container">
              <p>No team members found.</p>
            </div>
          )}

          {/* Categories View */}
          {!loading &&
            !error &&
            viewMode === "categories" &&
            categorizedTeam.length > 0 && (
              <div className="categories-container">
                {categorizedTeam.map((item) => {
                  const category = item.category;
                  const categoryId = category?.id || "uncategorized";

                  return (
                    <div key={categoryId} className="category-section mb-10">
                      {/* Category Header */}
                      <div
                        className="category-header flex items-center justify-between cursor-pointer p-4 bg-gray-100 rounded-lg mb-4 hover:bg-gray-200 transition-colors"
                        onClick={() => toggleCategory(categoryId)}
                      >
                        <div className="flex items-center gap-3">
                          {category?.icon && (
                            <span className="category-icon text-2xl">
                              {category.icon}
                            </span>
                          )}
                          <div>
                            <h2
                              className="text-xl font-bold"
                              style={{ color: category?.color || "#1a1a2e" }}
                            >
                              {category?.name || "Other"}
                            </h2>
                            {category?.description && (
                              <p className="text-gray-600 text-sm">
                                {category.description}
                              </p>
                            )}
                          </div>
                          <span className="member-count bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm ml-2">
                            {item.members?.length || 0} members
                          </span>
                        </div>
                        <button className="collapse-btn p-2">
                          {collapsedCategories[categoryId] ? (
                            <FaChevronDown className="text-gray-500" />
                          ) : (
                            <FaChevronUp className="text-gray-500" />
                          )}
                        </button>
                      </div>

                      {/* Category Members */}
                      <AnimatePresence>
                        {!collapsedCategories[categoryId] &&
                          item.members?.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                className="team-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                {item.members.map((member) => (
                                  <TeamMemberCard
                                    key={member.id}
                                    member={member}
                                    cardVariants={cardVariants}
                                    getImageUrl={getImageUrl}
                                    defaultProfile={defaultProfile}
                                  />
                                ))}
                              </motion.div>
                            </motion.div>
                          )}
                      </AnimatePresence>

                      {/* Empty category message */}
                      {!collapsedCategories[categoryId] &&
                        (!item.members || item.members.length === 0) && (
                          <p className="text-gray-500 text-center py-4">
                            No team members in this category yet.
                          </p>
                        )}
                    </div>
                  );
                })}
              </div>
            )}

          {/* All Members View */}
          {!loading &&
            !error &&
            viewMode === "all" &&
            allMembers.length > 0 && (
              <motion.div
                className="team-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {allMembers.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    cardVariants={cardVariants}
                    getImageUrl={getImageUrl}
                    defaultProfile={defaultProfile}
                  />
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
