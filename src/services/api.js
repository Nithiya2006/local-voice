import axios from "axios";

// API Base URL - defaults to local Express server port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("localvoice_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      "Unable to communicate with the server. Please check your connection.";

    // If unauthorized / token expired, handle session cleanup if necessary
    if (error.response?.status === 401) {
      // Token invalid or expired
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/register" &&
        window.location.pathname !== "/about"
      ) {
        // Optional: Could notify or redirect to login
      }
    }

    return Promise.reject(new Error(customMessage));
  }
);

/* ==========================================================================
   AUTHENTICATION API SERVICES
   ========================================================================== */

export const register = async (userData) => {
  const payload = {
    name: userData.fullName || userData.name,
    email: userData.email,
    phone: userData.phone,
    city: userData.area || userData.city,
    password: userData.password
  };
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

/* ==========================================================================
   ISSUE REPORTING & RETRIEVAL API SERVICES
   ========================================================================== */

export const getIssues = async (params = {}) => {
  const response = await api.get("/issues", { params });
  return response.data;
};

export const getNearbyIssues = async (latitude, longitude, maxDistance = 50000, category = "all") => {
  const params = { latitude, longitude, maxDistance };
  if (category && category !== "all") {
    params.category = category;
  }
  const response = await api.get("/issues/nearby", { params });
  return response.data;
};

export const getMyReports = async () => {
  const response = await api.get("/issues/my-reports");
  return response.data;
};

export const getIssue = async (id) => {
  const response = await api.get(`/issues/${id}`);
  return response.data;
};

export const createIssue = async (issueData) => {
  let response;

  if (issueData instanceof FormData) {
    // Multipart form-data with binary image upload
    response = await api.post("/issues", issueData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } else {
    // JSON payload
    response = await api.post("/issues", issueData);
  }

  return response.data;
};

export const updateIssue = async (id, data) => {
  const response = await api.put(`/issues/${id}`, data);
  return response.data;
};

export const deleteIssue = async (id) => {
  const response = await api.delete(`/issues/${id}`);
  return response.data;
};

/* ==========================================================================
   COMMUNITY SUPPORT API SERVICES
   ========================================================================== */

export const supportIssue = async (issueId) => {
  const response = await api.post(`/issues/${issueId}/support`);
  return response.data;
};

export const getMySupports = async () => {
  const response = await api.get("/support/my-supports");
  return response.data;
};

/* ==========================================================================
   NOTIFICATION API SERVICES
   ========================================================================== */

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

/* ==========================================================================
   DASHBOARD STATS API SERVICES
   ========================================================================== */

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export default api;
