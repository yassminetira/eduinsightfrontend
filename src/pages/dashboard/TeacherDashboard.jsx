// src/pages/dashboard/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import { getTeacherDashboard } from "../../api/dashboardApi";
import { useTheme } from "../../context/ThemeContext";

function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTeacherDashboard();
        setData(res);
      } catch (err) {
        console.error("Erreur chargement dashboard teacher", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Overview">
      {loading ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="My Courses" value={data.totalCourses} icon="📚" color="cyan" />
            <StatCard label="Students" value={data.totalStudents} icon="👨‍🎓" color="green" />
            <StatCard label="Quizzes" value={data.courses?.length || 0} icon="❓" color="orange" />
          </div>

          <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
              My Courses
            </h3>
            <ul className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
              {data.courses?.map((c) => (
                <li key={c._id} className={`py-3 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {c.title}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default TeacherDashboard;