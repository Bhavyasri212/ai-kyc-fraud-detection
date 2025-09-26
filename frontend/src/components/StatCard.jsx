import React from "react";
import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
}) {
  const colorClasses = {
    green:
      "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
    yellow:
      "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400",
    red: "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-4 border backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-300 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <Icon className="w-8 h-8" />
      </div>
    </motion.div>
  );
}
