import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "data", "db.json");

function ensureDir() {
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function read() {
  if (!existsSync(DB_PATH)) {
    return { models: [], annotations: [] };
  }
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

function write(data) {
  ensureDir();
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getAllModels() {
  return read().models;
}

export function getModelById(id) {
  return read().models.find((m) => m.id === id) || null;
}

export function createModel(model) {
  const data = read();
  data.models.push(model);
  write(data);
  return model;
}

export function deleteModel(id) {
  const data = read();
  data.models = data.models.filter((m) => m.id !== id);
  data.annotations = data.annotations.filter((a) => a.modelId !== id);
  write(data);
}

export function getAnnotations(modelId) {
  return read().annotations.filter((a) => a.modelId === modelId);
}

export function createAnnotation(annotation) {
  const data = read();
  data.annotations.push(annotation);
  write(data);
  return annotation;
}

export function updateAnnotation(id, updates) {
  const data = read();
  const idx = data.annotations.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  data.annotations[idx] = { ...data.annotations[idx], ...updates };
  write(data);
  return data.annotations[idx];
}

export function deleteAnnotation(id) {
  const data = read();
  data.annotations = data.annotations.filter((a) => a.id !== id);
  write(data);
}
