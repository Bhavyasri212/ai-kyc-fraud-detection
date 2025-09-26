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

  return (
    <div className="min-h-screen bg-black p-4">
      <AnimatedBackground />
      <Navbar />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-yellow-300 bg-clip-text text-transparent mb-2">
            My Document Uploads
          </h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-slate-400">
              Manage and track your document verification status
            </p>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        </motion.div>

        {/* Stats Cards */}
        {!loading && uploads.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Documents"
              value={stats.total.toString()}
              icon={FileCheck}
              color="blue"
              delay={0.1}
            />
            <StatCard
              title="Approved"
              value={stats.approved.toString()}
              icon={FileCheck}
              color="green"
              delay={0.2}
            />
            <StatCard
              title="Pending Review"
              value={stats.pending.toString()}
              icon={Clock}
              color="yellow"
              delay={0.3}
            />
            <StatCard
              title="Rejected"
              value={stats.rejected.toString()}
              icon={AlertCircle}
              color="red"
              delay={0.4}
            />
          </div>
        )}

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-8"
        >
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Document List</h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {uploads.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-medium rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Upload New
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <p className="text-slate-400 ml-3">Loading your uploads...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-2">{error}</p>
              <button
                onClick={handleRefresh}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Try again
              </button>
            </motion.div>
          ) : uploads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No documents yet
              </h3>
              <p className="text-slate-400 mb-6">
                Start by uploading your first document for verification
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-medium rounded-lg transition-all"
              >
                Upload Document
              </motion.button>
            </motion.div>
          ) : filteredUploads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No documents found
              </h3>
              <p className="text-slate-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredUploads.map((doc) => (
                  <DocumentCard
                    key={doc._id || doc.id || doc.filename}
                    doc={doc}
                    onDelete={handleDelete}
                    onResubmit={handleResubmit}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 text-sm text-slate-500"
        >
          <p>
            © 2024 SecureKYC. All rights reserved. | Need help?{" "}
            <a href="#" className="text-yellow-400 hover:text-yellow-300">
              Contact Support
            </a>
          </p>
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
