import "./TechBadge.css";

function TechBadge({ label, active, onClick }) {
  if (!onClick) {
    return <span className="tech-badge">{label}</span>;
  }

  return (
    <button
      className={`tech-badge${active ? " tech-badge--active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      type="button"
      aria-label={`Filter pieces by ${label}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default TechBadge;
