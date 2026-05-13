export const DEMO_USER = {
  id: 1,
  username: "demo_user",
  email: "demo@example.com",
  created_at: "2026-04-01T00:00:00",
};

export const DEMO_PROJECTS = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Modernize the company website with new branding",
    task_count: 4,
    owner_id: 1,
    created_at: "2026-04-01T10:00:00",
    updated_at: "2026-05-10T14:30:00",
  },
  {
    id: 2,
    name: "Mobile App MVP",
    description: "Build the first version of our mobile app",
    task_count: 3,
    owner_id: 1,
    created_at: "2026-04-15T09:00:00",
    updated_at: "2026-05-12T11:00:00",
  },
  {
    id: 3,
    name: "API Documentation",
    description: "Write comprehensive API docs for partners",
    task_count: 3,
    owner_id: 1,
    created_at: "2026-05-01T08:00:00",
    updated_at: "2026-05-13T09:00:00",
  },
];

export const DEMO_TASKS = [
  { id: 1, title: "Design new homepage mockup", description: "Create Figma mockups for the hero section and navigation", status: "done", priority: "high", due_date: "2026-05-05", project_id: 1, created_at: "2026-04-02T10:00:00", updated_at: "2026-05-04T16:00:00" },
  { id: 2, title: "Implement responsive header", description: "Build the header component with mobile hamburger menu", status: "done", priority: "medium", due_date: "2026-05-10", project_id: 1, created_at: "2026-04-05T09:00:00", updated_at: "2026-05-09T14:00:00" },
  { id: 3, title: "Migrate blog to new CMS", description: "Move all existing blog posts to the new content management system", status: "in_progress", priority: "medium", due_date: "2026-05-20", project_id: 1, created_at: "2026-04-10T11:00:00", updated_at: "2026-05-12T10:00:00" },
  { id: 4, title: "Set up analytics tracking", description: "", status: "todo", priority: "low", due_date: "2026-05-25", project_id: 1, created_at: "2026-04-12T08:00:00", updated_at: "2026-04-12T08:00:00" },

  { id: 5, title: "Set up React Native project", description: "Initialize project with Expo and configure navigation", status: "done", priority: "high", due_date: "2026-04-20", project_id: 2, created_at: "2026-04-16T10:00:00", updated_at: "2026-04-19T17:00:00" },
  { id: 6, title: "Build authentication screens", description: "Login, register, and password reset flows", status: "in_progress", priority: "high", due_date: "2026-05-15", project_id: 2, created_at: "2026-04-20T09:00:00", updated_at: "2026-05-11T13:00:00" },
  { id: 7, title: "Design app icon and splash screen", description: "", status: "todo", priority: "low", due_date: "2026-05-30", project_id: 2, created_at: "2026-04-22T14:00:00", updated_at: "2026-04-22T14:00:00" },

  { id: 8, title: "Document authentication endpoints", description: "Write docs for register, login, and token refresh", status: "in_progress", priority: "high", due_date: "2026-05-18", project_id: 3, created_at: "2026-05-02T10:00:00", updated_at: "2026-05-13T08:00:00" },
  { id: 9, title: "Add request/response examples", description: "Include curl examples and JSON samples for each endpoint", status: "todo", priority: "medium", due_date: "2026-05-22", project_id: 3, created_at: "2026-05-03T09:00:00", updated_at: "2026-05-03T09:00:00" },
  { id: 10, title: "Set up Swagger UI", description: "Deploy interactive API documentation", status: "todo", priority: "medium", due_date: "2026-05-28", project_id: 3, created_at: "2026-05-05T11:00:00", updated_at: "2026-05-05T11:00:00" },
];
