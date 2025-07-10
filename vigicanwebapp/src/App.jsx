import React, { useEffect } from "react";
import { setUser } from "./utils/auth";
import { useAuthStore } from "./store/auth"; // <-- import store
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoutes";

import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import OtpverifyPage from "./pages/OtpVerifyPage";

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

        {/* Private Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard
                key={window.location.pathname + window.location.search}
              />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
