/**
 * Team Member Authentication & Dashboard API
 * Uses the main auth system (cookies) for authentication
 */
import axios from "axios";
import Cookies from "js-cookie";

// API Base URL - same as team API
const API_BASE_URL = import.meta.env.PROD
  ? "https://teamapi-production.up.railway.app/api/v1"
  : "http://127.0.0.1:8000/api/v1";

// Create axios instance for team member auth
const teamAuthApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get token from cookies (main auth system)
const getAccessToken = () => Cookies.get("access_token");

// Request interceptor - add auth header
teamAuthApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle token errors
teamAuthApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on auth failure
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API - uses main authentication system
export const authApi = {
  isAuthenticated: () => {
    return !!getAccessToken();
  },

  getProfile: async () => {
    const response = await teamAuthApi.get("/auth/profile/");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await teamAuthApi.patch("/auth/profile/", data);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await teamAuthApi.post("/auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPassword,
    });
    return response.data;
  },

  logout: async () => {
    // Main logout is handled by the main auth system
    window.location.href = "/logout";
  },
};

// Booking/Scheduling API
export const bookingApi = {
  // Availability
  getAvailability: async () => {
    const response = await teamAuthApi.get("/booking/availability/");
    return response.data;
  },

  createAvailability: async (data) => {
    const response = await teamAuthApi.post("/booking/availability/", data);
    return response.data;
  },

  updateAvailability: async (id, data) => {
    const response = await teamAuthApi.patch(
      `/booking/availability/${id}/`,
      data,
    );
    return response.data;
  },

  deleteAvailability: async (id) => {
    await teamAuthApi.delete(`/booking/availability/${id}/`);
  },

  bulkCreateAvailability: async (slots) => {
    const response = await teamAuthApi.post(
      "/booking/availability/bulk_create/",
      { slots },
    );
    return response.data;
  },

  clearAllAvailability: async () => {
    const response = await teamAuthApi.delete(
      "/booking/availability/clear_all/",
    );
    return response.data;
  },

  // Blocked Time
  getBlockedTimes: async () => {
    const response = await teamAuthApi.get("/booking/blocked-time/");
    return response.data;
  },

  createBlockedTime: async (data) => {
    const response = await teamAuthApi.post("/booking/blocked-time/", data);
    return response.data;
  },

  deleteBlockedTime: async (id) => {
    await teamAuthApi.delete(`/booking/blocked-time/${id}/`);
  },

  // Appointments
  getAppointments: async (params = {}) => {
    const response = await teamAuthApi.get("/booking/appointments/", {
      params,
    });
    return response.data;
  },

  getAppointmentStats: async () => {
    const response = await teamAuthApi.get("/booking/appointments/stats/");
    return response.data;
  },

  confirmAppointment: async (id) => {
    const response = await teamAuthApi.post(
      `/booking/appointments/${id}/confirm/`,
    );
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await teamAuthApi.post(
      `/booking/appointments/${id}/cancel/`,
    );
    return response.data;
  },

  completeAppointment: async (id) => {
    const response = await teamAuthApi.post(
      `/booking/appointments/${id}/complete/`,
    );
    return response.data;
  },

  updateAppointment: async (id, data) => {
    const response = await teamAuthApi.patch(
      `/booking/appointments/${id}/`,
      data,
    );
    return response.data;
  },

  // Services
  getServices: async () => {
    const response = await teamAuthApi.get("/booking/services/");
    return response.data;
  },

  // Google Calendar
  getGoogleAuthUrl: async (redirectUri) => {
    const response = await teamAuthApi.get("/booking/google/connect/", {
      params: { redirect_uri: redirectUri },
    });
    return response.data;
  },

  connectGoogleCalendar: async (code, redirectUri) => {
    const response = await teamAuthApi.post("/booking/google/callback/", {
      code,
      redirect_uri: redirectUri,
    });
    return response.data;
  },

  disconnectGoogleCalendar: async () => {
    const response = await teamAuthApi.post("/booking/google/disconnect/");
    return response.data;
  },

  getGoogleCalendars: async () => {
    const response = await teamAuthApi.get("/booking/google/calendars/");
    return response.data;
  },

  selectGoogleCalendar: async (calendarId) => {
    const response = await teamAuthApi.post(
      "/booking/google/calendars/select/",
      {
        calendar_id: calendarId,
      },
    );
    return response.data;
  },
};

// Public Booking API (for clients)
export const publicBookingApi = {
  getTeamMembers: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/booking/public/team-members/`,
    );
    return response.data;
  },

  getAvailableSlots: async (teamMemberId, date, serviceTypeId = null) => {
    const params = { date };
    if (serviceTypeId) params.service_type_id = serviceTypeId;

    const response = await axios.get(
      `${API_BASE_URL}/booking/public/team-members/${teamMemberId}/slots/`,
      { params },
    );
    return response.data;
  },

  bookAppointment: async (data) => {
    const response = await axios.post(
      `${API_BASE_URL}/booking/public/book/`,
      data,
    );
    return response.data;
  },

  getServices: async () => {
    const response = await axios.get(`${API_BASE_URL}/booking/services/`);
    return response.data;
  },
};

export default teamAuthApi;
