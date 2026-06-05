import TechBadge from "../Shared/TechBadge";
import "./PieceInfo.css";

export default function PieceInfo({ piece }) {
  return (
    <div className="piece-info">
      <div className="info-description">
        <p>{piece.description}</p>
      </div>
      <div className="info-metadata">
        <div className="meta-group">
          <h3>Tools</h3>
          <div className="meta-tools">
            {piece.tools.map((tool) => (
              <TechBadge key={tool} label={tool} onClick={() => {}} />
            ))}
          </div>
        </div>
        <div className="meta-group">
          <h3>Role</h3>
          <p>{piece.role}</p>
        </div>
        <div className="meta-group">
          <h3>Date</h3>
          <p>{piece.date}</p>
        </div>
        <div className="meta-group">
          <h3>Category</h3>
          <p>{piece.category}</p>
        </div>
        {piece.attribution && (
          <div className="meta-group">
            <h3>Attribution</h3>
            <p>
              {piece.attribution.url ? (
                <a
                  href={piece.attribution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="attribution-link"
                >
                  {piece.attribution.text}
                </a>
              ) : (
                piece.attribution.text
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
