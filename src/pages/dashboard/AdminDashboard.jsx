//src/pages/dashboard/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
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

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview">
      {loading ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Users" value={data.totalUsers} icon="👥" color="cyan" hint="Live" />
            <StatCard label="Courses" value={data.totalCourses} icon="📚" color="blue" />
            <StatCard label="Enrollments" value={data.totalInscriptions} icon="📝" color="green" />
            <StatCard
              label="Students / Teachers"
              value={`${data.totalStudents} / ${data.totalTeachers}`}
              icon="🎓"
              color="purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                User Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
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

            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                Recent Alerts
              </h3>
              <ul className={`text-sm space-y-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                <li>✅ Server health: Optimal</li>
                <li>📚 {data.totalCourses} active courses</li>
                <li>👥 {data.totalUsers} registered users</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;