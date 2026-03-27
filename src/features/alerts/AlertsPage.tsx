import { useState } from "react";

interface Alert {
  id: string;
  title: string;
  description: string;
  server: string;
  severity: "High" | "Critical" | "Warning";
  status: "active" | "resolved";
  createdAt: string;
  resolvedAt?: string;
}

const mockAlerts: Alert[] = [
  {
    id: "A109",
    title: "AI Detected Anomaly: Process Memory",
    description: "OOM Killed: Process exceeded memory limit matching known fatal patterns.",
    server: "Worker Node 3",
    severity: "Critical",
    status: "active",
    createdAt: "2026-03-27 10:24:00"
  },
  {
    id: "A110",
    title: "AI Detected Anomaly: High Latency",
    description: "Timeout waiting for query lock! High latency.",
    server: "Prod DB Server",
    severity: "High",
    status: "active",
    createdAt: "2026-03-27 10:21:00"
  },
  {
    id: "A111",
    title: "Sustained CPU Spike",
    description: "Server CPU has been pinned at 99% for over 5 minutes.",
    server: "Image Processing Pod",
    severity: "High",
    status: "resolved",
    createdAt: "2026-03-27 08:12:00",
    resolvedAt: "2026-03-27 08:45:00"
  }
];

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "resolved">("active");
  const filteredAlerts = mockAlerts.filter(a => a.status === activeTab);

  return (
    <div className="p-8 max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold flex items-center gap-3">
          Alerts Manager
        </h2>
        <p className="text-sm text-slate-400 mt-1">Review AI-detected anomalies and critical system faults.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-px">
        <button 
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "active" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
        >
          Active ({mockAlerts.filter(a => a.status === "active").length})
        </button>
        <button 
           onClick={() => setActiveTab("resolved")}
           className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "resolved" ? "border-green-500 text-green-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
        >
          Resolved ({mockAlerts.filter(a => a.status === "resolved").length})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div 
            key={alert.id} 
            className={`group bg-[#071426] border rounded-xl p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6
              ${alert.status === "active" ? "border-slate-800 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.05)]" : "border-slate-800 opacity-70"}
            `}
          >
            <div className="flex gap-4 items-start">
              <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border 
                ${alert.status === "resolved" ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  alert.severity === 'Critical' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {alert.status === "resolved" ? (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-medium text-slate-200">{alert.title}</h3>
                  <span className="text-xs text-slate-500">{alert.status === "active" ? `Created: ${alert.createdAt}` : `Resolved: ${alert.resolvedAt}`}</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{alert.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                    Source: {alert.server}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md border 
                    ${alert.severity === 'Critical' ? 'text-purple-400 border-purple-500/30' : 
                      alert.severity === 'High' ? 'text-red-400 border-red-500/30' : 'text-yellow-400 border-yellow-500/30'}`}>
                    Severity: {alert.severity}
                  </span>
                </div>
              </div>
            </div>

            {alert.status === "active" && (
              <button className="flex-shrink-0 self-start sm:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Resolve Alert
              </button>
            )}
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-16 bg-[#071426] border border-slate-800 rounded-xl border-dashed">
            <p className="text-slate-500">No {activeTab} alerts to show.</p>
          </div>
        )}
      </div>
    </div>
  );
}
