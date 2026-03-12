import { useNavigate } from "react-router-dom";

type ServerStatus = "Healthy" | "Warning" | "Offline";

interface Server {
  id: string;
  name: string;
  status: ServerStatus;
  logsToday: number;
  alerts: number;
}

const mockServers: Server[] = [
  { id: "1", name: "Production Server", status: "Healthy", logsToday: 1243, alerts: 2 },
  { id: "2", name: "Staging Server", status: "Warning", logsToday: 876, alerts: 5 },
  { id: "3", name: "Development Server", status: "Offline", logsToday: 342, alerts: 0 },
];

export default function ServersPage() {
  const navigate = useNavigate();

  const getStatusStyles = (status: ServerStatus) => {
    switch (status) {
      case "Healthy":
        return "bg-green-500/10 text-green-400 border border-green-500/30";
      case "Warning":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
      case "Offline":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-10">

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

        <button className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition">
          + Add Server
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl">
          <p className="text-sm text-slate-400">
            Total Servers
          </p>

          <p className="text-2xl font-semibold mt-2">
            {mockServers.length}
          </p>
        </div>

        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl">
          <p className="text-sm text-slate-400">
            Total Logs Today
          </p>

          <p className="text-2xl font-semibold mt-2">
            {mockServers.reduce((a, s) => a + s.logsToday, 0)}
          </p>
        </div>

        <div className="bg-[#071426] border border-slate-800 p-6 rounded-xl">
          <p className="text-sm text-slate-400">
            Active Alerts
          </p>

          <p className="text-2xl font-semibold mt-2">
            {mockServers.reduce((a, s) => a + s.alerts, 0)}
          </p>
        </div>

      </div>

      {/* Servers Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {mockServers.map((server) => (
          <div
            key={server.id}
            onClick={() => navigate(`/servers/${server.id}`)}
            className="bg-[#071426] border border-slate-800 p-6 rounded-xl cursor-pointer transition hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
          >

            {/* Server Header */}
            <div className="flex justify-between items-center mb-5">

              <h3 className="text-lg font-semibold">
                {server.name}
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full ${getStatusStyles(
                  server.status
                )}`}
              >
                {server.status}
              </span>

            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-slate-400">
                  Logs Today
                </p>

                <p className="font-semibold mt-1">
                  {server.logsToday}
                </p>
              </div>

              <div>
                <p className="text-slate-400">
                  Active Alerts
                </p>

                <p className="font-semibold mt-1">
                  {server.alerts}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

