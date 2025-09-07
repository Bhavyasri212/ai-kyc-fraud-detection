import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Backend base URL

// Read token from localStorage
const getToken = () => localStorage.getItem("token") || "";

// Create an axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Add a request interceptor to add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
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
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} response data including token and userId
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
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} response data
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
   * @param {File} file - file to upload
   * @returns {Promise<Object>} extracted data from OCR
   */
  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append("document", file);

      const res = await axiosInstance.post("/docs/upload-doc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data; // expected { message, extracted: {...} }
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
   * @returns {Promise<Object[]>} list of documents
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

  /**
   * Logout user by clearing localStorage tokens
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
  },

  /**
   * Send forgot password email
   * @param {string} email
   * @returns {Promise<Object>} response data
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

  /**
   * Verify a document
   * @param {FormData} formData
   * @returns {Promise<Object>} verification result
   */
  verifyDoc: async (formData) => {
    try {
      // Note: Don't set Content-Type manually for FormData
      const res = await axiosInstance.post(
        "/verification/verify-doc",
        formData
      );
      return res.data;
    } catch (error) {
      console.error(
        "Document verification failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Get fraud score for a document
   * @param {Object} params - contains documentType and documentData
   * @param {string} params.documentType
   * @param {Object} params.documentData
   * @returns {Promise<Object>} fraud score data
   */
  getFraudScore: async ({ documentType, documentData }) => {
    try {
      const res = await axiosInstance.post("/verification/fraud-score", {
        documentType,
        documentData,
      });
      return res.data;
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
