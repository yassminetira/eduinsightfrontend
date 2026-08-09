import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../../api/coursesApi";
import { useTheme } from "../../context/ThemeContext";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Modal & Edit State
  const [showModal, setShowModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    Title: "",
    Status: "Active",
    Lessons: "[]",
  });

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses(1, 1000);
      const allCoursList = data.cours || data.courses || (Array.isArray(data) ? data : []);

      const myCourses = allCoursList.filter((course) => {
        const teacherId = course.Teacher?._id || course.Teacher || course.teacher?._id || course.teacher;
        const currentUserId = user?.id || user?._id;
        return teacherId === currentUserId;
      });
      setCourses(myCourses);
    } catch (err) {
      console.error("Erreur chargement courses", err);
      setError("Impossible de charger les cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourseId(null);
    setForm({ Title: "", Status: "Active", Lessons: "[]" });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourseId(course._id);
    setForm({
      Title: course.Title || course.title || "",
      Status: course.Status || course.status || "Active",
      Lessons: course.Lessons || course.lessons
        ? JSON.stringify(course.Lessons || course.lessons, null, 2)
        : "[]",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    let lessonsParsed = [];
    if (form.Lessons && form.Lessons.trim() !== "") {
      try {
        lessonsParsed = JSON.parse(form.Lessons);
      } catch (err) {
        setFormError("Format JSON invalide pour Lessons.");
        setSaving(false);
        return;
      }
    }

    const currentUserId = user?.id || user?._id;

    const payload = {
      Title: form.Title,
      title: form.Title,
      Description: form.Title || "Description du cours",
      description: form.Title || "Description du cours",
      Teacher: currentUserId,
      teacher: currentUserId,
      Status: form.Status,
      status: form.Status,
      Lessons: lessonsParsed,
      lessons: lessonsParsed,
    };

    try {
      if (editingCourseId) {
        if (typeof updateCourse === "function") {
          await updateCourse(editingCourseId, payload);
        }
      } else {
        await createCourse(payload);
      }

      setShowModal(false);
      setEditingCourseId(null);
      setLoading(true);
      fetchCourses();
    } catch (err) {
      console.error("Erreur enregistrement cours:", err.response?.data || err);
      const backendMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de l'enregistrement du cours.";
      setFormError(backendMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    try {
      if (typeof deleteCourse === "function") {
        await deleteCourse(id);
      }
      fetchCourses();
    } catch (err) {
      alert("Erreur lors de la suppression du cours");
    }
  };

  return (
    <DashboardLayout title="My Courses" subtitle="Vos cours">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          My Courses
        </h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <span className="text-lg leading-none">+</span> New Course
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Chargement...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : courses.length === 0 ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Aucun cours trouvé.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Students</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className={`border-b last:border-0 ${isDark ? "border-slate-800 hover:bg-slate-900/50" : "border-slate-50 hover:bg-slate-50/50"}`}>
                  <td className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {course.Title || course.title}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {course.studentsCount ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {course.Status || course.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(course)}
                        className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs hover:bg-blue-500/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 font-medium text-xs hover:bg-red-500/20 transition-colors"
                      >
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

      {/* Modal Edit / New Course */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            
            {/* Modal Title */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-800/50">
              <h3 className="text-lg font-bold">
                {editingCourseId ? "Edit Course" : "New Course"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              {/* 1. Title */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Title</label>
                <input
                  type="text"
                  name="Title"
                  value={form.Title}
                  onChange={handleChange}
                  required
                  placeholder="Course title..."
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              {/* 2. Instructor */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Instructor</label>
                <input
                  type="text"
                  value={user ? `${user.firstName || ""} ${user.lastName || user.name || ""}`.trim() : "Teacher"}
                  disabled
                  className={`w-full rounded-lg border px-3 py-2 text-sm opacity-60 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              {/* 3. Status (Active / Draft / Upcoming) */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Status</label>
                <select
                  name="Status"
                  value={form.Status}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              {/* 4. Lessons (JSON format) */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Lessons (JSON format)
                </label>
                <textarea
                  name="Lessons"
                  value={form.Lessons}
                  onChange={handleChange}
                  rows={3}
                  placeholder='[{"title": "Intro"}, {"title": "Chapitre 1"}]'
                  className={`w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-950 border-slate-800 text-blue-300" : "bg-slate-50 border-slate-200 text-blue-900"
                  }`}
                />
              </div>

              {/* 5. Buttons: Save / Cancel */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm ${
                    isDark ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CoursesPage;