import axios from "axios";

// Django backend API instance for team management microservice
const teamApiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Team API functions
export const teamApi = {
  // Get all approved team members
  getTeamMembers: async (params = {}) => {
    const response = await teamApiInstance.get("team/", { params });
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
};

export default teamApiInstance;
