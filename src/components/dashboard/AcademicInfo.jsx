import React, { useState, useEffect, useCallback } from "react";
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
    ResearchTopic: "", // <-- ADDED!
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

  const [isPhDProgram, setIsPhDProgram] = useState(false);

  // Mobile summary chips expand/collapse
  const [showProgramDetailsMobile, setShowProgramDetailsMobile] =
    useState(false);
  const [showSchoolDetailsMobile, setShowSchoolDetailsMobile] = useState(false);

  // Can edit if status null / Pending (2) / Rejected (4)
  const canEdit =
    applicationStatus === null ||
    applicationStatus === 2 ||
    applicationStatus === 4;

  const getStatusText = (status) => {
    const map = {
      1: "Submitted",
      2: "Pending",
      3: "Under Review",
      4: "Rejected",
      5: "Approved",
    };
    return map[status] || "Unknown";
  };

  const getProgramLevelText = (level) => {
    const levels = {
      0: "Undergraduate",
      1: "Masters",
      2: "PhD",
      3: "Certificate",
    };
    return levels[level] || "Other";
  };

  const getSchoolName = (id) => schools.find((s) => s.id === id)?.name || "";
  const getCourseName = (id) => courses.find((c) => c.id === id)?.name || "";
  const selectedProgram = programs.find(
    (p) => p.id === formData.AcademicProgramId
  );

  // Load personal info & existing academic record
  useEffect(() => {
    const load = async () => {
      if (!authData) {
        setLoading(false);
        return;
      }
      const userId = authData.uid;
      try {
        const personalRes = await apiInstance.get(
          `StudentPersonalInfo/user/${userId}`
        );
        const personalInfo = personalRes?.data?.result;
        if (personalInfo) {
          const personalInfoId = personalInfo.id;
          setFormData((p) => ({ ...p, PersonalInformationId: personalInfoId }));
          localStorage.setItem("studentPersonalInfoId", personalInfoId);

          try {
            const statusRes = await apiInstance.get(
              `StudentApplication/application?StudentPersonalInformationId=${personalInfoId}`
            );
            if (statusRes?.data?.result) {
              setApplicationStatus(statusRes.data.result.applicationStatus);
            } else {
              setApplicationStatus(2);
            }
          } catch {
            setApplicationStatus(2);
          }

          try {
            const acadRes = await apiInstance.get(
              `Academic/StudentInformationId?PersonalInformationId=${personalInfoId}`
            );
            if (acadRes?.data?.result && acadRes.data.statusCode === 201) {
              const saved = acadRes.data.result;
              setAcademicInfoId(saved.id || "");
              setIsFormSubmitted(true);
            }
          } catch {
            /* no record */
          }
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authData]);

  // Lookup lists
  useEffect(() => {
    (async () => {
      try {
        const r = await apiInstance.get("School");
        if (r?.data?.statusCode === 200) setSchools(r.data.result || []);
      } catch {}
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const r = await apiInstance.get("AcademicProgram");
        if (r?.data?.statusCode === 200) setPrograms(r.data.result || []);
      } catch {}
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const r = await apiInstance.get("CourseOfInterest");
        if (r?.data?.statusCode === 200) setCourses(r.data.result || []);
      } catch {}
    })();
  }, []);

  // Map existing academic record once lookups ready
  useEffect(() => {
    const mapRecord = async () => {
      if (
        !formData.PersonalInformationId ||
        !academicInfoId ||
        !schools.length ||
        !programs.length ||
        !courses.length
      )
        return;
      try {
        const r = await apiInstance.get(
          `Academic/StudentInformationId?PersonalInformationId=${formData.PersonalInformationId}`
        );
        if (r?.data?.result && r.data.statusCode === 201) {
          const saved = r.data.result;
          const schoolId =
            schools.find((s) => s.name === saved.schoolResponse?.name)?.id ||
            "";
          const programId =
            programs.find((p) => p.description === saved.program?.description)
              ?.id || "";
          const courseId =
            courses.find((c) => c.name === saved.courseOfInterest?.name)?.id ||
            "";
          setFormData((p) => ({
            ...p,
            Id: saved.id || "",
            SchoolId: schoolId,
            AcademicProgramId: programId,
            CourseOfInterestId: courseId,
            ResearchTopic: saved.researchTopic || "", // <-- ADDED!
          }));
        }
      } catch {
        /* ignore */
      }
    };
    mapRecord();
  }, [
    formData.PersonalInformationId,
    academicInfoId,
    schools,
    programs,
    courses,
  ]);

  // Track PhD
  useEffect(() => {
    if (formData.AcademicProgramId && programs.length) {
      const p = programs.find((x) => x.id === formData.AcademicProgramId);
      const phd = p && p.programLevel === 2;
      setIsPhDProgram(phd);
      localStorage.setItem("isPhDProgram", phd ? "true" : "false");
    } else {
      setIsPhDProgram(false);
      localStorage.setItem("isPhDProgram", "false");
    }
  }, [formData.AcademicProgramId, programs]);

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
    if (!formData.PersonalInformationId) {
      Toast.fire({
        icon: "error",
        title: "Missing personal info (previous step).",
      });
      return;
    }
    const required = [
      "PersonalInformationId",
      "SchoolId",
      "AcademicProgramId",
      "CourseOfInterestId",
    ];
    const complete = required.every(
      (f) => formData[f] && String(formData[f]).trim() !== ""
    );
    if (!complete) {
      Toast.fire({ icon: "warning", title: "Fill all required fields" });
      return;
    }
    // ResearchTopic required for PhD
    if (
      isPhDProgram &&
      (!formData.ResearchTopic || !formData.ResearchTopic.trim())
    ) {
      Toast.fire({
        icon: "warning",
        title: "Research topic is required for PhD",
      });
      return;
    }

    const payload = new FormData();
    payload.append("PersonalInformationId", formData.PersonalInformationId);
    payload.append("SchoolId", formData.SchoolId);
    payload.append("AcademicProgramId", formData.AcademicProgramId);
    payload.append("CourseOfInterestId", formData.CourseOfInterestId);
    if (isPhDProgram) payload.append("ResearchTopic", formData.ResearchTopic); // <-- ADDED!

    try {
      setSubmitting(true);
      showLoadingOverlay();
      const res = await apiInstance.post("Academic", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.close();
      setIsFormSubmitted(true);
      if (res?.data?.result?.id) {
        const newId = res.data.result.id;
        setAcademicInfoId(newId);
        setFormData((p) => ({ ...p, Id: newId }));
      }
      Toast.fire({ icon: "success", title: "Saved" });
      setTimeout(() => onContinue && onContinue(), 400);
    } catch (err) {
      Swal.close();
      if (
        err.response?.data?.statusCode === 400 &&
        err.response.data.message?.includes("Already exits")
      ) {
        Toast.fire({ icon: "info", title: "Record exists. Continuing..." });
        setIsFormSubmitted(true);
        onContinue && onContinue();
      } else {
        Toast.fire({ icon: "error", title: "Submission failed" });
      }
    } finally {
      setSubmitting(false);
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
    if (!formData.Id) {
      Toast.fire({ icon: "error", title: "Missing record ID" });
      return;
    }
    const payload = new FormData();
    payload.append("Id", formData.Id);
    payload.append("PersonalInformationId", formData.PersonalInformationId);
    payload.append("ProgramId", formData.AcademicProgramId);
    payload.append("CourseId", formData.CourseOfInterestId);
    if (isPhDProgram) payload.append("ResearchTopic", formData.ResearchTopic); // <-- ADDED!
    try {
      showLoadingOverlay();
      await apiInstance.put("Academic/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.close();
      Toast.fire({ icon: "success", title: "Updated" });
      setIsEditing(false);
    } catch {
      Swal.close();
      Toast.fire({ icon: "error", title: "Update failed" });
    }
  };

  const handleContinue = useCallback(
    () => setTimeout(() => onContinue && onContinue(), 150),
    [onContinue]
  );

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="loading-spinner" />
          <p>Loading Academic Programs...</p>
        </div>
      </div>
    );
  }

  const mobileChips = [
    formData.SchoolId && {
      label: "School",
      value: getSchoolName(formData.SchoolId),
      expandable: true,
      toggle: () => setShowSchoolDetailsMobile((v) => !v),
      open: showSchoolDetailsMobile,
    },
    formData.AcademicProgramId && {
      label: "Program",
      value: selectedProgram?.description,
      expandable: true,
      toggle: () => setShowProgramDetailsMobile((v) => !v),
      open: showProgramDetailsMobile,
    },
    formData.CourseOfInterestId && {
      label: "Course",
      value: getCourseName(formData.CourseOfInterestId),
    },
    selectedProgram && {
      label: "Level",
      value: getProgramLevelText(selectedProgram.programLevel),
    },
  ].filter(Boolean);

  return (
    <form className="form-container academic-info-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Academic Program Selection</h2>

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
          <strong>Saved.</strong> Tap Edit to change selections.
          <p className="form-subtitle mb-0">
            You can modify while status allows editing.
          </p>
        </div>
      )}

      {applicationStatus && ![2, 4, null].includes(applicationStatus) && (
        <div className="alert alert-primary mb-2 mt-0 p-2 compact-alert">
          <p className="mb-0">
            <strong>Notice:</strong> Editing disabled for this status.
          </p>
        </div>
      )}

      {/* Mobile summary chips */}
      <div className="mobile-summary-bar">
        {mobileChips.map((chip, i) => (
          <div
            key={i}
            className={`summary-chip ${
              chip.expandable ? "chip-expandable" : ""
            }`}
            onClick={chip.expandable ? chip.toggle : undefined}
          >
            <span className="chip-label">{chip.label}:</span>
            <span className="chip-value" title={chip.value}>
              {chip.value?.length > 22
                ? chip.value.slice(0, 22) + "…"
                : chip.value}
            </span>
            {chip.expandable && (
              <span
                className={`chip-caret ${chip.open ? "chip-caret-open" : ""}`}
              >
                ▾
              </span>
            )}
          </div>
        ))}
      </div>

      {formData.SchoolId && showSchoolDetailsMobile && (
        <div className="mobile-detail-panel">
          {schools
            .filter((s) => s.id === formData.SchoolId)
            .map((s) => (
              <div key={s.id} className="mobile-detail-grid">
                <div>
                  <strong>Name:</strong> {s.name}
                </div>
                <div>
                  <strong>Location:</strong> {s.town}, {s.county}
                </div>
                <div>
                  <strong>Post Code:</strong> {s.postCode}
                </div>
                <div>
                  <strong>Address:</strong> {s.addresss}
                </div>
              </div>
            ))}
        </div>
      )}

      {formData.AcademicProgramId &&
        showProgramDetailsMobile &&
        selectedProgram && (
          <div className="mobile-detail-panel">
            <div className="mobile-detail-grid">
              <div>
                <strong>Program:</strong> {selectedProgram.description}
              </div>
              <div>
                <strong>Faculty:</strong> {selectedProgram.faculty}
              </div>
              <div>
                <strong>Level:</strong>{" "}
                {getProgramLevelText(selectedProgram.programLevel)}
              </div>
              <div>
                <strong>Duration:</strong> {selectedProgram.durationInYears}{" "}
                years
              </div>
            </div>
          </div>
        )}

      {/* School */}
      <div className="row g-3 pb-2 compact-row">
        <div className="col-12">
          <label className="form-label">
            School <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select compact-select"
            value={formData.SchoolId}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, SchoolId: e.target.value })
            }
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} – {school.town}, {school.county}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop school detail */}
      {formData.SchoolId && schools.length > 0 && (
        <div className="selected-school-info mb-3 desktop-school-details">
          {schools
            .filter((s) => s.id === formData.SchoolId)
            .map((s) => (
              <div key={s.id} className="school-details">
                <h4 className="selected-school-title mb-1">{s.name}</h4>
                <div className="school-address">
                  <p className="mb-1">
                    {s.addresss}, {s.town}, {s.county}
                  </p>
                  <p className="mb-0">Post Code: {s.postCode}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Program */}
      <div className="row g-3 pb-2 compact-row">
        <div className="col-12">
          <label className="form-label">
            Academic Program <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select compact-select"
            value={formData.AcademicProgramId}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({ ...formData, AcademicProgramId: e.target.value })
            }
          >
            <option value="">Select a program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.description} ({getProgramLevelText(p.programLevel)}) –{" "}
                {p.faculty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPhDProgram && (
        <div className="alert alert-info mb-3 compact-alert phd-alert">
          <i className="fas fa-info-circle me-2" />
          <strong>PhD Selected.</strong> Research Proposal required next step.
        </div>
      )}

      {/* Course */}
      <div className="row g-3 pb-2 compact-row">
        <div className="col-12">
          <label className="form-label">
            Course of Interest <span className="required-asterisk">*</span>
          </label>
          <select
            className="form-select compact-select"
            value={formData.CourseOfInterestId}
            disabled={(!isEditing && isFormSubmitted) || !canEdit}
            onChange={(e) =>
              setFormData({
                ...formData,
                CourseOfInterestId: e.target.value,
              })
            }
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Research Topic for PhD only */}
      {isPhDProgram && (
        <div className="row g-3 pb-2 compact-row">
          <div className="col-12">
            <label className="form-label">
              Research Topic <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              className="form-control compact-input"
              maxLength={200}
              placeholder="Enter your research topic"
              value={formData.ResearchTopic}
              disabled={(!isEditing && isFormSubmitted) || !canEdit}
              onChange={(e) =>
                setFormData({ ...formData, ResearchTopic: e.target.value })
              }
              required={isPhDProgram}
            />
            <small className="text-muted">
              Please specify your intended research topic. (Compulsory for PhD)
            </small>
          </div>
        </div>
      )}

      {formData.AcademicProgramId && selectedProgram && (
        <div className="program-details-card desktop-program-details">
          <h3 className="program-details-title">Selected Program Details</h3>
          <div className="program-info">
            <div className="program-info-row">
              <span className="info-label">Program:</span>
              <span className="info-value">{selectedProgram.description}</span>
            </div>
            <div className="program-info-row">
              <span className="info-label">Faculty:</span>
              <span className="info-value">{selectedProgram.faculty}</span>
            </div>
            <div className="program-info-row">
              <span className="info-label">Level:</span>
              <span className="info-value">
                {getProgramLevelText(selectedProgram.programLevel)}
              </span>
            </div>
            <div className="program-info-row">
              <span className="info-label">Duration:</span>
              <span className="info-value">
                {selectedProgram.durationInYears} years
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
                <span className="info-label">Course:</span>
                <span className="info-value">
                  {getCourseName(formData.CourseOfInterestId)}
                </span>
              </div>
            )}
            {isPhDProgram && formData.ResearchTopic && (
              <div className="program-info-row">
                <span className="info-label">Research Topic:</span>
                <span className="info-value">{formData.ResearchTopic}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer – NOT fixed, matches PersonalInfo style */}
      <div className="form-footer non-fixed-footer">
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
            disabled={!canEdit || submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Saving...
              </>
            ) : (
              "Continue →"
            )}
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
