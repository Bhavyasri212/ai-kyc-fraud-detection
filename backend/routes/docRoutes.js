import express from "express";
import multer from "multer";
import {
  uploadDoc,
  getUserDocs,
  deleteDoc, // ✅ ADD this import
} from "../controllers/docController.js";
import { protect } from "../middelware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Existing routes
router.post("/upload-doc", protect, upload.single("document"), uploadDoc);
router.get("/get-user-docs", protect, getUserDocs);

// ✅ NEW route to delete a document
router.delete("/:id", protect, deleteDoc); // <-- this is what your frontend needs

export default router;
