import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { Shield, Zap, CheckCircle, Lock } from "lucide-react";

export default function LoadingPage() {
  const processingSteps = [
    { icon: Shield, text: "Securing document", delay: 0 },
    { icon: Zap, text: "Extracting information", delay: 0.5 },
    { icon: CheckCircle, text: "Validating authenticity", delay: 1 },
    { icon: Lock, text: "Finalizing verification", delay: 1.5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12 max-w-md w-full text-center"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Processing Document
          </h2>
          <p className="text-slate-600">
            Securely analyzing your document with AI
          </p>
        </div>

        {/* Processing Animation */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 border-4 border-blue-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner ring */}
            <motion.div
              className="absolute inset-2 border-4 border-indigo-500 border-t-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {processingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: step.delay }}
              className="flex items-center justify-center text-sm text-slate-600"
            >
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <step.icon className="w-3 h-3 text-blue-600" />
              </div>
              <span>{step.text}</span>
              <motion.div
                className="ml-2 flex space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: step.delay + 0.2 }}
              >
                {[0, 0.1, 0.2].map((dotDelay, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-blue-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: dotDelay,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center justify-center text-sm text-blue-800">
            <Lock className="w-4 h-4 mr-2" />
            <span>Your data is encrypted and secure</span>
          </div>
        </motion.div>

        {/* Estimated time */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="mt-4 text-xs text-slate-500"
        >
          Estimated time: 2-5 seconds
        </motion.p>
      </motion.div>
    </div>
  );
}
