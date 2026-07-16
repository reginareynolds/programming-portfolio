import { useState } from "react";
import PlaceholderImage from "../Shared/PlaceholderImage.jsx";
import Lightbox from "../Shared/Lightbox.jsx";
import "./DetailGallery.css";

function DetailGallery({ images }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <div className="detail-gallery">
      {images.map((img, i) => (
        <figure key={i} className="detail-item">
          <button
            className="detail-image"
            onClick={() => setLightboxIndex(i)}
            aria-label={`View full image: ${img.label}`}
          >
            <PlaceholderImage src={img.src} alt={img.label} className="detail-img" />
          </button>
          <figcaption className="detail-label">{img.label}</figcaption>
        </figure>
      ))}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

export default DetailGallery;
