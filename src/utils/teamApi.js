import axios from "axios";

// Django backend API instance for team management microservice
// Uses Railway production URL in production, localhost in development
const TEAM_API_BASE_URL = import.meta.env.PROD
  ? "https://teamapi-production.up.railway.app/api/v1/"
  : "http://127.0.0.1:8000/api/v1/";

const teamApiInstance = axios.create({
  baseURL: TEAM_API_BASE_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Module-level cache so team data is available instantly when /team is opened
let _teamByCategory = null;
let _teamByCategoryPromise = null;

// Call this early (e.g. on the landing page) to warm the cache in the background
export const prefetchTeam = () => {
  if (_teamByCategory || _teamByCategoryPromise) return;
  _teamByCategoryPromise = teamApiInstance
    .get("team/by-category/")
    .then((r) => {
      _teamByCategory = r.data;
      _teamByCategoryPromise = null;
      return r.data;
    })
    .catch(() => {
      _teamByCategoryPromise = null;
    });
};

// Team API functions
export const teamApi = {
  // Get all approved team members
  getTeamMembers: async (params = {}) => {
    const response = await teamApiInstance.get("team/", { params });
    return response.data;
  },

  // Get team members grouped by category — reads from cache if already prefetched
  getTeamMembersByCategory: async () => {
    if (_teamByCategory) return _teamByCategory;
    if (_teamByCategoryPromise) return _teamByCategoryPromise;
    const response = await teamApiInstance.get("team/by-category/");
    _teamByCategory = response.data;
    return _teamByCategory;
  },

  // Get all public categories
  getCategories: async () => {
    const response = await teamApiInstance.get("team/categories/public/");
    return response.data;
  },

  // Get a specific team member's details
  getTeamMemberDetails: async (id) => {
    const response = await teamApiInstance.get(`team/${id}/`);
    return response.data;
  },

  // Submit application to join team
  applyToTeam: async (formData) => {
    const response = await teamApiInstance.post("team/apply/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get featured team members only
  getFeaturedMembers: async () => {
    const response = await teamApiInstance.get("team/", {
      params: { featured: "true" },
    });
    return response.data;
  },

  // Filter by department
  getTeamByDepartment: async (department) => {
    const response = await teamApiInstance.get("team/", {
      params: { department },
    });
    return response.data;
  },

  // Filter by category
  getTeamByCategory: async (categoryId) => {
    const response = await teamApiInstance.get("team/", {
      params: { category: categoryId },
    });
    return response.data;
  },
};

export default teamApiInstance;
