import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT token stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
