// frontend/src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Backend base URL

// Read token from localStorage
const getToken = () => localStorage.getItem("token") || "";

// Create an axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Add Authorization header automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("Sending token:", token); // Add this line to debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const api = {
  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("email", email);
      }
      return res.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Signup new user
   */
  signup: async (name, email, password) => {
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Upload document for OCR
   */
  uploadDocument: async (file) => {
    try {
      const token = getToken();
      console.log("Upload token being used:", token); // Add this
      const formData = new FormData();
      formData.append("document", file);

      const res = await axiosInstance.post("/docs/upload-doc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (error) {
      console.error(
        "Document upload failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Get previously uploaded user documents
   */
  getUserDocs: async () => {
    try {
      const res = await axiosInstance.get("/docs/get-user-docs");
      return res.data;
    } catch (error) {
      console.error(
        "Fetching user docs failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  submitKYC: async (kycData) => {
    try {
      const res = await axiosInstance.post("/kyc/submit", kycData);
      return res.data;
    } catch (error) {
      console.error(
        "KYC submission failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return res.data;
    } catch (error) {
      console.error(
        "Forgot password request failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to send reset email");
    }
  },

  // ---------------- AI Fraud Detection APIs ----------------
  aiVerifyDoc: async (formData) => {
    try {
      const res = await axiosInstance.post(
        "/verification/verify-doc",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(
        "AI document verification failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Fetch fraud score for a given user
   * @param {string} userId
   */
  getFraudScore: async (userId) => {
    try {
      const res = await axiosInstance.get(`/ai/fraud-score/${userId}`);
      return res.data; // { userId, fraud_score, risk_level }
    } catch (error) {
      console.error(
        "Fetching fraud score failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default api;
