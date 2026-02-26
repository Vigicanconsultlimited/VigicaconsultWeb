import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TeamHeader from "../components/teamDashboard/TeamHeader";
import TeamSidebar from "../components/teamDashboard/TeamSidebar";
import Overview from "../components/teamDashboard/sections/Overview";
import Availability from "../components/teamDashboard/sections/Availability";
import Appointments from "../components/teamDashboard/sections/Appointments";
import UpcomingAppointments from "../components/teamDashboard/sections/UpcomingAppointments";
import EditProfile from "../components/teamDashboard/sections/EditProfile";
import Settings from "../components/teamDashboard/sections/Settings";
import { authApi, bookingApi } from "../utils/teamAuthApi";
import "./TeamDashboardLayout.css";

function TeamDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [user, setUser] = useState(null);
  const [teamMember, setTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState("upcoming");
  const [googleConnected, setGoogleConnected] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Check authentication
    if (!authApi.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadInitialData();

    // Handle Google OAuth callback
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) {
      handleGoogleCallback(code);
    }
  }, [navigate, location]);

  const loadInitialData = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      setGoogleConnected(profile.google_calendar_connected);

      // Load team member data if available
      if (profile.team_member_id) {
        setTeamMember({
          id: profile.team_member_id,
          status: profile.team_member_status,
        });
      }

      const [statsData, availData, apptData] = await Promise.all([
        bookingApi.getAppointmentStats(),
        bookingApi.getAvailability(),
        bookingApi.getAppointments({ upcoming: "true" }),
      ]);

      setStats(statsData);
      setAvailability(availData.results || availData);
      setAppointments(apptData.results || apptData);
    } catch (err) {
      console.error("Error loading data:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Availability handlers
  const handleAddAvailability = async (form) => {
    try {
      await bookingApi.createAvailability(form);
      const data = await bookingApi.getAvailability();
      setAvailability(data.results || data);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add availability");
      throw err;
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Delete this availability slot?")) return;
    try {
      await bookingApi.deleteAvailability(id);
      setAvailability(availability.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete availability");
    }
  };

  // Appointment handlers
  const handleFilterChange = async (filter) => {
    setAppointmentFilter(filter);
    try {
      const params = {};
      if (filter === "upcoming") params.upcoming = "true";
      else if (filter !== "all") params.status = filter;

      const data = await bookingApi.getAppointments(params);
      setAppointments(data.results || data);
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  const handleConfirmAppointment = async (id) => {
    try {
      await bookingApi.confirmAppointment(id);
      handleFilterChange(appointmentFilter);
      const statsData = await bookingApi.getAppointmentStats();
      setStats(statsData);
    } catch (err) {
      alert("Failed to confirm appointment");
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await bookingApi.cancelAppointment(id);
      handleFilterChange(appointmentFilter);
      const statsData = await bookingApi.getAppointmentStats();
      setStats(statsData);
    } catch (err) {
      alert("Failed to cancel appointment");
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      await bookingApi.completeAppointment(id);
      handleFilterChange(appointmentFilter);
      const statsData = await bookingApi.getAppointmentStats();
      setStats(statsData);
    } catch (err) {
      alert("Failed to complete appointment");
    }
  };

  // Google Calendar handlers
  const handleConnectGoogle = async () => {
    try {
      const redirectUri = `${window.location.origin}/team/dashboard`;
      const data = await bookingApi.getGoogleAuthUrl(redirectUri);
      window.location.href = data.authorization_url;
    } catch (err) {
      alert("Failed to connect Google Calendar");
    }
  };

  const handleGoogleCallback = async (code) => {
    try {
      const redirectUri = `${window.location.origin}/team/dashboard`;
      await bookingApi.connectGoogleCalendar(code, redirectUri);
      setGoogleConnected(true);
      navigate("/team/dashboard", { replace: true });
    } catch (err) {
      console.error("Google callback error:", err);
    }
  };

  const handleDisconnectGoogle = async () => {
    if (!window.confirm("Disconnect Google Calendar?")) return;
    try {
      await bookingApi.disconnectGoogleCalendar();
      setGoogleConnected(false);
    } catch (err) {
      alert("Failed to disconnect Google Calendar");
    }
  };

  // Profile handlers
  const handleUpdateProfile = async (data) => {
    const updated = await authApi.updateProfile(data);
    setUser((prev) => ({ ...prev, ...updated }));
    // Redirect to overview after successful update
    setCurrentSection("overview");
  };

  const handleProfileCreated = (profile) => {
    // Update team member state with the new profile
    setTeamMember(profile);
    // Redirect to overview after successful creation
    setCurrentSection("overview");
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    await authApi.changePassword(oldPassword, newPassword);
  };

  // Render current section
  const renderCurrentSection = () => {
    switch (currentSection) {
      case "overview":
        return (
          <Overview
            user={user}
            stats={stats}
            appointments={appointments}
            googleConnected={googleConnected}
            onConnectGoogle={handleConnectGoogle}
            onDisconnectGoogle={handleDisconnectGoogle}
          />
        );
      case "availability":
        return (
          <Availability
            availability={availability}
            onAdd={handleAddAvailability}
            onDelete={handleDeleteAvailability}
          />
        );
      case "appointments":
        return (
          <Appointments
            appointments={appointments}
            filter={appointmentFilter}
            onFilterChange={handleFilterChange}
            onConfirm={handleConfirmAppointment}
            onCancel={handleCancelAppointment}
            onComplete={handleCompleteAppointment}
          />
        );
      case "upcoming":
        return <UpcomingAppointments appointments={appointments} />;
      case "edit-profile":
        return (
          <EditProfile
            user={user}
            teamMember={teamMember}
            onUpdateProfile={handleUpdateProfile}
            onProfileCreated={handleProfileCreated}
          />
        );
      case "settings":
        return (
          <Settings
            user={user}
            googleConnected={googleConnected}
            onConnectGoogle={handleConnectGoogle}
            onDisconnectGoogle={handleDisconnectGoogle}
            onChangePassword={handleChangePassword}
          />
        );
      default:
        return (
          <Overview
            user={user}
            stats={stats}
            appointments={appointments}
            googleConnected={googleConnected}
            onConnectGoogle={handleConnectGoogle}
            onDisconnectGoogle={handleDisconnectGoogle}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="team-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="team-dashboard-layout">
      <TeamHeader toggleSidebar={toggleSidebar} teamUser={user} />

      <div className="team-dashboard-body">
        <TeamSidebar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className="team-main-content">
          <div className="team-content-wrapper">{renderCurrentSection()}</div>
        </main>
      </div>
    </div>
  );
}

export default TeamDashboard;
