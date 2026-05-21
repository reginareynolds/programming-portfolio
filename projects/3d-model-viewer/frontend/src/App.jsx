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
  const [annotationCache, setAnnotationCache] = useState({});
  const [annotateMode, setAnnotateMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const activeModel = models.find((m) => m.id === activeModelId) || null;
  const annotations = annotationCache[activeModelId] || [];

  useEffect(() => {
    fetchModels()
      .then((data) => {
        if (data.length > 0) {
          setModels(data);
          setActiveModelId(data[0].id);
        } else {
          setModels([DEMO_MODEL]);
          setActiveModelId("demo");
          setAnnotationCache({ demo: DEMO_ANNOTATIONS });
        }
      })
      .catch(() => {
        setModels([DEMO_MODEL]);
        setActiveModelId("demo");
        setAnnotationCache({ demo: DEMO_ANNOTATIONS });
      });
  }, []);

  useEffect(() => {
    if (!activeModelId || activeModelId === "demo") return;
    if (annotationCache[activeModelId]) return;
    fetchAnnotations(activeModelId)
      .then((data) => setAnnotationCache((prev) => ({ ...prev, [activeModelId]: data })))
      .catch(() => setAnnotationCache((prev) => ({ ...prev, [activeModelId]: [] })));
  }, [activeModelId, annotationCache]);

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
        setAnnotationCache((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        if (activeModelId === id) {
          setActiveModelId(null);
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
      if (activeModelId === "demo") {
        const ann = {
          id: `demo-${Date.now()}`,
          label,
          position: pendingPoint.position,
          normal: pendingPoint.normal,
        };
        setAnnotationCache((prev) => ({
          ...prev,
          demo: [...(prev.demo || []), ann],
        }));
        setPendingPoint(null);
        return;
      }
      try {
        const ann = await createAnnotation(activeModelId, {
          label,
          position: pendingPoint.position,
          normal: pendingPoint.normal,
        });
        setAnnotationCache((prev) => ({
          ...prev,
          [activeModelId]: [...(prev[activeModelId] || []), ann],
        }));
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
      if (activeModelId === "demo") {
        setAnnotationCache((prev) => ({
          ...prev,
          demo: (prev.demo || []).filter((a) => a.id !== id),
        }));
        return;
      }
      try {
        await deleteAnnotationApi(activeModelId, id);
        setAnnotationCache((prev) => ({
          ...prev,
          [activeModelId]: (prev[activeModelId] || []).filter((a) => a.id !== id),
        }));
      } catch {
        setError("Failed to delete annotation");
      }
    },
    [activeModelId]
  );

  return (
    <div className="app">
      <nav className="top-bar">
        <a href={import.meta.env.VITE_PORTFOLIO_URL || "https://reginareynolds.vercel.app"} className="back-link">&larr; Portfolio</a>
      </nav>
      <header className="app-header">
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

        <main className="main-content" aria-label="3D model viewer">
          {error && (
            <div className="error-banner" aria-live="polite">
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
              <h2>Drop a model to begin</h2>
              <p>.glb &middot; .gltf &middot; .obj &middot; .stl</p>
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

      <footer className="app-footer">
        <p>
          &copy; 2026 Regina Reynolds &middot; React &middot; Three.js &middot; React Three Fiber &middot; Express &middot; Node.js
        </p>
      </footer>
    </div>
  );
}
