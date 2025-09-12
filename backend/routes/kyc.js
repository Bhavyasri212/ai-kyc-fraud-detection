import express from "express";
import { protect } from "../middelware/authMiddleware.js";
import KYCRequest from "../models/kyc.js";

const router = express.Router();

router.post("/submit", protect, async (req, res) => {
  console.log("res object methods:", Object.keys(res));
  try {
    console.log("User from token:", req.user);

    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID missing in token payload" });
    }

    const kycData = { ...req.body, userId };
    console.log("Saving KYC with data:", kycData);

    const newKYC = new KYCRequest(kycData);
    await newKYC.save();

    return res.status(201).json({
      message: "✅ KYC submitted successfully",
      kyc: newKYC,
    });
  } catch (err) {
    console.error("❌ Error saving KYC:", err);
    return res.status(500).json({
      error: err.message || "Failed to save KYC",
      stack: err.stack,
    });
  }
});

export default router;
