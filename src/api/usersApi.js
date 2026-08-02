import api from "./axios";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllUsers = async () => {
  const res = await api.get("/users/list", { headers: authHeader() });
  return res.data;
};