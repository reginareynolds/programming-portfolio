import { Link } from "react-router-dom";
import PlaceholderImage from "../Shared/PlaceholderImage";
import TechBadge from "../Shared/TechBadge";
import "./GalleryCard.css";

export default function GalleryCard({ piece, dimmed, activeSkill, onBadgeClick }) {
  return (
    <Link to={`/piece/${piece.id}`} className={`gallery-card${dimmed ? " gallery-card--dimmed" : ""}`}>
      <div className="card-image">
        <PlaceholderImage src={piece.thumbnail} alt={piece.title} className="card-img" />
        {piece.hasModel && <span className="card-3d-badge">3D</span>}
        {piece.videoPath && <span className="card-video-badge">Video</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{piece.title}</h3>
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
    </Link>
  );
}
