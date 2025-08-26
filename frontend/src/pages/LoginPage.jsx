import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import api from "../services/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.login(form.email, form.password);
      navigate("/upload");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="backdrop-blur-xl bg-white/40 border border-white/30 p-10 rounded-3xl shadow-2xl w-[400px]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Branding */}
        <h1 className="text-center text-3xl font-extrabold text-indigo-700 mb-6">
          AI-KYC
        </h1>

        {/* Login Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-indigo-600 cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              }`}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Signup Redirect */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
