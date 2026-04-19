import React, { useEffect, lazy, Suspense } from "react";
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

// Eagerly load critical pages
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import VigicaLoader from "./components/shared/VigicaLoader";
import { prefetchTeam } from "./utils/teamApi";

// Start fetching team data immediately — before any component mounts
prefetchTeam();

// Lazy load non-critical pages for faster initial load
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Logout = lazy(() => import("./pages/Logout"));
const OtpverifyPage = lazy(() => import("./pages/OtpVerifyPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const TeamMemberProfile = lazy(() => import("./pages/TeamMemberProfile"));
const TeamApplicationForm = lazy(() => import("./pages/TeamApplicationForm"));
const TeamDashboard = lazy(() => import("./pages/TeamDashboard"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
// const ChatWidget = lazy(() => import("./components/shared/ChatWidget"));

// Component to redirect to appropriate dashboard based on role
function DashboardRedirect() {
  const userRole = useAuthStore((state) => state.getUserRole());

  if (userRole === "Admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (userRole === "TeamMember") {
    return <Navigate to="/team/dashboard" replace />;
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
      //console.log(
      //"App: Store hydrated, running validation - Time: 2025-07-28 12:36:28 UTC - User: NeduStack"
      //);
      validateAuth();
    }
  }, [hydrated, validateAuth]);

  // Show loading until hydrated and validation is complete
  if (!hydrated || loading) {
    return (
      <VigicaLoader
        variant="overlay"
        size="xl"
        text={!hydrated ? "Initializing..." : "Verifying your session..."}
      />
    );
  }

  return (
    <Router>
      <Suspense
        fallback={
          <VigicaLoader variant="inline" size="md" text="Loading page..." />
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpverifyPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />

          {/* About Page */}
          <Route path="/about" element={<AboutPage />} />

          {/* Team Pages - Public */}
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/apply" element={<TeamApplicationForm />} />
          <Route path="/team/:id" element={<TeamMemberProfile />} />

          {/* Team Member Dashboard - Only for TeamMember role */}
          <Route
            path="/team/dashboard"
            element={
              <PrivateRoute>
                <RequireRole role="TeamMember">
                  <TeamDashboard />
                </RequireRole>
              </PrivateRoute>
            }
          />

          {/* Appointment Booking */}
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/book/:teamMemberId" element={<BookAppointment />} />

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
      </Suspense>
      {/* <Suspense fallback={null}>
        <ChatWidget />
      </Suspense> */}
    </Router>
  );
}

export default App;
