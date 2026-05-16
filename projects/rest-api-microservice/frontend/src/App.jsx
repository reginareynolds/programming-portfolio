import { useState, useEffect, useRef, useCallback } from "react";
import * as api from "./api";
import { DEMO_USER, DEMO_PROJECTS, DEMO_TASKS } from "./demoData";
import AuthForm from "./components/AuthForm";
import ProjectList from "./components/ProjectList";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import "./App.css";

const PORTFOLIO_URL =
  import.meta.env.VITE_PORTFOLIO_URL || "https://reginareynolds.vercel.app";

const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const [modalTask, setModalTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const nextDemoId = useRef(11);
  const deletingIds = useRef(new Set());

  // --- Auth handlers ---
  function handleAuth(userData, accessToken) {
    setUser(userData);
    setToken(accessToken);
    setDemoMode(false);
  }

  function handleDemoMode() {
    setUser(DEMO_USER);
    setDemoMode(true);
    setProjects(JSON.parse(JSON.stringify(DEMO_PROJECTS)));
    setTasks(JSON.parse(JSON.stringify(DEMO_TASKS)));
  }

  function handleLogout() {
    setUser(null);
    setToken(null);
    setDemoMode(false);
    setProjects([]);
    setTasks([]);
    setSelectedProjectId(null);
    api.setAuthToken(null);
  }

  // --- Data fetching ---
  const loadProjects = useCallback(async () => {
    if (demoMode) return;
    try {
      const data = await api.fetchProjects({ per_page: 100 });
      setProjects(data.projects || []);
    } catch {
      setError("Failed to load projects");
    }
  }, [demoMode]);

  const loadTasks = useCallback(async () => {
    if (demoMode) return;
    try {
      const params = { per_page: 100 };
      if (selectedProjectId) params.project_id = selectedProjectId;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      const data = await api.fetchTasks(params);
      setTasks(data.tasks || []);
    } catch {
      setError("Failed to load tasks");
    }
  }, [demoMode, selectedProjectId, filterStatus, filterPriority]);

  useEffect(() => {
    if (token && !demoMode) {
      loadProjects();
      loadTasks();
    }
  }, [token, demoMode, loadProjects, loadTasks]);

  // --- Project CRUD ---
  async function handleCreateProject(name) {
    if (demoMode) {
      const id = nextDemoId.current++;
      setProjects((prev) => [
        ...prev,
        {
          id,
          name,
          description: "",
          task_count: 0,
          owner_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      return;
    }
    try {
      await api.createProject(name, "");
      await loadProjects();
    } catch {
      setError("Failed to create project");
    }
  }

  async function handleDeleteProject(id) {
    const key = `project-${id}`;
    if (deletingIds.current.has(key)) return;
    deletingIds.current.add(key);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.project_id !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
    if (demoMode) { deletingIds.current.delete(key); return; }
    try {
      await api.deleteProject(id);
    } catch {
      // ignore — may have already been deleted
    }
    await loadProjects();
    await loadTasks();
    deletingIds.current.delete(key);
  }

  // --- Task CRUD ---
  async function handleSaveTask(taskData) {
    if (demoMode) {
      if (taskData.id) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskData.id
              ? { ...t, ...taskData, updated_at: new Date().toISOString() }
              : t
          )
        );
      } else {
        const id = nextDemoId.current++;
        setTasks((prev) => [
          ...prev,
          {
            ...taskData,
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === taskData.project_id
              ? { ...p, task_count: (p.task_count || 0) + 1 }
              : p
          )
        );
      }
      setShowModal(false);
      setModalTask(null);
      return;
    }
    try {
      if (taskData.id) {
        const { id, ...rest } = taskData;
        await api.updateTask(id, rest);
      } else {
        await api.createTask(taskData);
      }
      setShowModal(false);
      setModalTask(null);
      await loadProjects();
      await loadTasks();
    } catch {
      setError("Failed to save task");
    }
  }

  async function handleDeleteTask(id) {
    const key = `task-${id}`;
    if (deletingIds.current.has(key)) return;
    deletingIds.current.add(key);
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === task.project_id
            ? { ...p, task_count: Math.max(0, (p.task_count || 1) - 1) }
            : p
        )
      );
    }
    if (demoMode) { deletingIds.current.delete(key); return; }
    try {
      await api.deleteTask(id);
    } catch {
      // ignore — may have already been deleted
    }
    await loadProjects();
    await loadTasks();
    deletingIds.current.delete(key);
  }

  async function handleStatusChange(id, newStatus) {
    if (demoMode) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
            : t
        )
      );
      return;
    }
    try {
      await api.updateTask(id, { status: newStatus });
      await loadTasks();
    } catch {
      setError("Failed to update task");
    }
  }

  // --- Filtered tasks for display ---
  const displayTasks = demoMode
    ? tasks.filter((t) => {
        if (selectedProjectId && t.project_id !== selectedProjectId) return false;
        if (filterStatus && t.status !== filterStatus) return false;
        if (filterPriority && t.priority !== filterPriority) return false;
        return true;
      })
    : tasks;

  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));

  const columns = ["todo", "in_progress", "done"].map((status) => ({
    status,
    label: STATUS_LABELS[status],
    tasks: displayTasks.filter((t) => t.status === status),
  }));

  // --- Render ---
  return (
    <div className="app">
      <nav className="top-bar">
        <a href={PORTFOLIO_URL} className="back-link">
          &larr; Portfolio
        </a>
      </nav>

      <header className="app-header">
        <div className="header-content">
          <h1>Task Manager</h1>
          <p>Manage projects and tasks with a REST API backend</p>
        </div>
        {user && (
          <div className="header-right">
            {demoMode && <span className="demo-badge">Demo Mode</span>}
            <div className="user-info">
              <span>{user.username}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {error && (
        <div className="error-message" aria-live="polite">
          {error}
          <button
            className="btn-icon"
            style={{ marginLeft: "0.5rem" }}
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      <main className="app-main" aria-label="Task management workspace">
        {!user ? (
          <AuthForm onAuth={handleAuth} onDemoMode={handleDemoMode} />
        ) : (
          <div className="workspace">
            <ProjectList
              projects={projects}
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
            />
            <div className="content">
              <div className="filter-bar">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="filter-spacer" />
                <button
                  className="btn-new-task"
                  onClick={() => {
                    setModalTask(null);
                    setShowModal(true);
                  }}
                >
                  + New Task
                </button>
              </div>

              {displayTasks.length === 0 ? (
                <div className="empty-state">
                  <p>No tasks yet. Create one to get started.</p>
                </div>
              ) : (
                <div className="task-board">
                  {columns.map((col) => (
                    <div key={col.status} className="task-column">
                      <div className="task-column-header">
                        <span className={`status-dot ${col.status}`} />
                        {col.label}
                        <span className="column-count">{col.tasks.length}</span>
                      </div>
                      <div className="task-column-body">
                        {col.tasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            projectName={
                              !selectedProjectId
                                ? projectMap[task.project_id]
                                : null
                            }
                            onEdit={(t) => {
                              setModalTask(t);
                              setShowModal(true);
                            }}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          &copy; 2026 Regina Reynolds &middot; React &middot; Flask &middot; PostgreSQL &middot; JWT
        </p>
      </footer>

      {showModal && (
        <TaskModal
          task={modalTask}
          projects={projects}
          onSave={handleSaveTask}
          onClose={() => {
            setShowModal(false);
            setModalTask(null);
          }}
        />
      )}
    </div>
  );
}
