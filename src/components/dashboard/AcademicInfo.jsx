import React, { useState, useEffect } from "react";
import "./styles/AcademicInfo.css";
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

export default function AcademicInfo({
  onContinue,
  onBack,
  defaultSchool = null,
  defaultProgram = null,
}) {
  const authData = useAuthStore((state) => state.allUserData);

  const [formData, setFormData] = useState({
    PersonalInformationId: "",
    SchoolId: "",
    AcademicProgramId: "",
    CourseOfInterestId: "",
  });

  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [previouslySubmitted, setPreviouslySubmitted] = useState(false);

  // Current date and time as specified
  const getCurrentDateTime = () => {
    return "2025-08-06 08:51:54";
  };

  // Current user login as specified
  const getCurrentUser = () => {
    return "NeduStack";
  };

  // Check if application status allows editing
  const canEdit =
    (applicationStatus === null ||
      applicationStatus === 2 ||
      applicationStatus === 4) &&
    !previouslySubmitted;

  // Check if application is submitted (status 1)
  const isApplicationSubmitted = applicationStatus === 1;

  // Fetch user's personal info ID with multiple fallbacks
  useEffect(() => {
    const fetchPersonalInfoId = async () => {
      try {
        // First check localStorage
        const storedId = localStorage.getItem("studentPersonalInfoId");

        if (storedId) {
          console.log(
            `Found personal info ID in localStorage: ${storedId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );
          setFormData((prev) => ({
            ...prev,
            PersonalInformationId: storedId,
          }));

          // Check application status
          try {
            const appResponse = await apiInstance.get(
              `StudentApplication/application?StudentPersonalInformationId=${storedId}`
            );

            if (appResponse?.data?.result) {
              const status = appResponse.data.result.applicationStatus;
              setApplicationStatus(status);
              console.log(
                `Application status: ${getStatusText(
                  status
                )} (${status}) at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );

              // If application is submitted, also mark academic info as previously submitted
              if (status === 1) {
                setPreviouslySubmitted(true);
                console.log(
                  `Application is submitted, marking academic info as previously submitted at ${getCurrentDateTime()} by ${getCurrentUser()}`
                );
              }
            }
          } catch (err) {
            console.log(
              `No application found or error: ${
                err.message
              } at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );
            setApplicationStatus(2); // Default to Pending
          }
        } else if (authData) {
          // If not in localStorage, fetch from API
          const userId = authData["uid"];
          try {
            console.log(
              `Fetching personal info ID from API at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );

            const response = await apiInstance.get(
              `StudentPersonalInfo/user/${userId}`
            );

            if (response?.data?.result) {
              const personalInfoId = response.data.result.id || "";

              setFormData((prev) => ({
                ...prev,
                PersonalInformationId: personalInfoId,
              }));

              // Also store in localStorage for future use
              localStorage.setItem("studentPersonalInfoId", personalInfoId);
              console.log(
                `Stored personal info ID in localStorage: ${personalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );

              // Check application status
              if (personalInfoId) {
                try {
                  const appResponse = await apiInstance.get(
                    `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
                  );

                  if (appResponse?.data?.result) {
                    const status = appResponse.data.result.applicationStatus;
                    setApplicationStatus(status);
                    console.log(
                      `Application status: ${getStatusText(
                        status
                      )} (${status}) at ${getCurrentDateTime()} by ${getCurrentUser()}`
                    );

                    // If application is submitted, also mark academic info as previously submitted
                    if (status === 1) {
                      setPreviouslySubmitted(true);
                      console.log(
                        `Application is submitted, marking academic info as previously submitted at ${getCurrentDateTime()} by ${getCurrentUser()}`
                      );
                    }
                  }
                } catch (appErr) {
                  console.log(
                    `No application found or error: ${
                      appErr.message
                    } at ${getCurrentDateTime()} by ${getCurrentUser()}`
                  );
                  setApplicationStatus(2); // Default to Pending
                }
              }
            } else {
              console.warn(
                `No personal info ID found at ${getCurrentDateTime()} by ${getCurrentUser()}`
              );
              Toast.fire({
                icon: "error",
                title: "Please complete your personal information first",
              });
              if (onBack) onBack();
            }
          } catch (error) {
            console.error(
              `Error fetching personal info: ${
                error.message
              } at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );
            Toast.fire({
              icon: "error",
              title: "Please complete your personal information first",
            });
            if (onBack) onBack();
          }
        }
      } catch (mainError) {
        console.error(
          `Main personal info fetch error: ${
            mainError.message
          } at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
      } finally {
        // Always set loading to false to prevent infinite loading
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchPersonalInfoId();
  }, [authData, onBack]);

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

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        console.log(
          `Fetching schools at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

        const response = await apiInstance.get("School");

        if (response?.data?.statusCode === 200) {
          setSchools(response.data.result || []);
          console.log(
            `${
              response.data.result.length
            } schools fetched at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // If we have schools and no school selected, auto-select the first school
          if (response.data.result?.length > 0 && !formData.SchoolId) {
            // Look for School of Science or select first one
            const scienceSchool = response.data.result.find((s) =>
              s.name.toLowerCase().includes("science")
            );
            const schoolToSelect = scienceSchool || response.data.result[0];

            setFormData((prev) => ({
              ...prev,
              SchoolId: schoolToSelect.id,
            }));
            console.log(
              `Auto-selected school: ${schoolToSelect.name} (${
                schoolToSelect.id
              }) at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );
          }
        }
      } catch (error) {
        console.error(
          `Error fetching schools: ${
            error.message
          } at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
      }
    };

    fetchSchools();
  }, []);

  // Fetch academic programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        console.log(
          `Fetching academic programs at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

        const response = await apiInstance.get("AcademicProgram");

        if (response?.data?.statusCode === 200) {
          setPrograms(response.data.result || []);
          console.log(
            `${
              response.data.result.length
            } programs fetched at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // If we have programs and no program selected, auto-select the Computer Science program or first one
          if (response.data.result?.length > 0 && !formData.AcademicProgramId) {
            const csProgram = response.data.result.find((p) =>
              p.description.toLowerCase().includes("computer science")
            );
            const programToSelect = csProgram || response.data.result[0];

            setFormData((prev) => ({
              ...prev,
              AcademicProgramId: programToSelect.id,
            }));
            console.log(
              `Auto-selected program: ${programToSelect.description} (${
                programToSelect.id
              }) at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );
          }
        }
      } catch (error) {
        console.error(
          `Error fetching programs: ${
            error.message
          } at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
      }
    };

    fetchPrograms();
  }, []);

  // Fetch courses of interest
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log(
          `Fetching courses of interest at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

        const response = await apiInstance.get("CourseOfInterest");

        if (response?.data?.statusCode === 200) {
          setCourses(response.data.result || []);
          console.log(
            `${
              response.data.result.length
            } courses fetched at ${getCurrentDateTime()} by ${getCurrentUser()}`
          );

          // If we have courses and no course selected, auto-select the Computer Science course or first one
          if (
            response.data.result?.length > 0 &&
            !formData.CourseOfInterestId
          ) {
            const csCourse = response.data.result.find((c) =>
              c.name.toLowerCase().includes("computer science")
            );
            const courseToSelect = csCourse || response.data.result[0];

            setFormData((prev) => ({
              ...prev,
              CourseOfInterestId: courseToSelect.id,
            }));
            console.log(
              `Auto-selected course: ${courseToSelect.name} (${
                courseToSelect.id
              }) at ${getCurrentDateTime()} by ${getCurrentUser()}`
            );
          }
        }
      } catch (error) {
        console.error(
          `Error fetching courses: ${
            error.message
          } at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
      }
    };

    fetchCourses();
  }, []);

  // Fetch existing academic info
  const fetchExistingData = async (personalInfoId) => {
    if (!personalInfoId) {
      console.warn(
        `Cannot fetch academic data: Personal Info ID is missing at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
      return false;
    }

    try {
      console.log(
        `Fetching academic data for PersonalInfoId: ${personalInfoId} at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
      const response = await apiInstance.get(
        `Academic?PersonalInformationId=${personalInfoId}`
      );

      if (response?.data?.result) {
        const savedData = response.data.result;
        console.log(
          `Retrieved academic data at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );

        setFormData((prev) => ({
          ...prev,
          SchoolId: savedData.schoolId || "",
          AcademicProgramId: savedData.academicProgramId || "",
          CourseOfInterestId: savedData.courseOfInterestId || "",
        }));
        setIsFormSubmitted(true);
        setPreviouslySubmitted(true); // Mark as previously submitted
        return true;
      }
      return false;
    } catch (error) {
      console.warn(
        `No existing academic info found or error: ${
          error.message
        } at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
      return false;
    }
  };

  // Call fetch existing data when personal info id is available
  useEffect(() => {
    if (formData.PersonalInformationId) {
      fetchExistingData(formData.PersonalInformationId);
    }
  }, [formData.PersonalInformationId]);

  // Get school name by ID
  const getSchoolName = (schoolId) => {
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Unknown School";
  };

  // Render selected school
  const renderSelectedSchool = () => {
    if (formData.SchoolId && schools.length > 0) {
      const schoolName = getSchoolName(formData.SchoolId);
      return (
        <div className="selected-school-info mb-3">
          <h4 className="selected-school-title">Selected School</h4>
          <div className="school-badge">
            <span>{schoolName}</span>
          </div>
        </div>
      );
    }
    return null;
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

    // Check if editing is allowed
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: previouslySubmitted
          ? "This information has already been submitted."
          : `Cannot edit. Application status: ${getStatusText(
              applicationStatus
            )}`,
      });
      return;
    }

    // Verify we have the personal info ID
    if (!formData.PersonalInformationId) {
      console.error(
        `Cannot submit academic info: Missing Personal Info ID at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );

      // Try to get from localStorage one more time
      const storedId = localStorage.getItem("studentPersonalInfoId");
      if (storedId) {
        setFormData((prev) => ({ ...prev, PersonalInformationId: storedId }));
        Toast.fire({
          icon: "info",
          title: "Please try submitting again",
        });
        return;
      }

      Toast.fire({
        icon: "error",
        title:
          "Missing personal information ID. Please go back and complete your personal information.",
      });
      return;
    }

    const requiredFields = [
      "PersonalInformationId",
      "SchoolId",
      "AcademicProgramId",
      "CourseOfInterestId",
    ];
    const isFormComplete = requiredFields.every(
      (field) => formData[field] && String(formData[field]).trim() !== ""
    );

    if (!isFormComplete) {
      Toast.fire({
        icon: "warning",
        title: "Please complete all required fields",
      });
      return;
    }

    const payload = new FormData();

    // Add required fields to the payload
    payload.append("PersonalInformationId", formData.PersonalInformationId);
    payload.append("SchoolId", formData.SchoolId);
    payload.append("AcademicProgramId", formData.AcademicProgramId);
    payload.append("CourseOfInterestId", formData.CourseOfInterestId);

    try {
      setSubmitting(true);
      showLoadingOverlay();

      console.log(
        `Submitting academic info with PersonalInfoId: ${
          formData.PersonalInformationId
        } at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );

      console.log(`Payload:
PersonalInformationId: ${formData.PersonalInformationId}
SchoolId: ${formData.SchoolId}
AcademicProgramId: ${formData.AcademicProgramId}
CourseOfInterestId: ${formData.CourseOfInterestId}
at ${getCurrentDateTime()} by ${getCurrentUser()}`);

      const response = await apiInstance.post("Academic", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.close();

      // Successfully submitted
      setIsFormSubmitted(true);
      setPreviouslySubmitted(true); // Mark as previously submitted
      Toast.fire({ icon: "success", title: "Submitted successfully" });
      console.log(
        `Program selection submitted at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );

      if (onContinue) {
        setTimeout(() => {
          onContinue();
        }, 500); // Small delay to ensure everything is saved
      }
    } catch (error) {
      Swal.close();
      console.error(
        `Submission failed: ${
          error.message
        } at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );

      // Check if it's the "Already exists" error
      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode === 400 &&
        error.response.data.message.includes("Already exits")
      ) {
        // Show a more helpful message with option to continue
        Swal.fire({
          title: "Program Already Selected",
          text: "You have already selected an academic program. Would you like to continue to the next step?",
          icon: "info",
          showCancelButton: false,
          confirmButtonText: "Continue to Next Step",
        }).then(() => {
          setPreviouslySubmitted(true); // Mark as previously submitted
          setIsFormSubmitted(true);
          if (onContinue) onContinue();
        });
      } else {
        // Handle other errors
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          Toast.fire({ icon: "error", title: error.response.data.message });
        } else {
          Toast.fire({ icon: "error", title: "Submission failed" });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    // Check if editing is allowed
    if (!canEdit) {
      Toast.fire({
        icon: "warning",
        title: previouslySubmitted
          ? "This information has already been submitted."
          : `Cannot edit. Application status: ${getStatusText(
              applicationStatus
            )}`,
      });
      return;
    }

    // Create payload with the correct field names for the update API
    const payload = new FormData();

    // Map field names as required by the API for update
    payload.append(
      "PersonalInformationId",
      formData.PersonalInformationId || ""
    );
    payload.append("SchoolId", formData.SchoolId || "");
    payload.append("ProgramId", formData.AcademicProgramId || ""); // Note the field name change for update
    payload.append("CourseId", formData.CourseOfInterestId || ""); // Note the field name change for update

    try {
      setSubmitting(true);
      showLoadingOverlay();

      console.log(
        `Updating program selection at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
      console.log(`Update payload:
PersonalInformationId: ${formData.PersonalInformationId}
SchoolId: ${formData.SchoolId}
ProgramId: ${formData.AcademicProgramId}
CourseId: ${formData.CourseOfInterestId}
at ${getCurrentDateTime()} by ${getCurrentUser()}`);

      await apiInstance.put("Academic/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.close();
      Toast.fire({ icon: "success", title: "Updated successfully" });
      setIsEditing(false);
      setPreviouslySubmitted(true); // Mark as previously submitted

      // After successful update, continue to next step
      if (onContinue) {
        setTimeout(() => {
          onContinue();
        }, 1000); // Small delay to show the success toast
      }
    } catch (error) {
      Swal.close();
      console.error(
        `Update failed: ${
          error.message
        } at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );

      // Show more detailed error message if available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Toast.fire({ icon: "error", title: error.response.data.message });
      } else {
        Toast.fire({ icon: "error", title: "Update failed" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Get program level as human-readable text
  const getProgramLevelText = (level) => {
    const levels = {
      0: "Undergraduate",
      1: "Masters",
      2: "PhD",
      3: "Certificate",
    };
    return levels[level] || "Other";
  };

  // Handle continuing to next step
  const handleContinue = () => {
    if (onContinue) {
      console.log(
        `Continuing to next step at ${getCurrentDateTime()} by ${getCurrentUser()}`
      );
      onContinue();
    }
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  // Loading indicator when fetching data
  if (loading) {
    return (
      <div className="form-container">
        <h2 className="form-title">Academic Program Selection</h2>
        <div className="loading-overlay">
          <div className="spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading Academic Programs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine what to render based on state
  const renderButtons = () => {
    // If we're in edit mode
    if (isEditing) {
      return (
        <>
          <button
            type="button"
            className="btn btn-success me-2"
            onClick={handleEditSubmit}
            disabled={submitting || !canEdit}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              "✅ Save Changes"
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setIsEditing(false);
              handleContinue();
            }}
          >
            Skip Changes →
          </button>
        </>
      );
    }

    // If form is submitted but not in edit mode
    if (isFormSubmitted || previouslySubmitted) {
      return (
        <>
          {/* Only show Edit button if editing is allowed */}
          {canEdit && (
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit
            </button>
          )}

          {/* Continue button with NO disabled prop */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleContinue}
          >
            Continue →
          </button>
        </>
      );
    }

    // Initial state - form not submitted yet
    return (
      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting || !canEdit}
      >
        {submitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Saving...
          </>
        ) : (
          "Continue →"
        )}
      </button>
    );
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Academic Program Selection</h2>

      {/* Show "already submitted" message only if editing is allowed and not previously submitted */}
      {isFormSubmitted && !isEditing && canEdit && !previouslySubmitted && (
        <div className="alert alert-info mt-3">
          <strong>You've already saved this form.</strong>
          <br />
          Click edit to update your program selection.
          <p className="form-subtitle">
            Select the academic program you wish to apply for.
            {canEdit ? " Your choice can be updated later if needed." : ""}
          </p>
        </div>
      )}

      {/* Show message for previously submitted data */}
      {previouslySubmitted && (
        <div className="alert alert-primary mt-3">
          <strong>Your academic information has been saved.</strong>
          <br />

          {canEdit
            ? "You can edit your selections or continue to the next step."
            : "This information cannot be modified, but you can proceed to the next step."}
        </div>
      )}

      {/* Show special message for submitted applications */}
      {isApplicationSubmitted && !previouslySubmitted && (
        <div className="alert alert-success mt-3">
          <strong>Your application has been submitted.</strong>
          <br />
          Program selections cannot be modified at this time, but you can
          proceed to the next step.
        </div>
      )}

      {/* Show warning for other non-editable statuses */}
      {applicationStatus &&
        applicationStatus !== 1 &&
        applicationStatus !== 2 &&
        applicationStatus !== 4 &&
        !previouslySubmitted && (
          <div className="alert alert-warning mt-3">
            <strong>Notice: Your application cannot be edited.</strong>
            <br />
            Current status: {getStatusText(applicationStatus)}. Only
            applications with status "Pending" or "Rejected" can be edited.
          </div>
        )}

      {/* Debug info - only visible in development */}
      {/*
      {process.env.NODE_ENV === "development" && (
        <div
          className="debug-info mt-2 mb-2"
          style={{
            fontSize: "0.8rem",
            color: "#666",
            background: "#f8f9fa",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Debug Info:</strong> Personal Info ID:{" "}
            {formData.PersonalInformationId || "Not set"}
          </p>
          <p style={{ margin: 0 }}>
            School ID: {formData.SchoolId || "Not set"}
          </p>
          <p style={{ margin: 0 }}>
            Program ID: {formData.AcademicProgramId || "Not set"}
          </p>
          <p style={{ margin: 0 }}>
            Course ID: {formData.CourseOfInterestId || "Not set"}
          </p>
          <p style={{ margin: 0 }}>
            Application Status: {applicationStatus} (
            {getStatusText(applicationStatus)})
          </p>
          <p style={{ margin: 0 }}>
            Can Edit: {canEdit ? "Yes" : "No"} | Previously Submitted:{" "}
            {previouslySubmitted ? "Yes" : "No"}
          </p>
          <p style={{ margin: 0 }}>
            Is Form Submitted: {isFormSubmitted ? "Yes" : "No"} | Is Editing:{" "}
            {isEditing ? "Yes" : "No"}
          </p>
          <p style={{ margin: 0 }}>
            Is Application Submitted: {isApplicationSubmitted ? "Yes" : "No"}
          </p>
        </div>
      )}
      */}

      {/* School Selection */}
      <div className="row g-3 pb-3">
        <div className="col-12">
          <label className="form-label">
            School <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select"
            value={formData.SchoolId}
            disabled={
              (!isEditing && isFormSubmitted) ||
              submitting ||
              !canEdit ||
              previouslySubmitted
            }
            onChange={(e) =>
              setFormData({ ...formData, SchoolId: e.target.value })
            }
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} - {school.town}, {school.county}
              </option>
            ))}
          </select>
          {formData.SchoolId && schools.length > 0 && (
            <small className="text-muted">
              Selected: {getSchoolName(formData.SchoolId)}
            </small>
          )}
        </div>
      </div>

      {/* Show selected school info */}
      {formData.SchoolId && schools.length > 0 && (
        <div className="selected-school-info mb-3">
          {schools
            .filter((school) => school.id === formData.SchoolId)
            .map((school) => (
              <div key={school.id} className="school-details">
                <h4 className="selected-school-title mb-1">{school.name}</h4>
                <div className="school-address">
                  <p className="mb-1">
                    {school.addresss}, {school.town}, {school.county}
                  </p>
                  <p>Post Code: {school.postCode}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Program Selection */}
      <div className="row g-3 pb-3">
        <div className="col-12">
          <label className="form-label">
            Academic Program <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select"
            value={formData.AcademicProgramId}
            disabled={
              (!isEditing && isFormSubmitted) ||
              submitting ||
              !canEdit ||
              previouslySubmitted
            }
            onChange={(e) =>
              setFormData({ ...formData, AcademicProgramId: e.target.value })
            }
          >
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.description} (
                {getProgramLevelText(program.programLevel)}) - {program.faculty}
              </option>
            ))}
          </select>
          {formData.AcademicProgramId && programs.length > 0 && (
            <small className="text-muted">
              {programs.find((p) => p.id === formData.AcademicProgramId)
                ?.description || ""}
            </small>
          )}
        </div>
      </div>

      {/* Course of Interest Selection */}
      <div className="row g-3 pb-3">
        <div className="col-12">
          <label className="form-label">
            Course of Interest <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select"
            value={formData.CourseOfInterestId}
            disabled={
              (!isEditing && isFormSubmitted) ||
              submitting ||
              !canEdit ||
              previouslySubmitted
            }
            onChange={(e) =>
              setFormData({ ...formData, CourseOfInterestId: e.target.value })
            }
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {formData.CourseOfInterestId && courses.length > 0 && (
            <small className="text-muted">
              {courses.find((c) => c.id === formData.CourseOfInterestId)
                ?.name || ""}
            </small>
          )}
        </div>
      </div>

      {/* Program Details */}
      {formData.AcademicProgramId && programs.length > 0 && (
        <div className="program-details-card">
          <h3 className="program-details-title">Selected Program Details</h3>
          {programs
            .filter((program) => program.id === formData.AcademicProgramId)
            .map((program) => (
              <div key={program.id} className="program-info">
                <div className="program-info-row">
                  <span className="info-label">Program:</span>
                  <span className="info-value">{program.description}</span>
                </div>
                <div className="program-info-row">
                  <span className="info-label">Faculty:</span>
                  <span className="info-value">{program.faculty}</span>
                </div>
                <div className="program-info-row">
                  <span className="info-label">Level:</span>
                  <span className="info-value">
                    {getProgramLevelText(program.programLevel)}
                  </span>
                </div>
                <div className="program-info-row">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">
                    {program.durationInYears} years
                  </span>
                </div>
                {formData.SchoolId && (
                  <div className="program-info-row">
                    <span className="info-label">School:</span>
                    <span className="info-value">
                      {getSchoolName(formData.SchoolId)}
                    </span>
                  </div>
                )}
                {formData.CourseOfInterestId && (
                  <div className="program-info-row">
                    <span className="info-label">Course of Interest:</span>
                    <span className="info-value">
                      {getCourseName(formData.CourseOfInterestId)}
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Footer Buttons */}
      <div className="form-footer">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onBack}
          disabled={submitting}
        >
          ← Back
        </button>

        <div className="button-group">{renderButtons()}</div>
      </div>
    </form>
  );
}
