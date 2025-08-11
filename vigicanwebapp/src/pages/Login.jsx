import { useState, useEffect } from "react";
import { login } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";

import "../styles/Login.css";
import registerImage from "../assets/images/img/vigica-img6.jpg";
import vigicaLogo from "../assets/images/vigica.png";

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
      //console.log(`Login attempt at 2025-08-11 11:18:43 by ${email}`);

      const { error, userRole } = await login(email, password);

      if (error) {
        //console.error(
        //  `Login failed at 2025-08-11 11:18:43 for ${email}:`,
        //  error
        //);
        Toast.fire({
          icon: "error",
          title: error,
        });
        setIsLoading(false);
        navigate("/verify-otp", { state: { email } });
      } else {
        //console.log(
        //  `Login successful at 2025-08-11 11:18:43 for ${email} with role: ${userRole}`
        //);

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
      //console.error(`Login error at 2025-08-11 11:18:43:`, error);
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
    <>
      <section>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
          <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0">
            {/* Left Image Section */}
            <div className="col-12 col-md-6 d-flex align-items-end justify-content-center register-img-section p-0">
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
                    Welcome to Vigica Consult Limited. Please sign in to
                    continue exploring our services.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Form Section */}
            <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center px-4 px-md-5 py-4 bg-white">
              <div className="w-100" style={{ maxWidth: 380 }}>
                <div className="d-flex align-items-center justify-content-center mb-3 gap-2">
                  {/* Logo - Replace src with your logo */}
                  <img
                    src={vigicaLogo}
                    alt="Vigica Logo"
                    style={{ width: 48, height: 48 }}
                  />
                  <div>
                    <span
                      className="d-block fs-3 fw-extrabold mb-0"
                      style={{
                        fontFamily: "Bricolage Grotesque', sans-serif",
                        color: "#444",
                        fontWeight: 700,
                        fontSize: 20,
                        marginBottom: 0,
                      }}
                    >
                      VIGICA
                    </span>
                    <div
                      className="d-block fs-4 mt-0 p-0"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "#2135b0",
                      }}
                    >
                      CONSULT LIMITED
                    </div>
                  </div>
                </div>
                <h2
                  className="text-center"
                  style={{ color: "#2135b0", fontWeight: 700, fontSize: 26 }}
                >
                  Sign-In
                </h2>

                <form
                  onSubmit={handleLogin}
                  className="mt-4"
                  autoComplete="off"
                >
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
                      style={{ fontWeight: 400, fontSize: 16 }}
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
                      style={{
                        fontWeight: 400,
                        fontSize: 16,
                      }}
                      disabled={isLoading}
                    />
                    <span
                      className="position-absolute"
                      style={{
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.5 : 1,
                      }}
                      onClick={() =>
                        !isLoading && setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <i className="fas fa-eye-slash" />
                      ) : (
                        <i className="fas fa-eye" />
                      )}
                    </span>
                  </div>

                  {isLoading === true ? (
                    <button
                      disabled
                      className="btn w-100"
                      style={{
                        background: "#2135b0",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 17,
                        borderRadius: 6,
                        opacity: 0.8,
                      }}
                      type="submit"
                    >
                      <span className="mr-2">Signing In</span>
                      <i className="fas fa-spinner fa-spin" />
                    </button>
                  ) : (
                    <button
                      className="btn w-100"
                      style={{
                        background: "#2135b0",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 17,
                        borderRadius: 6,
                      }}
                      type="submit"
                    >
                      <span className="mr-2">Sign In</span>
                      <i className="fas fa-sign-in-alt" />
                    </button>
                  )}
                  <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1 border-top" />
                    <span
                      className="mx-2 text-muted"
                      style={{ fontWeight: 500 }}
                    >
                      Or
                    </span>
                    <div className="flex-grow-1 border-top" />
                  </div>
                  <div className="text-center">
                    <p className="mt-4">
                      Don't have an account?{" "}
                      <Link to="/register">Register</Link>
                    </p>
                    <p className="mt-0">
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
        </main>
      </section>
    </>
  );
}

export default Login;
