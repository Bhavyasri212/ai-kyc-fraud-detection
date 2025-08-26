import mongoose from "mongoose";
const docSchema = new mongoose.Schema({
  filename: String,
  extractedData: Object,
  uploadedAt: { type: Date, default: Date.now },
});
export default mongoose.model("Document", docSchema);
