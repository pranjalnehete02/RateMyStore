import axios from "axios";

// Base URL of your backend API
const BASE_URL = "http://localhost:5000/api"; // Change to your actual backend if deployed

// Get token from localStorage (or context later)
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "", // 👈 attach token if it exists
  },
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
