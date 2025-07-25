import React, { useEffect } from "react";
import { setUser } from "./utils/auth";
import { useAuthStore } from "./store/auth";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoutes";
import RequireRole from "./routes/RequireRole";

import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Logout from "./pages/Logout";
import OtpverifyPage from "./pages/OtpVerifyPage";

// Component to redirect to appropriate dashboard based on role
function DashboardRedirect() {
  const userRole = useAuthStore((state) => state.getUserRole());

  if (userRole === "Admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function App() {
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    setUser();
  }, []);

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <p>Loading...</p> {/* Replace with a spinner if you like */}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OtpverifyPage />} />
        <Route path="/logout" element={<Logout />} />

        {/* Dashboard redirect route - redirects to appropriate dashboard based on role */}
        <Route
          path="/dashboard-redirect"
          element={
            <PrivateRoute>
              <DashboardRedirect />
            </PrivateRoute>
          }
        />

        {/* User Dashboard - Only for Students */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RequireRole role="User">
                <Dashboard
                  key={window.location.pathname + window.location.search}
                />
              </RequireRole>
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard - Only for admins */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <RequireRole role="Admin">
                <AdminDashboard />
              </RequireRole>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
