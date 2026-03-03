import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaCheck,
  FaSpinner,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaGlobe,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import "../styles/TeamDashboard.css";

const defaultProfile = "/default-profile.jpg";

const API_BASE_URL = import.meta.env.PROD
  ? "https://teamapi-production.up.railway.app/api/v1"
  : "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function EditProfile({
  user,
  teamMember,
  onUpdateProfile,
  onProfileCreated,
}) {
  const [categories, setCategories] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isCreating, setIsCreating] = useState(!teamMember);
  const [isEditMode, setIsEditMode] = useState(false); // New: controls whether fields are editable
  const [form, setForm] = useState({
    first_name: teamMember?.first_name || user?.first_name || "",
    last_name: teamMember?.last_name || user?.last_name || "",
    position: teamMember?.position || "",
    department: teamMember?.department || "",
    category: teamMember?.category || "",
    short_bio: teamMember?.short_bio || "",
    full_bio: teamMember?.full_bio || "",
    phone: teamMember?.phone || "",
    linkedin_url: teamMember?.linkedin_url || "",
    twitter_url: teamMember?.twitter_url || "",
    facebook_url: teamMember?.facebook_url || "",
    instagram_url: teamMember?.instagram_url || "",
    website_url: teamMember?.website_url || "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [existingProfile, setExistingProfile] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchPositions();
    fetchMyProfile();
  }, []);

  // Fetch existing profile from API
  const fetchMyProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await api.get("/team/my-profile/");

      if (response.data.has_profile && response.data.profile) {
        const profile = response.data.profile;
        setExistingProfile(profile);
        setIsCreating(false);

        // Prefill form with existing data
        setForm({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          position: profile.position || "",
          department: profile.department || "",
          category: profile.category || "",
          short_bio: profile.short_bio || "",
          full_bio: profile.full_bio || "",
          phone: profile.phone || "",
          linkedin_url: profile.linkedin_url || "",
          twitter_url: profile.twitter_url || "",
          facebook_url: profile.facebook_url || "",
          instagram_url: profile.instagram_url || "",
          website_url: profile.website_url || "",
        });

        // Set the existing profile picture URL for preview
        if (profile.profile_picture_url) {
          setPreviewUrl(profile.profile_picture_url);
        }
      } else {
        setIsCreating(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // If no profile exists, that's okay - user will create one
      setIsCreating(true);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    // If teamMember prop is passed, use it (fallback)
    if (teamMember && !existingProfile) {
      setIsCreating(false);
      setForm({
        first_name: teamMember.first_name || "",
        last_name: teamMember.last_name || "",
        position: teamMember.position || "",
        department: teamMember.department || "",
        category: teamMember.category || "",
        short_bio: teamMember.short_bio || "",
        full_bio: teamMember.full_bio || "",
        phone: teamMember.phone || "",
        linkedin_url: teamMember.linkedin_url || "",
        twitter_url: teamMember.twitter_url || "",
        facebook_url: teamMember.facebook_url || "",
        instagram_url: teamMember.instagram_url || "",
        website_url: teamMember.website_url || "",
      });
    }
  }, [teamMember, existingProfile]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/team/categories/dropdown/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await api.get("/team/positions/dropdown/");
      setPositions(response.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profile_picture: "Please select a valid image file",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profile_picture: "Image size must be less than 5MB",
        }));
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profile_picture: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.position) newErrors.position = "Please select a position";
    if (!form.short_bio.trim())
      newErrors.short_bio = "Short biography is required";
    else if (form.short_bio.length > 300)
      newErrors.short_bio = "Short biography must be 300 characters or less";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });
      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      const headers = { "Content-Type": "multipart/form-data" };
      const token = Cookies.get("access_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      if (isCreating) {
        const response = await api.post("/team/my-profile/", formData, { headers });
        const savedProfile = response.data.profile;
        setExistingProfile(savedProfile);
        setIsCreating(false);
        if (savedProfile?.profile_picture_url) setPreviewUrl(savedProfile.profile_picture_url);
        setMessage({
          type: "success",
          text: "Profile submitted successfully! It is now pending admin approval.",
        });
        if (onProfileCreated) onProfileCreated(savedProfile);
      } else {
        const response = await api.patch("/team/my-profile/", formData, { headers });
        const savedProfile = response.data.profile;
        setExistingProfile(savedProfile);
        setIsEditMode(false);
        if (savedProfile?.profile_picture_url) setPreviewUrl(savedProfile.profile_picture_url);
        setMessage({
          type: "success",
          text: "Profile updated and resubmitted for admin approval.",
        });
        if (onUpdateProfile) onUpdateProfile(savedProfile);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to save profile. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const currentProfilePic =
    previewUrl ||
    existingProfile?.profile_picture_url ||
    teamMember?.profile_picture_url ||
    user?.profile_picture_url ||
    defaultProfile;

  // Get the current profile status (from API or prop)
  const currentStatus = existingProfile?.status || teamMember?.status;

  // Fields are editable only if creating new profile OR if edit mode is enabled
  const isEditable = isCreating || isEditMode;

  // Show loading state while fetching profile
  if (loadingProfile) {
    return (
      <motion.div
        className="edit-profile-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="profile-form-container">
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <FaSpinner
              className="spinner"
              style={{ fontSize: "32px", marginBottom: "16px" }}
            />
            <p>Loading your profile...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="edit-profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-form-container">
        {/* Header with Edit Button */}
        <div className="form-header">
          <div className="form-header-text">
            <h1 className="form-title">
              {isCreating
                ? "Create Your Profile"
                : isEditMode
                  ? "Edit Your Profile"
                  : "Your Profile"}
            </h1>
            <p className="form-description">
              {isCreating
                ? "Fill out the form below to create your team profile. Your profile will be reviewed by our admin team before being published."
                : isEditMode
                  ? "Update your personal information and professional details."
                  : "View your profile information below. Click 'Edit Profile' to make changes."}
            </p>
          </div>

          {/* Edit/Cancel Button - only show for existing profiles */}
          {!isCreating && (
            <div className="form-header-actions">
              {isEditMode ? (
                <button
                  type="button"
                  className="edit-toggle-btn cancel"
                  onClick={() => {
                    setIsEditMode(false);
                    // Reset form to original values
                    if (existingProfile) {
                      setForm({
                        first_name: existingProfile.first_name || "",
                        last_name: existingProfile.last_name || "",
                        position: existingProfile.position || "",
                        department: existingProfile.department || "",
                        category: existingProfile.category || "",
                        short_bio: existingProfile.short_bio || "",
                        full_bio: existingProfile.full_bio || "",
                        phone: existingProfile.phone || "",
                        linkedin_url: existingProfile.linkedin_url || "",
                        twitter_url: existingProfile.twitter_url || "",
                        facebook_url: existingProfile.facebook_url || "",
                        instagram_url: existingProfile.instagram_url || "",
                        website_url: existingProfile.website_url || "",
                      });
                      setPreviewUrl(
                        existingProfile.profile_picture_url || null,
                      );
                      setProfilePicture(null);
                    }
                    setMessage(null);
                    setErrors({});
                  }}
                >
                  <FaTimes /> Cancel Editing
                </button>
              ) : (
                <button
                  type="button"
                  className="edit-toggle-btn edit"
                  onClick={() => setIsEditMode(true)}
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status Banners */}
        {isCreating && (
          <div className="status-banner info">
            <AlertCircle size={20} />
            <div>
              <strong>Welcome!</strong> Create your team profile to be displayed
              on our team page.
            </div>
          </div>
        )}

        {currentStatus === "pending" && (
          <div className="status-banner warning">
            <AlertCircle size={20} />
            <div>
              <strong>Pending Approval</strong> - Your profile is awaiting admin
              approval.{" "}
              {isEditMode
                ? "You can make edits below."
                : "Click 'Edit Profile' to make changes."}
            </div>
          </div>
        )}

        {currentStatus === "rejected" && (
          <div className="status-banner error">
            <AlertCircle size={20} />
            <div>
              <strong>Profile Rejected</strong> - Please update your profile and
              resubmit.
              {(existingProfile?.admin_notes || teamMember?.admin_notes) && (
                <p className="admin-notes">
                  Admin notes:{" "}
                  {existingProfile?.admin_notes || teamMember?.admin_notes}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStatus === "approved" && !isEditMode && (
          <div className="status-banner success">
            <FaCheck size={18} />
            <div>
              <strong>Profile Approved</strong> — Your profile is currently live
              on the team page. Click <strong>Edit Profile</strong> to make
              changes. Note: editing will resubmit your profile for admin
              approval.
            </div>
          </div>
        )}

        {currentStatus === "approved" && isEditMode && (
          <div className="status-banner warning">
            <AlertCircle size={20} />
            <div>
              <strong>Editing Live Profile</strong> — Saving these changes will
              resubmit your profile for admin review. Your profile will be set
              to <strong>pending</strong> until the admin approves the update.
            </div>
          </div>
        )}

        {message && (
          <div className={`status-banner ${message.type}`}>
            <AlertCircle size={18} />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-application-form">
          {/* Profile Picture Section */}
          <div className="form-section">
            <h2 className="section-title">Profile Picture</h2>
            <div
              className={`image-upload-container ${!isEditable ? "view-only" : ""}`}
            >
              <div className="image-preview">
                {previewUrl ||
                (teamMember?.profile_picture_url &&
                  teamMember.profile_picture_url !== defaultProfile) ? (
                  <img
                    src={previewUrl || teamMember?.profile_picture_url}
                    alt="Preview"
                  />
                ) : (
                  <div className="placeholder">
                    <FaUpload />
                    <span>{isEditable ? "Upload Photo" : "No Photo"}</span>
                  </div>
                )}
              </div>
              {isEditable && (
                <>
                  <input
                    type="file"
                    id="profile_picture"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="profile_picture" className="upload-btn">
                    Choose Image
                  </label>
                </>
              )}
              {errors.profile_picture && (
                <span className="error-text">{errors.profile_picture}</span>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className={`${errors.first_name ? "error" : ""} ${!isEditable ? "readonly-input" : ""}`}
                  readOnly={!isEditable}
                />
                {errors.first_name && (
                  <span className="error-text">{errors.first_name}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="last_name">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className={`${errors.last_name ? "error" : ""} ${!isEditable ? "readonly-input" : ""}`}
                  readOnly={!isEditable}
                />
                {errors.last_name && (
                  <span className="error-text">{errors.last_name}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={
                    user?.email ||
                    existingProfile?.email ||
                    teamMember?.email ||
                    ""
                  }
                  disabled
                  className="disabled-input"
                />
                <span className="field-note">
                  Email is linked to your account
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 901 234 5678"
                  className={!isEditable ? "readonly-input" : ""}
                  readOnly={!isEditable}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="form-section">
            <h2 className="section-title">Professional Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="position">
                  Position/Title <span className="required">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className={`select-input ${errors.position ? "error" : ""} ${!isEditable ? "readonly-input" : ""}`}
                  disabled={!isEditable}
                >
                  <option value="">Select a position</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.name}>
                      {pos.name}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <span className="error-text">{errors.position}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g., Consulting, Marketing"
                  className={!isEditable ? "readonly-input" : ""}
                  readOnly={!isEditable}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Team Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`select-input ${!isEditable ? "readonly-input" : ""}`}
                disabled={!isEditable}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className="field-note">
                Choose the team category you belong to
              </span>
            </div>

            <div className="form-group full-width">
              <label htmlFor="short_bio">
                Short Biography <span className="required">*</span>
                <span className="char-count">{form.short_bio.length}/300</span>
              </label>
              <textarea
                id="short_bio"
                name="short_bio"
                value={form.short_bio}
                onChange={handleChange}
                maxLength={300}
                rows={3}
                className={`${errors.short_bio ? "error" : ""} ${!isEditable ? "readonly-input" : ""}`}
                placeholder="Brief description that appears on the team page"
                readOnly={!isEditable}
              />
              {errors.short_bio && (
                <span className="error-text">{errors.short_bio}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="full_bio">Full Biography</label>
              <textarea
                id="full_bio"
                name="full_bio"
                value={form.full_bio}
                onChange={handleChange}
                rows={6}
                placeholder="Detailed biography that appears on your profile page"
                className={!isEditable ? "readonly-input" : ""}
                readOnly={!isEditable}
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="form-section">
            <h2 className="section-title">Social Media Links</h2>
            <p className="section-description">
              {isEditable
                ? "Add links to your social media profiles (optional)"
                : "Your social media profiles"}
            </p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin_url">
                  <FaLinkedin className="social-icon linkedin" /> LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={form.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className={!isEditable ? "readonly-input" : ""}
                  readOnly={!isEditable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="twitter_url">
                  <FaTwitter className="social-icon twitter" /> Twitter / X
                </label>
                <input
                  type="url"
                  id="twitter_url"
                  name="twitter_url"
                  value={form.twitter_url}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className={!isEditable ? "readonly-input" : ""}
                  readOnly={!isEditable}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="facebook_url">
                  <FaFacebook className="social-icon facebook" /> Facebook
                </label>
                <input
                  type="url"
                  id="facebook_url"
                  name="facebook_url"
                  value={form.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/username"
                  className={!isEditable ? "readonly-input" : ""}
                  readOnly={!isEditable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="instagram_url">
                  <FaInstagram className="social-icon instagram" /> Instagram
                </label>
                <input
                  type="url"
                  id="instagram_url"
                  name="instagram_url"
                  value={form.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className={!isEditable ? "readonly-input" : ""}
                  readOnly={!isEditable}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="website_url">
                <FaGlobe className="social-icon website" /> Personal Website
              </label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className={!isEditable ? "readonly-input" : ""}
                readOnly={!isEditable}
              />
            </div>
          </div>

          {/* Submit Button - only show when editable */}
          {isEditable && (
            <div className="form-actions">
              <div className="submit-wrapper">
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <FaSpinner className="spinner" />
                      {isCreating ? "Submitting..." : "Resubmitting..."}
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      {isCreating ? "Submit for Approval" : "Save & Resubmit for Approval"}
                    </>
                  )}
                </button>
                <p className="submit-note">
                  {isCreating
                    ? "Your profile will be reviewed by an admin before it appears on the team page."
                    : "Your changes will be reviewed by an admin. Your profile status will be set to pending until approved."}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .edit-profile-page {
          padding: 20px;
          background: #f8fafc;
          min-height: 100%;
        }
        
        .profile-form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        /* Form Header with Edit Button */
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 20px;
        }
        
        .form-header-text {
          flex: 1;
        }
        
        .form-header-text .form-title {
          text-align: left;
          margin-bottom: 8px;
        }
        
        .form-header-text .form-description {
          text-align: left;
          margin-bottom: 0;
        }
        
        .form-header-actions {
          flex-shrink: 0;
        }
        
        .edit-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .edit-toggle-btn.edit {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }
        
        .edit-toggle-btn.edit:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .edit-toggle-btn.cancel {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        
        .edit-toggle-btn.cancel:hover {
          background: #e2e8f0;
          color: #475569;
        }
        
        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .form-description {
          text-align: center;
          color: #64748b;
          margin-bottom: 24px;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .status-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        
        .status-banner.info {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #7dd3fc;
        }
        
        .status-banner.warning {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }
        
        .status-banner.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        
        .status-banner.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }
        
        .admin-notes {
          margin-top: 8px;
          font-style: italic;
          opacity: 0.9;
        }
        
        /* Read-only input styles */
        .readonly-input {
          background-color: #f8fafc !important;
          color: #475569 !important;
          cursor: default !important;
          border-color: #e2e8f0 !important;
        }
        
        .readonly-input:focus {
          border-color: #e2e8f0 !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        .image-upload-container.view-only .image-preview {
          cursor: default;
        }
        
        .image-upload-container.view-only .image-preview:hover {
          border-color: #e2e8f0;
        }
        
        .form-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .form-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }
        
        .section-description {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 16px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          font-size: 0.875rem;
        }
        
        .required {
          color: #ef4444;
        }
        
        .char-count {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 400;
        }
        
        .profile-application-form input[type="text"],
        .profile-application-form input[type="email"],
        .profile-application-form input[type="tel"],
        .profile-application-form input[type="url"],
        .profile-application-form textarea,
        .profile-application-form select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f9fafb;
        }
        
        .profile-application-form input:focus,
        .profile-application-form textarea:focus,
        .profile-application-form select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .profile-application-form input.error,
        .profile-application-form textarea.error {
          border-color: #ef4444;
          background: #fef2f2;
        }
        
        .profile-application-form input.disabled-input {
          background: #f1f5f9;
          color: #64748b;
          cursor: not-allowed;
        }
        
        .profile-application-form textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .error-text {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 4px;
        }
        
        .field-note {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 4px;
        }
        
        /* Image Upload */
        .image-upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        
        .image-preview {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px dashed #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          transition: border-color 0.3s ease;
        }
        
        .image-preview:hover {
          border-color: #3b82f6;
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-preview .placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #9ca3af;
        }
        
        .image-preview .placeholder svg {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        
        .file-input {
          display: none;
        }
        
        .upload-btn {
          padding: 10px 24px;
          background: #f1f5f9;
          color: #64748b;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }
        
        .upload-btn:hover {
          background: #e2e8f0;
          color: #374151;
        }
        
        /* Social Icons */
        .social-icon {
          margin-right: 8px;
          font-size: 1rem;
        }
        
        .social-icon.linkedin { color: #0077b5; }
        .social-icon.twitter { color: #1da1f2; }
        .social-icon.facebook { color: #1877f2; }
        .social-icon.instagram { color: #e4405f; }
        .social-icon.website { color: #64748b; }
        
        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .submit-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .submit-note {
          font-size: 0.78rem;
          color: #94a3b8;
          text-align: center;
          max-width: 420px;
          line-height: 1.5;
          margin: 0;
        }
        
        .submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.35);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .submit-btn .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .select-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
      `}</style>
    </motion.div>
  );
}
