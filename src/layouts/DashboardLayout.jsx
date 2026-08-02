import { Link, useNavigate, useLocation } from "react-router-dom";
import { sidebarConfig } from "../config/sidebarConfig";
import { useTheme } from "../context/ThemeContext";

function DashboardLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || "student";
  const menuItems = sidebarConfig[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-black" : "bg-slate-50"}`}>
      <aside
        className={`w-72 flex flex-col border-r ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className={`px-8 py-8 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                EduInsight
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Smart Education
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 pt-6">
          <div
            className={`rounded-xl border p-1 flex ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
            }`}
          >
            {["admin", "teacher", "student"].map((r) => (
              <div
                key={r}
                className={`flex-1 py-2 rounded-lg text-center capitalize text-sm transition
                ${role === r ? "bg-cyan-400 text-slate-950 font-semibold" : "text-slate-500"}`}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition
                ${
                  active
                    ? "bg-cyan-400/10 border border-cyan-400/20 text-cyan-400"
                    : isDark
                    ? "text-slate-400 hover:bg-slate-900 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Theme Toggle + Logout */}
        <div className={`border-t p-6 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className={`text-xs capitalize ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {role}
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 border transition text-sm ${
              isDark
                ? "border-slate-800 text-slate-300 hover:bg-slate-900"
                : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{isDark ? "☀️" : "🌙"}</span>
            <span className="font-medium">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="mt-3 w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-3 hover:bg-red-500/20 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`border-b ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"}`}>
          <div className="px-10 py-7 flex items-center justify-between">
            <div>
              <p className={`text-xs tracking-widest uppercase ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Dashboard
              </p>
              <h1 className={`text-3xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {subtitle}
                </p>
              )}
            </div>
            <button
              className={`w-12 h-12 rounded-xl border transition ${
                isDark
                  ? "bg-slate-900 border-slate-800 hover:border-cyan-400"
                  : "bg-slate-100 border-slate-200 hover:border-cyan-400"
              }`}
            >
              🔔
            </button>
          </div>
        </header>

        <div className="p-10">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;