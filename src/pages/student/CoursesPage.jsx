import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllCourses } from "../../api/coursesApi";
import { getMyEnrollments, enrollInCourse } from "../../api/inscriptionApi";
import { useTheme } from "../../context/ThemeContext";

function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [coursesData, enrollData] = await Promise.all([
        getAllCourses(1, 1000),
        getMyEnrollments(),
      ]);
      const list = coursesData.cours || coursesData.courses || (Array.isArray(coursesData) ? coursesData : []);
      setCourses(list);
      setEnrollments(enrollData);
    } catch (err) {
      console.error("Erreur chargement cours student", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      fetchData();
    } catch (err) {
      console.error("Erreur inscription", err);
    }
  };

  const getStatus = (courseId) => {
    const enrollment = enrollments.find((e) => e.cours && e.cours._id === courseId);
    if (!enrollment) return "Available";
    return enrollment.status === "completed" ? "Completed" : "Enrolled";
  };

  return (
    <DashboardLayout title="My Courses" subtitle="Student View">
      <div className={`rounded-2xl border overflow-hidden mb-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className="p-6 text-slate-400">Chargement des cours...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Instructor</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const instructorName = course.Teacher
                  ? `${course.Teacher.firstName || ""} ${course.Teacher.lastName || course.Teacher.name || ""}`.trim()
                  : "Instructor";

                const status = getStatus(course._id);

                return (
                  <tr key={course._id} className={`border-b last:border-0 ${isDark ? "border-slate-800 hover:bg-slate-900/40" : "border-slate-50 hover:bg-slate-50"}`}>
                    <td className={`px-6 py-4 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {course.Title || course.title}
                    </td>
                    <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {instructorName}
                    </td>
                    <td className="px-6 py-4">
                      {status === "Completed" && (
                        <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-semibold">
                          Completed
                        </span>
                      )}
                      {status === "Enrolled" && (
                        <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-semibold">
                          Enrolled
                        </span>
                      )}
                      {status === "Available" && (
                        <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-semibold">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {status === "Available" && (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          className="px-4 py-1.5 rounded-xl font-medium text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Enroll
                        </button>
                      )}
                      {status === "Enrolled" && (
                        <button
                          onClick={() => handleSelectCourse(course)}
                          className="px-4 py-1.5 rounded-xl font-medium text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          Continue
                        </button>
                      )}
                      {status === "Completed" && (
                        <button
                          onClick={() => handleSelectCourse(course)}
                          className="px-4 py-1.5 rounded-xl font-medium text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedCourse && (
        <div className={`rounded-2xl border p-6 transition-all ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{selectedCourse.Title || selectedCourse.title}</h3>
            <button
              onClick={() => setSelectedCourse(null)}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              Back
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {(() => {
              let rawLessons = selectedCourse.Lessons || selectedCourse.lessons;
              if (typeof rawLessons === "string") {
                try {
                  rawLessons = JSON.parse(rawLessons);
                } catch (e) {
                  rawLessons = [];
                }
              }

              if (Array.isArray(rawLessons) && rawLessons.length > 0) {
                return rawLessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50/50"}`}
                  >
                    <h4 className="font-bold text-base mb-1">
                      {lesson.title || lesson.Title || `Lesson ${idx + 1}`}
                    </h4>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {lesson.description || lesson.content || `Content for ${lesson.title || "this lesson"}.`}
                    </p>
                  </div>
                ));
              }

              const courseTitle = (selectedCourse.Title || selectedCourse.title || "").toLowerCase();

              let defaultModules = [
                { title: `${selectedCourse.Title || selectedCourse.title} Fundamentals`, desc: `Core concepts of ${selectedCourse.Title || selectedCourse.title}.` },
                { title: "Advanced Practice & Applications", desc: "Hands-on implementation and tools." }
              ];

              if (courseTitle.includes("devops") || courseTitle.includes("cloud")) {
                defaultModules = [
                  { title: "Docker Containerization", desc: "Building, running, and managing lightweight containerized environments." },
                  { title: "CI/CD Pipelines & Kubernetes", desc: "Automating deployment workflows and orchestrating cloud clusters." }
                ];
              } else if (courseTitle.includes("cyber") || courseTitle.includes("security")) {
                defaultModules = [
                  { title: "Network Security Fundamentals", desc: "Understanding protocols and common vulnerability vectors." },
                  { title: "Ethical Hacking & Penetration Testing", desc: "Identifying and mitigating security breaches." }
                ];
              } else if (courseTitle.includes("design") || courseTitle.includes("ux")) {
                defaultModules = [
                  { title: "User Research & Wireframing", desc: "Creating intuitive low-fidelity layouts." },
                  { title: "Figma Prototyping & Design Systems", desc: "Building interactive component libraries." }
                ];
              }

              return defaultModules.map((mod, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50/50"}`}
                >
                  <h4 className="font-bold text-base mb-1">{mod.title}</h4>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{mod.desc}</p>
                </div>
              ));
            })()}
          </div>

          <button
            onClick={() =>
              navigate("/student/quizzes", {
                state: { courseTitle: selectedCourse.Title || selectedCourse.title },
              })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20"
          >
            Take Quiz
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentCoursesPage;