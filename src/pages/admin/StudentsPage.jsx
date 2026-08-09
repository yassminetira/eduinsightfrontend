import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllStudents } from "../../api/studentsApi";
import { useTheme } from "../../context/ThemeContext";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllStudents(page, 10);
        // On sécurise la récupération de la liste des étudiants
        setStudents(data.students || data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Erreur chargement students", err);
        setError("Impossible de charger les étudiants");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [page]);

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
        ) : students.length === 0 ? (
          <p className={`p-6 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Aucun étudiant trouvé.
          </p>
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
              {students.map((student) => {
                // ✅ Gestion flexible du nom (Name OU firstName + lastName)
                const studentName =
                  student.name ||
                  `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                  "Étudiant Sans Nom";

                return (
                  <tr key={student._id} className={`border-b last:border-0 ${isDark ? "border-slate-800 hover:bg-slate-900/50" : "border-slate-50 hover:bg-slate-50/50"}`}>
                    {/* Nom de l'étudiant */}
                    <td className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {studentName}
                    </td>

                    {/* Email */}
                    <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {student.email}
                    </td>

                    {/* Cours inscrits */}
                    <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {student.enrolledCount ?? 0} cours
                    </td>

                    {/* Moyenne */}
                    <td className="px-6 py-4">
                      {student.avgGrade !== null && student.avgGrade !== undefined ? (
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 ${
              isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
            }`}
          >
            Previous
          </button>
          <span className={isDark ? "text-slate-400" : "text-slate-500"}>
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 ${
              isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentsPage;