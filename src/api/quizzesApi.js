import api from "./axios";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllQuizzes = async () => {
  const res = await api.get("quiz/list", { headers: authHeader() });
  return res.data;
};