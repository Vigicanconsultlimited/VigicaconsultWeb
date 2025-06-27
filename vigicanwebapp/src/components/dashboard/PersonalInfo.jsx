import React, { useState, useEffect } from "react";
import "./styles/PersonalInfo.css";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";

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

  useEffect(() => {
    if (authData) {
      const email =
        authData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userId = authData["uid"];

      setFormData((prev) => ({
        ...prev,
        Email: email || "",
        UserId: userId || "",
      }));
    }
  }, [authData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await apiInstance.post(
        "StudentPersonalInfo/create",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();
      console.log("Form submitted:", result);
      if (onContinue) onContinue();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Personal Information</h2>
      <p className="form-subtitle">
        Please provide accurate information. Inaccuracies may delay or reject
        your application.
      </p>

      {/* Title and Full Name */}
      <div className="row">
        {/* <div className="col-md-2 col-6">
          <label className="form-label">Title</label>
          <select className="form-input">
            <option value="">Mr.</option>
            <option>Mrs.</option>
            <option>Miss</option>
            <option>Dr.</option>
            <option>Prof.</option>
          </select>
        </div> */}
        <div className="col-md-3 col-12">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your first name"
            value={formData.FirstName}
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
            placeholder="Enter your middle name"
            value={formData.MiddleName}
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
            placeholder="Enter your last name"
            value={formData.LastName}
            onChange={(e) =>
              setFormData({ ...formData, LastName: e.target.value })
            }
          />
        </div>
        <div className="col-12">
          <small className="form-hint">
            Enter your full name exactly as it appears on your passport. Note
            that any discrepancies may cause issues with your application.
          </small>
        </div>
      </div>

      {/* Phone & Date of Birth */}
      <div className="row">
        {/* Phone */}
        <div className="col-md-6 col-12">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-input form-input-error"
            placeholder="+234 80..."
            value={formData.Phone}
            onChange={(e) =>
              setFormData({ ...formData, Phone: e.target.value })
            }
          />
          <small className="form-hint">
            Enter an active phone number where you can receive an SMS from us
          </small>
        </div>

        {/* Date of Birth */}
        <div className="col-md-6 col-12">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-input"
            value={formData.DOB}
            onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
          />
          <small className="form-hint">
            Select your date of birth (e.g., 1990-05-20)
          </small>
        </div>
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-input"
          placeholder="Enter your email"
          value={formData.Email}
          disabled
        />
        <small className="form-hint">
          Enter an active email address where you can receive messages from us
        </small>
      </div>

      {/* Address */}
      <div className="form-group">
        <label className="form-label">Permanent Address</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter address"
          value={formData.Address}
          onChange={(e) =>
            setFormData({ ...formData, Address: e.target.value })
          }
        />
        <small className="form-hint">Provide your permanent home address</small>
      </div>

      {/* Postcode & Course */}
      <div className="row">
        <div className="col-md-6 col-12">
          <label className="form-label">Post Code</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter postcode"
            value={formData.PostCode}
            onChange={(e) =>
              setFormData({ ...formData, PostCode: e.target.value })
            }
          />
          <small className="form-hint">What is your postal code?</small>
        </div>

        <div className="col-md-6 col-12">
          <label className="form-label">Preferred Language</label>
          <select
            id="language"
            className="form-select personal-info-input"
            value={formData.FirstLanguage}
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
          <small className="form-hint">Which language do you prefer?</small>
        </div>
        {/* Pronoun */}
        <div className="mb-3">
          <label className="form-label personal-info-label" htmlFor="pronoun">
            Preferred Pronoun
          </label>
          <select
            id="pronoun"
            className="form-select personal-info-input"
            value={formData.PreferredPronoun}
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
          <div className="form-hint">How would you like to be addressed?</div>
        </div>
        {/* <div className="col-md-6 col-12">
          <label className="form-label">Preferred Course</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter preferred course"
          />
          <small className="form-hint">
            Which course are you interested in applying for?
          </small>
        </div>
        */}
      </div>

      {/* Footer */}
      <div className="form-footer">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onBack}
        >
          ⬅ Back
        </button>
        <button type="button" className="btn btn-secondary">
          💾 Save as Draft
        </button>
        <button type="submit" className="btn btn-primary">
          Continue →
        </button>
      </div>
    </form>
  );
}
