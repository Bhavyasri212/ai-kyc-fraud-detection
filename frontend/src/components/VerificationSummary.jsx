import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4ade80", "#f87171", "#facc15", "#a78bfa", "#38bdf8"];

export default function VerificationSummary({ results }) {
  if (!results || results.length === 0) return null;

  const riskCounts = results.reduce((acc, curr) => {
    const risk = curr.riskLevel || "Unknown";
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(riskCounts).map(([riskLevel, count]) => ({
    riskLevel,
    count,
  }));

  const threshold = 30;
  const verifiedCount = results.filter((r) => r.fraudScore <= threshold).length;
  const unverifiedCount = results.length - verifiedCount;

  const pieData = [
    { name: "Verified", value: verifiedCount },
    { name: "Unverified", value: unverifiedCount },
  ];

  return (
    <div className="bg-slate-900/70 p-8 rounded-3xl shadow-xl mt-12 border border-slate-800 text-white">
      <h2 className="text-2xl font-bold mb-6">Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Risk Levels Bar Chart */}
        <div className="h-72 w-full">
          <h3 className="text-xl font-semibold mb-3">Risk Categories</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="riskLevel" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Verified vs Unverified Pie Chart */}
        <div className="h-72 w-full">
          <h3 className="text-xl font-semibold mb-3">Verified vs Unverified</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
