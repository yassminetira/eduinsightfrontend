import api from "./axios";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllStudents = async () => {
  const res = await api.get("/users/students", { headers: authHeader() });
  return res.data;
};