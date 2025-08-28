import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Menu, X, User, LogOut, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
    { name: "Sign In", path: "/login" },
  ];

  const hideAuthButtons = ["/upload", "/results"].includes(location.pathname);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-2xl border-b border-gray-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer group"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-yellow-500/25">
              <Shield className="w-6 h-6 text-white" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl opacity-0 group-hover:opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                SecureKYC
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400 ml-2 opacity-80" />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems
              .filter(
                (item) =>
                  !(
                    hideAuthButtons &&
                    (item.name === "Sign In" || item.name === "Login")
                  )
              )
              .map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? "text-yellow-400 bg-yellow-400/10"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-lg border border-yellow-400/30"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}

            {!hideAuthButtons && (
              <motion.button
                onClick={() => navigate("/signup")}
                className="relative px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg font-semibold overflow-hidden group shadow-lg shadow-yellow-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden border-t border-gray-700/50"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "text-yellow-400 bg-yellow-400/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                navigate("/signup");
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg font-semibold mt-4 shadow-lg shadow-yellow-500/25"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
