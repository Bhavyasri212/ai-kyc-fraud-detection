import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Upload,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api.js";

export default function DocumentCard({ doc, onDelete, onResubmit }) {
  const [showActions, setShowActions] = useState(false);
  const [showReviewNotes, setShowReviewNotes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // Delete document handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    const docId = doc.id || doc._id;

    if (!docId) {
      alert("Document ID is missing!");
      console.error("Document ID is missing:", doc);
      return;
    }

    setIsDeleting(true);
    try {
      await api.deleteDocument(docId);
      onDelete(docId);
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open file picker for resubmission
  const handleResubmit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset input to allow re-upload same file
      fileInputRef.current.click();
    }
  };

  // Handle file selection for resubmission
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload only PDF, JPEG, or PNG files.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    setIsResubmitting(true);
    try {
      await onResubmit(doc.id || doc._id, file);
    } catch (error) {
      console.error("Failed to resubmit document:", error);
      alert("Failed to resubmit document. Please try again.");
    } finally {
      setIsResubmitting(false);
    }
  };

  // Preview document in new tab
  const handlePreview = async () => {
    try {
      const previewUrl = await api.previewDocument(doc.id || doc._id);
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to preview document:", error);
      alert("Failed to preview document. Please try again.");
    }
  };

  // Download document handler
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await api.downloadDocument(doc.id || doc._id);
    } catch (error) {
      console.error("Failed to download document:", error);
      alert("Failed to download document. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Status config for colors and icons

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          icon: CheckCircle,
          bgColor: "bg-green-600/30",
          textColor: "text-green-400",
          borderColor: "border-green-500/30",
        };
      case "rejected":
        return {
          icon: XCircle,
          bgColor: "bg-red-600/30",
          textColor: "text-red-400",
          borderColor: "border-red-500/30",
        };
      default:
        return {
          icon: Clock,
          bgColor: "bg-yellow-600/30",
          textColor: "text-yellow-300",
          borderColor: "border-yellow-500/30",
        };
    }
  };
  const status =
    doc.status ||
    (doc.verificationResult && doc.verificationResult[0]?.status) ||
    "pending";
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className={`relative bg-slate-800/40 rounded-xl p-4 border transition-all duration-300 hover:bg-slate-800/60 ${statusConfig.borderColor}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-white font-medium mb-1">
            <FileText className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="truncate">{doc.filename}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>
              Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
            </span>
            <span>{doc.fileType}</span>
            <span>{formatFileSize(doc.fileSize)}</span>
          </div>

          {doc.reviewNotes && (
            <motion.button
              onClick={() => setShowReviewNotes(!showReviewNotes)}
              className="flex items-center gap-1 text-red-400 text-xs mt-2 hover:text-red-300 transition-colors"
              aria-expanded={showReviewNotes}
              aria-controls={`review-notes-${doc.id || doc._id}`}
            >
              <AlertTriangle className="w-3 h-3" />
              {showReviewNotes ? "Hide" : "Show"} review notes
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePreview}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Preview Document"
                  aria-label="Preview Document"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                  title="Download Document"
                  aria-label="Download Document"
                >
                  <Download
                    className={`w-4 h-4 ${
                      isDownloading ? "animate-bounce" : ""
                    }`}
                  />
                </motion.button>

                {doc.status === "rejected" && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleResubmit}
                    disabled={isResubmitting}
                    className="p-2 rounded-lg bg-blue-600/50 hover:bg-blue-600 text-blue-300 hover:text-white transition-all disabled:opacity-50"
                    title="Resubmit Document"
                    aria-label="Resubmit Document"
                  >
                    <Upload
                      className={`w-4 h-4 ${
                        isResubmitting ? "animate-pulse" : ""
                      }`}
                    />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 rounded-lg bg-red-600/50 hover:bg-red-600 text-red-300 hover:text-white transition-all disabled:opacity-50"
                  title="Delete Document"
                  aria-label="Delete Document"
                >
                  <Trash2
                    className={`w-4 h-4 ${isDeleting ? "animate-pulse" : ""}`}
                  />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.textColor}`}
            aria-label={`Status: ${status}`}
          >
            <StatusIcon className="w-4 h-4" />
            <span className="capitalize">{status}</span>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {showReviewNotes && doc.reviewNotes && (
          <motion.div
            id={`review-notes-${doc.id || doc._id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30"
          >
            <p className="text-red-300 text-sm">{doc.reviewNotes}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for resubmission */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
      />

      {/* Loading overlay for resubmitting or deleting */}
      {(isResubmitting || isDeleting) && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-white">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">
              {isResubmitting ? "Resubmitting..." : "Deleting..."}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
