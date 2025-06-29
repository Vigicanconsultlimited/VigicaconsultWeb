import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import apiInstance from "../utils/axios";
import "../styles/OtpVerifyPage.css";
import OtpVerifyImage from "../assets/images/visa-apply.jpg";

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
      console.log("Sending OTP validation request with:", {
        Email: email,
        otp: otp.join(""),
      });

      const response = await apiInstance.post("User/otpvalidation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Full response:", response);

      if (response.data.result === true) {
        console.log("OTP validation successful:", response.data);

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
      console.error("OTP Validation Error:", err);
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
      const response = await apiInstance.post("User/resendotp", { email });
      if (response.status === 200) {
        Toast.fire({
          icon: "success",
          text: "New OTP sent to your email!",
        });
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
    <div className="otpverify-root d-flex flex-column flex-md-row align-items-stretch p-0">
      {/* Left Image Section */}
      <div className="otpverify-img-section col-12 col-md-6 d-flex align-items-end justify-content-center p-0">
        <div className="w-100 h-100 position-relative">
          <img
            src={OtpVerifyImage}
            alt="OTP Auth"
            className="img-fluid w-100 h-100 otpverify-main-img"
          />
          <div className="otpverify-img-overlay px-3 py-2 rounded">
            <p className="mb-0 otpverify-img-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              consequat ornare feugiat. Nulla diam elit, ornare non felis vitae,
              porttitor venenatis nunc. Morbi dictum molestie dapibus. Vivamus
              lacinia nunc eu elit volutpat blandit.
            </p>
          </div>
        </div>
      </div>

      {/* Right OTP Form Section */}
      <div className="otpverify-form-section col-12 col-md-6 d-flex flex-column align-items-center justify-content-center px-3 px-md-5 py-4 bg-white">
        <form
          className="w-100"
          style={{ maxWidth: 410 }}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h2 className="otpverify-title text-center mb-1">Enter the code</h2>
          <div className="text-center otpverify-desc mb-4">
            Enter the OTP code that we sent to your email{" "}
            <span className="otpverify-email">{maskedEmail}</span>.<br />
            <span className="otpverify-desc-muted">
              Be careful not to share the code with anyone.
            </span>
          </div>

          {/* OTP Inputs */}
          <div
            className="d-flex justify-content-center gap-2 mb-4 otpverify-inputs-wrap"
            onPaste={handlePaste}
          >
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`otpverify-input${
                  otp[idx] && idx === otp.findIndex((d) => d === "")
                    ? " otpverify-input-active"
                    : ""
                }`}
                ref={(el) => (inputRefs.current[idx] = el)}
                value={otp[idx]}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                style={{ textAlign: "center" }}
                aria-label={`OTP digit ${idx + 1}`}
                autoFocus={idx === 0}
                disabled={loading}
              />
            ))}
          </div>

          <button
            className="otpverify-btn btn btn-primary w-100 py-2"
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
                className="btn btn-link p-0"
                onClick={handleResendOTP}
              >
                Didn't receive code? Resend OTP
              </button>
            )}
          </div>

          <div className="text-center mt-2 otpverify-footnote">
            One more step to get started
          </div>
        </form>
      </div>
    </div>
  );
}
