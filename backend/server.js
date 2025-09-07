// server.js (or index.js in your backend directory)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import verificationRoutes from "./routes/verification.js";
import kycRoutes from "./routes/kyc.js"; // KYC routes
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/admin", adminRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
