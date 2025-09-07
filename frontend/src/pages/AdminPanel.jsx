import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  ShieldX,
  ShieldCheck,
  FileSearch,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const API_BASE = "http://localhost:5000/api";

export default function AdminPanel() {
  const [kycRequests, setKycRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/admin/kyc-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch KYC data");
        return res.json();
      })
      .then((data) => data.map((req) => ({ id: req._id || req.id, ...req })))
      .then(setKycRequests)
      .catch(() => setError("Failed to load KYC requests"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/kyc-requests/${id}/${action}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Action failed");

      setKycRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? { ...req, status: action === "approve" ? "approved" : "rejected" }
            : req
        )
      );
    } catch {
      setError("Failed to update status");
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <AnimatedBackground />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl shadow-2xl mb-6">
            <FileSearch className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3">
            KYC Admin Dashboard
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Monitor and manage identity verification requests securely and in
            real time.
          </p>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center p-4 mb-6 rounded-xl border border-red-500 bg-red-500/10 text-red-300 backdrop-blur-sm shadow-lg"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        {/* KYC Requests Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
          <table className="w-full text-left border-separate border-spacing-y-6">
            <thead className="text-sm text-yellow-300 uppercase bg-yellow-900/10 rounded-t-lg font-semibold">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Documents</th>
                <th className="py-4 px-6">OCR Data</th>
                <th className="py-4 px-6">Fraud Score</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-amber-400">
                    Loading KYC requests...
                  </td>
                </tr>
              ) : kycRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 italic"
                  >
                    No KYC requests found
                  </td>
                </tr>
              ) : (
                kycRequests.map((req, i) => {
                  const fraudScore =
                    req.fraudScore ??
                    req.verificationResult?.Aadhaar?.fraudScore ??
                    req.verificationResult?.Pan?.fraudScore ??
                    null;

                  return (
                    <motion.tr
                      key={req._id || req.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-black/30 backdrop-blur-md rounded-xl border border-slate-800 hover:border-yellow-500/30 transition-all duration-300 shadow-md"
                    >
                      {/* User */}
                      <td className="py-4 px-6 text-yellow-200 font-semibold">
                        {req.userInfo?.fullName ||
                          req.userInfo?.email ||
                          "Unknown"}
                      </td>

                      {/* Documents */}
                      <td className="py-4 px-6 text-sm text-slate-300 italic">
                        No documents available
                      </td>

                      {/* OCR Data */}
                      <td className="py-4 px-6 max-w-sm overflow-x-auto text-xs text-yellow-300 font-mono whitespace-pre-wrap bg-black/40 p-3 rounded-lg border border-yellow-900">
                        {JSON.stringify(req.extractedData || {}, null, 2)}
                      </td>

                      {/* Fraud Score */}
                      <td className="py-4 px-6 font-bold text-lg">
                        {fraudScore !== null ? (
                          <span
                            className={
                              fraudScore > 0.5
                                ? "text-red-400"
                                : "text-green-400"
                            }
                          >
                            {fraudScore}
                          </span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-yellow-400 capitalize font-medium">
                        {req.status}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        {req.status === "pending" ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAction(req._id, "approve")}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-full flex items-center shadow-lg text-sm font-semibold transition-all"
                            >
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(req._id, "reject")}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-full flex items-center shadow-lg text-sm font-semibold transition-all"
                            >
                              <ShieldX className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-400">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            No actions
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
