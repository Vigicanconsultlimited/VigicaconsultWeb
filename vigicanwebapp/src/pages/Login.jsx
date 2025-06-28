import { useState, useEffect } from "react";
import { login } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import registerImage from "../assets/images/visa-apply.jpg";
import vigicaLogo from "../assets/images/vigica.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await login(email, password);
    if (error) {
      alert(error);
      setIsLoading(false);
    } else {
      navigate("/dashboard");
      resetForm();
      setIsLoading(false);
    }
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aliquam consequat ornare feugiat. Nulla diam elit, ornare
                    non felis vitae, porttitor venenatis nunc. Morbi dictum
                    molestie dapibus. Vivamus lacinia nunc eu elit volutpat
                    blandit.
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
                  <div className="mb-3">
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
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <input
                      type="password"
                      className="form-control py-2"
                      placeholder="Password"
                      required
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ fontWeight: 400, fontSize: 16 }}
                    />
                    <button
                      type="button"
                      className="btn btn-link p-0 position-absolute"
                      style={{
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      tabIndex={-1}
                      aria-label="Show password"
                    >
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"
                          fill="#bbb"
                        />
                      </svg>
                    </button>
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
                      }}
                      type="submit"
                    >
                      <span className="mr-2">Processing</span>
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
                      <Link to="/forgot-password/" className="text-danger">
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
