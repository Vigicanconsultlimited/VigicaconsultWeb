import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import "../styles/TeamDashboard.css";

export default function UpcomingAppointments({ appointments }) {
  const upcomingAppts =
    appointments?.filter(
      (appt) => appt.status === "confirmed" || appt.status === "pending",
    ) || [];

  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-header-row">
        <div>
          <h1 className="section-title">Upcoming Appointments</h1>
          <p className="section-subtitle">
            Your confirmed and pending appointments
          </p>
        </div>
      </div>

      {upcomingAppts.length === 0 ? (
        <div className="empty-state-card">
          <Calendar size={64} className="empty-icon" />
          <h3>No upcoming appointments</h3>
          <p>Your upcoming appointments will appear here</p>
        </div>
      ) : (
        <div className="upcoming-appointments-grid">
          {upcomingAppts.map((appt) => (
            <div key={appt.id} className="upcoming-card">
              <div className="upcoming-header">
                <span className={`status-badge ${appt.status}`}>
                  {appt.status}
                </span>
              </div>
              <div className="upcoming-body">
                <h3>{appt.title}</h3>
                <div className="upcoming-datetime">
                  <div className="datetime-item">
                    <Calendar size={16} />
                    <span>
                      {new Date(appt.start_datetime).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="datetime-item">
                    <Clock size={16} />
                    <span>
                      {new Date(appt.start_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(appt.end_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className="upcoming-client">
                  <p className="client-name">{appt.client_name}</p>
                  <p className="client-email">{appt.client_email}</p>
                  {appt.client_phone && (
                    <p className="client-phone">{appt.client_phone}</p>
                  )}
                </div>
                {appt.notes && (
                  <div className="upcoming-notes">
                    <p>{appt.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
