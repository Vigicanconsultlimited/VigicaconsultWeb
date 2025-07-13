import React, { useState, useEffect } from "react";
import "./styles/PersonalInfo.css";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import Swal from "sweetalert2";

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

export default function PersonalInfo({ onContinue, onBack }) {
  const authData = useAuthStore((state) => state.allUserData);

  const languageOptions = [
    "English",
    "French",
    "Spanish",
    "Arabic",
    "Mandarin",
    "Hindi",
    "Yoruba",
    "Igbo",
    "Hausa",
    "Portuguese",
    "Russian",
    "Bengali",
    "Japanese",
    "German",
    "Other",
  ];

  const pronounOptions = [
    "He/Him",
    "She/Her",
    "They/Them",
    "Prefer not to say",
    "Other",
  ];

  const getMappedValue = (label, options) => {
    const index = options.indexOf(label);
    return index !== -1 ? index + 1 : 0;
  };

  const getLabelFromMappedValue = (value, options) => {
    return options[value - 1] || "";
  };

  const [formData, setFormData] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Phone: "",
    Email: "",
    Address: "",
    PostCode: "",
    DOB: "",
    UserId: "",
    PreferredPronoun: "",
    FirstLanguage: "",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (authData) {
        const userId = authData["uid"];
        const email =
          authData[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];
        setFormData((prev) => ({
          ...prev,
          Email: email || "",
          UserId: userId || "",
        }));

        try {
          const response = await apiInstance.get(
            `StudentPersonalInfo/user/${userId}`
          );
          if (response?.data?.result) {
            const savedData = response.data.result;
            setFormData({
              FirstName: savedData.firstName || "",
              MiddleName: savedData.middleName || "",
              LastName: savedData.lastName || "",
              Phone: savedData.phone || "",
              Email: savedData.email || email,
              Address: savedData.address || "",
              PostCode: savedData.postCode || "",
              DOB: savedData.dob ? savedData.dob.split("T")[0] : "",
              Id: savedData.id || "",
              PreferredPronoun: getLabelFromMappedValue(
                savedData.preferredPronoun,
                pronounOptions
              ),
              FirstLanguage: getLabelFromMappedValue(
                savedData.firstLanguage,
                languageOptions
              ),
            });
            setIsFormSubmitted(true);
          }
        } catch (error) {
          console.warn("No existing personal info found or error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExistingData();
  }, [authData]);

  const showLoadingOverlay = () => {
    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "FirstName",
      "LastName",
      "Phone",
      "DOB",
      "Address",
      "PostCode",
      "FirstLanguage",
      "PreferredPronoun",
    ];
    const isFormComplete = requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );

    if (!isFormComplete) {
      Toast.fire({
        icon: "warning",
        title: "Please complete all required fields.",
      });
      return;
    }

    const payload = new FormData();
    Object.entries({
      ...formData,
      FirstLanguage: getMappedValue(formData.FirstLanguage, languageOptions),
      PreferredPronoun: getMappedValue(
        formData.PreferredPronoun,
        pronounOptions
      ),
    }).forEach(([key, value]) => payload.append(key, value));

    try {
      showLoadingOverlay();
      await apiInstance.post("StudentPersonalInfo/create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.close();
      setIsFormSubmitted(true);
      Toast.fire({ icon: "success", title: "Submitted successfully" });
      if (onContinue) onContinue();
    } catch (error) {
      Swal.close();
      console.error("Submission failed:", error);
      Toast.fire({ icon: "error", title: "Submission failed" });
    }
  };

  const handleEditSubmit = async () => {
    const payload = new FormData();
    Object.entries({
      ...formData,
      FirstLanguage: getMappedValue(formData.FirstLanguage, languageOptions),
      PreferredPronoun: getMappedValue(
        formData.PreferredPronoun,
        pronounOptions
      ),
    }).forEach(([key, value]) => payload.append(key, value));

    try {
      showLoadingOverlay();
      await apiInstance.put("StudentPersonalInfo/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.close();
      Toast.fire({ icon: "success", title: "Updated successfully" });
      setIsEditing(false);
    } catch (error) {
      Swal.close();
      console.error("Update failed:", error);
      Toast.fire({ icon: "error", title: "Update failed" });
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading Personal Info...</p>
        </div>
      </div>
    );
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Personal Information</h2>

      {isFormSubmitted && !isEditing && (
        <div className="alert alert-info mt-3">
          <strong>You’ve already submitted this form.</strong>
          <br />
          Click edit to update your information.
        </div>
      )}

      <p className="form-subtitle">
        Please provide accurate information. Inaccuracies may delay or reject
        your application.
      </p>

      {/* Name Fields */}
      <div className="row g-3 pb-3">
        {["FirstName", "MiddleName", "LastName"].map((field, i) => (
          <div className="col-md-4 col-12" key={i}>
            <label className="form-label">
              {field.replace("Name", " Name")}
            </label>
            <input
              type="text"
              className="form-input"
              value={formData[field]}
              disabled={!isEditing && isFormSubmitted}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="row g-3 pb-3">
        <div className="col-md-4 col-12">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={formData.Email}
            disabled
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            value={formData.Phone}
            disabled={!isEditing && isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, Phone: e.target.value })
            }
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-input"
            value={formData.DOB}
            disabled={!isEditing && isFormSubmitted}
            onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
          />
        </div>
      </div>

      {/* Address */}
      <div className="row g-3 pb-3">
        <div className="col-12">
          <label className="form-label">Permanent Address</label>
          <input
            type="text"
            className="form-input"
            value={formData.Address}
            disabled={!isEditing && isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, Address: e.target.value })
            }
          />
        </div>
      </div>

      {/* Post Code & Preferences */}
      <div className="row g-3 pb-3">
        <div className="col-md-4 col-12">
          <label className="form-label">Post Code</label>
          <input
            type="text"
            className="form-input"
            value={formData.PostCode}
            disabled={!isEditing && isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, PostCode: e.target.value })
            }
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">Preferred Language</label>
          <select
            className="form-select"
            value={formData.FirstLanguage}
            disabled={!isEditing && isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, FirstLanguage: e.target.value })
            }
          >
            <option value="">Select language</option>
            {languageOptions.map((lang, i) => (
              <option key={i} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">Preferred Pronoun</label>
          <select
            className="form-select"
            value={formData.PreferredPronoun}
            disabled={!isEditing && isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, PreferredPronoun: e.target.value })
            }
          >
            <option value="">Select pronoun</option>
            {pronounOptions.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Buttons */}
      <div
        className="form-footer d-flex justify-content-between"
        style={{
          marginTop: "20px",
          backgroundColor: "#e3e8fd",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <button
          type="button"
          className="btn btn-outline-primary px-4"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div>
          {!isFormSubmitted ? (
            <button type="submit" className="btn btn-primary">
              Continue →
            </button>
          ) : isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-success me-2 "
                onClick={handleEditSubmit}
              >
                ✅ Finish Editing
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onContinue}
              >
                ➡ Next
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary me-2 btn-outline-primary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onContinue}
              >
                ➡ Next
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
