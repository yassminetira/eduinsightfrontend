
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllStudents } from "../../api/studentsApi";
import { useTheme } from "../../context/ThemeContext";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const LIMIT = 10;

  // =========================
  // GET STUDENTS
  // =========================

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllStudents(page, LIMIT);

        console.log("Students response:", data);

        let studentsList = [];

        if (Array.isArray(data)) {
          studentsList = data;
        } else if (Array.isArray(data?.students)) {
          studentsList = data.students;
        } else if (Array.isArray(data?.data)) {
          studentsList = data.data;
        }

        setStudents(studentsList);

        // =========================
        // TOTAL PAGES
        // =========================

        let pages = 1;

        if (data?.totalPages !== undefined) {
          pages = Number(data.totalPages);
        } else if (data?.total !== undefined) {
          pages = Math.ceil(Number(data.total) / LIMIT);
        }

        if (!Number.isFinite(pages) || pages < 1) {
          pages = 1;
        }

        setTotalPages(pages);

        if (page > pages) {
          setPage(pages);
        }
      } catch (err) {
        console.error(
          "Erreur chargement students:",
          err
        );

        setError(
          "Impossible de charger les étudiants"
        );

        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page]);

  // =========================
  // SEARCH
  // =========================

  const filteredStudents = students.filter(
    (student) => {
      const fullName =
        `${student.firstName || ""} ${
          student.lastName || ""
        }`.trim();

      const studentName =
        student.name || fullName;

      const name =
        studentName.toLowerCase();

      const email =
        (student.email || "").toLowerCase();

      const searchValue =
        search.toLowerCase().trim();

      return (
        name.includes(searchValue) ||
        email.includes(searchValue)
      );
    }
  );

  // =========================
  // NEXT
  // =========================

  const handleNext = () => {
    if (page < totalPages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  // =========================
  // PREVIOUS
  // =========================

  const handlePrevious = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  return (
    <DashboardLayout
      title="Students"
      subtitle="Manage students"
    >
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            isDark
              ? "text-white"
              : "text-slate-900"
          }`}
        >
          All Students
        </h2>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="relative w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search student..."
            className={`w-full px-4 py-2 pl-10 rounded-xl border outline-none transition ${
              isDark
                ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
            }`}
          />

          {/* Search icon */}
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            🔍
          </span>
        </div>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-slate-950 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        {loading ? (
          <p
            className={`p-6 ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Chargement...
          </p>
        ) : error ? (
          <p className="p-6 text-red-500">
            {error}
          </p>
        ) : filteredStudents.length === 0 ? (
          <p
            className={`p-6 text-center ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Aucun étudiant trouvé.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr
                className={`text-left border-b ${
                  isDark
                    ? "border-slate-800 text-slate-400"
                    : "border-slate-100 text-slate-500"
                }`}
              >
                <th className="px-6 py-4 font-medium">
                  Name
                </th>

                <th className="px-6 py-4 font-medium">
                  Email
                </th>

                <th className="px-6 py-4 font-medium">
                  Enrolled
                </th>

                <th className="px-6 py-4 font-medium">
                  Avg Grade
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(
                (student) => {
                  const fullName =
                    `${student.firstName || ""} ${
                      student.lastName || ""
                    }`.trim();

                  const studentName =
                    student.name ||
                    fullName ||
                    "Étudiant Sans Nom";

                  return (
                    <tr
                      key={
                        student._id ||
                        student.id ||
                        student.email
                      }
                      className={`border-b last:border-0 ${
                        isDark
                          ? "border-slate-800 hover:bg-slate-900/50"
                          : "border-slate-50 hover:bg-slate-50/50"
                      }`}
                    >
                      {/* NAME */}

                      <td
                        className={`px-6 py-4 font-semibold ${
                          isDark
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        {studentName}
                      </td>

                      {/* EMAIL */}

                      <td
                        className={`px-6 py-4 ${
                          isDark
                            ? "text-slate-300"
                            : "text-slate-600"
                        }`}
                      >
                        {student.email || "—"}
                      </td>

                      {/* ENROLLED */}

                      <td
                        className={`px-6 py-4 ${
                          isDark
                            ? "text-slate-300"
                            : "text-slate-600"
                        }`}
                      >
                        {student.enrolledCount ?? 0}{" "}
                        cours
                      </td>

                      {/* AVG GRADE */}

                      <td className="px-6 py-4">
                        {student.avgGrade !== null &&
                        student.avgGrade !==
                          undefined ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              Number(
                                student.avgGrade
                              ) >= 60
                                ? isDark
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-green-100 text-green-700"
                                : isDark
                                ? "bg-red-500/10 text-red-400"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.avgGrade}%
                          </span>
                        ) : (
                          <span
                            className={
                              isDark
                                ? "text-slate-500"
                                : "text-slate-400"
                            }
                          >
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* =========================
          PAGINATION
      ========================= */}

      {!loading &&
        !error &&
        !search &&
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 ${
                isDark
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              Previous
            </button>

            <span
              className={
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }
            >
              Page {page} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 ${
                isDark
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900"
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