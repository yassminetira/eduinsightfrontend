
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../api/coursesApi";
import { useTheme } from "../../context/ThemeContext";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =========================
  // MODAL & EDIT STATE
  // =========================

  const [showModal, setShowModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    Title: "",
    Status: "Active",
    Lessons: "[]",
  });

  // =========================
  // FETCH COURSES
  // =========================

  const fetchCourses = async () => {
    try {
      setError(null);

      const data = await getAllCourses(1, 1000);

      const allCoursList =
        data.cours ||
        data.courses ||
        (Array.isArray(data) ? data : []);

      const currentUserId = user?.id || user?._id;

      const myCourses = allCoursList.filter((course) => {
        const teacherId =
          course.Teacher?._id ||
          course.Teacher ||
          course.teacher?._id ||
          course.teacher;

        return String(teacherId) === String(currentUserId);
      });

      setCourses(myCourses);
    } catch (err) {
      console.error("Erreur chargement courses:", err);

      setError("Impossible de charger les cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredCourses = courses.filter((course) => {
    const title =
      course.Title ||
      course.title ||
      "";

    return title
      .toLowerCase()
      .includes(search.toLowerCase().trim());
  });

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingCourseId(null);

    setForm({
      Title: "",
      Status: "Active",
      Lessons: "[]",
    });

    setFormError("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (course) => {
    setEditingCourseId(course._id);

    setForm({
      Title:
        course.Title ||
        course.title ||
        "",

      Status:
        course.Status ||
        course.status ||
        "Active",

      Lessons:
        course.Lessons ||
        course.lessons
          ? JSON.stringify(
              course.Lessons ||
                course.lessons,
              null,
              2
            )
          : "[]",
    });

    setFormError("");
    setShowModal(true);
  };

  // =========================
  // HANDLE FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setFormError("");

    let lessonsParsed = [];

    if (
      form.Lessons &&
      form.Lessons.trim() !== ""
    ) {
      try {
        lessonsParsed = JSON.parse(
          form.Lessons
        );
      } catch (err) {
        setFormError(
          "Format JSON invalide pour Lessons."
        );

        setSaving(false);
        return;
      }
    }

    const currentUserId =
      user?.id || user?._id;

    const payload = {
      Title: form.Title,
      title: form.Title,

      Description:
        form.Title ||
        "Description du cours",

      description:
        form.Title ||
        "Description du cours",

      Teacher: currentUserId,
      teacher: currentUserId,

      Status: form.Status,
      status: form.Status,

      Lessons: lessonsParsed,
      lessons: lessonsParsed,
    };

    try {
      if (editingCourseId) {
        if (
          typeof updateCourse ===
          "function"
        ) {
          await updateCourse(
            editingCourseId,
            payload
          );
        }
      } else {
        await createCourse(payload);
      }

      setShowModal(false);
      setEditingCourseId(null);

      setLoading(true);

      await fetchCourses();
    } catch (err) {
      console.error(
        "Erreur enregistrement cours:",
        err.response?.data || err
      );

      const backendMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de l'enregistrement du cours.";

      setFormError(backendMsg);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE COURSE
  // =========================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer ce cours ?"
      )
    ) {
      return;
    }

    try {
      if (
        typeof deleteCourse ===
        "function"
      ) {
        await deleteCourse(id);
      }

      setLoading(true);

      await fetchCourses();
    } catch (err) {
      console.error(
        "Erreur suppression:",
        err
      );

      alert(
        "Erreur lors de la suppression du cours"
      );
    }
  };

  return (
    <DashboardLayout
      title="My Courses"
      subtitle="Vos cours"
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
          My Courses
        </h2>

        <div className="flex items-center gap-3">
          {/* =========================
              SEARCH
          ========================= */}

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search course..."
              className={`w-64 px-4 py-2.5 pl-10 rounded-full border text-sm outline-none transition ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
              }`}
            />

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            {/* CLEAR SEARCH */}

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* =========================
              NEW COURSE
          ========================= */}

          <button
            onClick={openAddModal}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <span className="text-lg leading-none">
              +
            </span>

            New Course
          </button>
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
        ) : filteredCourses.length === 0 ? (
          <p
            className={`p-6 ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {search
              ? "Aucun cours correspondant à votre recherche."
              : "Aucun cours trouvé."}
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
                  Course
                </th>

                <th className="px-6 py-4 font-medium">
                  Students
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>

                <th className="px-6 py-4 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map(
                (course) => (
                  <tr
                    key={course._id}
                    className={`border-b last:border-0 ${
                      isDark
                        ? "border-slate-800 hover:bg-slate-900/50"
                        : "border-slate-50 hover:bg-slate-50/50"
                    }`}
                  >
                    {/* COURSE */}

                    <td
                      className={`px-6 py-4 font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {course.Title ||
                        course.title}
                    </td>

                    {/* STUDENTS */}

                    <td
                      className={`px-6 py-4 ${
                        isDark
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {course.studentsCount ??
                        0}
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isDark
                            ? "bg-green-500/10 text-green-400"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {course.Status ||
                          course.status ||
                          "Active"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openEditModal(
                              course
                            )
                          }
                          className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs hover:bg-blue-500/20 transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              course._id
                            )
                          }
                          className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 font-medium text-xs hover:bg-red-500/20 transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* =========================
          MODAL
      ========================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
              isDark
                ? "bg-slate-950 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-800/50">
              <h3 className="text-lg font-bold">
                {editingCourseId
                  ? "Edit Course"
                  : "New Course"}
              </h3>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* FORM ERROR */}

              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              {/* TITLE */}

              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  Title
                </label>

                <input
                  type="text"
                  name="Title"
                  value={form.Title}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                  placeholder="Course title"
                />
              </div>

              {/* STATUS */}

              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  Status
                </label>

                <select
                  name="Status"
                  value={form.Status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* LESSONS */}

              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  Lessons (JSON)
                </label>

                <textarea
                  name="Lessons"
                  value={form.Lessons}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-3 py-2 rounded-lg border outline-none font-mono text-xs ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                  placeholder="[]"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isDark
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingCourseId
                    ? "Update"
                    : "Create"}
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