import { useState, useEffect } from "react";
import { login } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

import "../styles/Login.css";
import vigicaLogo from "../assets/images/vigicaV2.png";

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  customClass: {
    container: "swal-mobile-container",
    popup: "swal-mobile-popup",
    title: "swal-mobile-title",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleRoleNavigation = (userRole) => {
    if (userRole === "Admin") {
      navigate("/admin-dashboard");
    } else if (userRole === "TeamMember") {
      navigate("/team/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const { signInWithGoogle } = useGoogleAuth({
    onSuccess: (data) => {
      setGoogleLoading(false);
      Toast.fire({ icon: "success", title: "Google sign-in successful!" });
      setTimeout(() => {
        handleRoleNavigation(data.userRole || "User");
      }, 1000);
    },
    onError: (message) => {
      setGoogleLoading(false);
      setBackendError(message);
    },
  });

  const handleGoogleClick = () => {
    if (!navigator.onLine) {
      setBackendError("No internet connection. Please check your network.");
      return;
    }
    setGoogleLoading(true);
    setBackendError("");
    signInWithGoogle();
  };

  useEffect(() => {
    if (isLoggedIn()) {
      const userRole = useAuthStore.getState().getUserRole();
      handleRoleNavigation(userRole);
    }
  }, [isLoggedIn, navigate]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setBackendError("");

    if (!email.trim()) {
      Toast.fire({ icon: "error", title: "Please enter your email address" });
      return;
    }

    if (!password.trim()) {
      Toast.fire({ icon: "error", title: "Please enter your password" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.fire({ icon: "error", title: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);

    try {
      const { error, userRole } = await login(email, password);

      if (error) {
        setBackendError(error);
        Toast.fire({ icon: "error", title: error });
        setIsLoading(false);
      } else {
        Toast.fire({ icon: "success", title: "Login successful!" });
        setTimeout(() => {
          handleRoleNavigation(userRole);
          resetForm();
          setIsLoading(false);
        }, 1000);
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100 p-3">
      <div
        className="login-card shadow-sm rounded-lg bg-white w-100"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4 p-md-5">
          <Link to="/">
            <div className="d-flex justify-content-center mb-4">
              <img
                src={vigicaLogo}
                alt="VIGICA Logo"
                className="img-fluid"
                style={{ maxWidth: "200px" }}
              />
            </div>
          </Link>

          <h2
            className="text-center mb-4"
            style={{ color: "#2135b0", fontWeight: 700, fontSize: "26px" }}
          >
            Sign In
          </h2>

          {backendError && (
            <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
              <small>{backendError}</small>
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="mb-3 position-relative">
              <input
                type="email"
                className="form-control py-2"
                placeholder="Email"
                required
                id="username"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontWeight: 400, fontSize: "16px" }}
                disabled={isLoading}
              />
            </div>

            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control py-2 pe-5"
                placeholder="Password"
                required
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontWeight: 400, fontSize: "16px" }}
                disabled={isLoading}
              />
              <span
                className="position-absolute eye-toggle"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash" />
                ) : (
                  <i className="fas fa-eye" />
                )}
              </span>
            </div>

            {isLoading ? (
              <button
                disabled
                className="btn w-100 py-2"
                style={{
                  background: "#2135b0",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "17px",
                  borderRadius: "6px",
                  opacity: 0.8,
                }}
                type="submit"
              >
                <span className="me-2">Signing In...</span>
                <i className="fas fa-spinner fa-spin" />
              </button>
            ) : (
              <button
                className="btn w-100 py-2"
                style={{
                  background: "#2135b0",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "17px",
                  borderRadius: "6px",
                }}
                type="submit"
              >
                <span className="me-2">Sign In</span>
                <i className="fas fa-sign-in-alt" />
              </button>
            )}

            <div className="d-flex align-items-center my-3">
              <div className="flex-grow-1 border-top" />
              <span className="mx-2 text-muted" style={{ fontWeight: 500 }}>
                Or
              </span>
              <div className="flex-grow-1 border-top" />
            </div>

            {/* Google Sign In Button */}
            <button
              className="btn btn-outline-secondary w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
              type="button"
              onClick={handleGoogleClick}
              disabled={googleLoading}
              style={{
                borderWidth: "1.5px",
                fontWeight: 500,
                fontSize: "16px",
                background: "#fff",
                borderColor: "#d1d5db",
              }}
            >
              {googleLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <svg width={20} height={20} viewBox="0 0 20 20">
                  <g>
                    <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.43a4.63 4.63 0 0 1-2.01 3.04v2.52h3.25c1.9-1.75 2.98-4.32 2.98-7.35z" />
                    <path fill="#34A853" d="M10 20c2.7 0 4.96-.89 6.62-2.41l-3.25-2.52c-.9.6-2.07.95-3.37.95-2.59 0-4.78-1.75-5.56-4.1H1.06v2.58A9.99 9.99 0 0 0 10 20z" />
                    <path fill="#FBBC05" d="M4.44 12.92A5.98 5.98 0 0 1 4.07 10c0-.51.09-1.01.16-1.49V5.93H1.06A10.01 10.01 0 0 0 0 10c0 1.61.39 3.13 1.06 4.47l3.38-2.55z" />
                    <path fill="#EA4335" d="M10 4.04c1.48 0 2.81.51 3.85 1.51l2.89-2.89C14.95 1.03 12.7 0 10 0A9.99 9.99 0 0 0 1.06 5.93l3.38 2.58C5.22 5.79 7.41 4.04 10 4.04z" />
                  </g>
                </svg>
              )}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <div className="text-center">
              <p className="mt-2 mb-2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#2135b0",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Register
                </Link>
              </p>
              <p className="mb-0">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none text-danger"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;