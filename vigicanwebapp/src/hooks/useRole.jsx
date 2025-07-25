import { useAuthStore } from "../store/auth";

export const useRole = () => {
  const userRole = useAuthStore((state) => state.getUserRole());
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const hasRole = (role) => {
    return isLoggedIn() && userRole === role;
  };

  const isAdmin = () => {
    return hasRole("Admin");
  };

  const isUser = () => {
    return hasRole("User");
  };

  const canAccess = (requiredRole) => {
    return hasRole(requiredRole);
  };

  return {
    userRole,
    hasRole,
    isAdmin,
    isUser,
    canAccess,
  };
};
