import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const PrivateRoutes = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isLoggedIn());

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default PrivateRoutes;
