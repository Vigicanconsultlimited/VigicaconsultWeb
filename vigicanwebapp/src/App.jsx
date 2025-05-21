import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UnderConstructionPage from "./pages/underconstruction";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UnderConstructionPage />} />
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
