import React, { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { uploadDocument } from "../controllers/ocrController";

export default function UploadPage({ onExtract }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    try {
      const data = await uploadDocument(file); // 🔹 use controller
      if (data.success) {
        onExtract(data.data); // structured Aadhaar fields → ResultPage
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while processing.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen">
      <AnimatedBackground />

      <motion.div
        className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-2xl w-[420px] border border-white/30"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">
          Aadhaar KYC Verification
        </h1>

        {/* Upload Container with Preview */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="aadhaar-upload"
        />

        <label
          htmlFor="aadhaar-upload"
          className="flex items-center justify-center cursor-pointer border-2 border-dashed border-indigo-400 rounded-xl hover:border-indigo-600 transition bg-white/70 aspect-[4/3] overflow-hidden"
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
                Click or Drag & Drop Aadhaar
              </span>
            </div>
          ) : (
            <motion.img
              src={preview}
              alt="Aadhaar Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            />
          )}
        </label>

        {/* Extract Button */}
        <motion.button
          onClick={handleExtract}
          disabled={!file}
          className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-40"
          whileTap={{ scale: 0.96 }}
        >
          Extract Aadhaar Details
        </motion.button>
      </motion.div>
    </div>
  );
}
