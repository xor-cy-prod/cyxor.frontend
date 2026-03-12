import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

const tabs = ["Logs", "AI Logs", "Alerts", "Analytics"] as const;
type TabType = (typeof tabs)[number];

const filters = ["6h", "12h", "24h"] as const;
type FilterType = (typeof filters)[number];

// Full 24h dataset
const allAnalyticsData = [
  { time: "00:00", requests: 120, errors: 12, warnings: 20 },
  { time: "01:00", requests: 200, errors: 8,  warnings: 15 },
  { time: "02:00", requests: 150, errors: 5,  warnings: 10 },
  { time: "03:00", requests: 300, errors: 22, warnings: 35 },
  { time: "04:00", requests: 280, errors: 18, warnings: 28 },
  { time: "05:00", requests: 200, errors: 10, warnings: 18 },
  { time: "06:00", requests: 150, errors: 7,  warnings: 12 },
  { time: "07:00", requests: 300, errors: 14, warnings: 30 },
  { time: "08:00", requests: 280, errors: 20, warnings: 25 },
  { time: "09:00", requests: 350, errors: 30, warnings: 42 },
  { time: "10:00", requests: 220, errors: 9,  warnings: 17 },
  { time: "11:00", requests: 200, errors: 6,  warnings: 14 },
  { time: "12:00", requests: 150, errors: 4,  warnings: 9 },
  { time: "13:00", requests: 300, errors: 16, warnings: 32 },
  { time: "14:00", requests: 280, errors: 24, warnings: 38 },
  { time: "15:00", requests: 200, errors: 11, warnings: 19 },
  { time: "16:00", requests: 150, errors: 8,  warnings: 13 },
  { time: "17:00", requests: 300, errors: 19, warnings: 29 },
  { time: "18:00", requests: 280, errors: 21, warnings: 33 },
  { time: "19:00", requests: 350, errors: 28, warnings: 44 },
  { time: "20:00", requests: 120, errors: 7,  warnings: 11 },
  { time: "21:00", requests: 200, errors: 13, warnings: 22 },
  { time: "22:00", requests: 150, errors: 5,  warnings: 8 },
  { time: "23:00", requests: 300, errors: 17, warnings: 26 },
];

const logs = [
  { level: "INFO",  time: "23:58:02", message: "Server started successfully",          source: "core.server" },
  { level: "INFO",  time: "23:57:44", message: "Connected to database",                source: "db.connector" },
  { level: "WARN",  time: "23:55:12", message: "Memory usage at 82%",                  source: "sys.monitor" },
  { level: "ERROR", time: "23:54:09", message: "Failed to fetch API response",         source: "api.client" },
  { level: "INFO",  time: "23:52:31", message: "Background job completed",             source: "jobs.worker" },
  { level: "ERROR", time: "23:51:05", message: "Timeout while connecting to Redis",    source: "cache.redis" },
  { level: "WARN",  time: "23:48:50", message: "Request queue depth exceeded 1000",   source: "queue.manager" },
  { level: "INFO",  time: "23:47:22", message: "SSL certificate renewed successfully", source: "ssl.manager" },
  { level: "ERROR", time: "23:45:00", message: "OOM kill on worker process PID 4821",  source: "sys.kernel" },
  { level: "INFO",  time: "23:44:17", message: "Health check passed",                 source: "health.check" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(15,20,35,0.95)",
        border: "1px solid rgba(99,179,237,0.2)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <p style={{ color: "#a0aec0", marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Style helper functions (kept outside component to avoid re-creation) ──────
const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "8px 20px",
  borderRadius: 9,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  border: "none",
  letterSpacing: "0.03em",
  transition: "all 0.15s",
  background: active ? "rgba(99,179,237,0.15)" : "transparent",
  color: active ? "#63b3ed" : "#4a5568",
  outline: "none",
});

const filterBtnStyle = (active: boolean, color: string): React.CSSProperties => ({
  padding: "5px 14px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
  background: active ? `${color}22` : "transparent",
  color: active ? color : "#4a5568",
  letterSpacing: "0.06em",
  outline: "none",
  transition: "all 0.15s",
});

