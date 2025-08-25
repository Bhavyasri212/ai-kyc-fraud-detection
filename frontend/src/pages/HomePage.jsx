import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-2xl w-[600px] border border-white/30 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">
          AI-Powered Identity Verification
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Fraud detection for KYC compliance using advanced OCR & AI models.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            onClick={() => navigate("/upload")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition"
            whileTap={{ scale: 0.96 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
