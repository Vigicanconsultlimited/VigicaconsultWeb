import React, { useState, useEffect } from "react";
import { register } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";
import vigicaLogo from "../assets/images/vigicaV2.png";

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !password2) {
      Toast.fire({
        icon: "error",
        title: "Please fill in all fields",
      });
      return;
    }

    if (password !== password2) {
      Toast.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await register(email, password, password2);
    if (error) {
      Toast.fire({
        icon: "error",
        title:
          typeof error === "string"
            ? error
            : "Registration failed. Please try again.",
      });
      setIsLoading(false);
    } else {
      Toast.fire({
        icon: "success",
        title: "Registration successful! Redirecting to verification...",
      });

      // Small delay to show success message before navigation
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center min-vh-100 p-3 bg-light">
      <div
        className="register-card shadow-sm rounded-lg bg-white w-100"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4 p-md-5">
          <Link to="/">
            <div className="d-flex justify-content-center mb-4">
              <img
                src={vigicaLogo}
                alt="Vigica Logo"
                className="img-fluid"
                style={{ maxWidth: "200px" }}
              />
            </div>
          </Link>
          <h2
            className="text-center mb-4"
            style={{ color: "#2135b0", fontWeight: 700, fontSize: "26px" }}
          >
            Create a free account
          </h2>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-3">
              <input
                type="email"
                className="form-control py-2"
                placeholder="Email"
                required
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

            <div className="mb-4 position-relative">
              <input
                type={showPassword2 ? "text" : "password"}
                className="form-control py-2 pe-5"
                placeholder="Confirm Password"
                required
                onChange={(e) => setPassword2(e.target.value)}
                style={{ fontWeight: 400, fontSize: "16px" }}
                disabled={isLoading}
              />
              <span
                className="position-absolute eye-toggle"
                onClick={() => !isLoading && setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? (
                  <i className="fas fa-eye-slash" />
                ) : (
                  <i className="fas fa-eye" />
                )}
              </span>
            </div>

            {isLoading ? (
              <button
                disabled
                className="btn w-100 py-2 mb-3"
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
                <span className="me-2">Processing...</span>
                <i className="fas fa-spinner fa-spin" />
              </button>
            ) : (
              <button
                className="btn w-100 py-2 mb-3"
                style={{
                  background: "#2135b0",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "17px",
                  borderRadius: "6px",
                }}
                type="submit"
              >
                <span className="me-2">Create account</span>
                <i className="fas fa-user-plus" />
              </button>
            )}

            <div className="d-flex align-items-center my-3">
              <div className="flex-grow-1 border-top" />
              <span className="mx-2 text-muted" style={{ fontWeight: 500 }}>
                Or
              </span>
              <div className="flex-grow-1 border-top" />
            </div>

            <div
              className="text-center mb-4"
              style={{ fontSize: "15px", color: "#444" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#d32f2f",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </div>

            <button
              className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
              type="button"
              style={{
                borderWidth: "1.5px",
                fontWeight: 500,
                fontSize: "16px",
                background: "#fff",
                borderColor: "#d1d5db",
              }}
            >
              <svg width={20} height={20} viewBox="0 0 20 20">
                <g>
                  <path
                    fill="#4285F4"
                    d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.43a4.63 4.63 0 0 1-2.01 3.04v2.52h3.25c1.9-1.75 2.98-4.32 2.98-7.35z"
                  />
                  <path
                    fill="#34A853"
                    d="M10 20c2.7 0 4.96-.89 6.62-2.41l-3.25-2.52c-.9.6-2.07.95-3.37.95-2.59 0-4.78-1.75-5.56-4.1H1.06v2.58A9.99 9.99 0 0 0 10 20z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M4.44 12.92A5.98 5.98 0 0 1 4.07 10c0-.51.09-1.01.16-1.49V5.93H1.06A10.01 10.01 0 0 0 0 10c0 1.61.39 3.13 1.06 4.47l3.38-2.55z"
                  />
                  <path
                    fill="#EA4335"
                    d="M10 4.04c1.48 0 2.81.51 3.85 1.51l2.89-2.89C14.95 1.03 12.7 0 10 0A9.99 9.99 0 0 0 1.06 5.93l3.38 2.58C5.22 5.79 7.41 4.04 10 4.04z"
                  />
                </g>
              </svg>
              Continue with Google
            </button>

            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
              type="button"
              style={{
                borderWidth: "1.5px",
                fontWeight: 500,
                fontSize: "16px",
                background: "#fff",
                borderColor: "#d1d5db",
              }}
            >
              <svg width={30} height={30} viewBox="0 0 22 22">
                <path
                  d="M16.84 11.44c-.02-2.13 1.74-3.15 1.81-3.19-1-1.45-2.56-1.65-3.1-1.67-1.32-.13-2.56.77-3.22.77-.66 0-1.7-.75-2.8-.72-1.44.02-2.77.84-3.5 2.13-1.5 2.59-.38 6.42 1.07 8.52.72 1.05 1.57 2.22 2.7 2.17 1.09-.04 1.5-.7 2.81-.7 1.3 0 1.67.7 2.8.69 1.16-.02 1.89-1.08 2.6-2.13.82-1.2 1.16-2.35 1.17-2.41-.03-.01-2.22-.85-2.24-3.39zm-2.64-6.17c.6-.73 1-1.75.89-2.77-.86.03-1.9.57-2.52 1.29-.55.63-1.04 1.65-.86 2.62.95.07 1.9-.48 2.49-1.14z"
                  fill="#000"
                />
              </svg>
              Continue with Apple
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