const timeChipStyle = (active: boolean): React.CSSProperties => ({
  padding: "5px 16px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  border: `1px solid ${active ? "rgba(99,179,237,0.4)" : "rgba(255,255,255,0.06)"}`,
  background: active ? "rgba(99,179,237,0.1)" : "transparent",
  color: active ? "#63b3ed" : "#4a5568",
  outline: "none",
  transition: "all 0.15s",
});

const statCardStyle = (from: string, to: string): React.CSSProperties => ({
  padding: "24px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.06)",
  background: `linear-gradient(135deg, ${from}, ${to})`,
});

export default function ServerDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("Logs");
  const [timeFilter, setTimeFilter] = useState<FilterType>("24h");
  const [logFilter, setLogFilter] = useState<string>("ALL");

  const filteredLogs = logFilter === "ALL"
    ? logs
    : logs.filter((l) => l.level === logFilter);

  const chartData = useMemo(() => {
    if (timeFilter === "6h")  return allAnalyticsData.slice(18);
    if (timeFilter === "12h") return allAnalyticsData.slice(12);
    return allAnalyticsData;
  }, [timeFilter]);

  const totalLogs   = chartData.reduce((s, d) => s + d.requests, 0);
  const totalErrors = chartData.reduce((s, d) => s + d.errors, 0);
  const peakHour    = chartData.reduce((a, b) => a.requests > b.requests ? a : b).time;
  const avgPerHour  = Math.round(totalLogs / chartData.length);

  const styles: Record<string, React.CSSProperties> = {
    root: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      background: "#080d1a",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "32px 40px",
    },
    header: {
      marginBottom: 32,
    },
    serverBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(99,179,237,0.08)",
      border: "1px solid rgba(99,179,237,0.2)",
      borderRadius: 8,
      padding: "4px 12px",
      fontSize: 11,
      color: "#63b3ed",
      marginBottom: 12,
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#48bb78",
      boxShadow: "0 0 6px #48bb78",
      display: "inline-block",
    },
    title: {
      fontSize: 28,
      fontWeight: 700,
      color: "#f7fafc",
      margin: 0,
      letterSpacing: "-0.02em",
    },
    subtitle: {
      fontSize: 12,
      color: "#4a5568",
      marginTop: 4,
    },
    // Stats bar at top
    statsBar: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 1,
      background: "rgba(99,179,237,0.06)",
      border: "1px solid rgba(99,179,237,0.12)",
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 28,
    },
    statItem: {
      padding: "18px 20px",
      background: "rgba(8,13,26,0.9)",
      borderRight: "1px solid rgba(99,179,237,0.08)",
    },
    statLabel: {
      fontSize: 10,
      color: "#4a5568",
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      marginBottom: 6,
    },
    statValue: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    statUnit: {
      fontSize: 11,
      color: "#718096",
      marginLeft: 4,
    },
    // Tabs
    tabsRow: {
      display: "flex",
      gap: 2,
      marginBottom: 24,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: 4,
      width: "fit-content",
    },
    // Card
    card: {
      background: "rgba(13,18,32,0.8)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: 28,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: "#e2e8f0",
      marginBottom: 20,
      letterSpacing: "0.02em",
    },
    // Console
    console: {
      background: "#040810",
      borderRadius: 12,
      padding: "20px 0",
      height: 340,
      overflowY: "auto" as const,
      border: "1px solid rgba(255,255,255,0.05)",
    },
    logRow: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "6px 20px",
      fontSize: 11,
      lineHeight: 1.6,
      borderBottom: "1px solid rgba(255,255,255,0.03)",
    },
    logTime: {
      color: "#2d3748",
      minWidth: 60,
      flexShrink: 0,
    },
    logSource: {
      color: "#2c5282",
      minWidth: 110,
      flexShrink: 0,
    },
    // Alert table
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: 12,
    },
    th: {
      padding: "10px 14px",
      textAlign: "left" as const,
      color: "#4a5568",
      fontSize: 10,
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontWeight: 600,
    },
    td: {
      padding: "14px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      color: "#a0aec0",
    },
  };

  const levelColor: Record<string, string> = {
    INFO: "#48bb78",
    WARN: "#ed8936",
    ERROR: "#fc8181",
  };

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.serverBadge}>
          <span style={styles.dot} />
          Online · Server {id}
        </div>
        <h2 style={styles.title}>Server Overview</h2>
        <p style={styles.subtitle}>Last updated: just now · Monitoring active</p>
      </div>

      {/* Top stats bar */}
      <div style={styles.statsBar}>
        {[
          { label: "Logs Usage",    value: "158K",  unit: "logs",  color: "#63b3ed" },
          { label: "Metrics",       value: "97K",   unit: "UTS",   color: "#f6ad55" },
          { label: "Traces",        value: "128K",  unit: "spans", color: "#9f7aea" },
          { label: "Alerts",        value: "12",    unit: "",      color: "#fc8181" },
          { label: "Exceptions",    value: "56",    unit: "",      color: "#f6ad55" },
          { label: "Insights",      value: "10",    unit: "",      color: "#68d391" },
        ].map((s, i) => (
          <div key={i} style={{ ...styles.statItem, borderRight: i < 5 ? "1px solid rgba(99,179,237,0.08)" : "none" }}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statValue, color: s.color }}>
              {s.value}<span style={styles.statUnit}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabsRow}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.card}>

        {/* ─── LOGS ─── */}
        {activeTab === "Logs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={styles.sectionTitle}>Live Logs</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["ALL", "INFO", "WARN", "ERROR"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilter(lvl)}
                    style={filterBtnStyle(logFilter === lvl, levelColor[lvl] || "#63b3ed")}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.console}>
              {filteredLogs.map((log, i) => (
                <div key={i} style={styles.logRow}>
                  <span style={styles.logTime}>{log.time}</span>
                  <span style={styles.logSource}>{log.source}</span>
                  <span style={{ color: levelColor[log.level], minWidth: 52 }}>[{log.level}]</span>
                  <span style={{ color: "#718096" }}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── AI LOGS ─── */}
        {activeTab === "AI Logs" && (
          <div>
            <span style={styles.sectionTitle}>AI Processed Logs</span>

            <div style={{
              border: "1px solid rgba(252,129,129,0.2)",
              borderLeft: "3px solid #fc8181",
              borderRadius: 12,
              padding: "20px 24px",
              background: "rgba(252,129,129,0.04)",
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Anomaly Detected</span>
                <span style={{ padding: "3px 10px", fontSize: 10, fontWeight: 700, background: "rgba(252,129,129,0.15)", color: "#fc8181", borderRadius: 6, letterSpacing: "0.08em" }}>HIGH RISK</span>
              </div>
              <p style={{ fontSize: 12, color: "#718096", lineHeight: 1.7, margin: 0 }}>
                Unusual traffic spike detected between <span style={{ color: "#fc8181" }}>14:00–14:15</span>. Pattern resembles abnormal API usage. Request volume exceeded 3× baseline. Possible DDoS vector or runaway client.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button style={{ fontSize: 11, color: "#63b3ed", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  🔍 Investigate
                </button>
                <button style={{ fontSize: 11, color: "#4a5568", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Mark as False Positive
                </button>
              </div>
            </div>

            <div style={{
              border: "1px solid rgba(246,173,85,0.2)",
              borderLeft: "3px solid #f6ad55",
              borderRadius: 12,
              padding: "20px 24px",
              background: "rgba(246,173,85,0.03)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Memory Pressure Pattern</span>
                <span style={{ padding: "3px 10px", fontSize: 10, fontWeight: 700, background: "rgba(246,173,85,0.15)", color: "#f6ad55", borderRadius: 6, letterSpacing: "0.08em" }}>MEDIUM</span>
              </div>
              <p style={{ fontSize: 12, color: "#718096", lineHeight: 1.7, margin: 0 }}>
                AI detected a gradual memory leak pattern over the past <span style={{ color: "#f6ad55" }}>6 hours</span>. Worker processes are not releasing heap after job completion.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button style={{ fontSize: 11, color: "#63b3ed", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  🔍 Investigate
                </button>
                <button style={{ fontSize: 11, color: "#4a5568", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Mark as False Positive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ALERTS ─── */}
        {activeTab === "Alerts" && (
          <div>
            <span style={styles.sectionTitle}>Active Alerts</span>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Type", "Severity", "Count", "Last Triggered", "Action"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "RuntimeException",          severity: "HIGH",   count: 42,   last: "2 mins ago",  color: "#fc8181" },
                  { type: "Memory Spike",               severity: "MEDIUM", count: 12,   last: "10 mins ago", color: "#f6ad55" },
                  { type: "Connection Attempt Failed",  severity: "HIGH",   count: 6350, last: "5 mins ago",  color: "#fc8181" },
                  { type: "Error in ArchiverHandler",   severity: "LOW",    count: 17,   last: "30 mins ago", color: "#68d391" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{row.type}</td>
                    <td style={styles.td}>
                      <span style={{ padding: "3px 10px", fontSize: 10, fontWeight: 700, background: `${row.color}18`, color: row.color, borderRadius: 6, letterSpacing: "0.06em" }}>
                        {row.severity}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: "#e2e8f0", fontWeight: 600 }}>{row.count.toLocaleString()}</td>
                    <td style={styles.td}>{row.last}</td>
                    <td style={{ ...styles.td }}>
                      <button style={{ fontSize: 11, color: "#63b3ed", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        Resolve →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── ANALYTICS ─── */}
        {activeTab === "Analytics" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={styles.sectionTitle}>Log Volume</span>
              <div style={{ display: "flex", gap: 6 }}>
                {filters.map((f) => (
                  <button key={f} onClick={() => setTimeFilter(f)} style={timeChipStyle(timeFilter === f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              <div style={statCardStyle("rgba(99,179,237,0.08)", "rgba(99,179,237,0.02)")}>
                <p style={{ fontSize: 10, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Total Logs</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#63b3ed", margin: 0, letterSpacing: "-0.02em" }}>{totalLogs.toLocaleString()}</p>
              </div>
              <div style={statCardStyle("rgba(252,129,129,0.08)", "rgba(252,129,129,0.02)")}>
                <p style={{ fontSize: 10, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Total Errors</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#fc8181", margin: 0, letterSpacing: "-0.02em" }}>{totalErrors}</p>
              </div>
              <div style={statCardStyle("rgba(72,187,120,0.08)", "rgba(72,187,120,0.02)")}>
                <p style={{ fontSize: 10, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Peak Hour</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#48bb78", margin: 0, letterSpacing: "-0.02em" }}>{peakHour}</p>
              </div>
              <div style={statCardStyle("rgba(159,122,234,0.08)", "rgba(159,122,234,0.02)")}>
                <p style={{ fontSize: 10, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Avg / Hour</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#9f7aea", margin: 0, letterSpacing: "-0.02em" }}>{avgPerHour}</p>
              </div>
            </div>

            {/* Area Chart */}
            <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", padding: "20px 10px 10px", background: "rgba(4,8,16,0.5)" }}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#63b3ed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#63b3ed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#fc8181" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fc8181" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="warnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f6ad55" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f6ad55" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#2d3748", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#2d3748", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke="#63b3ed" strokeWidth={2} fill="url(#reqGrad)" dot={false} />
                  <Area type="monotone" dataKey="warnings"  name="Warnings"  stroke="#f6ad55" strokeWidth={1.5} fill="url(#warnGrad)" dot={false} />
                  <Area type="monotone" dataKey="errors"   name="Errors"   stroke="#fc8181" strokeWidth={1.5} fill="url(#errGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8 }}>
                {[{ color: "#63b3ed", label: "Requests" }, { color: "#f6ad55", label: "Warnings" }, { color: "#fc8181", label: "Errors" }].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#4a5568" }}>
                    <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}