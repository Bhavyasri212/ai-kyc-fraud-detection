import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  Lock,
  Award,
  Users,
  TrendingUp,
  FileCheck,
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description:
        "Enterprise-level encryption and compliance with financial industry standards including PCI DSS and ISO 27001.",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description:
        "Advanced OCR technology processes documents in under 3 seconds with 99.7% accuracy rate.",
      color: "from-emerald-600 to-emerald-700",
    },
    {
      icon: Award,
      title: "Regulatory Compliance",
      description:
        "Fully compliant with KYC, AML, and GDPR regulations. Trusted by 500+ financial institutions.",
      color: "from-purple-600 to-purple-700",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Secure Document Upload",
      description:
        "Upload your identity documents through our encrypted, HTTPS-secured platform with end-to-end encryption.",
      icon: FileCheck,
    },
    {
      step: "02",
      title: "AI-Powered Analysis",
      description:
        "Our advanced AI engine extracts and validates information while detecting fraudulent documents in real-time.",
      icon: Zap,
    },
    {
      step: "03",
      title: "Instant Verification",
      description:
        "Receive immediate verification results with detailed compliance reports and secure data storage.",
      icon: CheckCircle,
    },
  ];

  const stats = [
    { number: "99.7%", label: "Accuracy Rate" },
    { number: "500+", label: "Banks Trust Us" },
    { number: "2.5M+", label: "Verifications" },
    { number: "<3s", label: "Processing Time" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Trusted by 500+ Financial Institutions
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                Enterprise-Grade
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Identity Verification
                </span>
              </h1>

              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Secure, compliant, and intelligent KYC verification platform
                designed for financial institutions. Advanced fraud detection
                with{" "}
                <span className="font-semibold text-blue-600">
                  99.7% accuracy
                </span>{" "}
                and instant processing.
              </p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Verification
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold text-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200">
                View Demo
              </button>
            </motion.div>

            {/* Security Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center items-center space-x-8 mt-12 text-sm text-slate-500"
            >
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                ISO 27001 Certified
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                PCI DSS Compliant
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                GDPR Ready
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Financial Institutions Choose Us
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built specifically for banks, credit unions, and financial
              services with enterprise-grade security and compliance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-8 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Secure Verification Process
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our streamlined process ensures maximum security while maintaining
              user experience excellence.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 transform -translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Secure Your KYC Process?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join hundreds of financial institutions that trust our platform
              for secure, compliant identity verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-50 transition-all duration-200 flex items-center group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-200">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">SecureKYC</h3>
              <p className="text-sm leading-relaxed">
                Enterprise-grade identity verification platform trusted by
                financial institutions worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li>KYC Verification</li>
                <li>AML Compliance</li>
                <li>Document Authentication</li>
                <li>Fraud Detection</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Security</li>
                <li>Compliance</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>GDPR</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} SecureKYC. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm">
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                SOC 2 Certified
              </span>
              <span className="flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                256-bit Encryption
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
