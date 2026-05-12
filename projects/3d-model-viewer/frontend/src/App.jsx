import { useState, useEffect, useCallback } from "react";
import Viewer from "./components/Viewer";
import Sidebar from "./components/Sidebar";
import AnnotationDialog from "./components/AnnotationDialog";
import {
  fetchModels,
  uploadModel,
  deleteModel,
  fetchAnnotations,
  createAnnotation,
  deleteAnnotationApi,
  getModelUrl,
} from "./api";
import "./App.css";

const DEMO_MODEL = {
  id: "demo",
  name: "Demo Torus Knot",
  filename: "__demo__",
  format: "demo",
};

const DEMO_ANNOTATIONS = [
  { id: "demo-1", label: "Top curve", position: { x: 0, y: 0.85, z: 0.3 } },
  { id: "demo-2", label: "Inner loop", position: { x: -0.5, y: -0.2, z: 0.6 } },
  { id: "demo-3", label: "Base section", position: { x: 0.4, y: -0.7, z: -0.3 } },
];

export default function App() {
  const [models, setModels] = useState([]);
  const [activeModelId, setActiveModelId] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [annotateMode, setAnnotateMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const activeModel = models.find((m) => m.id === activeModelId) || null;

  useEffect(() => {
    fetchModels()
      .then((data) => {
        if (data.length > 0) {
          setModels(data);
          setActiveModelId(data[0].id);
        } else {
          setModels([DEMO_MODEL]);
          setActiveModelId("demo");
          setAnnotations(DEMO_ANNOTATIONS);
        }
      })
      .catch(() => {
        setModels([DEMO_MODEL]);
        setActiveModelId("demo");
        setAnnotations(DEMO_ANNOTATIONS);
      });
  }, []);

  useEffect(() => {
    if (!activeModelId || activeModelId === "demo") return;
    fetchAnnotations(activeModelId)
      .then(setAnnotations)
      .catch(() => setAnnotations([]));
  }, [activeModelId]);

  const handleUpload = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    try {
      const model = await uploadModel(file);
      setModels((prev) => [...prev, model]);
      setActiveModelId(model.id);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDeleteModel = useCallback(
    async (id) => {
      try {
        await deleteModel(id);
        setModels((prev) => prev.filter((m) => m.id !== id));
        if (activeModelId === id) {
          setActiveModelId(null);
          setAnnotations([]);
        }
      } catch {
        setError("Failed to delete model");
      }
    },
    [activeModelId]
  );

  const handleAnnotationPlace = useCallback((position, normal) => {
    setPendingPoint({ position, normal });
  }, []);

  const handleAnnotationConfirm = useCallback(
    async (label) => {
      if (!pendingPoint || !activeModelId) return;
      try {
        const ann = await createAnnotation(activeModelId, {
          label,
          position: pendingPoint.position,
          normal: pendingPoint.normal,
        });
        setAnnotations((prev) => [...prev, ann]);
      } catch {
        setError("Failed to save annotation");
      }
      setPendingPoint(null);
    },
    [pendingPoint, activeModelId]
  );

  const handleAnnotationDelete = useCallback(
    async (id) => {
      if (!activeModelId) return;
      try {
        await deleteAnnotationApi(activeModelId, id);
        setAnnotations((prev) => prev.filter((a) => a.id !== id));
      } catch {
        setError("Failed to delete annotation");
      }
    },
    [activeModelId]
  );

  return (
    <div className="app">
      <header className="app-header">
        <a href={import.meta.env.VITE_PORTFOLIO_URL || "https://reginareynolds.vercel.app"} className="back-link">&larr; Portfolio</a>
        <div>
          <h1>3D Model Viewer</h1>
          <p>Upload, inspect, and annotate 3D models</p>
        </div>
      </header>

      <div className="app-body">
        <Sidebar
          models={models}
          activeModelId={activeModelId}
          onSelectModel={setActiveModelId}
          onUpload={handleUpload}
          onDeleteModel={handleDeleteModel}
          annotations={annotations}
          annotateMode={annotateMode}
          onToggleAnnotate={() => setAnnotateMode((prev) => !prev)}
          onDeleteAnnotation={handleAnnotationDelete}
          uploading={uploading}
        />

        <main className="main-content">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {activeModel ? (
            <Viewer
              modelUrl={getModelUrl(activeModel.filename)}
              format={activeModel.format}
              annotations={annotations}
              annotateMode={annotateMode}
              onAnnotationPlace={handleAnnotationPlace}
              onAnnotationDelete={handleAnnotationDelete}
            />
          ) : (
            <div className="empty-state">
              <h2>No model selected</h2>
              <p>Upload a 3D model (.glb, .gltf, .obj, .stl) to get started</p>
            </div>
          )}
        </main>
      </div>

      {pendingPoint && (
        <AnnotationDialog
          onConfirm={handleAnnotationConfirm}
          onCancel={() => setPendingPoint(null)}
        />
      )}
    </div>
  );
}
