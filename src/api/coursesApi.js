import api from "./axios";

export const getAllCourses = async () => {
  const res = await api.get("/cours/list");
  return res.data;
};