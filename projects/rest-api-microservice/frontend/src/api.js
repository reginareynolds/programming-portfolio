import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({ baseURL: API_BASE });

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export const register = (username, email, password) =>
  api.post("/api/auth/register", { username, email, password }).then((r) => r.data);

export const login = (username, password) =>
  api.post("/api/auth/login", { username, password }).then((r) => r.data);

export const getMe = () =>
  api.get("/api/auth/me").then((r) => r.data);

export const fetchProjects = (params) =>
  api.get("/api/projects", { params }).then((r) => r.data);

export const createProject = (name, description) =>
  api.post("/api/projects", { name, description }).then((r) => r.data);

export const deleteProject = (id) =>
  api.delete(`/api/projects/${id}`);

export const fetchTasks = (params) =>
  api.get("/api/tasks", { params }).then((r) => r.data);

export const createTask = (data) =>
  api.post("/api/tasks", data).then((r) => r.data);

export const updateTask = (id, data) =>
  api.put(`/api/tasks/${id}`, data).then((r) => r.data);

export const deleteTask = (id) =>
  api.delete(`/api/tasks/${id}`);
