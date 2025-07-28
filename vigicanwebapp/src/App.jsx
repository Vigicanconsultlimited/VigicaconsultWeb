import React, { useEffect } from "react";
import { logout, setUser } from "./utils/auth";

import { useAuthStore } from "./store/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
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
  const hydrated = useAuthStore((state) => state.hydrated);
  const validateAuth = useAuthStore((state) => state.validateAuth);

  useEffect(() => {
    // Only run validation after store is hydrated
    if (hydrated) {
      console.log(
        "App: Store hydrated, running validation - Time: 2025-07-28 12:36:28 UTC - User: NeduStack"
      );
      validateAuth();
    }
  }, [hydrated, validateAuth]);

  // Show loading until hydrated and validation is complete
  if (!hydrated || loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
          <small className="text-muted">
            {!hydrated
              ? "Initializing store..."
              : "Validating authentication..."}
          </small>
        </div>
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

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
