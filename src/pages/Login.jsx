import { useState, useEffect } from "react";
import { login } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";

import "../styles/Login.css";
import registerImage from "../assets/images/img/vigica-img6.jpg";
import vigicaLogo from "../assets/images/vigicaV2.png";

// SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      // Redirect based on role if already logged in
      const userRole = useAuthStore.getState().getUserRole();
      if (userRole === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isLoggedIn, navigate]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email.trim()) {
      Toast.fire({
        icon: "error",
        title: "Please enter your email address",
      });
      return;
    }

    if (!password.trim()) {
      Toast.fire({
        icon: "error",
        title: "Please enter your password",
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.fire({
        icon: "error",
        title: "Please enter a valid email address",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error, userRole } = await login(email, password);

      if (error) {
        Toast.fire({
          icon: "error",
          title: error,
        });
        setIsLoading(false);
      } else {
        Toast.fire({
          icon: "success",
          title: "Login successful!",
        });

        // Navigate based on user role
        setTimeout(() => {
          if (userRole === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
          resetForm();
          setIsLoading(false);
        }, 1000); // Small delay to show success message
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Toast.fire({
      icon: "info",
      title: "Password reset functionality will be available soon",
    });
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100 p-3">
      <div
        className="login-card shadow-sm rounded-lg bg-white w-100"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4 p-md-5 ">
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
            Sign-In
          </h2>

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
                <span className="mr-2">Signing In</span>
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
                <span className="mr-2">Sign In</span>
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

            <div className="text-center">
              <p className="mt-3 mb-2">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary">
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
