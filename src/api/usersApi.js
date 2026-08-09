import api from "./axios";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllUsers = async (page = 1, limit = 10) => {
  const res = await api.get(`/users/list?page=${page}&limit=${limit}`, { headers: authHeader() });
  return res.data;
};
export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data, { headers: authHeader() });
  return res.data;
};
export const createUser = async (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => formData.append(key, userData[key]));

  const res = await api.post("/users/ajouter", formData, {
    headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};