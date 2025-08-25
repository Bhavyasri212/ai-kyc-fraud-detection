import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

export default function LoadingPage() {
  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-2xl border border-white/30 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">
          Extracting Aadhaar Details...
        </h2>

        {/* Loader Animation */}
        <div className="flex space-x-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.span
              key={i}
              className="w-4 h-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
