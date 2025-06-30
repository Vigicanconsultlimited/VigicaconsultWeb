import React, { useEffect, useState } from "react";
//import { getSavedSupportingDocs } from "../../services/api";

function SavedSupportingDocuments({ onBack }) {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    async function fetchDocs() {
      const result = await getSavedSupportingDocs();
      setDocs(result);
    }
    fetchDocs();
  }, []);

  if (!docs) return <p>Loading...</p>;

  return (
    <div>
      <h2>Saved Supporting Documents</h2>
      <ul>
        {docs.map((doc, index) => (
          <li key={index}>
            {doc.name} - {doc.status}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onBack} className="btn btn-secondary">
        Back
      </button>
    </div>
  );
}

export default SavedSupportingDocuments;
