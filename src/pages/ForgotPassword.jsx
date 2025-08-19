import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiInstance from "../utils/axios";
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

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail("");
  };

  // single reusable function to call API
  const sendResetLink = async (emailToSend) => {
    if (!emailToSend) {
      throw new Error("Missing email");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToSend)) {
      const err = new Error("Please enter a valid email address");
      err.isValidation = true;
      throw err;
    }

    const response = await apiInstance.post(
      `User/forgotpasswordrequest?email=${encodeURIComponent(emailToSend)}`
    );

    // normalize success detection
    if (
      response?.data?.statusCode === 200 ||
      response?.data?.statusCode === 201
    ) {
      return response.data;
    }

    throw new Error(response?.data?.message || "Failed to send reset link");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      Toast.fire({ icon: "error", title: "Please enter your email address" });
      return;
    }

    setIsLoading(true);
    try {
      await sendResetLink(emailTrimmed);

      // save the email used for the request so resend uses it
      setSubmittedEmail(emailTrimmed);
      setIsSuccess(true);
      Toast.fire({
        icon: "success",
        title: "Password reset link sent successfully!",
      });

      // clear the input (optional) but keep submittedEmail for resend
      resetForm();
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.isValidation) {
        errorMessage = error.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Email address not found in our system.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid email address format.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.fire({ icon: "error", title: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // Resend uses submittedEmail (the last email that was used to request)
  const handleResendLink = async () => {
    const emailToResend = submittedEmail || email || "";
    if (!emailToResend.trim()) {
      Toast.fire({
        icon: "warning",
        title: "Please enter your email address first",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendResetLink(emailToResend.trim());
      // keep submittedEmail as the address used for resends
      setSubmittedEmail(emailToResend.trim());
      setIsSuccess(true);
      Toast.fire({
        icon: "success",
        title: "Password reset link resent successfully!",
      });
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.isValidation) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Toast.fire({ icon: "error", title: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container d-flex justify-content-center align-items-center min-vh-100 p-3 bg-light">
      <div
        className="forgot-password-card shadow-sm rounded-lg bg-white w-100"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Centered Logo */}
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
          {!isSuccess ? (
            <>
              <h2
                className="text-center mb-3"
                style={{
                  color: "#2135b0",
                  fontWeight: 700,
                  fontSize: "26px",
                }}
              >
                Forgot Password
              </h2>
              <p
                className="text-center text-muted mb-4"
                style={{ fontSize: "14px", lineHeight: 1.5 }}
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <form
                onSubmit={handleForgotPassword}
                className="mt-4"
                autoComplete="off"
              >
                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control py-2"
                    placeholder="Enter your email address"
                    required
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontWeight: 400, fontSize: "16px" }}
                    disabled={isLoading}
                  />
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
                    <span className="me-2">Sending Reset Link</span>
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
                    <span className="me-2">Send Reset Link</span>
                    <i className="fas fa-paper-plane" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="btn w-100 py-2"
                  style={{
                    background: "transparent",
                    color: "#2135b0",
                    fontWeight: 600,
                    fontSize: "16px",
                    borderRadius: "6px",
                    border: "2px solid #2135b0",
                  }}
                  disabled={isLoading}
                >
                  <span className="me-2">Back to Sign In</span>
                  <i className="fas fa-arrow-left" />
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div
                  className="mb-4"
                  style={{
                    width: 80,
                    height: 80,
                    background: "#dcfce7",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 2rem auto",
                  }}
                >
                  <i
                    className="fas fa-check"
                    style={{
                      fontSize: 32,
                      color: "#16a34a",
                    }}
                  />
                </div>

                <h2
                  className="text-center mb-3"
                  style={{
                    color: "#2135b0",
                    fontWeight: 700,
                    fontSize: "26px",
                  }}
                >
                  Check Your Email
                </h2>

                <p
                  className="text-center text-muted mb-4"
                  style={{ fontSize: "14px", lineHeight: 1.6 }}
                >
                  We've sent a password reset link to{" "}
                  <strong>{submittedEmail || email}</strong>
                  <br />
                  Please check your email and follow the instructions to reset
                  your password.
                </p>

                <div className="d-flex flex-column gap-3">
                  <button
                    onClick={handleResendLink}
                    className="btn w-100 py-2"
                    style={{
                      background: "#2135b0",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "16px",
                      borderRadius: "6px",
                    }}
                    disabled={isLoading}
                  >
                    <span className="me-2">Resend Link</span>
                    <i className="fas fa-redo" />
                  </button>

                  <button
                    onClick={handleBackToLogin}
                    className="btn w-100 py-2"
                    style={{
                      background: "transparent",
                      color: "#2135b0",
                      fontWeight: 600,
                      fontSize: "16px",
                      borderRadius: "6px",
                      border: "2px solid #2135b0",
                    }}
                    disabled={isLoading}
                  >
                    <span className="me-2">Back to Sign In</span>
                    <i className="fas fa-arrow-left" />
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="d-flex align-items-center my-4">
            <div className="flex-grow-1 border-top" />
            <span
              className="mx-2 text-muted"
              style={{ fontWeight: 500, fontSize: "12px" }}
            >
              Need Help?
            </span>
            <div className="flex-grow-1 border-top" />
          </div>

          <div className="text-center">
            <p className="mb-2" style={{ fontSize: "14px" }}>
              Remember your password?{" "}
              <Link
                to="/login"
                style={{
                  color: "#2135b0",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
            </p>
            <p className="mb-0" style={{ fontSize: "14px" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#2135b0",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
