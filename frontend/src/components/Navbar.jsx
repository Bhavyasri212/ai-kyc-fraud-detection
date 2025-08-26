import { useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show login button only on home page "/"
  const showLogin = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* App Name */}
        <motion.div
          className="text-4xl font-bold text-indigo-700 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate("/")}
        >
          AI-KYC
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <Link
            to="home"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            Home
          </Link>
          <Link
            to="features"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            Features
          </Link>
          <Link
            to="how-it-works"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            How It Works
          </Link>

          {/* Desktop Login Button (only on home page) */}
          {showLogin && (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md">
          <div className="flex flex-col space-y-4 px-6 py-4 text-gray-700 font-medium">
            <Link
              to="home"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="features"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              to="how-it-works"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600 transition"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
          </div>

          {/* Mobile Login Button (only on home page) */}
          {showLogin && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
              className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
