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
        return "bg-green-100 text-green-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      case "Offline":
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="space-y-10">

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Servers
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage all connected servers.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-xl shadow-sm hover:bg-blue-700 transition">
          + Add Server
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Servers</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">
            {mockServers.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Logs Today</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">
            {mockServers.reduce((a, s) => a + s.logsToday, 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Active Alerts</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">
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
            className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                {server.name}
              </h3>

              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusStyles(server.status)}`}>
                {server.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Logs Today</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {server.logsToday}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Active Alerts</p>
                <p className="font-semibold text-gray-900 mt-1">
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