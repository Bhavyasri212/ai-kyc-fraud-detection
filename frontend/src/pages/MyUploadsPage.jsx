import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileCheck,
  AlertCircle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";

import AnimatedBackground from "../components/AnimatedBackground";
import DocumentCard from "../components/DocumentCard";
import StatCard from "../components/StatCard";
import UploadModal from "../components/UploadModal";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function MyUploadsPage() {
  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDocs = async () => {
    try {
      setError(null);
      const docs = await api.getUserDocs();
      setUploads(docs);
      setFilteredUploads(docs);
    } catch (err) {
      setError("Failed to load uploads.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    let filtered = uploads;

    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    setFilteredUploads(filtered);
  }, [uploads, searchTerm, statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDocs();
  };

  const handleDelete = (id) => {
    setUploads((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleResubmit = async (id, file) => {
    try {
      const updatedDoc = await api.resubmitDocument(id, file);
      setUploads((prev) =>
        prev.map((doc) => (doc.id === id ? updatedDoc : doc))
      );
    } catch (error) {
      console.error("Failed to resubmit document:", error);
      throw error;
    }
  };

  const handleUpload = async (file) => {
    try {
      const newDoc = await api.uploadDocument(file);
      setUploads((prev) => [newDoc, ...prev]);
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error;
    }
  };

  const stats = {
    total: uploads.length,
    approved: uploads.filter((doc) => doc.status === "approved").length,
    pending: uploads.filter((doc) => doc.status === "pending").length,
    rejected: uploads.filter((doc) => doc.status === "rejected").length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black">
      <AnimatedBackground />
      <Navbar />
      <div className="h-24" />
      <div className="w-full max-w-7xl mx-auto relative z-10 px-6 py-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <p className="text-slate-300 text-lg font-medium tracking-wide">
              Manage and track your document verification journey
            </p>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        {!loading && uploads.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Documents"
                value={stats.total.toString()}
                icon={FileCheck}
                color="blue"
                delay={0.1}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Approved"
                value={stats.approved.toString()}
                icon={FileCheck}
                color="green"
                delay={0.2}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Pending Review"
                value={stats.pending.toString()}
                icon={Clock}
                color="yellow"
                delay={0.3}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Rejected"
                value={stats.rejected.toString()}
                icon={AlertCircle}
                color="red"
                delay={0.4}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-yellow-600/20 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity blur-lg"></div>

          <div className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none"></div>

            <div className="relative p-8">
              {/* Enhanced Card Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Document Management
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Track and manage your verification process
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                  {uploads.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      {/* Enhanced Search */}
                      <motion.div
                        className="relative group/search"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-hover/search:text-yellow-400 transition-colors z-10" />
                        <input
                          type="text"
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full sm:w-72 pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 backdrop-blur-sm transition-all duration-300 font-medium"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-600/10 to-orange-600/10 opacity-0 group-hover/search:opacity-100 transition-opacity pointer-events-none"></div>
                      </motion.div>

                      {/* Enhanced Filter */}
                      <motion.div
                        className="relative group/filter"
                        whileHover={{ scale: 1.02 }}
                      >
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 backdrop-blur-sm transition-all cursor-pointer font-medium"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-hover/filter:text-yellow-400 transition-colors pointer-events-none" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-600/10 to-orange-600/10 opacity-0 group-hover/filter:opacity-100 transition-opacity pointer-events-none"></div>
                      </motion.div>
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="group flex items-center gap-2 px-5 py-3.5 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600/30 hover:border-slate-500/50 backdrop-blur-sm disabled:opacity-50 font-medium"
                    >
                      <RefreshCw
                        className={`w-4 h-4 transition-all ${
                          refreshing ? "animate-spin" : "group-hover:rotate-180"
                        }`}
                      />
                      <span className="hidden sm:inline">Refresh</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUploadModal(true)}
                      className="group relative flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-yellow-500/25 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Plus className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform" />
                      <span className="relative z-10">Upload New</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Enhanced Content */}
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-yellow-400/30"></div>
                  </div>
                  <p className="text-slate-300 text-lg font-medium">
                    Loading your documents...
                  </p>
                  <div className="mt-4 w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="relative mb-8">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
                    <div className="absolute inset-0 animate-pulse rounded-full bg-red-400/20 blur-xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Something went wrong
                  </h3>
                  <p className="text-red-400 text-lg mb-8 max-w-md mx-auto">
                    {error}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl transition-all shadow-lg"
                  >
                    Try Again
                  </motion.button>
                </motion.div>
              ) : uploads.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="relative mb-10">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center border border-yellow-500/30">
                      <FileCheck className="w-12 h-12 text-slate-400" />
                    </div>
                    <div className="absolute inset-0 animate-pulse rounded-3xl bg-yellow-400/10 blur-xl"></div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Ready to get started?
                  </h3>
                  <p className="text-slate-300 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                    Upload your first document and begin the verification
                    process. We support PDF, JPEG, and PNG files up to 10MB.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadModal(true)}
                    className="group relative px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-yellow-500/25 overflow-hidden text-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      Upload Your First Document
                    </span>
                  </motion.button>
                </motion.div>
              ) : filteredUploads.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="relative mb-8">
                    <Search className="w-16 h-16 text-slate-500 mx-auto" />
                    <div className="absolute inset-0 animate-pulse rounded-full bg-slate-400/10 blur-xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No documents found
                  </h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                    Try adjusting your search terms or filter criteria to find
                    what you're looking for.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Clear All Filters
                  </motion.button>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-400 font-medium">
                      Showing {filteredUploads.length} of {uploads.length}{" "}
                      documents
                    </p>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {filteredUploads.map((doc, index) => (
                      <motion.div
                        key={doc._id || doc.id || doc.filename}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <DocumentCard
                          doc={doc}
                          onDelete={handleDelete}
                          onResubmit={handleResubmit}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-6 text-sm text-slate-500 bg-slate-900/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-slate-800">
            <span className="font-medium">
              © 2024 SecureKYC. All rights reserved.
            </span>
            <span className="w-px h-4 bg-slate-700"></span>
            <a
              href="#"
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
