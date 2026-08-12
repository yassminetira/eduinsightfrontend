import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllStudents } from "../../api/studentsApi";
import { useTheme } from "../../context/ThemeContext";

const LEVELS = ["L1", "L2", "L3", "M1", "M2"];

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Recherche + Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        // Protection houni bech nrodouh dima tableau b sife da2ima
        const studentsList = Array.isArray(data) 
          ? data 
          : (data.students || data.data || data.docs || []);
        
        setStudents(studentsList);
      } catch (err) {
        console.error("Erreur chargement students", err);
        setError("Impossible de charger les étudiants");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Protection zeda houni 3la rous el amwel (ken students mouch tableau yrodha tableau feragh [])
  const safeStudents = Array.isArray(students) ? students : [];

  // Liste unique des groupes
  const groupOptions = [
    ...new Set(safeStudents.filter((s) => s.group).map((s) => s.group)),
  ];

  // Filtrage sécurisé
  const filteredStudents = safeStudents.filter((student) => {
    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || student.level === levelFilter;
    const matchesGroup = groupFilter === "all" || student.group === groupFilter;
    return matchesSearch && matchesLevel && matchesGroup;
  });

  return (
    <DashboardLayout title="Students" subtitle="Manage students">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          All Students
        </h2>
      </div>

      {/* Barre de recherche + Filtres */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-cyan-400 ${
            isDark ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
          }`}
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className={`rounded-lg border px-4 py-2.5 text-sm outline-none ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <option value="all">Tous les niveaux</option>
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className={`rounded-lg border px-4 py-2.5 text-sm outline-none ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <option value="all">Tous les groupes</option>
          {groupOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Tableau des étudiants */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Chargement...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : filteredStudents.length === 0 ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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
              {filteredStudents.map((student) => (
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentsPage;