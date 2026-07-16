import { useState } from "react";
import PlaceholderImage from "../Shared/PlaceholderImage.jsx";
import Lightbox from "../Shared/Lightbox.jsx";
import "./ProcessBreakdown.css";

function ProcessBreakdown({ steps, pieceTitle }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <div className="process-breakdown">
      {steps.map((step, i) => (
        <div key={i} className="process-step">
          <button
            className="step-image"
            onClick={() => setLightboxIndex(i)}
            aria-label={`View full image: ${step.label}`}
          >
            <PlaceholderImage src={step.src} alt={pieceTitle ? `${step.label} — ${pieceTitle}` : step.label} className="step-img" />
          </button>
          <div className="step-label">
            <span className="step-number">{i + 1}</span>
            {step.label}
          </div>
        </div>
      ))}
      {lightboxIndex !== null && (
        <Lightbox
          images={steps}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

export default ProcessBreakdown;
