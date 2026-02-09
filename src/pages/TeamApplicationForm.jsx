import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUpload, FaCheck, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { teamApi } from "../utils/teamApi";
import Header from "../components/landing/Header";
import "../styles/TeamApplicationForm.css";

function TeamApplicationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    short_bio: "",
    full_bio: "",
    linkedin_url: "",
    twitter_url: "",
    facebook_url: "",
    instagram_url: "",
    website_url: "",
    profile_picture: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profile_picture: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profile_picture: "Image size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        profile_picture: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }
    if (!formData.short_bio.trim()) {
      newErrors.short_bio = "Short biography is required";
    } else if (formData.short_bio.length > 300) {
      newErrors.short_bio = "Short biography must be 300 characters or less";
    }

    // Validate URLs if provided
    const urlFields = [
      "linkedin_url",
      "twitter_url",
      "facebook_url",
      "instagram_url",
      "website_url",
    ];
    urlFields.forEach((field) => {
      if (formData[field] && !isValidUrl(formData[field])) {
        newErrors[field] = "Please enter a valid URL";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });

      const response = await teamApi.applyToTeam(submitData);

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Your application has been submitted successfully. Our admin team will review it and get back to you.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/team");
      });
    } catch (err) {
      console.error("Error submitting application:", err);

      let errorMessage = "Failed to submit application. Please try again.";
      if (err.response?.data?.email) {
        errorMessage = "This email is already registered.";
      } else if (err.response?.data) {
        const errorData = err.response.data;
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else if (typeof firstError === "string") {
          errorMessage = firstError;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">
      <Header />

      <section className="application-content">
        <div className="container mx-auto px-4 py-12">
          <Link to="/team" className="back-link">
            <FaArrowLeft className="mr-2" />
            Back to Team
          </Link>

          <motion.div
            className="application-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Join Our Team</h1>
            <p className="form-description">
              Fill out the form below to apply. Your application will be
              reviewed by our admin team before being published.
            </p>

            <form onSubmit={handleSubmit} className="application-form">
              {/* Profile Picture */}
              <div className="form-section">
                <h2>Profile Picture</h2>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" />
                    ) : (
                      <div className="placeholder">
                        <FaUpload />
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profile_picture"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="profile_picture" className="upload-btn">
                    Choose Image
                  </label>
                  {errors.profile_picture && (
                    <span className="error-text">{errors.profile_picture}</span>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="form-section">
                <h2>Personal Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={errors.first_name ? "error" : ""}
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
                      value={formData.last_name}
                      onChange={handleChange}
                      className={errors.last_name ? "error" : ""}
                    />
                    {errors.last_name && (
                      <span className="error-text">{errors.last_name}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="form-section">
                <h2>Professional Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="position">
                      Position/Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={errors.position ? "error" : ""}
                      placeholder="e.g., Software Engineer, Marketing Manager"
                    />
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
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Engineering, Marketing"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="short_bio">
                    Short Biography <span className="required">*</span>
                    <span className="char-count">
                      {formData.short_bio.length}/300
                    </span>
                  </label>
                  <textarea
                    id="short_bio"
                    name="short_bio"
                    value={formData.short_bio}
                    onChange={handleChange}
                    maxLength={300}
                    rows={3}
                    className={errors.short_bio ? "error" : ""}
                    placeholder="Brief description that appears on the team page"
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
                    value={formData.full_bio}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Detailed biography that appears on your profile page"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="form-section">
                <h2>Social Media Links</h2>
                <p className="section-description">
                  Add links to your social media profiles (optional)
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="linkedin_url">LinkedIn</label>
                    <input
                      type="url"
                      id="linkedin_url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      className={errors.linkedin_url ? "error" : ""}
                      placeholder="https://linkedin.com/in/username"
                    />
                    {errors.linkedin_url && (
                      <span className="error-text">{errors.linkedin_url}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="twitter_url">Twitter / X</label>
                    <input
                      type="url"
                      id="twitter_url"
                      name="twitter_url"
                      value={formData.twitter_url}
                      onChange={handleChange}
                      className={errors.twitter_url ? "error" : ""}
                      placeholder="https://twitter.com/username"
                    />
                    {errors.twitter_url && (
                      <span className="error-text">{errors.twitter_url}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="facebook_url">Facebook</label>
                    <input
                      type="url"
                      id="facebook_url"
                      name="facebook_url"
                      value={formData.facebook_url}
                      onChange={handleChange}
                      className={errors.facebook_url ? "error" : ""}
                      placeholder="https://facebook.com/username"
                    />
                    {errors.facebook_url && (
                      <span className="error-text">{errors.facebook_url}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="instagram_url">Instagram</label>
                    <input
                      type="url"
                      id="instagram_url"
                      name="instagram_url"
                      value={formData.instagram_url}
                      onChange={handleChange}
                      className={errors.instagram_url ? "error" : ""}
                      placeholder="https://instagram.com/username"
                    />
                    {errors.instagram_url && (
                      <span className="error-text">{errors.instagram_url}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="website_url">Personal Website</label>
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className={errors.website_url ? "error" : ""}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website_url && (
                    <span className="error-text">{errors.website_url}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner className="spinner mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default TeamApplicationForm;
