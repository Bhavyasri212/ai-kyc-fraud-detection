import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  const maxSize = 2 * 1024 * 1024; // 2MB for banking documents

  const supportedDocuments = [
    { name: "Aadhaar Card", formats: "JPEG, PNG, PDF" },
    { name: "PAN Card", formats: "JPEG, PNG, PDF" },
  ];

  const securityFeatures = [
    { icon: Shield, text: "256-bit encryption" },
    { icon: Lock, text: "Secure processing" },
    { icon: Eye, text: "No data retention" },
    { icon: Clock, text: "Real-time verification" },
  ];

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

  const applyFile = (f) => {
    const vErr = validateFile(f);
    if (vErr) {
      setError(vErr);
      setFile(null);
      setPreview(null);
      return;
    }
    setError("");
    setFile(f);
    setPreview(makePreview(f));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) applyFile(selected);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) applyFile(dropped);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    setProcessing(true);
    navigate("/loading");

    try {
      const data = await api.uploadDocument(file);
      onExtract?.(data);
      navigate("/results");
    } catch (err) {
      console.error(err);
      setError("Failed to process document. Please try again.");
      navigate("/upload");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AnimatedBackground />
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-3xl mb-6 shadow-2xl shadow-yellow-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Shield className="w-10 h-10 text-black" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Secure Document Verification
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Upload your identity documents for instant, secure verification
              using our advanced AI technology.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-amber-400/5 rounded-3xl" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Upload Document
                  </h2>

                  {/* Hidden Input */}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="document-upload"
                  />

                  {/* Upload Area */}
                  <div className="mb-6">
                    <label
                      htmlFor="document-upload"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 group ${
                        dragOver
                          ? "border-yellow-500 bg-yellow-500/10"
                          : file
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-slate-700 bg-slate-800/30 hover:border-yellow-500/50 hover:bg-yellow-500/5"
                      }`}
                    >
                      {!file ? (
                        <div className="text-center p-8">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Upload className="w-16 h-16 text-slate-500 group-hover:text-yellow-400 mx-auto mb-6 transition-colors" />
                          </motion.div>
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
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FileText className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                          </motion.div>
                          <h3 className="text-xl font-semibold text-white mb-3">
                            PDF Document Selected
                          </h3>
                          <p className="text-slate-400 text-sm">{file.name}</p>
                          <p className="text-slate-500 text-xs mt-2">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="inline-flex items-center px-3 py-1 bg-amber-500/20 rounded-lg text-xs font-medium text-amber-300 mt-4">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready to process
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={preview}
                            alt="Document Preview"
                            className="w-full h-full object-contain rounded-2xl"
                          />
                          <div className="absolute top-4 left-4 inline-flex items-center px-3 py-1 bg-amber-500 text-black rounded-lg text-xs font-bold shadow-lg">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready to process
                          </div>
                        </div>
                      )}

                      {file && (
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile();
                          }}
                          className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          whileHover={{ rotate: 90 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      )}

                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-600/10 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center p-4 bg-red-500/10 border border-red-500/30 rounded-2xl mb-6 backdrop-blur-sm"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <p className="text-sm text-red-300">{error}</p>
                    </motion.div>
                  )}

                  {/* Process Button */}
                  <motion.button
                    onClick={handleExtract}
                    disabled={!file || processing}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 relative overflow-hidden group ${
                      !file || processing
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-600 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-400 shadow-yellow-500/25"
                    }`}
                    whileHover={
                      !file || processing ? {} : { scale: 1.02, y: -2 }
                    }
                    whileTap={!file || processing ? {} : { scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3" />
                          Processing Document...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-3" />
                          Verify Document Securely
                        </>
                      )}
                    </span>
                    {!processing && file && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-2xl"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-amber-400/5 rounded-3xl" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Upload Guidelines
                  </h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
                    <li>Document must be fully visible.</li>
                    <li>No glare or shadows.</li>
                    <li>Use original, clear documents.</li>
                    <li>One document per upload.</li>
                    <li>Valid and unexpired documents only.</li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* Supported Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-amber-400/5 rounded-3xl" />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Supported Documents
                  </h3>
                  <div className="space-y-4">
                    {supportedDocuments.map((doc, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-white font-medium">
                          {doc.name}
                        </span>
                        <span className="text-xs text-yellow-400 font-medium">
                          {doc.formats}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Security Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-yellow-500/20 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-amber-400/10 rounded-3xl blur-xl" />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Security & Privacy
                  </h3>
                  <div className="space-y-4">
                    {securityFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl flex items-center justify-center mr-3 border border-yellow-500/30">
                          <feature.icon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-slate-300 text-sm font-medium">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300">
                        Your documents are processed securely and deleted
                        immediately after verification.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Processing Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-amber-400/5 rounded-3xl" />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    What We Extract
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {[
                      "Full Name",
                      "Date of Birth",
                      "Document Number",
                      "Address Information",
                      "Fraud Detection",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center hover:text-white transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <CheckCircle className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
