import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Menu, X, LogOut, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // State for user auth info
  const [userEmail, setUserEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync auth state from localStorage on mount & route change
  useEffect(() => {
    let token = localStorage.getItem("token");
    let email = localStorage.getItem("email");

    if (email === "undefined" || email === null) {
      email = "";
      localStorage.setItem("email", "");
    }

    setIsLoggedIn(!!token);
    setUserEmail(email);
  }, [location]);

  // Listen for localStorage changes (multi-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      setIsLoggedIn(!!token);
      setUserEmail(email);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
    { name: "Sign In", path: "/login" },
  ];

  const hideAuthButtons = ["/upload", "/results", "/verify"].includes(
    location.pathname
  );

  // ✅ Filter nav items
  const filteredNavItems = navItems.filter((item) => {
    // Hide "Sign In" on home page when logged in
    if (isLoggedIn && item.name === "Sign In" && location.pathname === "/") {
      return false;
    }
    // Hide Sign In/Login on restricted pages
    if (hideAuthButtons && (item.name === "Sign In" || item.name === "Login")) {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserEmail(null);
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
            {filteredNavItems.map((item) => (
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

            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                  <img
                    src={`https://ui-avatars.com/api/?name=${
                      userEmail?.split("@")[0] || "User"
                    }`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline">
                    {userEmail?.split("@")[0] || "User"}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all z-50">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-white"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-red-400"
                  >
                    Logout <LogOut className="inline w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ) : (
              !hideAuthButtons && (
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
              )
            )}
          </div>

          {/* Mobile Menu Button */}
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
            {filteredNavItems.map((item) => (
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
            {!isLoggedIn && !hideAuthButtons && (
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg font-semibold mt-4 shadow-lg shadow-yellow-500/25"
              >
                Get Started
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
