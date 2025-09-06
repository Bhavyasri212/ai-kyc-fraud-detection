import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../components/Navbar";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  Eye,
  Clock,
  X,
  Sparkles,
  Zap,
} from "lucide-react";

export default function UploadPage({ onExtract }) {
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [aadhaarError, setAadhaarError] = useState("");

  const [panFile, setPanFile] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [panError, setPanError] = useState("");

  const [processing, setProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState({});
  const [verifying, setVerifying] = useState(false);

  const aadhaarInputRef = useRef(null);
  const panInputRef = useRef(null);
  const navigate = useNavigate();

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  const maxSize = 2 * 1024 * 1024;

  const makePreview = (f) => {
    if (!f) return null;
    if (f.type === "application/pdf") return "pdf";
    return URL.createObjectURL(f);
  };

  const validateFile = (f) => {
    if (!f) return "No file selected.";
    if (!allowedTypes.includes(f.type))
      return "Only JPEG, PNG, or PDF files are supported.";
    if (f.size > maxSize) return "File size must be ≤ 2MB.";
    return "";
  };

  const handleFile = (f, type) => {
    const error = validateFile(f);
    if (type === "aadhaar") {
      if (error) {
        setAadhaarError(error);
        setAadhaarFile(null);
        setAadhaarPreview(null);
      } else {
        setAadhaarError("");
        setAadhaarFile(f);
        setAadhaarPreview(makePreview(f));
      }
    } else {
      if (error) {
        setPanError(error);
        setPanFile(null);
        setPanPreview(null);
      } else {
        setPanError("");
        setPanFile(f);
        setPanPreview(makePreview(f));
      }
    }
  };

  const handleExtract = async (file) => {
    if (!file) return;
    setProcessing(true);
    navigate("/loading");

    try {
      const data = await api.uploadDocument(file);
      // Pass extracted data as state while navigating to /results
      navigate("/results", { state: { extractedData: data } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract document data.");
      navigate("/upload");
    } finally {
      setProcessing(false);
    }
  };

  const handleVerifyDoc = async (file, label) => {
    if (!file) return;
    setVerifying(true);
    toast.info(`[${label}] Verification started...`);

    try {
      console.log(`[${label}] Sending verification request...`);

      // Create FormData to send file + fields
      const formData = new FormData();
      formData.append("documentImage", file); // must match multer field name on backend
      formData.append("documentType", label.toLowerCase()); // "aadhaar" or "pan"
      formData.append("userName", "Rahul Verma"); // replace with actual user input if available

      // Make API call, sending formData directly (no JSON)
      const verifyRes = await api.verifyDoc(formData);

      console.log(`[${label}] verifyRes:`, verifyRes);

      setVerificationResult((prev) => ({
        ...prev,
        [label]: verifyRes,
      }));

      toast.success(
        `[${label}] ${verifyRes.valid ? "Valid" : "Invalid"} — Risk: ${
          verifyRes.riskLevel || verifyRes.riskCategory || "Unknown"
        }`
      );
    } catch (err) {
      console.error(`[${label}] Verification error:`, err);
      toast.error(`[${label}] Verification failed.`);
    } finally {
      setVerifying(false);
    }
  };

  const removeFile = (type) => {
    if (type === "aadhaar") {
      setAadhaarFile(null);
      setAadhaarPreview(null);
      setAadhaarError("");
      if (aadhaarInputRef.current) aadhaarInputRef.current.value = "";
    } else {
      setPanFile(null);
      setPanPreview(null);
      setPanError("");
      if (panInputRef.current) panInputRef.current.value = "";
    }
  };

  const renderUploader = (
    label,
    file,
    preview,
    error,
    inputRef,
    onFileChange,
    onExtractClick,
    removeClick
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-8 mb-10"
    >
      <h2 className="text-xl font-bold text-white mb-6">{label}</h2>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        onChange={onFileChange}
        className="hidden"
        id={`upload-${label}`}
      />

      <label
        htmlFor={`upload-${label}`}
        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 group ${
          file
            ? "border-amber-400 bg-amber-400/10"
            : "border-slate-700 bg-slate-800/30 hover:border-yellow-500/50 hover:bg-yellow-500/5"
        }`}
      >
        {!file ? (
          <div className="text-center p-8">
            <Upload className="w-16 h-16 text-slate-500 group-hover:text-yellow-400 mx-auto mb-6 transition-colors" />
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-300 transition-colors">
              Drop your document here
            </h3>
            <p className="text-slate-400 mb-4 group-hover:text-slate-300 transition-colors">
              or click to browse files
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 rounded-xl text-sm text-slate-400 border border-slate-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Supports: JPEG, PNG, PDF • Max size: 2MB
            </div>
          </div>
        ) : preview === "pdf" ? (
          <div className="text-center p-8">
            <FileText className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">
              PDF Document Selected
            </h3>
            <p className="text-slate-400 text-sm">{file.name}</p>
          </div>
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain rounded-2xl"
          />
        )}

        {file && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              removeClick();
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            whileHover={{ rotate: 90 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </label>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-4 bg-red-500/10 border border-red-500/30 rounded-2xl mt-4 backdrop-blur-sm"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <motion.button
          onClick={() => onExtractClick(file)}
          disabled={!file || processing}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
            !file || processing
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-600 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-400"
          }`}
          whileHover={!file || processing ? {} : { scale: 1.02 }}
          whileTap={!file || processing ? {} : { scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center justify-center">
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Extract Data
              </>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() =>
            handleVerifyDoc(file, label.includes("Aadhaar") ? "Aadhaar" : "Pan")
          }
          disabled={!file || verifying}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
            !file || verifying
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-emerald-500 text-black hover:from-green-500 hover:to-emerald-400"
          }`}
          whileHover={!file || verifying ? {} : { scale: 1.02 }}
          whileTap={!file || verifying ? {} : { scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center justify-center">
            {verifying ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Verify Document
              </>
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black">
      <AnimatedBackground />
      <Navbar />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl mx-auto">
        {renderUploader(
          "Aadhaar Card Upload",
          aadhaarFile,
          aadhaarPreview,
          aadhaarError,
          aadhaarInputRef,
          (e) => handleFile(e.target.files?.[0], "aadhaar"),
          handleExtract,
          () => removeFile("aadhaar")
        )}
        {verificationResult["Aadhaar"] && (
          <div className="mt-6 mb-10 bg-slate-800 p-4 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">
              Aadhaar Verification Result
            </h3>
            <p>
              Status:{" "}
              <strong>
                {verificationResult["Aadhaar"].valid
                  ? "✅ Valid"
                  : "❌ Invalid"}
              </strong>
            </p>
            <p>
              Risk Score:{" "}
              <strong>{verificationResult["Aadhaar"].fraudScore}%</strong>
            </p>
            <p>
              Risk Level:{" "}
              <strong>{verificationResult["Aadhaar"].riskCategory}</strong>
            </p>
            {verificationResult["Aadhaar"].reason && (
              <p className="text-red-400">
                Reason: {verificationResult["Aadhaar"].reason}
              </p>
            )}
          </div>
        )}

        {renderUploader(
          "PAN Card Upload",
          panFile,
          panPreview,
          panError,
          panInputRef,
          (e) => handleFile(e.target.files?.[0], "pan"),
          handleExtract,
          () => removeFile("pan")
        )}

        {verificationResult["Pan"] && (
          <div className="mt-6 bg-slate-800 p-4 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">
              Pancard Verification Result
            </h3>
            <p>
              Status:{" "}
              <strong>
                {verificationResult["Pan"].valid ? "✅ Valid" : "❌ Invalid"}
              </strong>
            </p>
            <p>
              Risk Score:{" "}
              <strong>{verificationResult["Pan"].fraudScore}%</strong>
            </p>
            <p>
              Risk Level:{" "}
              <strong>{verificationResult["Pan"].riskCategory}</strong>
            </p>
            {verificationResult["Pan"].reason && (
              <p className="text-red-400">
                Reason: {verificationResult["Pan"].reason}
              </p>
            )}
          </div>
        )}

        {(verificationResult["Aadhaar"] || verificationResult["Pan"]) && (
          <div className="mt-8 text-center">
            <button
              onClick={() =>
                navigate("/verify", {
                  state: {
                    verificationResult,
                  },
                })
              }
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-300"
            >
              Go to Verification Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
