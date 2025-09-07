// routes/admin.js
import express from "express";
import jwt from "jsonwebtoken";
import KYCRequest from "../models/kyc.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    console.warn("Missing Authorization header");
    return res.status(401).json({ message: "Missing Authorization" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.warn("JWT verification error:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("JWT verified user:", user);
    req.user = user;
    next();
  });
}

// Fetch KYC requests from DB
router.get("/kyc-requests", authenticate, async (req, res, next) => {
  console.log("GET /kyc-requests called by user:", req.user);
  try {
    const requests = await KYCRequest.find();
    console.log("KYC requests found:", requests.length);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching KYC requests:", err);
    next(err);
  }
});

// Approve or reject KYC
router.post(
  "/kyc-requests/:id/:action",
  authenticate,
  async (req, res, next) => {
    const { id, action } = req.params;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }
    try {
      const reqDoc = await KYCRequest.findById(id);
      if (!reqDoc) return res.status(404).json({ message: "Not found" });
      if (reqDoc.status !== "pending")
        return res.status(400).json({ message: "Already processed" });

      reqDoc.status = action === "approve" ? "approved" : "rejected";
      await reqDoc.save();
      res.json(reqDoc);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
