import { Link } from "react-router-dom";
import PlaceholderImage from "../Shared/PlaceholderImage.jsx";
import TechBadge from "../Shared/TechBadge.jsx";
import "./GalleryCard.css";

function GalleryCard({ piece, row, columns, dimmed, activeSkill, onBadgeClick, skipReveal }) {
  return (
    <div className={`gallery-card${skipReveal ? "" : " reveal reveal-stagger"}${dimmed ? " gallery-card--dimmed" : ""}`} style={skipReveal ? undefined : { transitionDelay: `${columns > 1 ? Math.min(row, 3) * 0.1 : 0}s` }}>
      <div className="card-image">
        <PlaceholderImage src={piece.thumbnail} alt={piece.title} className="card-img" />
        {piece.hasModel && <span className="card-3d-badge">3D</span>}
        {piece.videoPath && <span className="card-video-badge">Video</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/piece/${piece.id}`} className="card-link">{piece.title}</Link>
        </h3>
        <p className="card-subtitle">{piece.subtitle}</p>
        <div className="card-tools">
          {piece.tools.slice(0, 3).map((tool) => (
            <TechBadge
              key={tool}
              label={tool}
              active={activeSkill === tool}
              onClick={() => onBadgeClick(tool)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GalleryCard;
