import express from "express";
import multer from "multer";
import { uploadDoc, getUserDocs } from "../controllers/docController.js";
import { protect } from "../middelware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-doc", protect, upload.single("document"), uploadDoc);
router.get("/get-user-docs", protect, getUserDocs);

export default router;
