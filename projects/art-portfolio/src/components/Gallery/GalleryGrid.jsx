import { useState, useRef } from "react";
import GalleryCard from "./GalleryCard.jsx";
import useGridColumns from "../../useGridColumns.js";
import "./GalleryGrid.css";

function GalleryGrid({ pieces }) {
  const [filterSkill, setFilterSkill] = useState(null);
  const hasFiltered = useRef(false);
  const [gridRef, columns] = useGridColumns();

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
      <div className="gallery-grid" ref={gridRef}>
        {pieces.map((piece, index) => (
          <GalleryCard
            key={piece.id}
            piece={piece}
            row={Math.floor(index / columns)}
            columns={columns}
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

export default GalleryGrid;
