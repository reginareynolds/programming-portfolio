import GalleryCard from "./GalleryCard";
import "./GalleryGrid.css";

export default function GalleryGrid({ pieces }) {
  return (
    <div className="gallery-grid">
      {pieces.map((piece) => (
        <GalleryCard key={piece.id} piece={piece} />
      ))}
    </div>
  );
}
