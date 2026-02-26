import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Calendar,
  AlertCircle,
  Check,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import "../styles/TeamDashboard.css";

export default function Settings({
  user,
  googleConnected,
  onConnectGoogle,
  onDisconnectGoogle,
  onChangePassword,
}) {
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    setChangingPassword(true);
    setPasswordMessage(null);
    try {
      await onChangePassword(
        passwordForm.old_password,
        passwordForm.new_password,
      );
      setPasswordMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text:
          err.response?.data?.old_password?.[0] || "Failed to change password",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-header-row">
        <div>
          <h1 className="section-title">Settings</h1>
          <p className="section-subtitle">
            Manage your account settings and integrations
          </p>
        </div>
      </div>

      {/* Google Calendar Integration */}
      <div className="settings-card">
        <div className="settings-card-header">
          <Calendar size={24} />
          <h3>Google Calendar Integration</h3>
        </div>
        <div className="settings-card-body">
          <p className="settings-description">
            Connect your Google Calendar to automatically sync appointments and
            block busy times.
          </p>
          <div className="google-integration-settings">
            {googleConnected ? (
              <div className="integration-connected">
                <div className="integration-status">
                  <FaGoogle size={20} className="google-icon" />
                  <span>Connected to Google Calendar</span>
                  <Check size={18} className="check-icon" />
                </div>
                <button onClick={onDisconnectGoogle} className="btn-disconnect">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={onConnectGoogle} className="btn-connect-google">
                <FaGoogle /> Connect Google Calendar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="settings-card">
        <div className="settings-card-header">
          <Lock size={24} />
          <h3>Change Password</h3>
        </div>
        <div className="settings-card-body">
          {passwordMessage && (
            <div className={`alert-message ${passwordMessage.type}`}>
              <AlertCircle size={18} />
              <span>{passwordMessage.text}</span>
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label htmlFor="old_password">Current Password</label>
              <input
                type="password"
                id="old_password"
                value={passwordForm.old_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    old_password: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new_password">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      new_password: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm_password">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm_password: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={changingPassword}
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Account Info */}
      <div className="settings-card">
        <div className="settings-card-header">
          <SettingsIcon size={24} />
          <h3>Account Information</h3>
        </div>
        <div className="settings-card-body">
          <div className="account-info-grid">
            <div className="account-info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="account-info-item">
              <span className="info-label">Account Created</span>
              <span className="info-value">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="account-info-item">
              <span className="info-label">Position</span>
              <span className="info-value">{user?.position || "Not set"}</span>
            </div>
            <div className="account-info-item">
              <span className="info-label">Department</span>
              <span className="info-value">
                {user?.department || "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
