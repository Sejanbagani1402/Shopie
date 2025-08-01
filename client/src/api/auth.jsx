import apiClient from "../utils/axios";

export const AuthService = {
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await apiClient.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.error(`Logout error: ${error}`);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },
  getProfile: async () => {
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.get("/auth/refresh-token", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
