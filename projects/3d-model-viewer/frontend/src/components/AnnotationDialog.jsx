import { useState, useEffect, useRef } from "react";

export default function AnnotationDialog({ onConfirm, onCancel }) {
  const [label, setLabel] = useState("");
  const dialogRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (label.trim()) {
      onConfirm(label.trim());
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'input, button:not([disabled])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="dialog-overlay" role="dialog" aria-label="Add annotation">
      <form className="dialog" ref={dialogRef} onSubmit={handleSubmit}>
        <h3>Add Annotation</h3>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label..."
          aria-label="Annotation label"
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
