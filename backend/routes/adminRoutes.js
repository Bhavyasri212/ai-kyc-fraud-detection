import express from "express";
import {
  getAllDocs,
  approveDoc,
  rejectDoc,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middelware/authMiddleware.js";

const router = express.Router();

router.get("/docs", protect, adminOnly, getAllDocs);
router.post("/docs/:id/approve", protect, adminOnly, approveDoc);
router.post("/docs/:id/reject", protect, adminOnly, rejectDoc);

export default router;
