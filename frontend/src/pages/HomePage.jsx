import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-screen overflow-hidden text-gray-800">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6"
      >
        <motion.div
          className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-2xl max-w-4xl border border-white/30"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-extrabold text-indigo-900 leading-tight mb-6">
            AI-Powered <br /> Identity Verification
          </h1>
          <p className="text-gray-700 text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
            Secure, fast, and intelligent fraud detection for{" "}
            <span className="font-semibold text-indigo-700">
              KYC compliance
            </span>{" "}
            using advanced OCR & AI-driven validation.
          </p>

          <motion.button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition"
            whileTap={{ scale: 0.96 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-white/80 to-indigo-50 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-indigo-900 mb-14">
            Why Choose Our KYC Verification?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "OCR-Powered",
                desc: "Extracts Aadhaar, PAN, and Driving License details instantly with high accuracy.",
              },
              {
                title: "Fraud Detection",
                desc: "Detects tampered or fake documents using AI-driven validation rules.",
              },
              {
                title: "Seamless Integration",
                desc: "RESTful APIs for frontend and backend make deployment easy and scalable.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-lg border hover:shadow-2xl transition transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 ">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-indigo-900 mb-14">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              {
                step: "1",
                title: "Upload Document",
                desc: "Drag & drop Aadhaar, PAN, or Driving License images securely.",
              },
              {
                step: "2",
                title: "AI OCR Extraction",
                desc: "Our engine extracts Name, DOB, Aadhaar/PAN numbers, and Address instantly.",
              },
              {
                step: "3",
                title: "Verify & Save",
                desc: "Review extracted data and store it securely in our database.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-10 bg-indigo-50 rounded-2xl shadow-md border hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-indigo-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-b from-white/80 to-indigo-50 backdrop-blur-md text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-indigo-900 mb-6">
            Ready to Experience AI-Powered Verification?
          </h2>
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
            Join us today and streamline your KYC process with advanced fraud
            detection.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <motion.button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition"
              whileTap={{ scale: 0.96 }}
            >
              Get Started now{" "}
              <ArrowRight className="inline-block ml-2" size={20} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-white text-indigo-900 text-sm">
        © {new Date().getFullYear()} AI-KYC | Secure Identity Verification
      </footer>
    </div>
  );
}
