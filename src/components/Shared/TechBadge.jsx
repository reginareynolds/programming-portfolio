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
    >
      {label}
    </button>
  );
}

export default TechBadge;
