import { useEffect } from "react";
import { logout } from "../utils/auth";
import { Link } from "react-router-dom";

function Logout() {
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
      <div className="card rounded-4 shadow w-100" style={{ maxWidth: 400 }}>
        <div className="card-body p-4 text-center">
          <h3 className="mb-4">You have been Logged Out</h3>
          <Link to="/register/" className="btn btn-primary w-100 mb-3">
            Register <i className="fas fa-user-plus ms-1"></i>
          </Link>
          <Link to="/login/" className="btn btn-outline-primary w-100">
            Login <i className="fas fa-sign-in-alt ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Logout;
