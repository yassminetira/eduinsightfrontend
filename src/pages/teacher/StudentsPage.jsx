import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllStudents } from "../../api/studentsApi";
import { useTheme } from "../../context/ThemeContext";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (err) {
        console.error("Erreur chargement students", err);
        setError("Impossible de charger les étudiants");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <DashboardLayout title="Students" subtitle="Manage students">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          All Students
        </h2>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Chargement...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Enrolled</th>
                <th className="px-6 py-4 font-medium">Avg Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className={`border-b last:border-0 ${isDark ? "border-slate-800" : "border-slate-50"}`}>
                  <td className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {student.firstName} {student.lastName}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {student.email}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {student.enrolledCount} cours
                  </td>
                  <td className="px-6 py-4">
                    {student.avgGrade !== null ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.avgGrade >= 60
                            ? isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                            : isDark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {student.avgGrade}%
                      </span>
                    ) : (
                      <span className={isDark ? "text-slate-500" : "text-slate-400"}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentsPage;