import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Layout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const customer = useAuthStore((s) => s.customer);

  const handleLogout = () => {
    clearAuth();
    navigate("/signin");
  };

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Servers", path: "/servers" },
    { label: "Logs", path: "/logs" },
    { label: "Alerts", path: "/alerts" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#071426] border-r border-slate-800 flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-100">cyxor</span>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 uppercase">
              {customer?.email?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {customer?.email || "User"}
              </p>
              <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
