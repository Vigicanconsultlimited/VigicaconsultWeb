import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, XCircle, Clock, Check, X } from "lucide-react";
import "../styles/TeamDashboard.css";

const FILTER_OPTIONS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

export default function Appointments({
  appointments,
  filter,
  onFilterChange,
  onConfirm,
  onCancel,
  onComplete,
}) {
  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-header-row">
        <div>
          <h1 className="section-title">Appointments</h1>
          <p className="section-subtitle">
            Manage your appointments and client bookings
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`filter-tab ${filter === opt.id ? "active" : ""}`}
            onClick={() => onFilterChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {appointments?.length === 0 ? (
        <div className="empty-state-card">
          <Calendar size={64} className="empty-icon" />
          <h3>No appointments found</h3>
          <p>Appointments will appear here when clients book with you</p>
        </div>
      ) : (
        <div className="appointments-table">
          {appointments?.map((appt) => (
            <div key={appt.id} className="appointment-row">
              <div className="appt-datetime">
                <span className="date">
                  {new Date(appt.start_datetime).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="time">
                  {new Date(appt.start_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="appt-info">
                <h4>{appt.title}</h4>
                <p className="client-details">
                  {appt.client_name} • {appt.client_email}
                </p>
                {appt.notes && <p className="appt-notes">{appt.notes}</p>}
              </div>
              <span className={`status-badge ${appt.status}`}>
                {appt.status}
              </span>
              <div className="appt-actions">
                {appt.status === "pending" && (
                  <>
                    <button
                      className="btn-action confirm"
                      onClick={() => onConfirm(appt.id)}
                      title="Confirm"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      className="btn-action cancel"
                      onClick={() => onCancel(appt.id)}
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
                {appt.status === "confirmed" && (
                  <>
                    <button
                      className="btn-action complete"
                      onClick={() => onComplete(appt.id)}
                      title="Mark Complete"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      className="btn-action cancel"
                      onClick={() => onCancel(appt.id)}
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
