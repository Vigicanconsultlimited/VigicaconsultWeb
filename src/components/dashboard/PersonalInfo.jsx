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
  ];

  const genderOptions = ["Male", "Female", "Prefer not to say", "Other"];

  const getMappedValue = (label, options) => {
    const index = options.indexOf(label);
    return index !== -1 ? index + 1 : 0;
  };
  const getLabelFromMappedValue = (value, options) => options[value - 1] || "";

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
    Gender: "",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [personalInfoId, setPersonalInfoId] = useState("");

  const canEdit =
    applicationStatus === null ||
    applicationStatus === 2 ||
    applicationStatus === 4;

  // Fetch existing data
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!authData) {
        setLoading(false);
        return;
      }
      const userId = authData["uid"];
      const email =
        authData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

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
          setPersonalInfoId(savedData.id || "");
          localStorage.setItem("studentPersonalInfoId", savedData.id || "");

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
            Gender: getLabelFromMappedValue(savedData.gender, genderOptions),
          });

          setIsFormSubmitted(true);

          if (savedData.id) {
            try {
              const appResponse = await apiInstance.get(
                `StudentApplication/application?StudentPersonalInformationId=${savedData.id}`
              );
              if (appResponse?.data?.result) {
                setApplicationStatus(appResponse.data.result.applicationStatus);
              }
            } catch {
              setApplicationStatus(2);
            }
          }
        }
      } catch {
        /* no existing record - silent */
      } finally {
        setLoading(false);
      }
    };
    fetchExistingData();
  }, [authData]);

  const getStatusText = (status) => {
    const statusMap = {
      1: "Submitted",
      2: "Pending",
      3: "Under Review",
      4: "Rejected",
      5: "Approved",
    };
    return statusMap[status] || "Unknown";
  };

  const showLoadingOverlay = () => {
    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Status: ${getStatusText(applicationStatus)}`,
      });
      return;
    }

    const required = [
      "FirstName",
      "MiddleName",
      "LastName",
      "Phone",
      "DOB",
      "Address",
      "PostCode",
      "FirstLanguage",
      "PreferredPronoun",
      "Gender",
    ];
    const complete = required.every(
      (f) => formData[f] && formData[f].trim() !== ""
    );
    if (!complete) {
      Toast.fire({ icon: "warning", title: "Complete all required fields." });
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
      Gender: getMappedValue(formData.Gender, genderOptions),
    }).forEach(([k, v]) => payload.append(k, v));

    try {
      showLoadingOverlay();
      const res = await apiInstance.post(
        "StudentPersonalInfo/create",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Swal.close();
      setIsFormSubmitted(true);
      if (res?.data?.result?.id) {
        const newId = res.data.result.id;
        setPersonalInfoId(newId);
        localStorage.setItem("studentPersonalInfoId", newId);
      }
      Toast.fire({ icon: "success", title: "Submitted successfully" });
      setTimeout(() => onContinue && onContinue(), 400);
    } catch {
      Swal.close();
      Toast.fire({ icon: "error", title: "Submission failed" });
    }
  };

  const handleEditSubmit = async () => {
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Status: ${getStatusText(applicationStatus)}`,
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
      Gender: getMappedValue(formData.Gender, genderOptions),
    }).forEach(([k, v]) => payload.append(k, v));

    try {
      showLoadingOverlay();
      await apiInstance.put("StudentPersonalInfo/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.close();
      Toast.fire({ icon: "success", title: "Updated successfully" });
      setIsEditing(false);
      if (formData.Id) {
        localStorage.setItem("studentPersonalInfoId", formData.Id);
      }
    } catch {
      Swal.close();
      Toast.fire({ icon: "error", title: "Update failed" });
    }
  };

  const handleContinue = () => {
    if (personalInfoId) {
      localStorage.setItem("studentPersonalInfoId", personalInfoId);
    }
    setTimeout(() => onContinue && onContinue(), 120);
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
    <form className="form-container personal-info-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Personal Information</h2>

      {applicationStatus && (
        <div
          className={`application-status ${getStatusText(applicationStatus)
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          <p>
            Status: <strong>{getStatusText(applicationStatus)}</strong>
          </p>
        </div>
      )}

      {isFormSubmitted && !isEditing && canEdit && (
        <div className="alert alert-info mt-3 compact-alert">
          <strong>Saved.</strong> Tap Edit to update.
          <p className="form-subtitle mb-0">
            Ensure accuracy to avoid delays or rejection.
          </p>
        </div>
      )}

      {applicationStatus && ![2, 4, null].includes(applicationStatus) && (
        <div className="alert alert-primary mb-2 mt-0 p-2 compact-alert">
          <p className="mb-0">
            <strong>Notice:</strong> Editing locked for this status.
          </p>
        </div>
      )}

      {/* Names */}
      <div className="grid-row compact-grid">
        {["FirstName", "MiddleName", "LastName"].map((field) => (
          <div className="grid-col" key={field}>
            <label className="form-label compact-label">
              {field.replace("Name", " Name")}
              <span className="required-field">*</span>
            </label>
            <input
              type="text"
              className="form-input compact-input"
              value={formData[field]}
              disabled={(!isEditing && isFormSubmitted) || !canEdit}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="grid-row compact-grid">
        <div className="grid-col">
          <label className="form-label compact-label">Email</label>
          <input
            type="email"
            className="form-input compact-input"
            value={formData.Email}
            disabled
          />
        </div>
        <div className="grid-col">
          <label className="form-label compact-label">
            Phone<span className="required-field">*</span>
          </label>
          <input
            type="tel"
            className="form-input compact-input"
            value={formData.Phone}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, Phone: e.target.value })
            }
          />
        </div>
        <div className="grid-col">
          <label className="form-label compact-label">
            DOB<span className="required-field">*</span>
          </label>
          <input
            type="date"
            className="form-input compact-input"
            value={formData.DOB}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
          />
        </div>
      </div>

      {/* Address */}
      <div className="grid-row compact-grid">
        <div className="grid-col address-col">
          <label className="form-label compact-label">
            Address<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-input compact-input"
            value={formData.Address}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, Address: e.target.value })
            }
          />
        </div>
        <div className="grid-col">
          <label className="form-label compact-label">
            Post Code<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-input compact-input"
            value={formData.PostCode}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, PostCode: e.target.value })
            }
          />
        </div>
      </div>

      {/* Selects */}
      <div className="grid-row compact-grid">
        <div className="grid-col">
          <label className="form-label compact-label">
            Gender<span className="required-field">*</span>
          </label>
          <select
            className="form-select compact-input"
            value={formData.Gender}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, Gender: e.target.value })
            }
          >
            <option value="">Select</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-col">
          <label className="form-label compact-label">
            Pronoun<span className="required-field">*</span>
          </label>
          <select
            className="form-select compact-input"
            value={formData.PreferredPronoun}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({
                ...formData,
                PreferredPronoun: e.target.value,
              })
            }
          >
            <option value="">Select</option>
            {pronounOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-col">
          <label className="form-label compact-label">
            Language<span className="required-field">*</span>
          </label>
          <select
            className="form-select compact-input"
            value={formData.FirstLanguage}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({
                ...formData,
                FirstLanguage: e.target.value,
              })
            }
          >
            <option value="">Select</option>
            {languageOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Buttons (no fixed positioning) */}
      <div className="form-footer compact-footer">
        <button
          type="button"
          className="btn btn-outline-primary back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        {!isFormSubmitted ? (
          <button
            type="submit"
            className="btn btn-primary primary-action"
            disabled={!canEdit}
          >
            Continue →
          </button>
        ) : isEditing ? (
          <div className="inline-action-pair">
            <button
              type="button"
              className="btn btn-success save-btn"
              onClick={handleEditSubmit}
              disabled={!canEdit}
            >
              ✅ Save
            </button>
            <button
              type="button"
              className="btn btn-primary next-btn"
              onClick={handleContinue}
            >
              ➡ Next
            </button>
          </div>
        ) : (
          <div className="inline-action-pair">
            {canEdit && (
              <button
                type="button"
                className="btn btn-secondary btn-outline-primary edit-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary next-btn"
              onClick={handleContinue}
            >
              ➡ Next
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
