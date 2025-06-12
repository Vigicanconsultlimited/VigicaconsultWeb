import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<PrivateRoute><StudentDashboardLayout /></PrivateRoute>} />
        */}
      </Routes>
    </Router>
  );
}

export default App;
