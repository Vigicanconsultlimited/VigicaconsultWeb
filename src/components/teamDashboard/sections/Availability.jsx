import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Trash2, X } from "lucide-react";
import "../styles/TeamDashboard.css";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Availability({ availability, onAdd, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    weekday: 0,
    start_time: "09:00",
    end_time: "17:00",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(form);
    setShowModal(false);
    setForm({ weekday: 0, start_time: "09:00", end_time: "17:00" });
  };

  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-header-row">
        <div>
          <h1 className="section-title">Your Availability</h1>
          <p className="section-subtitle">
            Set your weekly availability. Clients can book appointments during
            these times.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Availability
        </button>
      </div>

      {availability?.length === 0 ? (
        <div className="empty-state-card">
          <Clock size={64} className="empty-icon" />
          <h3>No availability set yet</h3>
          <p>Add your first availability slot to start accepting bookings</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Your First Slot
          </button>
        </div>
      ) : (
        <div className="availability-week-grid">
          {WEEKDAYS.map((day, index) => {
            const daySlots =
              availability?.filter((a) => a.weekday === index) || [];
            return (
              <div key={day} className="day-card">
                <h3 className="day-name">{day}</h3>
                {daySlots.length === 0 ? (
                  <p className="no-slots">No availability</p>
                ) : (
                  <div className="slots-list">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="slot-item">
                        <Clock size={16} className="slot-icon" />
                        <span className="slot-time">
                          {slot.start_time} - {slot.end_time}
                        </span>
                        <button
                          className="btn-delete-slot"
                          onClick={() => onDelete(slot.id)}
                          title="Delete slot"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Availability Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Availability</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Day of Week</label>
                <select
                  value={form.weekday}
                  onChange={(e) =>
                    setForm({ ...form, weekday: parseInt(e.target.value) })
                  }
                >
                  {WEEKDAYS.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm({ ...form, start_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm({ ...form, end_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
