import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllQuizzes, createQuiz, updateQuiz, deleteQuiz } from "../../api/quizzesApi";
import { getAllCourses } from "../../api/coursesApi";
import { useTheme } from "../../context/ThemeContext";


const defaultQuestionsJson = JSON.stringify(
  [
    {
      statement: "What is React?",
      options: ["Library", "Framework", "Database", "Language"],
      correctAnswer: 0,
      type: "mcq"
    },
    {
      statement: "Is HTML a programming language?",
      options: ["True", "False"],
      correctAnswer: 1,
      type: "tf"
    }
  ],
  null,
  2
);

function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Edit State
  const [showModal, setShowModal] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null); // null = création, string = édition
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cours: "",
    questionsJson: defaultQuestionsJson,
  });

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 1. Charger la liste des cours (Exécuté UNE seule fois au démarrage)
  useEffect(() => {
    const fetchCoursesList = async () => {
      try {
        const coursesData = await getAllCourses(1, 100);
        const coursesList = coursesData.cours || coursesData.courses || (Array.isArray(coursesData) ? coursesData : []);
        setCourses(coursesList);
      } catch (err) {
        console.error("Erreur chargement cours", err);
      }
    };
    fetchCoursesList();
  }, []);

  // 2. Charger les Quizzes (Rechargé quand la page change)
  const fetchQuizzesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllQuizzes(page, 10);
      setQuizzes(data.quizzes || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Erreur chargement quizzes", err);
      setError("Impossible de charger les quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzesList();
  }, [page]);

  // Ouvrir le modal en mode CRÉATION
  const handleOpenCreateModal = () => {
    setEditingQuizId(null);
    setFormData({
      title: "",
      description: "",
      cours: "",
      questionsJson: defaultQuestionsJson,
    });
    setShowModal(true);
  };

  // Ouvrir le modal en mode ÉDITION
  const handleEdit = (quiz) => {
    setEditingQuizId(quiz._id);
    setFormData({
      title: quiz.title || quiz.Title || "",
      description: quiz.description || "",
      cours: quiz.cours?._id || quiz.cours || "",
      questionsJson: quiz.questions && quiz.questions.length > 0 
        ? JSON.stringify(quiz.questions, null, 2) 
        : defaultQuestionsJson,
    });
    setShowModal(true);
  };

  // Handle Form Submit (Création OU Modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.cours) {
      alert("Veuillez remplir le titre, la description et sélectionner un cours.");
      return;
    }

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(formData.questionsJson);
    } catch (err) {
      alert("Format JSON invalide ! Vérifiez la syntaxe dans le champ Questions.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser._id || storedUser.id;

    setSubmitting(true);
    try {
      if (editingQuizId) {
        // ✏️ Mode ÉDITION
        await updateQuiz(editingQuizId, {
          title: formData.title,
          description: formData.description,
          cours: formData.cours,
          questions: parsedQuestions,
        });
      } else {
        // ➕ Mode CRÉATION
        await createQuiz({
          title: formData.title,
          description: formData.description,
          cours: formData.cours,
          createdBy: userId,
          questions: parsedQuestions,
        });
      }

      // Réinitialisation du formulaire & Fermeture Modal
      setShowModal(false);
      setEditingQuizId(null);
      setFormData({
        title: "",
        description: "",
        cours: "",
        questionsJson: defaultQuestionsJson,
      });

      // Recharger la liste des quiz
      fetchQuizzesList();

    } catch (err) {
      console.error("Erreur enregistrement quiz backend:", err.response?.data || err);
      const backendMsg = err.response?.data?.error || err.response?.data?.message;
      alert(`Erreur lors de l'enregistrement : ${backendMsg || "Vérifiez les données."}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce quiz ?")) return;
    try {
      await deleteQuiz(id);
      fetchQuizzesList();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <DashboardLayout title="Quizzes" subtitle="Assessments">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Quizzes
        </h2>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <span className="text-xl leading-none">+</span> New Quiz
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Chargement...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : quizzes.length === 0 ? (
          <p className={`p-6 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Aucun quiz disponible.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                <th className="px-6 py-4 font-medium">Quiz</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Questions</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className={`border-b last:border-0 ${isDark ? "border-slate-800 hover:bg-slate-900/50" : "border-slate-50 hover:bg-slate-50/50"}`}>
                  <td className="px-6 py-4 text-blue-400 font-medium">
                    {quiz.title || quiz.Title}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {quiz.cours ? (quiz.cours.Title || quiz.cours.title) : "N/A"}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {quiz.questionCount ?? (quiz.questions ? quiz.questions.length : 0)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {/* ✏️ BOUTON EDIT */}
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="text-amber-400 font-medium hover:underline"
                    >
                      Edit
                    </button>
                    {/* 🗑️ BOUTON DELETE */}
                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="text-red-400 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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

      {/* MODAL : NEW QUIZ / EDIT QUIZ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            
            <div className="flex justify-between items-center mb-5 border-b pb-3 border-slate-700/50">
              <h3 className="text-xl font-bold">
                {editingQuizId ? "Edit Quiz" : "New Quiz"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter quiz title..."
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short quiz description..."
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  required
                  value={formData.cours}
                  onChange={(e) => setFormData({ ...formData, cours: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.Title || c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Questions (JSON) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Questions (JSON with type: mcq/tf)
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.questionsJson}
                  onChange={(e) => setFormData({ ...formData, questionsJson: e.target.value })}
                  className={`w-full p-3 rounded-xl border font-mono text-xs outline-none ${isDark ? "bg-slate-950 border-slate-800 text-blue-300" : "bg-slate-50 border-slate-300 text-blue-900"}`}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-5 py-2 rounded-xl font-medium text-sm ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingQuizId ? "Update" : "Save"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default QuizzesPage;