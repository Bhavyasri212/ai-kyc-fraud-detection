import express from "express";
import { protect } from "../middelware/authMiddleware.js";
import KYCRequest from "../models/kyc.js";
import crypto from "crypto";
import { normalize } from "../utils/normalize.js";

const hashValue = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

const router = express.Router();

router.post("/submit", protect, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID missing in token payload" });
    }

    const extractedData = req.body.extractedData || {};

    // Normalize and hash Aadhaar & PAN
    const rawAadhaar =
      typeof extractedData.aadhaar === "string"
        ? extractedData.aadhaar
        : extractedData.aadhaar?.aadhaar || "";

    const rawPan =
      typeof extractedData.pan === "string"
        ? extractedData.pan
        : extractedData.pan?.pan || "";

    const aadhaar = normalize(rawAadhaar);
    const pan = normalize(rawPan);

    // Compute hashes
    const aadhaarHash = aadhaar ? hashValue(aadhaar) : null;
    const panHash = pan ? hashValue(pan) : null;

    // 🔍 Check for duplicates
    const duplicate = await KYCRequest.findOne({
      $or: [
        aadhaarHash ? { aadhaarHash } : null,
        panHash ? { panHash } : null,
      ].filter(Boolean), // remove nulls
    });

    const isDuplicate = !!duplicate;

    // Mark is_duplicate in the extractedData (used by Python)
    extractedData.is_duplicate = isDuplicate;

    // ✅ Prepare final payload
    const kycData = {
      ...req.body,
      userId,
      extractedData,
      aadhaarHash,
      panHash,
    };

    const newKYC = new KYCRequest(kycData);
    await newKYC.save();

    return res.status(201).json({
      message: "✅ KYC submitted successfully",
      isDuplicate,
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
