import React, { useState, useEffect } from "react";
import "./styles/PersonalInfo.css";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";
import Swal from "sweetalert2";

// Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-08-11 17:13:28
// Current User's Login: NeduStack

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

  // Gender options
  const genderOptions = ["Male", "Female"];

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
    Gender: "",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [personalInfoId, setPersonalInfoId] = useState("");

  // Check if application status allows editing (only Pending or Rejected)
  const canEdit =
    applicationStatus === null ||
    applicationStatus === 2 ||
    applicationStatus === 4;

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
            setPersonalInfoId(savedData.id || "");

            // Store the personal info ID in localStorage for access by other components
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

            // Now fetch application status
            if (savedData.id) {
              try {
                const appResponse = await apiInstance.get(
                  `StudentApplication/application?StudentPersonalInformationId=${savedData.id}`
                );

                if (appResponse?.data?.result) {
                  // Status codes: 1=Submitted, 2=Pending, 3=UnderReview, 4=Rejected, 5=Approved
                  const status = appResponse.data.result.applicationStatus;
                  setApplicationStatus(status);
                }
              } catch (err) {
                console.log(`No application found or error: ${err.message}`);
                // If no application exists yet, it's effectively pending
                setApplicationStatus(2); // Pending
              }
            }
          }
        } catch (error) {
          console.warn(
            `No existing personal info found or error: ${error.message}`
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExistingData();
  }, [authData]);

  // Helper function to get status text
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
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if application status doesn't allow editing
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Application status: ${getStatusText(
          applicationStatus
        )}`,
      });
      return;
    }

    const requiredFields = [
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
      Gender: getMappedValue(formData.Gender, genderOptions), // Add gender to payload
    }).forEach(([key, value]) => payload.append(key, value));

    try {
      showLoadingOverlay();

      const response = await apiInstance.post(
        "StudentPersonalInfo/create",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.close();
      setIsFormSubmitted(true);

      // If we get a response with an ID, save it to localStorage
      if (response?.data?.result?.id) {
        const newPersonalInfoId = response.data.result.id;
        setPersonalInfoId(newPersonalInfoId);
        localStorage.setItem("studentPersonalInfoId", newPersonalInfoId);
      }

      Toast.fire({ icon: "success", title: "Submitted successfully" });

      // Use setTimeout to ensure the localStorage is updated before continuing
      setTimeout(() => {
        if (onContinue) onContinue();
      }, 500);
    } catch (error) {
      Swal.close();
      console.error(`Submission failed: ${error.message}`);
      Toast.fire({ icon: "error", title: "Submission failed" });
    }
  };

  const handleEditSubmit = async () => {
    // Prevent editing if application status doesn't allow it
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: `Cannot edit. Application status: ${getStatusText(
          applicationStatus
        )}`,
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
      Gender: getMappedValue(formData.Gender, genderOptions), // Add gender to update payload
    }).forEach(([key, value]) => payload.append(key, value));

    try {
      showLoadingOverlay();

      await apiInstance.put("StudentPersonalInfo/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.close();
      Toast.fire({ icon: "success", title: "Updated successfully" });
      setIsEditing(false);

      // Make sure localStorage has the latest ID
      if (formData.Id) {
        localStorage.setItem("studentPersonalInfoId", formData.Id);
      }
    } catch (error) {
      Swal.close();
      console.error(`Update failed: ${error.message}`);
      Toast.fire({ icon: "error", title: "Update failed" });
    }
  };

  // Handle "Next" button click
  const handleContinue = () => {
    // Make sure the ID is stored in localStorage before continuing
    if (personalInfoId) {
      localStorage.setItem("studentPersonalInfoId", personalInfoId);
    }

    // Use setTimeout to ensure the localStorage is updated before continuing
    setTimeout(() => {
      if (onContinue) onContinue();
    }, 200);
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

      {/* Application Status Display */}
      {applicationStatus && (
        <div
          className={`application-status ${getStatusText(applicationStatus)
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          <p>
            Current Application Status:{" "}
            <strong>{getStatusText(applicationStatus)}</strong>
          </p>
        </div>
      )}

      {/* Only show "already submitted" message if editing is allowed */}
      {isFormSubmitted && !isEditing && canEdit && (
        <div className="alert alert-info mt-3">
          <strong>You've already Saved this form.</strong>
          <br />
          Click edit to update your information.
          <br />
          <p className="form-subtitle">
            Please provide accurate information. Inaccuracies may delay or
            reject your application.
          </p>
        </div>
      )}

      {applicationStatus &&
        applicationStatus !== 2 &&
        applicationStatus !== 4 && (
          <div className="alert alert-primary mb-2 mt-0 p-2">
            <p>
              <strong>Notice:</strong> Your application cannot be edited at this
              time.
            </p>
          </div>
        )}

      {/* Name Fields */}
      <div className="row g-3 pb-3">
        {["FirstName", "MiddleName", "LastName"].map((field, i) => (
          <div className="col-md-4 col-12" key={i}>
            <label className="form-label">
              {field.replace("Name", " Name")}
              {(field === "FirstName" ||
                field === "MiddleName" ||
                field === "LastName") && (
                <span className="required-field">*</span>
              )}
            </label>
            <input
              type="text"
              className="form-input"
              value={formData[field]}
              disabled={(!isEditing && isFormSubmitted) || !canEdit}
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
          <label className="form-label">
            Phone Number<span className="required-field">*</span>
          </label>
          <input
            type="tel"
            className="form-input"
            value={formData.Phone}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, Phone: e.target.value })
            }
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">
            Date of Birth<span className="required-field">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            value={formData.DOB}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
          />
        </div>
      </div>

      {/* Address and Post Code - MOVED POSTCODE NEXT TO ADDRESS */}
      <div className="row g-3 pb-3">
        <div className="col-md-8 col-12">
          <label className="form-label">
            Permanent Address<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.Address}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, Address: e.target.value })
            }
          />
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">
            Post Code<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.PostCode}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, PostCode: e.target.value })
            }
          />
        </div>
      </div>

      {/* Gender, Pronoun, Language */}
      <div className="row g-3 pb-3">
        <div className="col-md-4 col-12">
          <label className="form-label">
            Gender<span className="required-field">*</span>
          </label>
          <select
            className="form-select"
            value={formData.Gender}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, Gender: e.target.value })
            }
          >
            <option value="">Select gender</option>
            {genderOptions.map((gender, i) => (
              <option key={i} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 col-12">
          <label className="form-label">
            Preferred Pronoun<span className="required-field">*</span>
          </label>
          <select
            className="form-select"
            value={formData.PreferredPronoun}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
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
        <div className="col-md-4 col-12">
          <label className="form-label">
            Preferred Language<span className="required-field">*</span>
          </label>
          <select
            className="form-select"
            value={formData.FirstLanguage}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canEdit}
            >
              Continue →
            </button>
          ) : isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-success me-2 "
                onClick={handleEditSubmit}
                disabled={!canEdit}
              >
                ✅ Finish Editing
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleContinue}
              >
                ➡ Next
              </button>
            </>
          ) : (
            <>
              {/* Only show Edit button if editing is allowed */}
              {canEdit && (
                <button
                  type="button"
                  className="btn btn-secondary me-2 btn-outline-primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleContinue}
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
