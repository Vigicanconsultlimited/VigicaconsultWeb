import React from "react";
import { useState, useEffect } from "react";
import { register } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import "../styles/Register.css";
import registerImage from "../assets/images/visa-apply.jpg";
import vigicaLogo from "../assets/images/vigicaV2.png";
import { FaGoogle, FaApple, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  {
    /*const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState(""); */
  }
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await register(email, password, password2);
    if (error) {
      alert(JSON.stringify(error));
      setIsLoading(false);
    } else {
      navigate("/verify-otp", { state: { email } });
      setIsLoading(false);
    }
  };

  return (
    <>
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
                  Welcome to the VIGICA Consult Limited Portal. Please register
                  to create a free account and access our services.
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
                  style={{ width: "200px", height: "auto" }}
                />
                {/*
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
                */}
              </div>
              <h2
                className="text-center"
                style={{ color: "#2135b0", fontWeight: 700, fontSize: 26 }}
              >
                Create a free account
              </h2>
              {/* 
               <form onSubmit={handleSubmit}>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="username"
                              placeholder="Full Name"
                              required
                              className="form-control"
                              onChange={(e) => setFullname(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginName">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              placeholder="Email Address"
                              required
                              className="form-control"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginName">
                              Mobile Number
                            </label>
                            <input
                              type="text"
                              id="phone"
                              placeholder="Mobile Number"
                              required
                              className="form-control"
                              onChange={(e) => setMobile(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              id="password"
                              placeholder="Password"
                              className="form-control"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          {/* Password input /}
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              placeholder="Confirm Password"
                              required
                              className="form-control"
                              onChange={(e) => setPassword2(e.target.value)}
                            />
                          </div>
                          {/* Password Check */}
              {/* <p className='fw-bold text-danger'>
                                                            {password2 !== password ? 'Passwords do not match' : ''}
                                                        </p> /}

                          {isLoading === true ? (
                            <button
                              disabled
                              className="btn btn-primary w-100"
                              type="submit"
                            >
                              <span className="mr-2">Processing</span>
                              <i className="fas fa-spinner fa-spin" />
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary w-100"
                              type="submit"
                            >
                              <span className="mr-2">Sign Up</span>
                              <i className="fas fa-user-plus" />
                            </button>
                          )}

                          <div className="text-center">
                            <p className="mt-4">
                              Already have an account?{" "}
                              <Link to="/login/">Login</Link>
                            </p>
                          </div>
                        </form> */}

              <form onSubmit={handleSubmit} className="mt-4" autoComplete="off">
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control py-2"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontWeight: 400, fontSize: 16 }}
                  />
                </div>
                <div className="mb-3 position-relative">
                  <input
                    //type="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control py-2"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontWeight: 400, fontSize: 16 }}
                  />
                  {/* Show Password */}
                  <span
                    className="position-absolute"
                    style={{
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash" />
                    ) : (
                      <i className="fas fa-eye" />
                    )}
                  </span>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    //type="password"
                    type={showPassword2 ? "text" : "password"}
                    className="form-control py-2"
                    placeholder="Confirm Password"
                    required
                    onChange={(e) => setPassword2(e.target.value)}
                    style={{ fontWeight: 400, fontSize: 16 }}
                  />
                  {/* Show Password */}
                  <span
                    className="position-absolute"
                    style={{
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword2(!showPassword2)}
                  >
                    {showPassword2 ? (
                      <i className="fas fa-eye-slash" />
                    ) : (
                      <i className="fas fa-eye" />
                    )}
                  </span>
                </div>

                {/* {isLoading === true ? (
                  <button
                    disabled
                    className="btn btn-primary w-100"
                    type="submit"
                  >
                    <span className="mr-2">Processing</span>
                    <i className="fas fa-spinner fa-spin" />
                  </button>
                ) : (
                  <button className="btn btn-primary w-100" type="submit">
                    <span className="mr-2">Sign Up</span>
                    <i className="fas fa-user-plus" />
                  </button>
                )} */}

                {isLoading === true ? (
                  <button
                    type="submit"
                    className="btn w-100 py-2"
                    style={{
                      background: "#2135b0",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 17,
                      borderRadius: 6,
                    }}
                  >
                    Processing...
                    <i className="fas fa-spinner fa-spin" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn w-100 py-2"
                    style={{
                      background: "#2135b0",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 17,
                      borderRadius: 6,
                    }}
                  >
                    <span className="mr-2 m-2">Create account</span>

                    <i className="fas fa-user-plus" />
                  </button>
                )}

                {/*<button
                  type="submit"
                  className="btn w-100 py-2"
                  style={{
                    background: "#2135b0",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 17,
                    borderRadius: 6,
                  }}
                >
                  Create account
                </button> */}
              </form>
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-top" />
                <span className="mx-2 text-muted" style={{ fontWeight: 500 }}>
                  Or
                </span>
                <div className="flex-grow-1 border-top" />
              </div>
              <div
                className="mb-3 text-center"
                style={{ fontSize: 15, color: "#444" }}
              >
                Already have an account?
                <a
                  href="/login"
                  className="ms-1"
                  style={{
                    color: "#d32f2f",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </a>
              </div>
              <button
                className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                type="button"
                style={{
                  borderWidth: 1.5,
                  fontWeight: 500,
                  fontSize: 16,
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
                  borderWidth: 1.5,
                  fontWeight: 500,
                  fontSize: 16,
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Register;
