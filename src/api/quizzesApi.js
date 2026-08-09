import api from "./axios";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllQuizzes = async (page = 1, limit = 10) => {
  const res = await api.get(`/quiz/list?page=${page}&limit=${limit}`, { headers: authHeader() });
  return res.data;
};
// Créer un nouveau quiz
export const createQuiz = async (quizData) => {
  const res = await api.post("/quiz/ajouter", quizData, {
    headers: authHeader(),
  });
  return res.data;
};
export const updateQuiz = async (id, quizData) => {
  const res = await api.put(`/quiz/${id}`, quizData, {
    headers: authHeader(),
  });
  return res.data;
};
// Supprimer un quiz
export const deleteQuiz = async (id) => {
  const res = await api.delete(`/quiz/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};