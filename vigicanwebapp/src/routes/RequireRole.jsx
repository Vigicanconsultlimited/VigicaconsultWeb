import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const RequireRole = ({ children, role }) => {
  const userRole = useAuthStore((state) => state.getUserRole());
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // If user is not logged in, redirect to login
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect to appropriate dashboard
  if (userRole !== role) {
    if (userRole === "Admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If user has the required role, render the children
  return children;
};

export default RequireRole;
