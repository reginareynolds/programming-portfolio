import SectionHeading from "../Shared/SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";
import projects from "../../data/projects.js";
import "./Projects.css";

function Projects() {
  return (
    <section id="projects" className="section">
      <SectionHeading>Projects</SectionHeading>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
