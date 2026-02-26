import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Bell,
  TrendingUp,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import "../styles/TeamDashboard.css";

export default function Overview({
  user,
  stats,
  appointments,
  googleConnected,
  onConnectGoogle,
  onDisconnectGoogle,
}) {
  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="section-title">
        Welcome, {user?.first_name || "Team Member"}!
      </h1>
      <p className="section-subtitle">
        Here's an overview of your appointments and availability
      </p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.today || 0}</span>
            <span className="stat-label">Today's Appointments</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <Bell size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.pending || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.confirmed || 0}</span>
            <span className="stat-label">Confirmed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.total || 0}</span>
            <span className="stat-label">Total Appointments</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="overview-grid">
        {/* Upcoming Appointments */}
        <div className="section-card">
          <div className="section-card-header">
            <h2>Upcoming Appointments</h2>
            <Link to="#" className="view-all-link" onClick={() => {}}>
              View All
            </Link>
          </div>
          <div className="section-card-body">
            {appointments?.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} className="empty-icon" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments?.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="appointment-item">
                    <div className="appt-time-badge">
                      <span className="appt-date">
                        {new Date(appt.start_datetime).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span className="appt-time">
                        {new Date(appt.start_datetime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="appt-details">
                      <h4>{appt.title}</h4>
                      <p>{appt.client_name}</p>
                    </div>
                    <span className={`status-badge ${appt.status}`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Google Calendar Integration */}
        <div className="section-card">
          <div className="section-card-header">
            <h2>Google Calendar</h2>
          </div>
          <div className="section-card-body">
            <div className="google-integration">
              {googleConnected ? (
                <div className="google-status connected">
                  <div className="google-icon-wrapper">
                    <FaGoogle size={24} />
                  </div>
                  <div className="google-info">
                    <h4>Connected</h4>
                    <p>Your calendar is synced with Google Calendar</p>
                  </div>
                  <button
                    onClick={onDisconnectGoogle}
                    className="btn-disconnect"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="google-status disconnected">
                  <div className="google-icon-wrapper inactive">
                    <FaGoogle size={24} />
                  </div>
                  <div className="google-info">
                    <h4>Not Connected</h4>
                    <p>Sync your appointments with Google Calendar</p>
                  </div>
                  <button
                    onClick={onConnectGoogle}
                    className="btn-connect-google"
                  >
                    <FaGoogle /> Connect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
