import { useState } from "react";

export default function AnnotationDialog({ onConfirm, onCancel }) {
  const [label, setLabel] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (label.trim()) {
      onConfirm(label.trim());
    }
  }

  return (
    <div className="dialog-overlay">
      <form className="dialog" onSubmit={handleSubmit}>
        <h3>Add Annotation</h3>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label..."
          autoFocus
          maxLength={100}
        />
        <div className="dialog-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-confirm" disabled={!label.trim()}>
            Place
          </button>
        </div>
      </form>
    </div>
  );
}
