import React from "react";
import { Card, CardBody } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const mockApplications = [
  {
    id: 1,
    type: "Undergraduate Scholarship",
    status: "Pending",
    lastUpdated: "2025-06-20",
    notes: "",
  },
  {
    id: 2,
    type: "Masters Grant",
    status: "Approved",
    lastUpdated: "2025-06-15",
    notes: "",
  },
  {
    id: 3,
    type: "Exchange Program",
    status: "Rejected",
    lastUpdated: "2025-06-10",
    notes: "Incomplete academic transcript uploaded.",
  },
  {
    id: 4,
    type: "Short Course Bursary",
    status: "Queried",
    lastUpdated: "2025-06-12",
    notes: "Clarify your course duration.",
  },
];

const getStatusVariant = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Approved":
      return "success";
    case "Rejected":
      return "danger";
    case "Queried":
      return "info";
    default:
      return "secondary";
  }
};

const ApplicationStatus = () => {
  return (
    <div>
      <h2 className="mb-4">Application Status</h2>
      {mockApplications.map((app) => (
        <Card
          className="mb-3"
          key={app.id}
          border={getStatusVariant(app.status)}
        >
          <CardBody>
            <h5 className="mb-2">{app.type}</h5>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`text-${getStatusVariant(app.status)}`}>
                {app.status}
              </span>
            </p>
            <p>
              <strong>Last Updated:</strong> {app.lastUpdated}
            </p>
            {(app.status === "Rejected" || app.status === "Queried") && (
              <div className="mt-2">
                <strong>Notes:</strong>
                <div className="alert alert-light border mt-1">{app.notes}</div>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationStatus;
