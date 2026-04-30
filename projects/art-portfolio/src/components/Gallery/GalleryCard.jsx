import { Link } from "react-router-dom";
import PlaceholderImage from "../Shared/PlaceholderImage";
import ToolBadge from "../Shared/ToolBadge";
import "./GalleryCard.css";

export default function GalleryCard({ piece }) {
  return (
    <Link to={`/piece/${piece.id}`} className="gallery-card">
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
            <ToolBadge key={tool} name={tool} />
          ))}
        </div>
      </div>
    </Link>
  );
}
