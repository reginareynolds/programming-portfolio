export default function TaskCard({ task, projectName, onEdit, onDelete, onStatusChange }) {
  const isOverdue =
    task.due_date &&
    task.status !== "done" &&
    new Date(task.due_date) < new Date();

  return (
    <div className="task-card" onClick={() => onEdit(task)}>
      <div className="task-title">{task.title}</div>
      {task.description && <div className="task-desc">{task.description}</div>}
      <div className="task-meta">
        <span className={`priority-badge ${task.priority}`}>
          {task.priority}
        </span>
        {task.due_date && (
          <span className={`task-due ${isOverdue ? "overdue" : ""}`}>
            {new Date(task.due_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
        {projectName && <span className="task-project-tag">{projectName}</span>}
      </div>
      <div className="task-actions">
        {task.status !== "done" && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              const next = task.status === "todo" ? "in_progress" : "done";
              onStatusChange(task.id, next);
            }}
          >
            {task.status === "todo" ? "Start" : "Complete"}
          </button>
        )}
        {task.status === "done" && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, "todo");
            }}
          >
            Reopen
          </button>
        )}
        <button
          className="btn btn-sm btn-danger-ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
