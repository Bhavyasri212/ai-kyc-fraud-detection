import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

import {
  CheckCircle,
  AlertTriangle,
  Shield,
  Download,
  FileText,
  Calendar,
  MapPin,
  User,
  Hash,
  Clock,
  ArrowLeft,
} from "lucide-react";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function handleDownload() {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Verification Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Name: ${verificationData.name}`, 20, 40);
  doc.text(`Date of Birth: ${verificationData.dob}`, 20, 50);
  doc.text(`Gender: ${verificationData.gender}`, 20, 60);
  doc.text(`Aadhaar Number: ${verificationData.aadhaar}`, 20, 70);
  doc.text(`Address: ${verificationData.address}`, 20, 80);
  doc.text(`Document Type: ${verificationData.documentType}`, 20, 90);
  doc.text(`Confidence Score: ${verificationData.confidence}%`, 20, 100);
  doc.text(`Fraud Risk: ${verificationData.fraudScore}%`, 20, 110);
  doc.text(`Status: ${capitalize(verificationData.status)}`, 20, 120);
  doc.text(
    `Processed At: ${new Date(verificationData.processedAt).toLocaleString()}`,
    20,
    130
  );

  doc.save("verification_report.pdf");
}
export default function ResultPage({ data, onBack }) {
  const navigate = useNavigate();

  // Use provided data or fallback mock
  const verificationData = data || {
    name: "Rajesh Kumar Sharma",
    dob: "15/08/1985",
    gender: "Male",
    aadhaar: "123456789012",
    pan: "N/A",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    confidence: 98.5,
    fraudScore: 2.1,
    status: "verified",
    processedAt: new Date().toISOString(),
    rawText: "Sample OCR extracted text from the document...",
  };

  const isAadhaar =
    verificationData?.aadhaar && verificationData.aadhaar !== "N/A";
  const isPan = verificationData?.pan && verificationData.pan !== "N/A";

  const documentType = isAadhaar
    ? "Aadhaar Card"
    : isPan
    ? "PAN Card"
    : "Unknown";

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return CheckCircle;
      case "pending":
        return Clock;
      case "rejected":
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const StatusIcon = getStatusIcon(verificationData.status);

  // Detail items with icons and labels
  const detailItems = [
    { icon: User, label: "Full Name", value: verificationData.name },
    { icon: Calendar, label: "Date of Birth", value: verificationData.dob },
    {
      icon: Hash,
      label: isAadhaar ? "Aadhaar Number" : "PAN Number",
      value: isAadhaar ? verificationData.aadhaar : verificationData.pan,
    },
    ...(isAadhaar
      ? [
          { icon: User, label: "Gender", value: verificationData.gender },
          { icon: MapPin, label: "Address", value: verificationData.address },
        ]
      : []),
  ];

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
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Verification Complete
            </h1>
            <p className="text-xl text-slate-600">
              Document processed successfully with high confidence
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Verification Status
                  </h2>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      verificationData.status
                    )}`}
                  >
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {capitalize(verificationData.status)}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {verificationData.confidence}%
                    </div>
                    <div className="text-sm text-green-700 font-medium">
                      Confidence Score
                    </div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {verificationData.fraudScore}%
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                      Fraud Risk
                    </div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {documentType}
                    </div>
                    <div className="text-sm text-purple-700 font-medium">
                      Document Type
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Extracted Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Extracted Information
                </h2>

                <div className="space-y-4">
                  {detailItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <item.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {item.label}
                          </div>
                          <div className="text-sm text-slate-600">
                            Extracted from document
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">
                          {item.value || "N/A"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => (onBack ? onBack() : navigate("/upload"))}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Process Another Document
                </button>

                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Report
                </button>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Security & Compliance
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm text-slate-700">
                      End-to-end encrypted
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm text-slate-700">
                      GDPR compliant
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm text-slate-700">
                      Data anonymization
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
