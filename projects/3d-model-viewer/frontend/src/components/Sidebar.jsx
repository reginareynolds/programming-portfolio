import { useCallback, useState } from "react";

export default function Sidebar({
  models,
  activeModelId,
  onSelectModel,
  onUpload,
  onDeleteModel,
  annotations,
  annotateMode,
  onToggleAnnotate,
  onDeleteAnnotation,
  uploading,
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) onUpload(file);
      e.target.value = "";
    },
    [onUpload]
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>Models</h2>
        <div
          className={`upload-zone ${dragActive ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <label className="upload-label">
            <input
              type="file"
              accept=".glb,.gltf,.obj,.stl"
              onChange={handleFileChange}
              hidden
              disabled={uploading}
            />
            {uploading ? "Uploading..." : "Drop file or click to upload"}
            <span className="upload-formats">.glb .gltf .obj .stl</span>
          </label>
        </div>

        <ul className="model-list">
          {models.map((model) => (
            <li
              key={model.id}
              className={`model-item ${model.id === activeModelId ? "active" : ""}`}
            >
              <button
                className="model-select"
                onClick={() => onSelectModel(model.id)}
              >
                <span className="model-name">{model.name}</span>
                <span className="model-format">{model.format.toUpperCase()}</span>
              </button>
              <button
                className="model-delete"
                onClick={() => onDeleteModel(model.id)}
                title="Delete model"
              >
                x
              </button>
            </li>
          ))}
          {models.length === 0 && (
            <li className="model-item empty">No models uploaded yet</li>
          )}
        </ul>
      </div>

      {activeModelId && (
        <div className="sidebar-section">
          <div className="section-header">
            <h2>Annotations</h2>
            <button
              className={`annotate-toggle ${annotateMode ? "active" : ""}`}
              onClick={onToggleAnnotate}
            >
              {annotateMode ? "Done" : "+ Add"}
            </button>
          </div>

          <ul className="annotation-list">
            {annotations.map((ann) => (
              <li key={ann.id} className="annotation-item">
                <span>{ann.label}</span>
                <button onClick={() => onDeleteAnnotation(ann.id)}>x</button>
              </li>
            ))}
            {annotations.length === 0 && (
              <li className="annotation-item empty">No annotations</li>
            )}
          </ul>
        </div>
      )}
    </aside>
  );
}
