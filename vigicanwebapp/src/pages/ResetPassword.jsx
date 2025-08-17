import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import apiInstance from "../utils/axios";
import Swal from "sweetalert2";

import "../styles/Login.css";
import registerImage from "../assets/images/img/vigica-img6.jpg";
import vigicaLogo from "../assets/images/vigicaV2.png";

// Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-08-16 21:23:50
// Current User's Login: NeduStack

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Password requirements
  const passwordMinLength = 8;

  // Extract email and token from URL query parameters
  // Extract email and token from URL query parameters
  useEffect(() => {
    // Get the raw query string instead of using URLSearchParams
    const queryString = location.search.substring(1); // Remove leading '?'

    // Split the query string by '&' to get individual parameters
    const params = queryString.split("&");
    let emailParam = "";
    let tokenParam = "";

    // Manually parse parameters without URL decoding yet
    for (const param of params) {
      const [key, value] = param.split("=");
      if (key === "email") {
        emailParam = decodeURIComponent(value);
      }
      if (key === "token") {
        // For token, we need to replace spaces back to '+' before decoding
        tokenParam = value.replace(/ /g, "+");
      }
    }

    if (emailParam) {
      setEmail(emailParam);
    }

    if (tokenParam) {
      setToken(tokenParam);
    }

    // If missing required parameters, show error
    if (!emailParam || !tokenParam) {
      Toast.fire({
        icon: "error",
        title: "Invalid password reset link. Please request a new one.",
      });
    }
  }, [location]);

  // Validate password
  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < passwordMinLength) {
      newErrors.password = `Password must be at least ${passwordMinLength} characters`;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Validate required parameters
    if (!email || !token) {
      Toast.fire({
        icon: "error",
        title: "Invalid password reset link. Please request a new one.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiInstance.post("User/changepassword", {
        email: email,
        token: token,
        newPassword: password,
      });

      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        setIsSuccess(true);
        Toast.fire({
          icon: "success",
          title: "Password has been reset successfully!",
        });

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        throw new Error(response?.data?.message || "Failed to reset password");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response?.status === 400) {
        errorMessage =
          "Invalid or expired reset link. Please request a new one.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <section className="reset-password-section">
        <main className="reset-password-container" style={{ padding: "10px" }}>
          <div className="container-fluid p-0 d-flex flex-column flex-md-row reset-password-wrapper">
            {/* Left Image Section - Hidden on mobile */}
            <div className="col-md-6 d-none d-md-flex align-items-end justify-content-center register-img-section p-0">
              <div className="w-100 h-100 position-relative">
                <img
                  src={registerImage}
                  alt="Library Student"
                  className="img-fluid w-100 h-100 object-fit-cover register-main-img"
                  style={{
                    borderTopLeftRadius: "0.75rem",
                    borderBottomLeftRadius: "0.75rem",
                  }}
                />
                <div className="register-img-overlay px-3 py-2 rounded">
                  <p className="mb-0 text-white" style={{ fontWeight: 400 }}>
                    {isSuccess
                      ? "Your password has been reset successfully! You can now log in with your new password."
                      : "Enter your new password to reset your account. Make sure to choose a strong password that you don't use elsewhere."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center px-3 px-md-5 py-4 bg-white reset-password-form-container">
              <div className="w-100" style={{ maxWidth: "380px" }}>
                <div className="d-flex align-items-center justify-content-center mb-3">
                  {/* Logo */}
                  <img
                    src={vigicaLogo}
                    alt="Vigica Consult Ltd"
                    className="logo-image"
                    style={{ width: "180px", height: "auto", maxWidth: "100%" }}
                  />
                </div>

                {!isSuccess ? (
                  <>
                    <h2
                      className="text-center mb-2"
                      style={{
                        color: "#2135b0",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                      }}
                    >
                      Reset Password
                    </h2>

                    {email && (
                      <p
                        className="text-center mb-3 email-display"
                        style={{
                          fontSize: "0.85rem",
                          padding: "8px 10px",
                          background: "#f0f9ff",
                          borderRadius: "6px",
                          color: "#0369a1",
                          border: "1px solid #bae6fd",
                          wordBreak: "break-word",
                        }}
                      >
                        Resetting password for: <strong>{email}</strong>
                      </p>
                    )}

                    <p
                      className="text-center text-muted mb-3"
                      style={{ fontSize: "0.875rem", lineHeight: 1.5 }}
                    >
                      Please enter your new password below.
                    </p>

                    <form
                      onSubmit={handleResetPassword}
                      className="mt-3"
                      autoComplete="off"
                    >
                      {/* New Password */}
                      <div className="mb-3">
                        <label
                          htmlFor="password"
                          className="form-label"
                          style={{
                            fontSize: "0.875rem",
                            color: "#4b5563",
                            fontWeight: 500,
                            marginBottom: "0.25rem",
                          }}
                        >
                          New Password
                        </label>
                        <div className="password-input-container position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${
                              errors.password ? "is-invalid" : ""
                            }`}
                            placeholder="Enter your new password"
                            required
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                              fontWeight: 400,
                              fontSize: "0.95rem",
                              paddingRight: "40px",
                              width: "85%",
                              height: "45px",
                            }}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="btn position-absolute end-0 top-0 h-100 border-0 bg-transparent"
                            onClick={togglePasswordVisibility}
                            tabIndex="-1"
                            style={{
                              backgroundColor: "transparent",
                              zIndex: 5,
                              width: "40px",
                              right: 10,
                            }}
                          >
                            <i
                              className={`fas ${
                                showPassword ? "fa-eye-slash" : "fa-eye"
                              }`}
                              style={{ color: "#6b7280" }}
                            ></i>
                          </button>
                        </div>
                        {errors.password && (
                          <div
                            className="error-message mt-1"
                            style={{ color: "#dc3545", fontSize: "0.75rem" }}
                          >
                            {errors.password}
                          </div>
                        )}
                        <small
                          className="text-muted d-block mt-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Password must be at least {passwordMinLength}{" "}
                          characters long.
                        </small>
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label
                          htmlFor="confirmPassword"
                          className="form-label"
                          style={{
                            fontSize: "0.875rem",
                            color: "#4b5563",
                            fontWeight: 500,
                            marginBottom: "0.25rem",
                          }}
                        >
                          Confirm Password
                        </label>
                        <div className="password-input-container position-relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`form-control ${
                              errors.confirmPassword ? "is-invalid" : ""
                            }`}
                            placeholder="Confirm your new password"
                            required
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                              fontWeight: 400,
                              fontSize: "0.95rem",
                              paddingRight: "40px",
                              width: "85%",
                              height: "45px",
                            }}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="btn position-absolute end-0 top-0 h-100 border-0 bg-transparent"
                            onClick={toggleConfirmPasswordVisibility}
                            tabIndex="-1"
                            style={{
                              backgroundColor: "transparent",
                              zIndex: 5,
                              width: "40px",
                            }}
                          >
                            <i
                              className={`fas ${
                                showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                              }`}
                              style={{ color: "#6b7280" }}
                            ></i>
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <div
                            className="error-message mt-1"
                            style={{ color: "#dc3545", fontSize: "0.75rem" }}
                          >
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>

                      {isLoading ? (
                        <button
                          disabled
                          className="btn w-100 mb-3 action-button"
                          style={{
                            background: "#2135b0",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: 6,
                            opacity: 0.8,
                            height: "45px",
                          }}
                          type="submit"
                        >
                          <span>Resetting Password</span>
                          <i className="fas fa-spinner fa-spin ms-2" />
                        </button>
                      ) : (
                        <button
                          className="btn w-100 mb-3 action-button"
                          style={{
                            background: "#2135b0",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: 6,
                            height: "45px",
                          }}
                          type="submit"
                        >
                          <span>Reset Password</span>
                          <i className="fas fa-key ms-2" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="btn w-100 secondary-button"
                        style={{
                          background: "transparent",
                          color: "#2135b0",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          borderRadius: 6,
                          border: "2px solid #2135b0",
                          height: "45px",
                        }}
                        disabled={isLoading}
                      >
                        <span>Back to Sign In</span>
                        <i className="fas fa-arrow-left ms-2" />
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div
                        className="mb-4 success-icon"
                        style={{
                          width: 70,
                          height: 70,
                          background: "#dcfce7",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1.5rem auto",
                        }}
                      >
                        <i
                          className="fas fa-check"
                          style={{
                            fontSize: 28,
                            color: "#16a34a",
                          }}
                        />
                      </div>

                      <h2
                        className="text-center mb-3"
                        style={{
                          color: "#2135b0",
                          fontWeight: 700,
                          fontSize: "1.5rem",
                        }}
                      >
                        Password Reset Complete
                      </h2>

                      <p
                        className="text-center text-muted mb-4"
                        style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
                      >
                        Your password has been reset successfully.
                        <br />
                        You will be redirected to the login page in a few
                        seconds.
                      </p>

                      <div className="d-flex flex-column gap-3">
                        <button
                          onClick={handleBackToLogin}
                          className="btn w-100 action-button"
                          style={{
                            background: "#2135b0",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            borderRadius: 6,
                            height: "45px",
                          }}
                        >
                          <span>Sign In Now</span>
                          <i className="fas fa-sign-in-alt ms-2" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}

export default ResetPassword;
