import { useState } from "react";

export default function ProjectList({
  projects,
  selectedId,
  onSelect,
  onCreateProject,
  onDeleteProject,
}) {
  const [newName, setNewName] = useState("");

  function handleCreate(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onCreateProject(name);
    setNewName("");
  }

  const totalTasks = projects.reduce((sum, p) => sum + (p.task_count || 0), 0);

  return (
    <aside className="sidebar" aria-label="Project navigation">
      <div className="sidebar-header">Projects</div>
      <div className="project-list">
        <div
          className={`project-item ${selectedId === null ? "active" : ""}`}
          onClick={() => onSelect(null)}
        >
          <div className="project-item-info">
            <div className="project-item-name">All Tasks</div>
          </div>
          <span className="project-count">{totalTasks}</span>
        </div>
        {projects.map((p) => (
          <div
            key={p.id}
            className={`project-item ${selectedId === p.id ? "active" : ""}`}
            onClick={() => onSelect(p.id)}
          >
            <div className="project-item-info">
              <div className="project-item-name">{p.name}</div>
              {p.description && (
                <div className="project-item-desc">{p.description}</div>
              )}
            </div>
            <span className="project-count">{p.task_count || 0}</span>
            <div className="project-actions">
              <button
                className="btn-icon"
                title="Delete project"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(p.id);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <form className="new-project-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="New project..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </aside>
  );
}
