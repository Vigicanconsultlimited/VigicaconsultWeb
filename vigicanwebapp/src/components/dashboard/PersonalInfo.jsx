import React, { useState, useEffect } from "react";
import "./styles/PersonalInfo.css";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";

export default function PersonalInfo({ onContinue, onBack, setCurrentStep }) {
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
            console.log("Fetched personal info:", savedData);

            setFormData({
              FirstName: savedData.firstName || "",
              MiddleName: savedData.middleName || "",
              LastName: savedData.lastName || "",
              Phone: savedData.phone || "",
              Email: savedData.email || email,
              Address: savedData.address || "",
              PostCode: savedData.postCode || "",
              DOB: savedData.dob ? savedData.dob.split("T")[0] : "",
              UserId: savedData.userId || userId,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormSubmitted) {
      window.location.href = "/dashboard/saved-applications";
      return;
    }

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
      console.warn("Form not completely filled. Skipping submission.");
      if (onContinue) onContinue();
      return;
    }

    const payload = new FormData();
    payload.append("FirstName", formData.FirstName);
    payload.append("MiddleName", formData.MiddleName);
    payload.append("LastName", formData.LastName);
    payload.append("Phone", formData.Phone);
    payload.append("Email", formData.Email);
    payload.append("Address", formData.Address);
    payload.append("PostCode", formData.PostCode);
    payload.append("DOB", formData.DOB);
    payload.append("UserId", formData.UserId);
    payload.append(
      "FirstLanguage",
      getMappedValue(formData.FirstLanguage, languageOptions)
    );
    payload.append(
      "PreferredPronoun",
      getMappedValue(formData.PreferredPronoun, pronounOptions)
    );

    try {
      await apiInstance.post("StudentPersonalInfo/create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onContinue) onContinue();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Personal Information</h2>
      {isFormSubmitted && (
        <div className="alert alert-info mt-3">
          <strong>You've already saved/submitted this form.</strong>
          <br />
          You can edit it from your saved applications.
          <br />
          <button
            className="btn btn-link mt-2"
            onClick={() => setCurrentStep("saved-personal-info")}
          >
            ➡ Go to Saved Applications
          </button>
        </div>
      )}

      <p className="form-subtitle">
        Please provide accurate information. Inaccuracies may delay or reject
        your application.
      </p>

      <div className="row">
        <div className="col-md-3 col-12">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.FirstName}
            disabled={isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, FirstName: e.target.value })
            }
          />
        </div>
        <div className="col-md-3 col-12">
          <label className="form-label">Middle Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.MiddleName}
            disabled={isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, MiddleName: e.target.value })
            }
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.LastName}
            disabled={isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, LastName: e.target.value })
            }
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            value={formData.Phone}
            disabled={isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, Phone: e.target.value })
            }
          />
        </div>

        <div className="col-md-6 col-12">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-input"
            value={formData.DOB}
            disabled={isFormSubmitted}
            onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-input"
          value={formData.Email}
          disabled
        />
      </div>

      <div className="form-group">
        <label className="form-label">Permanent Address</label>
        <input
          type="text"
          className="form-input"
          value={formData.Address}
          disabled={isFormSubmitted}
          onChange={(e) =>
            setFormData({ ...formData, Address: e.target.value })
          }
        />
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <label className="form-label">Post Code</label>
          <input
            type="text"
            className="form-input"
            value={formData.PostCode}
            disabled={isFormSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, PostCode: e.target.value })
            }
          />
        </div>

        <div className="col-md-6 col-12">
          <label className="form-label">Preferred Language</label>
          <select
            className="form-select"
            value={formData.FirstLanguage}
            disabled={isFormSubmitted}
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
      </div>

      <div className="mb-3">
        <label className="form-label">Preferred Pronoun</label>
        <select
          className="form-select"
          value={formData.PreferredPronoun}
          disabled={isFormSubmitted}
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

      <div className="form-footer">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onBack}
        >
          ⬅ Back
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isFormSubmitted}
        >
          {isFormSubmitted ? "Already Submitted" : "Continue →"}
        </button>
      </div>
    </form>
  );
}
