/**
 * Axios instance with auth interceptors.
 * Full interceptor implementation (token refresh) in Phase 11.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor — attach Bearer token (Phase 11 adds refresh logic)
api.interceptors.request.use(
  (config) => {
    // Token will be injected here from authStore in Phase 11
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalise errors (Phase 11 adds 401 refresh flow)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default api;
