import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import stringSimilarity from "string-similarity";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { execFile } from "child_process";
import path from "path";
import { extractKYCDetails } from "../controllers/docController.js";
import KYCRequest from "../models/kyc.js";
import crypto from "crypto"; // For hashing
import { normalize } from "../utils/normalize.js";

const hashValue = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/verify-doc", upload.single("documentImage"), async (req, res) => {
  try {
    const { documentType, userName } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: "Document image is required" });
    }
    if (!documentType) {
      return res
        .status(400)
        .json({ error: "Missing required field: documentType" });
    }

    // Step 1: OCR
    const {
      data: { text: rawText },
    } = await Tesseract.recognize(imageFile.path, "eng", {
      logger: (m) => console.log(m),
    });

    // Step 2: Extract data
    const extractedData = extractKYCDetails(rawText);
    const aadhaarNumber = extractedData?.aadhaar || "";
    const nameOnDoc = extractedData?.name || "";

    // Step 3: OPTIONAL - Real duplicate check (replace logic with DB)
    // ✅ Normalize input before hashing using shared utility
    const rawAadhaar =
      typeof extractedData.aadhaar === "string"
        ? extractedData.aadhaar
        : extractedData.aadhaar?.aadhaar || "";

    const rawPan =
      typeof extractedData.pan === "string"
        ? extractedData.pan
        : extractedData.pan?.pan || "";

    const aadhaar = normalize(rawAadhaar);
    const pan = normalize(rawPan);

    // Compute hashes
    const aadhaarHash = aadhaar ? hashValue(aadhaar) : null;
    const panHash = pan ? hashValue(pan) : null;

    // 🐞 Log for debugging
    console.log("Aadhaar normalized:", aadhaar);
    console.log("PAN normalized:", pan);
    console.log("Aadhaar hash:", aadhaarHash);
    console.log("PAN hash:", panHash);

    // 🔍 Duplicate check query
    const orQuery = [
      aadhaarHash ? { aadhaarHash } : null,
      panHash ? { panHash } : null,
    ].filter(Boolean);

    console.log("Duplicate query:", orQuery);

    const duplicate = await KYCRequest.findOne({ $or: orQuery });

    console.log("Duplicate found:", duplicate);

    const isDuplicate = !!duplicate;
    console.log("Is duplicate:", isDuplicate);

    // 📝 Mark in extracted data for downstream use
    extractedData.is_duplicate = isDuplicate;

    // Step 4: Name similarity check
    let nameSimilarityScore = 1.0;
    let reason = [];

    if (userName && nameOnDoc) {
      nameSimilarityScore = stringSimilarity.compareTwoStrings(
        userName.toLowerCase(),
        nameOnDoc.toLowerCase()
      );
    } else {
      reason.push("Missing name for comparison");
    }

    // Step 5: Prepare fraud check input and encode it as base64
    const fraudInput = {
      is_duplicate: isDuplicate,
      aadhaar_number: aadhaarNumber,
      pan_number: extractedData?.pan || "",
      name_similarity_score: nameSimilarityScore,
      name_on_doc: nameOnDoc,
      name_input: userName || "",
      type: documentType,
    };

    const fraudInputString = JSON.stringify(fraudInput);
    const fraudInputBase64 = Buffer.from(fraudInputString).toString("base64");

    const pythonPath =
      "C:\\Users\\sdgeryuj\\AppData\\Local\\Programs\\Python\\Python313\\python.exe"; // Adjust if needed
    const scriptPath = path.resolve("scripts/fraudScoring.py");

    // Pass base64-encoded JSON and image path to Python
    const pythonArgs = [scriptPath, fraudInputBase64, imageFile.path];

    execFile(pythonPath, pythonArgs, (error, stdout, stderr) => {
      console.log("Python stdout:", stdout);
      console.log("Python stderr:", stderr);

      fs.unlink(imageFile.path, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });

      if (error) {
        console.error("Python script error:", stderr);
        return res.status(500).json({ error: "Fraud scoring failed" });
      }
      try {
        const fraudResult = JSON.parse(stdout);
        const finalRiskLevel = fraudResult.risk_level;
        const fraudScore = fraudResult.fraud_score;
        const fraudReasons = fraudResult.reasons;

        const valid = fraudScore <= 70;
        const status = valid ? "Valid Document" : "Invalid Document";

        return res.json({
          id: uuidv4(),
          timestamp: new Date(),
          valid,
          status,
          fraudScore,
          riskLevel: finalRiskLevel,
          reason: [...reason, ...fraudReasons],
          extractedData,
          ocrTextSnippet: rawText.slice(0, 200),
          isDuplicate,
        });
      } catch (parseError) {
        console.error("Error parsing Python output:", parseError);
        return res.status(500).json({ error: "Invalid Python output" });
      }
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return res.status(500).json({ error: "Failed to process document" });
  }
});

export default router;
