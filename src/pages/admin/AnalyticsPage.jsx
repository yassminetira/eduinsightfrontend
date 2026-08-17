import { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import { getAnalytics } from "../../api/dashboardApi";
import { useTheme } from "../../context/ThemeContext";

function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnalytics();
        setData(res);
      } catch (err) {
        console.error("Erreur chargement analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const gradeChartData = data
    ? Object.entries(data.gradeDistribution).map(([grade, count]) => ({ grade, count }))
    : [];

  const completionData = data
    ? [
        { name: "Completed", value: data.courseCompletion.completed, color: "#2563eb" },
        { name: "In Progress", value: data.courseCompletion.inProgress, color: "#93c5fd" },
        { name: "Not Started", value: data.courseCompletion.notStarted, color: "#e2e8f0" },
      ]
    : [];

  return (
    <DashboardLayout title="Analytics" subtitle="Detailed reports">
      {loading ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Completion Rate" value={`${data.completionRate}%`} icon="✅" color="blue" />
            <StatCard label="Avg Quiz Score" value={`${data.avgQuizScore}%`} icon="🎯" color="green" />
            <StatCard label="Active Students" value={data.activeStudents} icon="👥" color="purple" />
            <StatCard label="Courses" value={data.totalCourses} icon="📚" color="cyan" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                Grade Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={gradeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                  <XAxis dataKey="grade" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} />
                  <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} />
                  <Tooltip
                    contentStyle={isDark ? { backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" } : {}}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Students" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Course Completion */}
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                Course Completion
              </h3>
              <div className="flex items-center gap-4 mb-2 text-xs">
                {completionData.map((entry) => (
                  <span key={entry.name} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span className={isDark ? "text-slate-300" : "text-slate-600"}>{entry.name}</span>
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={completionData} dataKey="value" outerRadius={90}>
                    {completionData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={isDark ? { backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" } : {}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AnalyticsPage;