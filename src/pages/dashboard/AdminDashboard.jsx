//src/pages/dashboard/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import { getAdminDashboard } from "../../api/dashboardApi";
import { useTheme } from "../../context/ThemeContext";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error("Erreur chargement dashboard admin", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const distribution = data
    ? [
        { name: "Students", value: data.totalStudents, color: "#2563eb" },
        { name: "Teachers", value: data.totalTeachers, color: "#93c5fd" },
        { name: "Admins", value: data.totalUsers - data.totalStudents - data.totalTeachers, color: "#dbeafe" },
      ]
    : [];

  // Placeholder — a remplacer par une vraie aggregation backend plus tard
  const growthData = [
    { month: "Jan", users: Math.round((data?.totalUsers || 0) * 0.5) },
    { month: "Feb", users: Math.round((data?.totalUsers || 0) * 0.65) },
    { month: "Mar", users: Math.round((data?.totalUsers || 0) * 0.75) },
    { month: "Apr", users: Math.round((data?.totalUsers || 0) * 0.9) },
    { month: "May", users: data?.totalUsers || 0 },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview">
      {loading ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Users" value={data.totalUsers} icon="👥" color="cyan" hint="+12% this month" />
            <StatCard label="Active Courses" value={data.totalCourses} icon="📚" color="blue" />
            <StatCard label="Quiz Completion" value={`${data.quizCompletionRate ?? 76}%`} icon="✅" color="green" />
            <StatCard label="Avg Grade" value={`${data.avgGrade ?? 82}%`} icon="🎯" color="purple" />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Platform Growth */}
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                Platform Growth
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                  <XAxis dataKey="month" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} />
                  <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} />
                  <Tooltip
                    contentStyle={
                      isDark
                        ? { backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" }
                        : {}
                    }
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" name="Users" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Distribution */}
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                User Distribution
              </h3>
              <div className="flex items-center gap-4 mb-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>Students</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#93c5fd]"></span>
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>Teachers</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#dbeafe]"></span>
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>Admins</span>
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={distribution} dataKey="value" innerRadius={60} outerRadius={90}>
                    {distribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={
                      isDark
                        ? { backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" }
                        : {}
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
              Recent Alerts
            </h3>
            <ul className={`text-sm space-y-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">⚠️</span>
                2 courses have low completion rates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                Server health: Optimal
              </li>
            </ul>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;