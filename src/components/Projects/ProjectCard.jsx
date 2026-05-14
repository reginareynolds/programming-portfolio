import TechBadge from "../Shared/TechBadge.jsx";
import "./ProjectCard.css";

const gradientAngles = [135, 160, 200, 180, 145];

function ProjectCard({ project }) {
  const idx = ["ai-dashboard", "3d-model-viewer", "rest-api-microservice", "iot-data-simulator", "art-portfolio"].indexOf(project.id);
  const initials = project.title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  return (
    <div className="project-card reveal reveal-stagger">
      <div className="project-card-thumb">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="project-card-img"
          />
        ) : (
          <div
            className="project-card-placeholder"
            style={{
              background: `linear-gradient(${gradientAngles[idx] || 135}deg, rgba(99,102,241,0.3), rgba(129,140,248,0.1))`,
            }}
          >
            <span className="project-card-initials">{initials}</span>
          </div>
        )}
        <span className="project-card-type">{project.type}</span>
      </div>
      <div className="project-card-body">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-desc">{project.description}</p>
        <div className="project-card-stack">
          {project.stack.map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>
        <div className="project-card-links">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
