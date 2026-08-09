import api from "./axios";


const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyEnrollments = async () => {
  const res = await api.get("/inscriptions/my", { headers: authHeader() });
  return res.data;
};

export const enrollInCourse = async (courseId) => {
  const res = await api.post(`/cours/${courseId}/enroll`, {}, { headers: authHeader() });
  return res.data;
};

export const getMyCertificates = async () => {
  const res = await api.get("/inscriptions/certificates", { headers: authHeader() });
  return res.data;
};

