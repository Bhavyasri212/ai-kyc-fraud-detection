// models/kyc.js
import mongoose from "mongoose";

const KYCRequestSchema = new mongoose.Schema({
  userInfo: {
    fullName: String,
    dob: String,
    gender: String,
    email: String,
    phone: String,
  },
  extractedData: {
    aadhaar: {
      aadhaar: String,
      name: String,
      dob: String,
      gender: String,
      address: String,
    },
    pan: {
      pan: String,
      name: String,
      dob: String,
      gender: String,
      aadhaar: String,
      address: String,
    },
  },
  verificationResult: {
    Aadhaar: {
      valid: Boolean,
      fraudScore: Number,
      riskCategory: String,
      reason: String,
    },
    Pan: {
      valid: Boolean,
      fraudScore: Number,
      riskCategory: String,
      reason: String,
    },
  },
  confidenceScores: {
    fullName: Number,
    dob: Number,
    aadhaarNumber: Number,
    panNumber: Number,
    gender: Number,
    address: Number,
  },
  fraudScore: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const KYCRequest = mongoose.model("KYCRequest", KYCRequestSchema);
export default KYCRequest;
