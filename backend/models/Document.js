import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
  filename: String,
  extractedData: { type: Object, default: {} },
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true }, // links document to user
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.model("Document", docSchema);
