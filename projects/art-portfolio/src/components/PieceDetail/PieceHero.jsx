import PlaceholderImage from "../Shared/PlaceholderImage";
import "./PieceHero.css";

export default function PieceHero({ piece }) {
  return (
    <div className="piece-hero">
      <div className="hero-image">
        <PlaceholderImage src={piece.heroImage} alt={piece.title} className="hero-img" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-text">
        <h1>{piece.title}</h1>
        <p>{piece.subtitle}</p>
      </div>
    </div>
  );
}
