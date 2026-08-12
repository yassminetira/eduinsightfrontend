import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../api/coursesApi";
import { getAllUsers } from "../../api/usersApi";
import { useTheme } from "../../context/ThemeContext";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Recherche + Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Modal & Edit State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    Title: "",
    Teacher: "",
    Department: "",
    Status: "Active",
    Lessons: "",
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getAllCourses(page, 10);
      setCourses(data.cours);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Erreur chargement courses", err);
      setError("Impossible de charger les cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  // Chargement de la liste des enseignants
  const loadTeachers = async () => {
    try {
      const data = await getAllUsers(1, 1000);
      setTeachers(data.users.filter((u) => u.role === "teacher"));
    } catch (err) {
      console.error("Erreur chargement teachers", err);
    }
  };

  // Listes uniques pour les dropdowns de filtre (extraites des cours affichés)
  const instructorOptions = [
    ...new Map(
      courses
        .filter((c) => c.Teacher)
        .map((c) => [c.Teacher._id, `${c.Teacher.firstName} ${c.Teacher.lastName}`])
    ).entries(),
  ];

  const departmentOptions = [
    ...new Map(
      courses
        .filter((c) => c.Department)
        .map((c) => [
          c.Department._id || c.Department,
          c.Department.name || c.Department,
        ])
    ).entries(),
  ];

  // Filtrage: recherche par titre + instructor + department
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = (course.Title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstructor = instructorFilter === "all" || course.Teacher?._id === instructorFilter;
    const courseDeptId = course.Department?._id || course.Department;
    const matchesDepartment = departmentFilter === "all" || courseDeptId === departmentFilter;
    return matchesSearch && matchesInstructor && matchesDepartment;
  });

  // ➕ Ouvrir Modal pour Ajouter
  const openAddModal = async () => {
    setEditingId(null);
    setForm({ Title: "", Teacher: "", Department: "", Status: "Active", Lessons: "" });
    setFormError("");
    setShowModal(true);
    await loadTeachers();
  };

  // ✏️ Ouvrir Modal pour Modifier
  const openEditModal = async (course) => {
    setEditingId(course._id);

    let lessonsString = "";
    if (Array.isArray(course.Lessons)) {
      lessonsString = course.Lessons.map((l) => (typeof l === "string" ? l : l.title)).join(", ");
    }

    setForm({
      Title: course.Title || "",
      Teacher: course.Teacher?._id || course.Teacher || "",
      Department: course.Department?._id || course.Department?.name || course.Department || "",
      Status: course.Status || "Active",
      Lessons: lessonsString,
    });

    setFormError("");
    setShowModal(true);
    await loadTeachers();
  };

  // 🗑️ Supprimer un cours
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce cours ?")) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (err) {
        console.error("Erreur suppression", err);
        alert(err.response?.data?.message || "Impossible de supprimer le cours.");
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Enregistrer (Création OU Modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    let lessonsParsed = [];
    if (form.Lessons.trim()) {
      lessonsParsed = form.Lessons.split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .map((title) => ({ title }));
    }

    const payload = {
      Title: form.Title,
      Description: form.Title,
      Teacher: form.Teacher,
      Department: form.Department,
      Status: form.Status,
      Lessons: lessonsParsed,
    };

    try {
      if (editingId) {
        await updateCourse(editingId, payload);
      } else {
        await createCourse(payload);
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error("Erreur enregistrement cours", err);
      setFormError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Erreur lors de l'enregistrement"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Courses" subtitle="Manage courses">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          All Courses
        </h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700"
        >
          <span className="text-lg leading-none">+</span> New Course
        </button>
      </div>

      {/* Barre de recherche + Filtres */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-cyan-400 ${
            isDark ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
          }`}
        />
        <select
          value={instructorFilter}
          onChange={(e) => setInstructorFilter(e.target.value)}
          className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-cyan-400 ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <option value="all">Tous les instructeurs</option>
          {instructorOptions.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-cyan-400 ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <option value="all">Tous les départements</option>
          {departmentOptions.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Chargement...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : filteredCourses.length === 0 ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Aucun cours trouvé.
          </p>
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
              {filteredCourses.map((course) => (
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
                    {course.Department ? course.Department.name || course.Department : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(course)}
                        className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs hover:bg-blue-500/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 font-medium text-xs hover:bg-red-500/20"
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

      {/* Modal New / Edit Course */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${isDark ? "bg-slate-950 border border-slate-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {editingId ? "Edit Course" : "New Course"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-900"}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              <div>
                <label className={`block text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Title</label>
                <input
                  type="text"
                  name="Title"
                  value={form.Title}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Instructor</label>
                <select
                  name="Teacher"
                  value={form.Teacher}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="">— Choisir —</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Department ID</label>
                <input
                  type="text"
                  name="Department"
                  value={form.Department}
                  onChange={handleChange}
                  required
                  placeholder="ID MongoDB du département..."
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Status</label>
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

              <div>
                <label className={`block text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Lessons (séparées par une virgule)
                </label>
                <textarea
                  name="Lessons"
                  value={form.Lessons}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Intro, Chapitre 1, Chapitre 2..."
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm ${
                    isDark ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : editingId ? "Update" : "Save"}
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