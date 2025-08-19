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
    Id: "",
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
  const [academicInfoId, setAcademicInfoId] = useState("");

  // State to track if selected program is PhD level
  const [isPhDProgram, setIsPhDProgram] = useState(false);

  // Check if application status allows editing (only Pending or Rejected)
  const canEdit =
    applicationStatus === null ||
    applicationStatus === 2 ||
    applicationStatus === 4;

  // Fetch user's personal info ID and existing academic data
  useEffect(() => {
    const fetchExistingData = async () => {
      if (authData) {
        const userId = authData["uid"];

        try {
          // First get the personal info ID
          const personalResponse = await apiInstance.get(
            `StudentPersonalInfo/user/${userId}`
          );

          if (personalResponse?.data?.result) {
            const personalInfoId = personalResponse.data.result.id || "";
            setFormData((prev) => ({
              ...prev,
              PersonalInformationId: personalInfoId,
            }));

            // Store in localStorage
            localStorage.setItem("studentPersonalInfoId", personalInfoId);

            // Check application status
            if (personalInfoId) {
              try {
                const appResponse = await apiInstance.get(
                  `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
                );

                if (appResponse?.data?.result) {
                  const status = appResponse.data.result.applicationStatus;
                  setApplicationStatus(status);
                }
              } catch (err) {
                console.log(`No application found or error: ${err.message}`);
                setApplicationStatus(2); // Default to Pending
              }

              // Now try to fetch existing academic info
              try {
                const academicResponse = await apiInstance.get(
                  `Academic/StudentInformationId?PersonalInformationId=${personalInfoId}`
                );

                if (
                  academicResponse?.data?.result &&
                  academicResponse.data.statusCode === 201
                ) {
                  const savedData = academicResponse.data.result;
                  setAcademicInfoId(savedData.id || "");
                  setIsFormSubmitted(true);
                }
              } catch (academicErr) {
                console.warn(
                  `No existing academic info found or error: ${academicErr.message}`
                );
              }
            }
          }
        } catch (error) {
          console.warn(`Error fetching existing data: ${error.message}`);
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

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiInstance.get("School");

        if (response?.data?.statusCode === 200) {
          setSchools(response.data.result || []);
        }
      } catch (error) {
        console.error(`Error fetching schools: ${error.message}`);
      }
    };

    fetchSchools();
  }, []);

  // Fetch academic programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await apiInstance.get("AcademicProgram");

        if (response?.data?.statusCode === 200) {
          setPrograms(response.data.result || []);
        }
      } catch (error) {
        console.error(`Error fetching programs: ${error.message}`);
      }
    };

    fetchPrograms();
  }, []);

  // Fetch courses of interest
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiInstance.get("CourseOfInterest");

        if (response?.data?.statusCode === 200) {
          setCourses(response.data.result || []);
        }
      } catch (error) {
        console.error(`Error fetching courses: ${error.message}`);
      }
    };

    fetchCourses();
  }, []);

  // Fetch and map existing academic data when all dropdowns are loaded
  useEffect(() => {
    const fetchAndMapAcademicData = async () => {
      if (
        formData.PersonalInformationId &&
        schools.length > 0 &&
        programs.length > 0 &&
        courses.length > 0 &&
        academicInfoId
      ) {
        try {
          const response = await apiInstance.get(
            `Academic/StudentInformationId?PersonalInformationId=${formData.PersonalInformationId}`
          );

          if (response?.data?.result && response.data.statusCode === 201) {
            const savedData = response.data.result;

            // Find the corresponding IDs from the fetched data
            const schoolId =
              schools.find((s) => s.name === savedData.schoolResponse?.name)
                ?.id || "";
            const programId =
              programs.find(
                (p) => p.description === savedData.program?.description
              )?.id || "";
            const courseId =
              courses.find((c) => c.name === savedData.courseOfInterest?.name)
                ?.id || "";

            setFormData((prev) => ({
              ...prev,
              Id: savedData.id || "",
              SchoolId: schoolId,
              AcademicProgramId: programId,
              CourseOfInterestId: courseId,
            }));

            // Check if selected program is PhD level
            if (programId) {
              const selectedProgram = programs.find((p) => p.id === programId);
              if (selectedProgram && selectedProgram.programLevel === 2) {
                // PhD level is 2
                setIsPhDProgram(true);
                // Store PhD program info in localStorage for document component
                localStorage.setItem("isPhDProgram", "true");
              } else {
                localStorage.setItem("isPhDProgram", "false");
              }
            }
          }
        } catch (error) {
          console.warn(`Error mapping academic data: ${error.message}`);
        }
      }
    };

    fetchAndMapAcademicData();
  }, [
    formData.PersonalInformationId,
    schools.length,
    programs.length,
    courses.length,
    academicInfoId,
  ]);

  // Effect to check if selected program is PhD level
  useEffect(() => {
    if (formData.AcademicProgramId && programs.length > 0) {
      const selectedProgram = programs.find(
        (p) => p.id === formData.AcademicProgramId
      );
      const isPhdLevel = selectedProgram && selectedProgram.programLevel === 2;
      setIsPhDProgram(isPhdLevel);

      // Store PhD program info in localStorage for document component
      localStorage.setItem("isPhDProgram", isPhdLevel ? "true" : "false");
    } else {
      setIsPhDProgram(false);
      localStorage.setItem("isPhDProgram", "false");
    }
  }, [formData.AcademicProgramId, programs]);

  // Get school name by ID
  const getSchoolName = (schoolId) => {
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Unknown School";
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
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

    // Verify we have the personal info ID
    if (!formData.PersonalInformationId) {
      console.error("Cannot submit academic info: Missing Personal Info ID");

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

      const response = await apiInstance.post("Academic", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.close();
      setIsFormSubmitted(true);

      // If we get a response with an ID, save it
      if (response?.data?.result?.id) {
        const newAcademicInfoId = response.data.result.id;
        setAcademicInfoId(newAcademicInfoId);
        setFormData((prev) => ({ ...prev, Id: newAcademicInfoId }));
      }

      Toast.fire({ icon: "success", title: "Submitted successfully" });

      // Use setTimeout to ensure everything is saved before continuing
      setTimeout(() => {
        if (onContinue) onContinue();
      }, 500);
    } catch (error) {
      Swal.close();
      console.error(`Submission failed: ${error.message}`);

      // Check if it's the "Already exists" error
      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode === 400 &&
        error.response.data.message.includes("Already exits")
      ) {
        Toast.fire({
          icon: "info",
          title: "Academic information already exists",
        });
        setIsFormSubmitted(true);
        if (onContinue) onContinue();
      } else {
        Toast.fire({ icon: "error", title: "Submission failed" });
      }
    } finally {
      setSubmitting(false);
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

    // Verify we have the ID for updates
    if (!formData.Id) {
      Toast.fire({
        icon: "error",
        title: "Cannot update: Missing record ID",
      });
      return;
    }

    const payload = new FormData();

    // Add required fields for update API
    payload.append("Id", formData.Id);
    payload.append(
      "PersonalInformationId",
      formData.PersonalInformationId || ""
    );
    payload.append("SchoolId", formData.SchoolId || "");
    payload.append("ProgramId", formData.AcademicProgramId || ""); // Note the field name change for update
    payload.append("CourseId", formData.CourseOfInterestId || ""); // Note the field name change for update

    try {
      showLoadingOverlay();

      await apiInstance.put("Academic/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.close();
      Toast.fire({ icon: "success", title: "Updated successfully" });
      setIsEditing(false);
    } catch (error) {
      Swal.close();
      console.error(`Update failed: ${error.message}`);
      Toast.fire({ icon: "error", title: "Update failed" });
    }
  };

  // Handle "Next" button click
  const handleContinue = () => {
    // Use setTimeout to ensure any state updates are completed
    setTimeout(() => {
      if (onContinue) onContinue();
    }, 200);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading Academic Programs...</p>
        </div>
      </div>
    );
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Academic Program Selection</h2>

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
          <strong>You've already saved this form.</strong>
          <br />
          Click edit to update your program selection.
          <br />
          <p className="form-subtitle">
            Select the academic program you wish to apply for. Your choice can
            be updated later if needed.
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

      {/* School Selection */}
      <div className="row g-3 pb-3">
        <div className="col-12">
          <label className="form-label">
            School <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select"
            value={formData.SchoolId}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
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
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
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
        </div>
      </div>

      {/* PhD Program Info Alert */}
      {isPhDProgram && (
        <div className="alert alert-info mb-4">
          <i className="fas fa-info-circle me-2"></i>
          <strong>PhD Program Selected:</strong> You will need to upload a
          Research Proposal document in the next step.
        </div>
      )}

      {/* Course of Interest Selection */}
      <div className="row g-3 pb-3">
        <div className="col-12">
          <label className="form-label">
            Course of Interest <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select"
            value={formData.CourseOfInterestId}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
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
                {/* 
                {program.programLevel === 2 && ( // PhD level
                  <div className="program-info-row">
                    <span className="info-label">Research Proposal:</span>
                    <span className="info-value">
                      <strong>Required</strong> (Upload in next step)
                    </span>
                  </div>
                )}
                */}
              </div>
            ))}
        </div>
      )}

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
          ← Back
        </button>

        <div>
          {!isFormSubmitted ? (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canEdit || submitting}
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
          ) : isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-success me-2"
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
