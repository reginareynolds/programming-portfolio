import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import {
  getModelsBySession,
  getModelById,
  createModel,
  deleteModel,
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from "./store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dirname, "..", "uploads");
const ALLOWED_EXTENSIONS = [".glb", ".gltf", ".obj", ".stl"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const id = uuidv4();
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported format. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`));
    }
  },
});

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

function ensureSession(req, res, next) {
  let sessionId = req.cookies.session_id;
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie("session_id", sessionId, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  req.sessionId = sessionId;
  next();
}

app.use(ensureSession);

// --- Model routes ---

app.get("/api/models", (req, res) => {
  res.json(getModelsBySession(req.sessionId));
});

app.get("/api/models/:id", (req, res) => {
  const model = getModelById(req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found" });
  res.json(model);
});

app.post("/api/models", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const ext = extname(req.file.originalname).toLowerCase();
  const model = createModel({
    id: req.file.filename.replace(ext, ""),
    name: req.body.name || req.file.originalname,
    filename: req.file.filename,
    originalName: req.file.originalname,
    format: ext.replace(".", ""),
    size: req.file.size,
    sessionId: req.sessionId,
    uploadedAt: new Date().toISOString(),
  });

  res.status(201).json(model);
});

app.delete("/api/models/:id", (req, res) => {
  const model = getModelById(req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found" });
  if (model.sessionId && model.sessionId !== req.sessionId) {
    return res.status(403).json({ error: "Not your model" });
  }

  const filePath = join(UPLOADS_DIR, model.filename);
  if (existsSync(filePath)) unlinkSync(filePath);

  deleteModel(req.params.id);
  res.status(204).end();
});

// --- Annotation routes ---

app.get("/api/models/:modelId/annotations", (req, res) => {
  res.json(getAnnotations(req.params.modelId));
});

app.post("/api/models/:modelId/annotations", (req, res) => {
  const model = getModelById(req.params.modelId);
  if (!model) return res.status(404).json({ error: "Model not found" });

  const { label, position, normal } = req.body;
  if (!label || !position) {
    return res.status(400).json({ error: "label and position are required" });
  }

  const annotation = createAnnotation({
    id: uuidv4(),
    modelId: req.params.modelId,
    label,
    position,
    normal: normal || null,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(annotation);
});

app.put("/api/models/:modelId/annotations/:id", (req, res) => {
  const updated = updateAnnotation(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Annotation not found" });
  res.json(updated);
});

app.delete("/api/models/:modelId/annotations/:id", (req, res) => {
  deleteAnnotation(req.params.id);
  res.status(204).end();
});

// --- Error handling ---

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`3D Model Viewer API running on port ${PORT}`);
});
