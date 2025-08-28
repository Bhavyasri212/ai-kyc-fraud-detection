// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // backend base

// read token if you’re storing it in localStorage after login
const getToken = () => localStorage.getItem("token") || "";

const api = {
  // LOGIN
  login: async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("email", res.data.email);
    }

    return res.data;
  },

  // SIGNUP
  signup: async (name, email, password) => {
    const res = await axios.post(`${API_BASE}/auth/signup`, {
      name,
      email,
      password,
    });
    return res.data;
  },

  // UPLOAD + OCR
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append("document", file);

    const res = await axios.post(`${API_BASE}/docs/upload-doc`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data; // { message, extracted: { aadhaarNumber, panNumber, dob, gender, rawText } }
  },

  // FETCH USER DOCS (previous uploads)
  getUserDocs: async () => {
    const res = await axios.get(`${API_BASE}/docs/get-user-docs`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
  },
  forgotPassword: async (email) => {
    // Example POST to your backend endpoint for forgot password
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error("Failed to send reset email");
    }
    return response.json();
  },
};

export default api;
