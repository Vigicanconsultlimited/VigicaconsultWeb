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

// Helper function to check token expiration
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const login = async (email, password) => {
  try {
    const { data } = await axios.post("user/login/", { email, password });

    if (data?.token) {
      setAuthUser({
        token: data.token,
        refreshToken: data.refreshertoken,
        user: data.userRsponse,
      });
      console.log("Login successful:", data);

      Toast.fire({
        icon: "success",
        title: "Login Successful",
      });
      return { data, error: null };
    }

    throw new Error("No token received");
  } catch (error) {
    const errorMsg =
      error.response?.data?.errorDetails ||
      error.response?.data?.message ||
      error.message ||
      "Login failed";
    return { data: null, error: errorMsg };
  }
};

export const setAuthUser = ({ token, refreshToken, user }) => {
  if (!token) return;

  // Set cookies with proper attributes
  Cookies.set("access_token", token, {
    expires: new Date(jwtDecode(token).exp * 1000),
    secure: false, // True in production
    //secure: process.env.NODE_ENV === "production",
    //sameSite: "Strict",
  });

  if (refreshToken) {
    Cookies.set("refresh_token", refreshToken, {
      expires: 7, // 7 days
      secure: false,
      //secure: process.env.NODE_ENV === "production",
      //sameSite: "Strict",
    });
  }

  // Set user in store
  useAuthStore.getState().setUser(user || jwtDecode(token));
  useAuthStore.getState().setLoading(false);
};

export const refreshAuthToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post("User/refreshtoken/", {
      refresh: refreshToken,
    });

    return {
      token: response.data.token,
      refreshToken: response.data.refreshertoken,
      user: response.data.userRsponse,
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};

export const setUser = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  const store = useAuthStore.getState();
  store.setLoading(true);

  if (!accessToken || !refreshToken) {
    store.setLoading(false);
    return;
  }

  try {
    if (isTokenExpired(accessToken)) {
      const newTokens = await refreshAuthToken();
      if (newTokens) {
        setAuthUser(newTokens);
      } else {
        logout();
      }
    } else {
      setAuthUser({
        token: accessToken,
        refreshToken,
        user: jwtDecode(accessToken),
      });
    }
  } catch (error) {
    console.error("Auth error:", error);
    logout();
  } finally {
    store.setLoading(false);
  }
};

export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  localStorage.removeItem("auth-storage");
  useAuthStore.getState().setUser(null);
  Toast.fire({
    icon: "success",
    title: "Signed Out Successfully",
  });
};

export const register = async (email, password, password2) => {
  try {
    const { data } = await axios.post("user/create/", {
      email,
      password,
      password2,
    });

    await login(email, password);

    //Alert - Signup up successfully

    Toast.fire({
      icon: "success",
      title: "Account Created Successfully",
    });

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

    return {
      data: null,
      error: errorMsg,
    };
  }
};
