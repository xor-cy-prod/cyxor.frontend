import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/apiClient";
import { AddServerModal } from "./AddServerModal";

type ServerStatus = "Healthy" | "Warning" | "Critical" | "Unknown";

interface Server {
  id: string;
  name: string;
  status: ServerStatus;
}

export default function ServersPage() {
  const navigate = useNavigate();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServers = async () => {
    try {
      const res = await apiClient.get("/servers/");
      // Map API response to our UI model
      const formatted = res.data.map((s: any) => ({
        id: s.id,
        name: s.name,
        // Calculate status visually
        status: s.status === "online" ? "Healthy" : s.status === "offline" ? "Critical" : "Unknown"
      }));
      setServers(formatted);
    } catch (err) {
      console.error("Failed to load servers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const getStatusStyles = (status: ServerStatus) => {
    switch (status) {
      case "Healthy":
        return "bg-green-500/10 text-green-400 border border-green-500/30";
      case "Warning":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
      case "Critical":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-10 relative">
      
      {/* Modal */}
      <AddServerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchServers}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold">
            Servers
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Monitor and manage all connected servers
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
        >
          + Add Server
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl">
          <p className="text-sm text-slate-400">Total Servers</p>
          <p className="text-2xl font-semibold mt-2">
            {loading ? "..." : servers.length}
          </p>
        </div>
      </div>

      {/* Servers Grid */}
      {loading ? (
        <div className="h-40 flex items-center justify-center border border-dashed border-slate-800 rounded-xl">
           <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : servers.length === 0 ? (
        <div className="text-center py-20 bg-[#071426] border border-slate-800 rounded-xl border-dashed">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-1">No servers connected</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">You haven't added any servers yet. Click the Add Server button to generate a token and start ingesting logs.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition border border-slate-700 hover:border-slate-600"
          >
            Add First Server
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servers.map((server) => (
            <div
              key={server.id}
              onClick={() => navigate(`/servers/${server.id}`)}
              className="bg-[#071426] border border-slate-800 p-6 rounded-xl cursor-pointer transition hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${server.status === 'Healthy' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : server.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                    {server.name}
                  </h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusStyles(server.status)}`}>
                  {server.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Click to view real-time diagnostics &rarr;</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

