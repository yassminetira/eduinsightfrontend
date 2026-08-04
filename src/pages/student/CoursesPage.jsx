import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllCourses } from "../../api/coursesApi";
import { getMyEnrollments, enrollInCourse } from "../../api/inscriptionApi";
import { useTheme } from "../../context/ThemeContext";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchData = async () => {
    try {
      const [coursesData, enrollData] = await Promise.all([
        getAllCourses(),
        getMyEnrollments(),
      ]);
      setCourses(coursesData);
      setEnrollments(enrollData);
    } catch (err) {
      console.error("Erreur chargement", err);
      setError("Impossible de charger les cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      fetchData(); // refresh après inscription
    } catch (err) {
      console.error("Erreur inscription", err);
    }
  };

  // Trouver le statut d'inscription pour un cours donné
  const getEnrollment = (courseId) =>
    enrollments.find((e) => e.cours && e.cours._id === courseId);

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter((e) => e.status === "completed").length;
  const avgGrade = 85; // placeholder — à connecter aux vrais scores plus tard

  return (
    <DashboardLayout title="My Courses" subtitle="Enroll & learn">
      {loading ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className={isDark ? "text-slate-400" : "text-slate-500"}>Enrolled</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                {enrolledCount}
              </p>
            </div>
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className={isDark ? "text-slate-400" : "text-slate-500"}>Completed</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                {completedCount}
              </p>
            </div>
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className={isDark ? "text-slate-400" : "text-slate-500"}>Avg Grade</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                {avgGrade}%
              </p>
            </div>
          </div>

          {/* Table */}
          <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">Instructor</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const enrollment = getEnrollment(course._id);
                  const status = enrollment
                    ? enrollment.status === "completed"
                      ? "Completed"
                      : "Enrolled"
                    : "Available";

                  return (
                    <tr key={course._id} className={`border-b last:border-0 ${isDark ? "border-slate-800" : "border-slate-50"}`}>
                      <td className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {course.Title}
                      </td>
                      <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {course.Teacher ? `${course.Teacher.firstName} ${course.Teacher.lastName.charAt(0)}.` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status === "Completed"
                              ? isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                              : status === "Enrolled"
                              ? isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-700"
                              : isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {status === "Available" && (
                          <button
                            onClick={() => handleEnroll(course._id)}
                            className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700"
                          >
                            Enroll
                          </button>
                        )}
                        {status === "Enrolled" && (
                          <button className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs hover:bg-blue-500/20">
                            Continue
                          </button>
                        )}
                        {status === "Completed" && (
                          <button className="px-4 py-1.5 rounded-full bg-slate-500/10 text-slate-400 font-medium text-xs hover:bg-slate-500/20">
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default CoursesPage;