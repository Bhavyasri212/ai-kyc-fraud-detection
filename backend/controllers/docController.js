import multer from "multer";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import Doc from "../models/Document.js";

// -------------------- Multer Config --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

// -------------------- Field Extraction --------------------
const extractKYCDetails = (rawText) => {
  let name = "N/A";
  let dob = "N/A";
  let gender = "N/A";
  let aadhaar = "N/A";
  let address = "N/A";

  const text = rawText.replace(/\s+/g, " ").trim();
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // ---------------- Aadhaar Number ----------------
  const aadhaarMatches = [...text.matchAll(/\b\d{4}\s?\d{4}\s?\d{4}\b/g)];
  const aadhaarNumbers = [];
  for (let match of aadhaarMatches) {
    const start = match.index;
    const context = text
      .substring(Math.max(0, start - 10), start)
      .toLowerCase();
    if (!context.includes("vid")) {
      aadhaarNumbers.push(match[0].replace(/\s+/g, ""));
    }
  }
  if (aadhaarNumbers.length > 0) {
    aadhaar = [...new Set(aadhaarNumbers)][0]; // take unique first valid
  }

  for (let i = 0; i < lines.length; i++) {
    if (/\b(Male|Female|Transgender)\b/i.test(lines[i])) {
      // previous line might contain DOB or YOB
      if (i > 0) {
        const prevLine = lines[i - 1];

        // Check for full DOB dd/mm/yyyy or dd-mm-yyyy
        const dobMatch = prevLine.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
        if (dobMatch) {
          dob = dobMatch[1];
          break;
        }

        // Check for Year of Birth
        const yobMatch = prevLine.match(/([0-9]{4})/);
        if (yobMatch) {
          dob = yobMatch[1];
          break;
        }
      }
    }
  }

  // Gender
  const genderMatch = text.match(/\b(Male|Female|Transgender)\b/i);
  if (genderMatch) gender = genderMatch[1].toUpperCase();

  // -------- Name Extraction --------
  let possibleNames = [];

  // After "To"
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*to\b/i.test(lines[i])) {
      if (i + 1 < lines.length) {
        let cleaned = lines[i + 1].replace(/[^A-Za-z\s]/g, "").trim();
        if (cleaned) possibleNames.push(cleaned);
      }
      break;
    }
  }

  // Before relation markers (S/O, D/O, W/O, C/O)
  for (let i = 0; i < lines.length; i++) {
    if (/(S\/O|D\/O|W\/O|C\/O)/i.test(lines[i])) {
      if (i > 0) {
        let cleaned = lines[i - 1].replace(/[^A-Za-z\s]/g, "").trim();
        if (cleaned) possibleNames.push(cleaned);
      }
      break;
    }
  }

  // Before DOB
  for (let i = 0; i < lines.length; i++) {
    if (/\b(DOB|Date of Birth|D\.O\.B)\b/i.test(lines[i])) {
      if (i > 0) {
        let cleaned = lines[i - 1].replace(/[^A-Za-z\s]/g, "").trim();
        if (cleaned) possibleNames.push(cleaned);
      }
      break;
    }
  }

  // Choose best candidate (longest clean string)
  if (possibleNames.length > 0) {
    name = possibleNames.reduce((a, b) => (b.length > a.length ? b : a));
  } else {
    name = "N/A";
  }

  // -------- Address Extraction --------
  let addressLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (/(S\/O|D\/O|W\/O|C\/O)/i.test(lines[i])) {
      addressLines = lines.slice(i + 1, i + 6); // take a few lines
      break;
    } else if (/dob|date of birth/i.test(lines[i]) && i > 0) {
      addressLines = lines.slice(i + 1, i + 6);
      break;
    }
  }

  if (addressLines.length) {
    let combined = [];
    for (let line of addressLines) {
      combined.push(line);
      // stop once PIN code (6 digits) is found
      if (/\b\d{6}\b/.test(line)) break;
    }

    address = combined
      .join(" ")
      .replace(/\b\d{10}\b/g, "") // remove phone numbers
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return { name, dob, gender, aadhaar, address };
};

// -------------------- Upload & Process --------------------
export const uploadDoc = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("📄 File uploaded:", req.file.filename);

    // Step 1: OCR → Raw Text
    const result = await Tesseract.recognize(req.file.path, "eng", {
      logger: (info) => console.log(info),
    });

    const rawText = result.data.text;
    console.log("📝 OCR Extracted Text:", rawText);

    // Step 2: Field Extraction
    const extractedData = extractKYCDetails(rawText);
    console.log("✅ Extracted Data:", extractedData);

    // Save in DB
    const doc = new Doc({
      userId: req.user.id,
      filePath: req.file.path,
      rawText,
      extractedData,
    });
    await doc.save();

    // Return only clean extracted fields
    res.json(extractedData);
  } catch (err) {
    console.error("❌ Error processing document:", err);
    res.status(500).json({ error: "Failed to process document" });
  }
};

// -------------------- Get User Docs --------------------
export const getUserDocs = async (req, res) => {
  try {
    const docs = await Doc.find({ userId: req.user.id });
    res.json(docs);
  } catch (err) {
    console.error("❌ Error fetching user docs:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};
