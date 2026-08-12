
import api from "./axios";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const getAllStudents = async (page = 1, limit = 10) => {
  const res = await api.get("/users/students", {
    params: {
      page,
      limit,
    },
    headers: authHeader(),
  });

  return res.data;
};
