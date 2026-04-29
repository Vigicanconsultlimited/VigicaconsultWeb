import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLinkedin, FaTwitter, FaFacebook, FaInstagram,
  FaArrowLeft, FaCalendarAlt, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import { teamApi } from "../utils/teamApi";
import Header from "../components/landing/Header";
import VigicaLoader from "../components/shared/VigicaLoader";

const defaultProfile = "/default-profile.jpg";

const VIGICA_SOCIALS = {
  linkedin: "https://www.linkedin.com/company/vigica-consult-limited/about/?viewAsMember=true",
  twitter: "https://x.com/vigicaconsult?t=_E90eYcUQ-mPotS-MhX4Mw&s=09",
  facebook: "https://www.facebook.com/profile.php?id=61587336548001",
  instagram: "https://www.instagram.com/vigica_consult?igsh=MXYzNmR3ZjZ3c3V2Zw==",
};

const MEDIA_BASE_URL = import.meta.env.PROD ? "" : "http://127.0.0.1:8000";

const getImageUrl = (url) => {
  if (!url) return defaultProfile;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${MEDIA_BASE_URL}${url}`;
};

// ─── Styles ───────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

  .tp-root {
    min-height: 100vh;
    background: #f8f9fc;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Hero ── */
  .tp-hero {
    position: relative;
    min-height: 52vh;
    display: flex;
    align-items: flex-end;
    background: linear-gradient(135deg, #0f2057 0%, #1e3a8a 55%, #2563eb 100%);
    overflow: hidden;
    padding: 0 2rem 4rem;
  }
  .tp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.35) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(254,208,22,0.12) 0%, transparent 50%);
  }
  .tp-hero-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .tp-hero-inner {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  .tp-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(254,208,22,0.15);
    border: 1px solid rgba(254,208,22,0.3);
    color: #fed016;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 20px;
  }
  .tp-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 700;
    color: #fff;
    line-height: 1.08;
    margin: 0 0 16px;
    max-width: 640px;
  }
  .tp-hero-title em {
    font-style: italic;
    color: #fed016;
  }
  .tp-hero-sub {
    color: rgba(255,255,255,0.65);
    font-size: 17px;
    font-weight: 300;
    max-width: 420px;
    line-height: 1.6;
    margin: 0;
  }
  .tp-hero-actions {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    gap: 12px;
  }
  .tp-book-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fed016;
    color: #0f2057;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 24px;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .tp-book-btn:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }

  /* ── Toolbar ── */
  .tp-toolbar {
    background: #fff;
    border-bottom: 1px solid #e8eaf0;
    position: sticky;
    top: 0;
    z-index: 50;
    padding: 0 2rem;
  }
  .tp-toolbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 56px;
  }
  .tp-tab {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    border: none;
    background: none;
    cursor: pointer;
    position: relative;
    transition: color 0.2s;
  }
  .tp-tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #2563eb;
    transform: scaleX(0);
    transition: transform 0.2s;
    border-radius: 2px 2px 0 0;
  }
  .tp-tab.active { color: #2563eb; }
  .tp-tab.active::after { transform: scaleX(1); }
  .tp-tab:hover { color: #2563eb; }
  .tp-count-badge {
    background: #eff6ff;
    color: #2563eb;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    margin-left: 8px;
  }

  /* ── Main ── */
  .tp-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 2rem 80px;
  }

  /* ── Category Section ── */
  .tp-cat-section { margin-bottom: 56px; }
  .tp-cat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 16px;
    margin-bottom: 28px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  .tp-cat-header:hover {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.06);
  }
  .tp-cat-header-left { display: flex; align-items: center; gap: 16px; }
  .tp-cat-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #1e3a8a, #2563eb);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .tp-cat-name {
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #0f2057;
    margin: 0 0 2px;
  }
  .tp-cat-desc {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }
  .tp-cat-pill {
    background: #eff6ff;
    color: #2563eb;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 100px;
  }
  .tp-collapse-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f3f4f6;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .tp-collapse-btn:hover { background: #e5e7eb; }

  /* ── Team Grid ── */
  .tp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  /* ── Member Card ── */
  .tp-card {
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .tp-card:hover {
    border-color: #2563eb;
    box-shadow: 0 20px 48px rgba(37,99,235,0.12);
    transform: translateY(-4px);
  }
  .tp-card-img-wrap {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: linear-gradient(135deg, #e0e7ff, #dbeafe);
  }
  .tp-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  .tp-card:hover .tp-card-img-wrap img { transform: scale(1.05); }
  .tp-featured-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #fed016;
    color: #0f2057;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    z-index: 2;
  }
  .tp-card-socials {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(to top, rgba(15,32,87,0.85), transparent);
    transform: translateY(100%);
    transition: transform 0.3s;
  }
  .tp-card:hover .tp-card-socials { transform: translateY(0); }
  .tp-social-a {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    text-decoration: none;
    transition: background 0.2s;
  }
  .tp-social-a:hover { background: rgba(255,255,255,0.3); }
  .tp-card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .tp-card-cat {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #2563eb;
    margin: 0 0 6px;
  }
  .tp-card-name {
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #0f2057;
    margin: 0 0 4px;
  }
  .tp-card-position {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 12px;
    font-weight: 400;
  }
  .tp-card-bio {
    font-size: 13px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0 0 20px;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .tp-view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    background: #eff6ff;
    color: #2563eb;
    font-size: 13px;
    font-weight: 600;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s;
    margin-top: auto;
  }
  .tp-view-btn:hover {
    background: #2563eb;
    color: #fff;
  }

  /* ── States ── */
  .tp-error {
    text-align: center;
    padding: 64px 24px;
    background: #fff;
    border-radius: 20px;
    border: 1px solid #fee2e2;
  }
  .tp-error p { color: #dc2626; margin-bottom: 16px; font-size: 15px; }
  .tp-retry-btn {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .tp-retry-btn:hover { background: #1d4ed8; }
  .tp-empty {
    text-align: center;
    padding: 64px 24px;
    color: #6b7280;
    font-size: 15px;
    background: #fff;
    border-radius: 20px;
    border: 1px dashed #d1d5db;
  }
  .tp-cat-empty {
    text-align: center;
    padding: 32px;
    color: #9ca3af;
    font-size: 14px;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px dashed #e5e7eb;
  }

  /* ── Back ── */
  .tp-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #2563eb;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 10px;
    background: #eff6ff;
    transition: all 0.2s;
    margin: 0 2rem 40px;
  }
  .tp-back:hover { background: #2563eb; color: #fff; }

  @media (max-width: 640px) {
    .tp-hero { padding: 0 1rem 3rem; min-height: 44vh; }
    .tp-hero-actions { position: static; margin-top: 24px; }
    .tp-main { padding: 32px 1rem 60px; }
    .tp-grid { grid-template-columns: 1fr; }
    .tp-back { margin: 0 1rem 32px; }
  }
`;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ─── Helper: derive a safe, stable category key ───────
// FIX: Centralised so it's used consistently everywhere — avoids
//      "item.category.id" TypeError when category is null/undefined.
const getCategoryKey = (category) =>
  category?.id != null ? String(category.id) : "uncategorized";

// ─── Member Card ──────────────────────────────────────
const TeamMemberCard = ({ member, index }) => {
  return (
    <motion.div
      className="tp-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      {/* Image */}
      <Link to={`/team/${member.id}`} className="tp-card-img-wrap" style={{ display: "block" }}>
        {member.is_featured && <div className="tp-featured-badge">⭐ Featured</div>}
        <img
          src={getImageUrl(member.profile_picture_url)}
          alt={member.full_name}
          onError={(e) => { e.target.src = defaultProfile; }}
        />
        {/* Social overlay */}
        <div className="tp-card-socials" onClick={(e) => e.preventDefault()}>
          {[
            { href: member.linkedin_url || VIGICA_SOCIALS.linkedin, icon: <FaLinkedin /> },
            { href: member.twitter_url || VIGICA_SOCIALS.twitter, icon: <FaTwitter /> },
            { href: member.facebook_url || VIGICA_SOCIALS.facebook, icon: <FaFacebook /> },
            { href: member.instagram_url || VIGICA_SOCIALS.instagram, icon: <FaInstagram /> },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="tp-social-a">
              {s.icon}
            </a>
          ))}
        </div>
      </Link>

      {/* Body */}
      <div className="tp-card-body">
        {member.category_name && (
          <p className="tp-card-cat">{member.category_name}</p>
        )}
        <h3 className="tp-card-name">{member.full_name}</h3>
        <p className="tp-card-position">
          {member.position}{member.department ? ` · ${member.department}` : ""}
        </p>
        {member.short_bio && <p className="tp-card-bio">{member.short_bio}</p>}
        <Link to={`/team/${member.id}`} className="tp-view-btn">
          View Profile →
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────
function TeamPage() {
  const [categorizedTeam, setCategorizedTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("categories");
  const [collapsedCategories, setCollapsedCategories] = useState({});

  useEffect(() => {
    fetchTeamByCategory();
  }, []);

  const fetchTeamByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamApi.getTeamMembersByCategory();

      // FIX: Guard against non-array responses so .forEach / .flatMap never throw.
      const safeData = Array.isArray(data) ? data : [];
      setCategorizedTeam(safeData);

      // FIX: Use getCategoryKey() — eliminates "Cannot read properties of null
      //      (reading 'id')" TypeError that was crashing the component silently
      //      when a category object was null, causing the blank-screen bug.
      const initialCollapsed = {};
      safeData.forEach((item) => {
        const key = getCategoryKey(item.category);
        initialCollapsed[key] = item.category?.collapsed_by_default ?? false;
      });
      setCollapsedCategories(initialCollapsed);
    } catch (err) {
      console.error("TeamPage fetch error:", err);
      setError("Failed to load team members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Use getCategoryKey() so the key always matches what was stored above.
  const toggleCategory = (categoryId) => {
    setCollapsedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  // FIX: Guard against items with missing/null members arrays.
  const allMembers = categorizedTeam.flatMap((item) => item.members ?? []);

  return (
    <>
      <style>{styles}</style>
      <div className="tp-root" style={{ paddingTop: "70px" }}>
        <Header />

        {/* ── Hero ── */}
        <section className="tp-hero">
          <div className="tp-hero-dots" />

          <div className="tp-hero-inner">
            <div style={{ maxWidth: "720px" }}>
              <div className="tp-hero-eyebrow">
                <span>👥</span> The People Behind Vigica
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  fontWeight: 700,
                  lineHeight: 1.12,
                  color: "#fff",
                  maxWidth: 720,
                  marginBottom: 24,
                  letterSpacing: "-0.5px",
                }}
              >
                Meet Our{" "}
                <em style={{ fontStyle: "italic", color: "#fed016" }}>
                  Expert
                </em>
                <br />
                Team
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  fontSize: 18,
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,.72)",
                  maxWidth: 520,
                  marginBottom: 36,
                }}
              >
                Dedicated professionals committed to opening doors to global opportunities.
              </motion.p>
            </div>

            <Link to="/book" className="tp-book-btn">
              <FaCalendarAlt /> Book Appointment
            </Link>
          </div>
        </section>

        {/* ── Sticky Toolbar ── */}
        <div className="tp-toolbar">
          <div className="tp-toolbar-inner">
            <button
              className={`tp-tab ${viewMode === "categories" ? "active" : ""}`}
              onClick={() => setViewMode("categories")}
            >
              By Category
            </button>
            <button
              className={`tp-tab ${viewMode === "all" ? "active" : ""}`}
              onClick={() => setViewMode("all")}
            >
              All Members
              {allMembers.length > 0 && (
                <span className="tp-count-badge">{allMembers.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="tp-main">

          {/* Loading State */}
          {loading && (
            <VigicaLoader
              variant="inline"
              size="lg"
              text="Loading team members..."
            />
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="tp-error">
              <p>{error}</p>
              <button onClick={fetchTeamByCategory} className="tp-retry-btn">
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && allMembers.length === 0 && (
            <div className="tp-empty">
              <p>No team members found.</p>
            </div>
          )}

          {/* Categories View */}
          {!loading && !error && viewMode === "categories" && categorizedTeam.length > 0 && (
            <div>
              {categorizedTeam.map((item) => {
                // FIX: Use getCategoryKey() — safe even when item.category is null.
                const categoryKey = getCategoryKey(item.category);
                const isCollapsed = collapsedCategories[categoryKey] ?? false;
                // FIX: Guard against null members array.
                const members = item.members ?? [];

                return (
                  <div key={categoryKey} className="tp-cat-section">
                    {/* Category Header */}
                    <div
                      className="tp-cat-header"
                      onClick={() => toggleCategory(categoryKey)}
                    >
                      <div className="tp-cat-header-left">
                        {item.category?.icon && (
                          <div className="tp-cat-icon">
                            {item.category.icon}
                          </div>
                        )}
                        <div>
                          <h2 className="tp-cat-name">
                            {item.category?.name || "Other"}
                          </h2>
                          {item.category?.description && (
                            <p className="tp-cat-desc">{item.category.description}</p>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {members.length > 0 && (
                          <span className="tp-cat-pill">{members.length} members</span>
                        )}
                        <button
                          className="tp-collapse-btn"
                          // FIX: Stop the click bubbling to the parent div so
                          //      toggleCategory isn't fired twice.
                          onClick={(e) => { e.stopPropagation(); toggleCategory(categoryKey); }}
                        >
                          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                        </button>
                      </div>
                    </div>

                    {/* Category Members */}
                    <AnimatePresence>
                      {!isCollapsed && members.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <motion.div
                            className="tp-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {members.map((member, index) => (
                              <TeamMemberCard
                                key={member.id}
                                member={member}
                                index={index}
                              />
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Empty category message */}
                    {!isCollapsed && members.length === 0 && (
                      <div className="tp-cat-empty">
                        No team members in this category yet.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* All Members View */}
          {!loading && !error && viewMode === "all" && allMembers.length > 0 && (
            <motion.div
              className="tp-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {allMembers.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                />
              ))}
            </motion.div>
          )}

        </div>

        {/* Back to Home */}
        <Link to="/" className="tp-back">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </>
  );
}

export default TeamPage;
