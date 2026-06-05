import { useState, useRef } from "react";
import GalleryCard from "./GalleryCard";
import "./GalleryGrid.css";

export default function GalleryGrid({ pieces }) {
  const [filterSkill, setFilterSkill] = useState(null);
  const hasFiltered = useRef(false);

  function handleBadgeClick(skill) {
    hasFiltered.current = true;
    setFilterSkill((prev) => (prev === skill ? null : skill));
  }

  return (
    <>
      {filterSkill && (
        <div className="filter-pill">
          Showing: {filterSkill}
          <button onClick={() => setFilterSkill(null)} aria-label="Clear filter">
            &times;
          </button>
        </div>
      )}
      <div className="gallery-grid">
        {pieces.map((piece) => (
          <GalleryCard
            key={piece.id}
            piece={piece}
            dimmed={filterSkill && !piece.tools.includes(filterSkill)}
            activeSkill={filterSkill}
            onBadgeClick={handleBadgeClick}
            skipReveal={hasFiltered.current}
          />
        ))}
      </div>
    </>
  );
}
