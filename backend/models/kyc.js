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

    aadhaarHash: { type: String, index: true },
    panHash: { type: String, index: true },

    fraudInfo: [
      {
        type: { type: String },
        fraudScore: Number,
        riskLevel: String,
        reasons: [String],
        amlFlags: [String],
        amlAction: String,
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
      enum: [
        "pending",
        "approved",
        "rejected",
        "manual_review",
        "Rejected – AML Rule Triggered", // ✅ New enum value
      ],
      default: "pending",
    },

    rejectionReason: {
      // ✅ New field
      type: String,
    },

    manualReviewFlaggedBy: String,
    manualReviewAt: Date,
  },
  { timestamps: true }
);

const KYCRequest = mongoose.model("KYCRequest", KYCRequestSchema);
export default KYCRequest;
