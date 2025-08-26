import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar";

export default function UploadPage({ onExtract }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  const makePreview = (f) => {
    if (!f) return null;
    if (f.type === "application/pdf") return "pdf"; // show a PDF badge
    return URL.createObjectURL(f); // image preview
  };

  const validateFile = (f) => {
    if (!f) return "No file selected.";
    if (!allowedTypes.includes(f.type))
      return "Only JPEG, PNG, or PDF allowed.";
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

  // Drag & Drop
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

  const handleExtract = async () => {
    if (!file) return;
    navigate("/loading");
    try {
      const data = await api.uploadDocument(file);
      // pass structured fields to ResultPage via onExtract
      onExtract?.(data);
      navigate("/results");
    } catch (err) {
      console.error(err);
      setError("Failed to process document. Please try again.");
      navigate("/upload");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen">
      <AnimatedBackground />
      <Navbar />

      <motion.div
        className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-2xl w-[420px] border border-white/30"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">
          Aadhaar KYC Verification
        </h1>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="kyc-upload"
        />

        {/* Dropzone + Click-to-select (UI unchanged in spirit) */}
        <label
          htmlFor="kyc-upload"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex items-center justify-center cursor-pointer border-2 border-dashed rounded-xl transition bg-white/70 aspect-[4/3] overflow-hidden
            ${
              dragOver
                ? "border-indigo-600"
                : "border-indigo-400 hover:border-indigo-600"
            }
          `}
          title="Click or drag & drop Aadhaar"
        >
          {!preview ? (
            <div className="flex flex-col items-center text-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-600 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5.001 5.001 0 0115.9 6.1a5 5 0 015.1 4.9A4.002 4.002 0 0117 16H7z"
                />
              </svg>
              <span className="text-indigo-700 font-medium">
                Click or Drag & Drop Aadhaar (JPEG/PNG/PDF)
              </span>
              <span className="text-xs text-gray-600 mt-1">Max size: 2MB</span>
            </div>
          ) : preview === "pdf" ? (
            <div className="flex flex-col items-center justify-center">
              <div className="px-3 py-1 rounded bg-indigo-600 text-white text-sm shadow">
                PDF selected
              </div>
            </div>
          ) : (
            <motion.img
              src={preview}
              alt="Document Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            />
          )}
        </label>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <motion.button
          onClick={handleExtract}
          disabled={!file}
          className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-40"
          whileTap={{ scale: 0.96 }}
        >
          Extract KYC Details
        </motion.button>
      </motion.div>
    </div>
  );
}
