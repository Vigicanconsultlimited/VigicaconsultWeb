import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const PrivateRoutes = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isLoggedIn());
  const loading = useAuthStore((state) => state.loading);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};
export default PrivateRoutes;
