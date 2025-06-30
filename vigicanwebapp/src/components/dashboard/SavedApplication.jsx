// SavedApplications.jsx
import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import PersonalInfo from "./PersonalInfo";
import AcademicDocuments from "./AcademicDocuments";
import SupportingDocuments from "./SupportingDocuments";

export default function SavedApplications({ userId, setCurrentStep }) {
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const response = await apiInstance.get(
          `/StudentPersonalInfo/get/${userId}`
        );
        setSavedData(response.data);
      } catch (error) {
        console.error("Error fetching saved data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSaved();
  }, [userId]);

  if (loading) return <p>Loading saved applications...</p>;
  if (!savedData) return <p>No saved applications found.</p>;

  return (
    <div>
      <h3>Edit Saved Application</h3>
      <PersonalInfo
        initialData={savedData}
        onContinue={() => setCurrentStep("academic-documents")}
        editing
      />
      {/* Optionally: you can add routes or buttons to edit other sections like AcademicDocuments */}
    </div>
  );
}
