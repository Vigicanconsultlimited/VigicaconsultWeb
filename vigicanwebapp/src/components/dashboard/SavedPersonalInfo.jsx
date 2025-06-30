import React, { useState, useEffect } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import "./styles/PersonalInfo.css";

export default function SavedPersonalInfo({ onBack }) {
  const authData = useAuthStore((state) => state.allUserData);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

  const getLabelFromMappedValue = (value, options) => options[value - 1] || "";

  const getMappedValue = (label, options) => options.indexOf(label) + 1 || 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!authData) return;
      const userId = authData["uid"];
      const email =
        authData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      try {
        const res = await apiInstance.get(`StudentPersonalInfo/user/${userId}`);
        if (res?.data) {
          const data = res.data;
          setFormData({
            FirstName: data.firstName || "",
            MiddleName: data.middleName || "",
            LastName: data.lastName || "",
            Email: data.email || email,
            Phone: data.phone || "",
            Address: data.address || "",
            PostCode: data.postCode || "",
            DOB: data.dob ? data.dob.split("T")[0] : "",
            FirstLanguage: getLabelFromMappedValue(
              data.firstLanguage,
              languageOptions
            ),
            PreferredPronoun: getLabelFromMappedValue(
              data.preferredPronoun,
              pronounOptions
            ),
            UserId: data.userId || userId,
          });
        }
      } catch (err) {
        console.error("Error loading saved personal info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    setSuccessMsg("");

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
      await apiInstance.put("StudentPersonalInfo/update", payload);
      setSuccessMsg("Changes saved successfully ✅");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!formData) return <p>No saved personal information found.</p>;

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Saved Personal Information</h2>

      <div className="row">
        <div className="col-md-4 col-12">
          <label className="form-label">First Name</label>
          <input
            className="form-input"
            value={formData.FirstName}
            onChange={(e) => handleChange("FirstName", e.target.value)}
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">Middle Name</label>
          <input
            className="form-input"
            value={formData.MiddleName}
            onChange={(e) => handleChange("MiddleName", e.target.value)}
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">Last Name</label>
          <input
            className="form-input"
            value={formData.LastName}
            onChange={(e) => handleChange("LastName", e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <label className="form-label">Phone</label>
          <input
            className="form-input"
            value={formData.Phone}
            onChange={(e) => handleChange("Phone", e.target.value)}
          />
        </div>
        <div className="col-md-6 col-12">
          <label className="form-label">Date of Birth</label>
          <input
            className="form-input"
            type="date"
            value={formData.DOB}
            onChange={(e) => handleChange("DOB", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" value={formData.Email} disabled />
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <input
          className="form-input"
          value={formData.Address}
          onChange={(e) => handleChange("Address", e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <label className="form-label">Post Code</label>
          <input
            className="form-input"
            value={formData.PostCode}
            onChange={(e) => handleChange("PostCode", e.target.value)}
          />
        </div>
        <div className="col-md-6 col-12">
          <label className="form-label">First Language</label>
          <select
            className="form-select"
            value={formData.FirstLanguage}
            onChange={(e) => handleChange("FirstLanguage", e.target.value)}
          >
            <option value="">Select language</option>
            {languageOptions.map((lang, idx) => (
              <option key={idx} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Preferred Pronoun</label>
        <select
          className="form-select"
          value={formData.PreferredPronoun}
          onChange={(e) => handleChange("PreferredPronoun", e.target.value)}
        >
          <option value="">Select pronoun</option>
          {pronounOptions.map((p, idx) => (
            <option key={idx} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="form-footer">
        <button className="btn btn-secondary me-2" onClick={onBack}>
          ⬅ Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success mt-3">{successMsg}</div>
      )}
    </div>
  );
}
