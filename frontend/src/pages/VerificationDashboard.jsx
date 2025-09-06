import React from "react";
import { useLocation } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Shield,
  BadgeAlert,
  FileText,
} from "lucide-react";
import "chart.js/auto";

import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";

export default function VerificationDashboard() {
  const { state } = useLocation();
  const verificationResult = state?.verificationResult || {};

  const aadhaarResult = verificationResult?.Aadhaar;
  const panResult = verificationResult?.Pan;

  // Helper to generate chart data dynamically
  const createBarData = (score) => ({
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [
      {
        label: "Fraud Risk Score",
        data: [
          score <= 30 ? score : 0,
          score > 30 && score <= 70 ? score : 0,
          score > 70 ? score : 0,
        ],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
      },
    ],
  });

  const createPieData = (isValid) => ({
    labels: ["Verified", "Unverified"],
    datasets: [
      {
        label: "Document Status",
        data: isValid ? [1, 0] : [0, 1],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  });

  const renderResultCard = (label, result) => {
    if (!result) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-8 text-white mb-10"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <FileText className="w-6 h-6 text-amber-400" />
          {label} Verification
        </h2>

        <div className="space-y-3 text-lg">
          <p>
            <strong>Status:</strong>{" "}
            {result.valid ? (
              <span className="text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Valid Document
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Invalid Document
              </span>
            )}
          </p>

          <p>
            <strong>Risk Score:</strong>{" "}
            <span
              className={`font-bold ${
                result.fraudScore > 70
                  ? "text-red-400"
                  : result.fraudScore > 30
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {result.fraudScore ?? "--"}%
            </span>
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            <span className="text-white">{result.riskCategory}</span>
          </p>

          {result.reason && (
            <p className="text-red-400">
              <BadgeAlert className="w-5 h-5 inline-block mr-2" />
              Reason: {result.reason}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Fraud Risk Score</h3>
            <Bar data={createBarData(result.fraudScore)} />
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Document Validity</h3>
            <Pie data={createPieData(result.valid)} />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      <Navbar />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
          <Shield className="w-7 h-7 text-amber-400" />
          Verification Dashboard
        </h1>

        {renderResultCard("Aadhaar", aadhaarResult)}
        {renderResultCard("Pan", panResult)}

        {!aadhaarResult && !panResult && (
          <div className="text-center text-white text-lg">
            No verification data available.
          </div>
        )}
      </div>
    </div>
  );
}
