// src/pages/ResultPage.jsx
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";

export default function ResultPage({ data, onBack }) {
  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <motion.div
        className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-2xl w-[500px] border border-white/30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">
          Extracted KYC Details
        </h1>

        <div className="space-y-4">
          <Detail label="Name" value={data?.name} />
          <Detail label="Date of Birth" value={data?.dob} />
          <Detail label="Gender" value={data?.gender} />
          <Detail label="Aadhaar Number" value={data?.aadhaar} />
          {/* <Detail label="PAN Number" value={data?.panNumber} /> */}
          <Detail label="Address" value={data?.address} />
          {/* Raw text if you also return it */}
          {data?.rawText && (
            <Detail label="Raw OCR Text" value={data.rawText} />
          )}
        </div>

        <motion.button
          onClick={onBack}
          className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition"
          whileTap={{ scale: 0.96 }}
        >
          Back to Upload
        </motion.button>
      </motion.div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <motion.div
      className="flex justify-between items-center bg-white/70 p-3 rounded-lg shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="font-semibold text-indigo-700">{label}:</span>
      <span className="text-gray-800 text-right">{value || "N/A"}</span>
    </motion.div>
  );
}
