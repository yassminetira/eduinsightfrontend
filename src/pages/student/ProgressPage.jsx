import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStudentProgress } from "../../api/dashboardApi";
import { useTheme } from "../../context/ThemeContext";

function ProgressPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStudentProgress();
        setData(res);
      } catch (err) {
        console.error("Erreur chargement progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = data
    ? [
        { label: "Start", score: 0 },
        ...data.courses
          .filter((c) => c.grade !== null)
          .map((c) => ({ label: c.courseTitle, score: c.grade })),
      ]
    : [];

  return (
    <DashboardLayout title="My Progress" subtitle="Grade tracking">
      {loading ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className={isDark ? "text-slate-400" : "text-slate-500"}>Courses Completed</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                {data.coursesCompleted}
              </p>
            </div>
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className={isDark ? "text-slate-400" : "text-slate-500"}>Average Grade</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                {data.averageGrade}%
              </p>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 mb-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
              Grade History
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="label" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} />
                <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} />
                <Tooltip
                  contentStyle={isDark ? { backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" } : {}}
                />
                <Legend />
                <Line type="monotone" dataKey="score" name="Score %" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">Grade</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.map((c) => (
                  <tr key={c.courseId} className={`border-b last:border-0 ${isDark ? "border-slate-800" : "border-slate-50"}`}>
                    <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                      {c.courseTitle}
                    </td>
                    <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {c.grade !== null ? `${c.grade}%` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.status === "Completed"
                            ? isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                            : isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default ProgressPage;