import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllCourses } from "../../api/coursesApi";
import { useTheme } from "../../context/ThemeContext";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Erreur chargement courses", err);
        setError("Impossible de charger les cours");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <DashboardLayout title="Courses" subtitle="Manage courses">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          All Courses
        </h2>
        <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700">
          <span className="text-lg leading-none">+</span> New Course
        </button>
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
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Instructor</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className={`border-b last:border-0 ${isDark ? "border-slate-800" : "border-slate-50"}`}>
                  <td className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {course.Title}
                  </td>
                  <td className="px-6 py-4 text-blue-400">
                    {course.Teacher
                      ? `${course.Teacher.firstName} ${course.Teacher.lastName}`
                      : "—"}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {course.Department ? course.Department.name : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs hover:bg-blue-500/20">
                        Edit
                      </button>
                      <button className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 font-medium text-xs hover:bg-red-500/20">
                        Del
                      </button>
                    </div>
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

export default CoursesPage;