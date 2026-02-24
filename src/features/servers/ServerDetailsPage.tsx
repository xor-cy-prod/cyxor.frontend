import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const tabs = ["Logs", "AI Logs", "Alerts", "Analytics"] as const;
type TabType = (typeof tabs)[number];

const analyticsData = [
  { time: "00:00", requests: 120 },
  { time: "01:00", requests: 200 },
  { time: "02:00", requests: 150 },
  { time: "03:00", requests: 300 },
  { time: "04:00", requests: 280 },
  { time: "05:00", requests: 200 },
  { time: "06:00", requests: 150 },
  { time: "07:00", requests: 300 },
  { time: "08:00", requests: 280 },
  { time: "09:00", requests: 350 },
  { time: "10:00", requests: 220 },
  { time: "11:00", requests: 200 },
  { time: "12:00", requests: 150 },
  { time: "13:00", requests: 300 },
  { time: "14:00", requests: 280 },
  { time: "15:00", requests: 200 },
  { time: "16:00", requests: 150 },
  { time: "17:00", requests: 300 },
  { time: "18:00", requests: 280 },
  { time: "19:00", requests: 350 },
  { time: "20:00", requests: 120 },
  { time: "21:00", requests: 200 },
  { time: "22:00", requests: 150 },
  { time: "23:00", requests: 300 },
  { time: "24:00", requests: 280 },
];

export default function ServerDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("Logs");

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">
          Server Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Server ID: {id}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        {/* ---------------- LOGS ---------------- */}
        {activeTab === "Logs" && (
          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Live Logs
              </h3>

              <input
                placeholder="Search logs..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-black rounded-xl p-4 text-xs font-mono h-80 overflow-y-auto space-y-2">
              <div className="text-green-400">[INFO] Server started successfully.</div>
              <div className="text-green-400">[INFO] Connected to database.</div>
              <div className="text-yellow-400">[WARNING] Memory usage at 82%.</div>
              <div className="text-red-400">[ERROR] Failed to fetch API response.</div>
              <div className="text-green-400">[INFO] Background job completed.</div>
              <div className="text-green-400">[INFO] Health check passed.</div>
              <div className="text-red-400">[ERROR] Timeout while connecting to Redis.</div>
            </div>
          </div>
        )}

        {/* ---------------- AI LOGS ---------------- */}
        {activeTab === "AI Logs" && (
          <div className="space-y-6">

            <h3 className="text-lg font-semibold text-gray-900">
              AI Processed Logs
            </h3>

            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Anomaly Score
                </span>
                <span className="text-sm font-semibold text-red-600">
                  0.87 (High)
                </span>
              </div>

              <p className="text-sm text-gray-600">
                AI detected unusual traffic spike between 14:00–14:15.
                Pattern resembles abnormal API usage behavior.
              </p>

              <button className="mt-4 text-sm text-blue-600 hover:underline">
                Mark as False Positive
              </button>
            </div>

          </div>
        )}

        {/* ---------------- ALERTS ---------------- */}
        {activeTab === "Alerts" && (
          <div className="space-y-4">

            <h3 className="text-lg font-semibold text-gray-900">
              Active Alerts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Severity</th>
                    <th className="p-3 text-left">Count</th>
                    <th className="p-3 text-left">Last Triggered</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-t">
                    <td className="p-3">RuntimeException</td>
                    <td className="p-3 text-red-600 font-medium">High</td>
                    <td className="p-3">42</td>
                    <td className="p-3">2 mins ago</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">
                        Resolve
                      </button>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Memory Spike</td>
                    <td className="p-3 text-yellow-600 font-medium">Medium</td>
                    <td className="p-3">12</td>
                    <td className="p-3">10 mins ago</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">
                        Resolve
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ---------------- ANALYTICS ---------------- */}
{activeTab === "Analytics" && (
  <div className="space-y-8">

    <h3 className="text-xl font-semibold text-gray-900">
      Log Volume (Last 24 Hours)
    </h3>

    {/* Summary Stats */}
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-gray-50 p-6 rounded-xl border">
        <p className="text-sm text-gray-500">Total Logs</p>
        <p className="text-2xl font-semibold mt-2">15,842</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border">
        <p className="text-sm text-gray-500">Peak Hour</p>
        <p className="text-2xl font-semibold mt-2">18:00</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border">
        <p className="text-sm text-gray-500">Avg / Hour</p>
        <p className="text-2xl font-semibold mt-2">660</p>
      </div>
    </div>

    {/* Big Bar Chart */}
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={analyticsData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="requests"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
)}

      </div>
    </div>
  );
}