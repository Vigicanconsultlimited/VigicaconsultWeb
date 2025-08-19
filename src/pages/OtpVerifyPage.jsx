import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import apiInstance from "../utils/axios";
import "../styles/OtpVerifyPage.css";
import vigicaLogo from "../assets/images/vigicaV2.png";
import { Link } from "react-router-dom";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

export default function OtpverifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/register");
    }
  }, [location, navigate]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    let newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      let newOtp = [...otp];
      newOtp[idx - 1] = "";
      setOtp(newOtp);
      inputRefs.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === 6) {
      setOtp(paste.split("").slice(0, 6));
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!email) {
      Toast.fire({
        icon: "error",
        title: "Email Missing",
        text: "Please provide your email address",
      });
      return;
    }

    if (otp.some((digit) => digit === "")) {
      Toast.fire({
        icon: "warning",
        title: "Incomplete OTP",
        text: "Please enter the complete 6-digit OTP code.",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("Email", email);
    formData.append("otp", otp.join(""));

    try {
      const response = await apiInstance.post("User/otpvalidation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.result === true) {
        Toast.fire({
          icon: "success",
          title: "Verification Successful",
          text: response.data.message || "Your email has been verified!",
        }).then(() => {
          navigate("/login");
        });
      } else {
        throw new Error(response.data.message || "OTP validation failed");
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Verification Failed",
        text:
          err.response?.data?.message || err.message || "Could not verify OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    try {
      // Create FormData for resend OTP
      const formData = new FormData();
      formData.append("Email", email);

      const response = await apiInstance.post("User/getotp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.statusCode === 200) {
        Toast.fire({
          icon: "success",
          title: "OTP Resent",
          text: "New OTP sent to your email!",
        });
        // Clear existing OTP
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      } else {
        throw new Error("Failed to resend OTP");
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        text: err.message || "Error resending OTP",
      });
      setResendDisabled(false);
    }
  };

  // Mask email for display (shows first character and domain)
  const maskedEmail = email
    ? email.replace(/(?<=.).(?=.*@)/g, "*")
    : "loading...";

  return (
    <div className="otp-verify-container d-flex justify-content-center align-items-center min-vh-100 p-3 bg-light">
      <div
        className="otp-verify-card shadow-sm rounded-lg bg-white w-100"
        style={{ maxWidth: "500px" }}
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
            className="text-center mb-3"
            style={{ color: "#2135b0", fontWeight: 700, fontSize: "26px" }}
          >
            Enter the code
          </h2>

          <p
            className="text-center text-muted mb-4"
            style={{ fontSize: "14px", lineHeight: 1.5 }}
          >
            Enter the OTP code that we sent to your email{" "}
            <span className="fw-bold">{maskedEmail}</span>.<br />
            <span className="text-muted">
              Be careful not to share the code with anyone.
            </span>
          </p>

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* OTP Inputs */}
            <div
              className="d-flex justify-content-center gap-2 mb-4"
              onPaste={handlePaste}
            >
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="form-control text-center py-2"
                  style={{
                    width: "45px",
                    height: "50px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  value={otp[idx]}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  aria-label={`OTP digit ${idx + 1}`}
                  autoFocus={idx === 0}
                  disabled={loading}
                />
              ))}
            </div>

            <button
              className="btn w-100 py-2 mb-3"
              style={{
                background: "#2135b0",
                color: "#fff",
                fontWeight: 600,
                fontSize: "16px",
                borderRadius: "6px",
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>

            <div className="text-center mt-3">
              {resendDisabled ? (
                <span className="text-muted">
                  Resend OTP in {countdown} seconds
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={handleResendOTP}
                  style={{ color: "#2135b0" }}
                >
                  Didn't receive code? Resend OTP
                </button>
              )}
            </div>

            <div
              className="text-center mt-2 text-muted"
              style={{ fontSize: "14px" }}
            >
              One more step to get started
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
