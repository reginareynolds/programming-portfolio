import SectionHeading from "../Shared/SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";
import projects from "../../data/projects.js";
import useScrollReveal from "../../useScrollReveal.js";
import "./Projects.css";

function Projects() {
  const ref = useScrollReveal();

  return (
    <section id="projects" className="section" ref={ref}>
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
