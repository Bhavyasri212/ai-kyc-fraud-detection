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
  const maxSize = 2 * 1024 * 1024; // 5MB for banking documents

  const supportedDocuments = [
    { name: "Aadhaar Card", formats: "JPEG, PNG, PDF" },
    { name: "PAN Card", formats: "JPEG, PNG, PDF" },
    // { name: "Driving License", formats: "JPEG, PNG, PDF" },
    // { name: "Passport", formats: "JPEG, PNG, PDF" },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AnimatedBackground />
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Secure Document Verification
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
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
                    className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-blue-500 bg-blue-50"
                        : file
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {!file ? (
                      <div className="text-center p-6">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          Drop your document here
                        </h3>
                        <p className="text-slate-500 mb-4">
                          or click to browse files
                        </p>
                        <div className="text-sm text-slate-400">
                          Supports: JPEG, PNG, PDF • Max size: 5MB
                        </div>
                      </div>
                    ) : preview === "pdf" ? (
                      <div className="text-center p-6">
                        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          PDF Document Selected
                        </h3>
                        <p className="text-slate-500 text-sm">{file.name}</p>
                        <p className="text-slate-400 text-xs mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={preview}
                          alt="Document Preview"
                          className="w-full h-full object-contain rounded-xl"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          Ready to process
                        </div>
                      </div>
                    )}

                    {file && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile();
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl mb-6"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                {/* Process Button */}
                <motion.button
                  onClick={handleExtract}
                  disabled={!file || processing}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
                    !file || processing
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                  }`}
                  whileTap={{ scale: !file || processing ? 1 : 0.98 }}
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Document...
                    </div>
                  ) : (
                    "Verify Document Securely"
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* Supported Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Supported Documents
                </h3>
                <div className="space-y-3">
                  {supportedDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-slate-700 font-medium">
                        {doc.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {doc.formats}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Security Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Security & Privacy
                </h3>
                <div className="space-y-3">
                  {securityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <feature.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700 text-sm">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600">
                      Your documents are processed securely and deleted
                      immediately after verification.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Processing Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  What We Extract
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Full Name
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Date of Birth
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Document Number
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Address Information
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Fraud Detection
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
