import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Generate 24 hours of somewhat realistic looking log volume data
const generateRichData = () => {
  const data = [];
  let baseVolume = 1000;
  for (let i = 0; i < 24; i++) {
    // Add some random noise and a massive spike around hour 14
    const isSpike = i === 13 || i === 14 || i === 15;
    const noise = Math.floor(Math.random() * 400) - 200;
    const totalLogs = isSpike ? 4500 + noise : baseVolume + noise + (i * 50);
    
    // AI Anomalies usually track at 1-2% of total, but jump during spikes
    const aiAnomalies = isSpike ? Math.floor(totalLogs * 0.15) : Math.floor(totalLogs * 0.02);

    data.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      totalLogs: Math.max(0, totalLogs),
      aiAnomalies: Math.max(0, aiAnomalies)
    });
  }
  return data;
};

const mockTrendData = generateRichData();

export default function OverviewPage() {
  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold">Dashboard Overview</h2>
        <p className="text-sm text-slate-400 mt-1">High-level insight into log volume and AI-processed anomalies.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
          <p className="text-sm text-slate-400">Connected Servers</p>
          <p className="text-2xl font-semibold mt-2 text-slate-100">12</p>
        </div>
        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
          <p className="text-sm text-slate-400">Total Logs (24h)</p>
          <p className="text-2xl font-semibold mt-2 text-blue-400">42,891</p>
        </div>
        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-colors">
          <p className="text-sm text-slate-400">AI Processed Logs</p>
          <p className="text-2xl font-semibold mt-2 text-purple-400">1,402</p>
        </div>
        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl hover:border-red-500/50 transition-colors">
          <p className="text-sm text-slate-400">Active Alerts</p>
          <p className="text-2xl font-semibold mt-2 text-red-400">3</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#071426] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-slate-300">Log Volume & Anomaly Trend (24h)</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-slate-400">Total Logs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-slate-400">AI Anomalies</span>
            </div>
          </div>
        </div>
        
        <div className="h-[380px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}
                itemStyle={{ color: "#fff", fontSize: "12px" }}
                labelStyle={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="totalLogs" 
                name="Total Logs"
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLogs)"
                activeDot={{ r: 6, fill: "#3b82f6", stroke: "#0f172a", strokeWidth: 2 }}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="aiAnomalies" 
                name="AI Anomalies"
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAnomalies)"
                activeDot={{ r: 6, fill: "#ef4444", stroke: "#0f172a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout for Feed/Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Alerts Box */}
        <div className="bg-[#071426] border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Recent Critical Alerts
            </h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All &rarr;</button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-800/50 last:border-0 last:pb-0">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Timeout waiting for query lock</h4>
                  <p className="text-xs text-slate-500 mt-1">Prod DB Server • 10:21 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Logs Feed */}
        <div className="bg-[#071426] border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Live Activity Feed
            </h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Go to Logs &rarr;</button>
          </div>
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="flex gap-3 text-slate-400">
              <span className="text-slate-500">10:24:05</span>
              <span className="text-blue-400 font-semibold">[INFO]</span>
              <span className="text-slate-300 truncate">Worker Node 3 / Healthcheck OK</span>
            </div>
            <div className="flex gap-3 text-slate-400">
              <span className="text-slate-500">10:24:12</span>
              <span className="text-yellow-400 font-semibold">[WARN]</span>
              <span className="text-slate-300 truncate">Auth Service / Rate limit approached for IP 192.168.1.5</span>
            </div>
            <div className="flex gap-3 text-slate-400">
              <span className="text-slate-500">10:24:18</span>
              <span className="text-blue-400 font-semibold">[INFO]</span>
              <span className="text-slate-300 truncate">Prod DB Server / Connection pool refreshed</span>
            </div>
             <div className="flex gap-3 text-slate-400">
              <span className="text-slate-500">10:24:22</span>
              <span className="text-blue-400 font-semibold">[INFO]</span>
              <span className="text-slate-300 truncate">Gateway / Routed 4,021 requests successfully</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
