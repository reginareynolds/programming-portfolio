import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export async function fetchDemoSummary() {
  const { data } = await api.get("/api/demo/summary");
  return data;
}

export async function fetchDatasets() {
  const { data } = await api.get("/api/datasets");
  return data;
}

export async function uploadCSV(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function queryData(question, dataset = "demo") {
  const { data } = await api.post("/api/query", { question, dataset });
  return data;
}
