import { useEffect, useRef } from "react";
import "./Lightbox.css";

function Lightbox({ images, index, onClose, onNavigate }) {
  const containerRef = useRef(null);
  const closeRef = useRef(null);
  const image = images[index];

  // On open: lock scroll, move focus in; on close: restore both
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  useEffect(() => {
    // If the focused nav button unmounted (first/last image), recover focus
    if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
      closeRef.current?.focus();
    }

    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1) onNavigate(index + 1);
      if (e.key === "Tab") {
        const focusables = containerRef.current?.querySelectorAll("button");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose, onNavigate]);

  if (!image) return null;

  const resolvedSrc = import.meta.env.BASE_URL + image.src.replace(/^\//, "");

  return (
    <div
      ref={containerRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={image.label}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        className="lightbox-close"
        aria-label="Close full view"
        onClick={onClose}
      >
        &times;
      </button>

      {index > 0 && (
        <button
          className="lightbox-nav lightbox-nav--prev"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
        >
          &#8249;
        </button>
      )}

      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={resolvedSrc} alt={image.label} className="lightbox-img" />
        <figcaption className="lightbox-caption">{image.label}</figcaption>
      </figure>

      {index < images.length - 1 && (
        <button
          className="lightbox-nav lightbox-nav--next"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
        >
          &#8250;
        </button>
      )}
    </div>
  );
}

export default Lightbox;
