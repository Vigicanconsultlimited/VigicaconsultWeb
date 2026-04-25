import { useAuthStore } from "../store/auth";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// ── Token expiration check ────────────────────────────
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

// ── Extract role from token ───────────────────────────
const getRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return (
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    );
  } catch {
    return null;
  }
};

// ── Extract email from token ──────────────────────────
const getEmailFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return (
      decoded["email"] ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      decoded["sub"] ||
      null
    );
  } catch {
    return null;
  }
};

// ── Extract user ID from token ────────────────────────
const getIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return (
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      decoded["sub"] ||
      null
    );
  } catch {
    return null;
  }
};

// ── Login ─────────────────────────────────────────────
export const login = async (email, password) => {
  try {
    const { data } = await axios.post("user/login/", { email, password });

    if (data?.token) {
      const userRole = data.userRole || getRoleFromToken(data.token);

      setAuthUser({
        token: data.token,
        refreshToken: data.refreshertoken,
        user: data.userRsponse,
        userRole: userRole,
      });

      Toast.fire({ icon: "success", title: "Login Successful" });
      return { data, error: null, userRole };
    }

    throw new Error("No token received");
  } catch (error) {
    const errorMsg =
      error.response?.data?.errorDetails ||
      error.response?.data?.message ||
      error.message ||
      "Login failed";
    return { data: null, error: errorMsg, userRole: null };
  }
};

// ── Set Auth User ─────────────────────────────────────
export const setAuthUser = ({ token, refreshToken, user, userRole }) => {
  if (!token) return;

  const role = userRole || getRoleFromToken(token);
  const decoded = jwtDecode(token);

  // ✅ Build clean user object — works for both regular and Google login
  const userData = user || {
    id: getIdFromToken(token),
    email: getEmailFromToken(token),
    ...decoded,
  };

  Cookies.set("access_token", token, {
    expires: new Date(decoded.exp * 1000),
    secure: false, // set true in production
  });

  if (refreshToken) {
    Cookies.set("refresh_token", refreshToken, {
      expires: 7,
      secure: false,
    });
  }

  useAuthStore.getState().setUser(userData);   // ✅ never null
  useAuthStore.getState().setUserRole(role);
  useAuthStore.getState().setLoading(false);
};

// ── Refresh Auth Token ────────────────────────────────
export const refreshAuthToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post("User/refreshtoken/", {
      refresh: refreshToken,
    });

    const userRole =
      response.data.userRole || getRoleFromToken(response.data.token);

    return {
      token: response.data.token,
      refreshToken: response.data.refreshertoken,
      user: response.data.userRsponse,
      userRole: userRole,
    };
  } catch (error) {
    return null;
  }
};

// ── Set User from Cookie ──────────────────────────────
export const setUser = async () => {
  const accessToken = Cookies.get("access_token");
  const store = useAuthStore.getState();
  store.setLoading(true);

  if (!accessToken) {
    store.setLoading(false);
    return;
  }

  try {
    if (isTokenExpired(accessToken)) {
      logout();
      return;
    }

    const userRole = getRoleFromToken(accessToken);
    setAuthUser({
      token: accessToken,
      user: null,        // ✅ let setAuthUser build from token
      userRole: userRole,
    });
  } catch (error) {
    logout();
  } finally {
    store.setLoading(false);
  }
};

// ── Logout ────────────────────────────────────────────
export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");

  useAuthStore.getState().clearUser();
  localStorage.removeItem("auth-storage");

  Toast.fire({ icon: "success", title: "Signed out successfully" });
};

// ── Register ──────────────────────────────────────────
export const register = async (email, password, password2) => {
  try {
    const { data } = await axios.post("user/create/", {
      email,
      password,
      password2,
    });

    await login(email, password);

    Toast.fire({ icon: "success", title: "Account Created Successfully" });
    return { data, error: null };
  } catch (error) {
    let errorMsg = "Something went wrong";

    if (error.response?.data?.errorDetails) {
      errorMsg = error.response.data.errorDetails;
    } else if (error.response?.data?.detail) {
      errorMsg = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.message) {
      errorMsg = error.message;
    }

    return { data: null, error: errorMsg };
  }
};