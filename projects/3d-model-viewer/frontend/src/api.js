import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({ baseURL: API_BASE });

export async function fetchModels() {
  const { data } = await api.get("/api/models");
  return data;
}

export async function fetchModel(id) {
  const { data } = await api.get(`/api/models/${id}`);
  return data;
}

export async function uploadModel(file, name) {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);
  const { data } = await api.post("/api/models", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteModel(id) {
  await api.delete(`/api/models/${id}`);
}

export async function fetchAnnotations(modelId) {
  const { data } = await api.get(`/api/models/${modelId}/annotations`);
  return data;
}

export async function createAnnotation(modelId, annotation) {
  const { data } = await api.post(
    `/api/models/${modelId}/annotations`,
    annotation
  );
  return data;
}

export async function updateAnnotation(modelId, id, updates) {
  const { data } = await api.put(
    `/api/models/${modelId}/annotations/${id}`,
    updates
  );
  return data;
}

export async function deleteAnnotationApi(modelId, id) {
  await api.delete(`/api/models/${modelId}/annotations/${id}`);
}

export function getModelUrl(filename) {
  return `${API_BASE}/uploads/${filename}`;
}
