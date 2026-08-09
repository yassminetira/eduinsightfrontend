import api from "./axios";

export const getAllCourses = async (page = 1, limit = 10) => {
  const res = await api.get(`/cours/list?page=${page}&limit=${limit}`);
  console.log("API COURSES RESPONSE:", res.data);
  return res.data;
};

export const createCourse = async (courseData) => {
  // Récupérer le token du localStorage
  const token = localStorage.getItem("token"); 
  const res = await api.post("/cours/ajouter", courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
// coursesApi.js
export const updateCourse = async (id, courseData) => {
  // 1. Récupérer le token depuis le localStorage (ajuste la clé selon ton app)
  const token = localStorage.getItem("token"); 

  // 2. Transmettre le token dans les headers de la requête
  const res = await api.put(`/cours/${id}`, courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const deleteCourse = async (id) => {
  
  const token = localStorage.getItem("token");
  const res = await api.delete(`/cours/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};