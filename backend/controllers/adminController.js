import Doc from "../models/Document.js";

export const getAllDocs = async (req, res) => {
  try {
    const docs = await Doc.find().sort({ createdAt: -1 }).limit(200);
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch docs" });
  }
};

export const approveDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Doc.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve" });
  }
};

export const rejectDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || { reason: "Rejected by admin" };
    const doc = await Doc.findByIdAndUpdate(
      id,
      { status: "rejected", adminReason: reason },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject" });
  }
};
