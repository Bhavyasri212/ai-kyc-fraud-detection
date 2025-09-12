import mongoose from "mongoose";

const KYCRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // link to user

    userInfo: {
      fullName: String,
      dob: String,
      gender: String,
      email: String,
      phone: String,
    },

    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ✅ Add these fields for duplicate detection
    aadhaarHash: { type: String, index: true },
    panHash: { type: String, index: true },

    fraudInfo: [
      {
        type: { type: String }, // e.g., "aadhaar", "pan"
        fraudScore: Number,
        riskLevel: String,
        reasons: [String],
      },
    ],

    verificationResult: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    fraudScore: Number,

    confidenceScores: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const KYCRequest = mongoose.model("KYCRequest", KYCRequestSchema);
export default KYCRequest;
