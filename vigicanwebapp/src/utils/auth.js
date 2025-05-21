import { useAuthStore } from "../store/authStore";
import axios from "./axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

export const login = async (email, password) => {
  try {
    const { response, status } = await axios.post("auth/token", {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(response.access, response.refresh);

      //Alert on successful login
    }
    return { response, error: null };
  } catch (error) {
    return {
      response: null,
      error: error.response.data?.detail || "Something went wrong",
    };
  }
};

export const register = async (
  first_name,
  last_name,
  other_name,
  email,
  password,
  password2
) => {
  try {
    const { response, status } = await axios.post("auth/register", {
      first_name,
      last_name,
      other_name,
      email,
      phone,
      password,
      password2,
    });

    if (status === 201) {
      await login(email, password);
      //Alert on successful registration
    }
    return { response, error: null };
  } catch (error) {
    return {
      response: null,
      error: error.response.data?.detail || "Something went wrong",
    };
  }
};

export const logout = async () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().clearUser();

  //Alert on successful logout
};

export const setUser = async () => {
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  if (access_token || refresh_token) {
    return;
  }
  if (isAccessTokenExpired(access_token)) {
    const { response, error } = await refreshAccessToken(refresh_token);
    if (error) {
      return;
    }
    setAuthUser(response.access, response.refresh);
  } else {
    setAuthUser(access_token, refresh_token);
  }
};

export const setAuthUser = (access_token, refresh_token) => {
  useAuthStore.getState().setUser(user);
  Cookies.set("access_token", access_token, { expires: 1, secure: true });
  Cookies.set("refresh_token", refresh_token, { expires: 7, secure: true });

  const user = jwt_decode(access_token) ?? null;
  if (user) {
    useAuthStore.getState().setUser(user);
  }
  useAuthStore.getState().setLoading(false);
};

export const refreshAccessToken = async (refresh_token) => {
  const refresh_token = Cookies.get("refresh_token");
  try {
    const response = await axios.post("user/token/refresh", {
      refresh: refresh_token,
    });

    return response.data;
  } catch (error) {
    return {
      response: null,
      error: error.response.data?.detail || "Something went wrong",
    };
  }
};

export const isAccessTokenExpired = (access_token) => {
  if (!access_token) {
    return true;
  }
  const decoded = jwt_decode(access_token);
  const current_time = Date.now() / 1000;
  return decoded.exp < current_time;
};
