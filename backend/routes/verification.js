import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import stringSimilarity from "string-similarity";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { extractKYCDetails } from "../controllers/docController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/verify-doc",
  upload.single("documentImage"), // expects form-data field "documentImage"
  async (req, res) => {
    try {
      const { documentType, userName } = req.body; // pass userName in request now, if needed
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({ error: "Document image is required" });
      }
      if (!documentType) {
        return res.status(400).json({
          error: "Missing required field: documentType",
        });
      }

      // OCR
      const {
        data: { text: rawText },
      } = await Tesseract.recognize(imageFile.path, "eng", {
        logger: (m) => console.log(m),
      });

      // Remove uploaded file after OCR
      fs.unlink(imageFile.path, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });

      // Extract data using existing logic
      const extractedData = extractKYCDetails(rawText);

      let score = 0;
      let reason = [];

      // Validate document number based on type
      if (documentType === "aadhaar") {
        const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
        if (aadhaarRegex.test(extractedData.aadhaar)) {
          score += 30;
        } else {
          reason.push("Invalid Aadhaar format or number not found");
        }
      } else if (documentType === "pan") {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (panRegex.test(extractedData.pan)) {
          score += 30;
        } else {
          reason.push("Invalid PAN format or number not found");
        }
      } else {
        return res.status(400).json({
          error: "Unsupported documentType. Use 'aadhaar' or 'pan'.",
        });
      }

      // Name similarity check using userName from request body if provided
      if (userName && extractedData.name) {
        const similarity = stringSimilarity.compareTwoStrings(
          userName.toLowerCase(),
          extractedData.name.toLowerCase()
        );
        console.log(`Name similarity score: ${similarity}`);
        if (similarity >= 0.8) {
          score += 40;
        } else {
          reason.push("Name mismatch");
        }
      } else {
        reason.push("Missing name for comparison");
      }

      // Dummy duplicate check (implement your own DB logic here)
      const isDuplicate = false;
      if (!isDuplicate) {
        score += 30;
      } else {
        reason.push("Duplicate document detected");
      }

      // Risk and validity
      const riskLevel =
        score >= 80 ? "Low Risk" : score >= 60 ? "Medium Risk" : "High Risk";

      const valid = score >= 60;
      const status = valid ? "Valid Document" : "Invalid Document";

      res.json({
        id: uuidv4(),
        timestamp: new Date(),
        valid,
        status,
        fraudScore: score,
        riskLevel,
        reason,
        extractedData,
        ocrTextSnippet: rawText.slice(0, 200),
      });
    } catch (error) {
      console.error("Error processing document:", error);
      res.status(500).json({ error: "Failed to process document" });
    }
  }
);

export default router;
