import { useEffect, useRef } from "react";
import "./Lightbox.css";

function Lightbox({ images, index, onClose, onNavigate }) {
  const closeRef = useRef(null);
  const image = images[index];

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1) onNavigate(index + 1);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  if (!image) return null;

  const resolvedSrc = import.meta.env.BASE_URL + image.src.replace(/^\//, "");

  return (
    <div
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
