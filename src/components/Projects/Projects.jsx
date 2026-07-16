import { useState, useRef } from "react";
import SectionHeading from "../Shared/SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";
import projects from "../../data/projects.js";
import useScrollReveal from "../../useScrollReveal.js";
import useGridColumns from "../../useGridColumns.js";
import "./Projects.css";

function Projects() {
  const ref = useScrollReveal();
  const [gridRef, columns] = useGridColumns();
  const [filterSkill, setFilterSkill] = useState(null);
  const hasFiltered = useRef(false);

  function handleBadgeClick(skill) {
    hasFiltered.current = true;
    setFilterSkill((prev) => (prev === skill ? null : skill));
  }

  return (
    <section id="projects" className="section" ref={ref}>
      <SectionHeading>Projects</SectionHeading>
      {filterSkill && (
        <div className="filter-pill">
          Showing: {filterSkill}
          <button onClick={() => setFilterSkill(null)} aria-label="Clear filter">
            &times;
          </button>
        </div>
      )}
      <div className="projects-grid" ref={gridRef}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            row={Math.floor(index / columns)}
            columns={columns}
            dimmed={filterSkill && !project.stack.includes(filterSkill)}
            activeSkill={filterSkill}
            onBadgeClick={handleBadgeClick}
            skipReveal={hasFiltered.current}
          />
        ))}
      </div>
    </section>
  );
}

export default Projects;
