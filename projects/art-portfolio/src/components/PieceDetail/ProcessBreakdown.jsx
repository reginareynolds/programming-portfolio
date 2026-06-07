import PlaceholderImage from "../Shared/PlaceholderImage.jsx";
import "./ProcessBreakdown.css";

function ProcessBreakdown({ steps }) {
  return (
    <div className="process-breakdown">
      {steps.map((step, i) => (
        <div key={i} className="process-step">
          <div className="step-image">
            <PlaceholderImage src={step.src} alt={step.label} className="step-img" />
          </div>
          <div className="step-label">
            <span className="step-number">{i + 1}</span>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProcessBreakdown;
