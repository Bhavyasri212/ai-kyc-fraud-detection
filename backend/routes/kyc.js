// routes/kyc.js
import express from "express";
import KYCRequest from "../models/kyc.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    console.log("📥 Received KYC payload:", req.body);

    const newKYC = new KYCRequest(req.body);
    await newKYC.save();

    res.status(201).json({
      message: "✅ KYC submitted successfully",
      kyc: newKYC,
    });
  } catch (err) {
    console.error("❌ Error saving KYC:", err.message);
    res.status(500).json({
      error: err.message || "Failed to save KYC",
    });
  }
});

export default router;
