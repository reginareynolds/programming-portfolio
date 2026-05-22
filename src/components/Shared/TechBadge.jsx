import "./TechBadge.css";

function TechBadge({ label, active, onClick }) {
  return (
    <button
      className={`tech-badge${active ? " tech-badge--active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      type="button"
      aria-label={`Filter projects by ${label}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default TechBadge;
