// src/components/StatCard.jsx

import { useTheme } from "../context/ThemeContext";

function StatCard({
  label,
  value,
  hint,
  icon = "📊",
  color = "cyan",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    cyan: "from-cyan-400/20 to-cyan-600/10 border-cyan-400/20",
    blue: "from-blue-400/20 to-blue-600/10 border-blue-400/20",
    green: "from-emerald-400/20 to-emerald-600/10 border-emerald-400/20",
    orange: "from-orange-400/20 to-orange-600/10 border-orange-400/20",
    purple: "from-violet-400/20 to-violet-600/10 border-violet-400/20",
    red: "from-red-400/20 to-red-600/10 border-red-400/20",
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        ${colors[color]}
        bg-gradient-to-br
        backdrop-blur-md
        ${isDark ? "bg-slate-950" : "bg-white"}
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        hover:shadow-cyan-500/10
      `}
    >
      {/* Glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {label}
          </p>

          <h2 className={`text-4xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            {value}
          </h2>

          {hint && (
            <p className="text-xs text-emerald-400 mt-3">
              ▲ {hint}
            </p>
          )}
        </div>

        <div
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Bottom line */}
      <div className={`mt-6 h-[2px] w-full rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
        <div className="h-full w-2/3 bg-cyan-400 rounded-full"></div>
      </div>
    </div>
  );
}

export default StatCard;