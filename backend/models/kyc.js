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
      type: mongoose.Schema.Types.Mixed, // allows dynamic keys like aadhaar, pan, passport, etc.
      default: {},
    },

    fraudInfo: [
      {
        type: { type: String }, // e.g., "aadhaar", "pan"
        fraudScore: Number,
        riskLevel: String,
        reasons: [String],
      },
    ],

    verificationResult: {
      type: mongoose.Schema.Types.Mixed, // in case you need to store full raw result
      default: {},
    },

    fraudScore: Number, // averaged fraud score if calculated on frontend

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
