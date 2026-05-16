import { useState, useRef } from "react";
import SectionHeading from "../Shared/SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";
import projects from "../../data/projects.js";
import useScrollReveal from "../../useScrollReveal.js";
import "./Projects.css";

function Projects() {
  const ref = useScrollReveal();
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
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
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
