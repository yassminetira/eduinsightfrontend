import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";

function StudentQuizzesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();

  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  // State mta3 el recherche
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const defaultQuizzes = [
      {
        _id: "q1",
        courseTitle: "React Fundamentals",
        quizTitle: "React Basics",
        bestScore: 85,
        questions: [
          {
            id: 1,
            questionText: "What is React?",
            options: ["Library", "Framework", "Language", "Database"],
            correctAnswer: 0,
          },
          {
            id: 2,
            questionText: "Which command is used to create a React app with Vite?",
            options: ["npm create vite@latest", "npx create-react-app", "npm init react", "vite start"],
            correctAnswer: 0,
          },
          {
            id: 3,
            questionText: "What hook is used for side effects in React?",
            options: ["useState", "useEffect", "useContext", "useReducer"],
            correctAnswer: 1,
          },
        ],
      },
      {
        _id: "q2",
        courseTitle: "UX/UI Design",
        quizTitle: "UX Quiz",
        bestScore: 92,
        questions: [
          {
            id: 1,
            questionText: "What does UI stand for?",
            options: ["User Interface", "User Integration", "Universal Interaction", "User Interest"],
            correctAnswer: 0,
          },
        ],
      },
      {
        _id: "q3",
        courseTitle: "Cloud Architecture",
        quizTitle: "Cloud Quiz",
        bestScore: 78,
        questions: [
          {
            id: 1,
            questionText: "Which service is used for virtual servers in AWS?",
            options: ["S3", "EC2", "RDS", "Lambda"],
            correctAnswer: 1,
          },
          {
            id: 2,
            questionText: "What is Docker used for?",
            options: ["Containerization", "Database management", "Styling", "Networking"],
            correctAnswer: 0,
          },
        ],
      },
    ];

    setQuizzes(defaultQuizzes);

    // Auto-start le quiz si on vient de "Take Quiz" (matching flexible: includes)
    const courseTitle = location.state?.courseTitle;
    if (courseTitle) {
      const matchedQuiz = defaultQuizzes.find(
        (q) =>
          courseTitle.toLowerCase().includes(q.courseTitle.toLowerCase()) ||
          q.courseTitle.toLowerCase().includes(courseTitle.toLowerCase())
      );
      if (matchedQuiz) {
        setActiveQuiz(matchedQuiz);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setIsFinished(false);
      }
    }
  }, [location.state]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuitQuiz = () => {
    setActiveQuiz(null);
  };

  // Filtrer les quiz selon el recherche (par Course Title wela Quiz Title)
  const filteredQuizzes = quizzes.filter((q) => {
    const courseTitle = (q.courseTitle || "").toLowerCase();
    const quizTitle = (q.quizTitle || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return courseTitle.includes(search) || quizTitle.includes(search);
  });

  return (
    <DashboardLayout title="My Quizzes" subtitle="Test yourself">
      {activeQuiz ? (
        <div
          className={`rounded-2xl border p-8 shadow-sm transition-all ${
            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {!isFinished ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  Quiz: {activeQuiz.courseTitle}
                </h3>
                <button
                  onClick={handleQuitQuiz}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  Back to Quizzes
                </button>
              </div>

              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Question {currentQuestionIndex + 1}/{activeQuiz.questions.length}
                </p>
                <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  {activeQuiz.questions[currentQuestionIndex].questionText}
                </h4>
              </div>

              <div className="space-y-2.5 mb-8">
                {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : isDark
                          ? "border-slate-800 hover:bg-slate-900 text-slate-300"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                    currentQuestionIndex === 0
                      ? "opacity-40 cursor-not-allowed bg-blue-50 text-blue-400 dark:bg-slate-800 dark:text-slate-600"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-400"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-2 rounded-full text-sm transition-colors shadow-md shadow-blue-500/20"
                >
                  {currentQuestionIndex === activeQuiz.questions.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
              <p className="text-slate-500 mb-6 text-sm">
                You have answered all questions in {activeQuiz.quizTitle}.
              </p>
              <button
                onClick={handleQuitQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                Back to My Quizzes
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Barre de recherche */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Rechercher par titre de cours ou de quiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                isDark ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          <div
            className={`rounded-2xl border overflow-hidden ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {filteredQuizzes.length === 0 ? (
              <p className={`p-6 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Aucun quiz trouvé.
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
                    <th className="px-6 py-4 font-medium">Course</th>
                    <th className="px-6 py-4 font-medium">Quiz</th>
                    <th className="px-6 py-4 font-medium">Questions</th>
                    <th className="px-6 py-4 font-medium">Best Score</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((q) => (
                    <tr
                      key={q._id}
                      className={`border-b last:border-0 ${
                        isDark
                          ? "border-slate-800 hover:bg-slate-900/40"
                          : "border-slate-50 hover:bg-slate-50"
                      }`}
                    >
                      <td
                        className={`px-6 py-4 font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {q.courseTitle}
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {q.quizTitle}
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {q.questions.length}
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {q.bestScore}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleStartQuiz(q)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-1.5 rounded-full font-semibold text-xs transition-colors"
                        >
                          Start
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default StudentQuizzesPage;