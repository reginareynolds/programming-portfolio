# Task Manager REST API

A production-grade RESTful API for task and project management with JWT authentication, input validation, pagination, filtering, and comprehensive test coverage.

## Features

- **JWT Authentication** — register, login, and token-protected endpoints
- **Projects** — CRUD operations with per-user isolation
- **Tasks** — full CRUD with status, priority, due dates, and project association
- **Filtering & sorting** — filter tasks by status, priority, or project; sort by any field
- **Pagination** — configurable page size with total counts
- **Input validation** — Marshmallow schemas with clear error messages
- **Cascade deletes** — deleting a project removes its tasks
- **User isolation** — users can only access their own data
- **CI/CD** — GitHub Actions pipeline runs tests on every push

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Flask                             |
| Database   | PostgreSQL (SQLite for tests)     |
| Auth       | Flask-JWT-Extended (JWT tokens)   |
| Validation | Marshmallow                       |
| Tests      | pytest + pytest-cov               |
| CI/CD      | GitHub Actions                    |
| Deploy     | Railway (API + Postgres)          |

## Architecture

```
┌──────────┐         ┌──────────┐
│  Client  │<------->│  Flask   │
│  (curl)  │  REST   │   API    │
└──────────┘         └────┬─────┘
                          │
                     ┌────v─────┐
                     │PostgreSQL│
                     └──────────┘
```

## Live Demo

- **API:** https://rest-api-microservice-api-production.up.railway.app

## Quick Start

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
python wsgi.py
```

Runs on `http://localhost:5001`.

Environment variables (see `.env.example`):

| Variable         | Required | Default                                                  |
|------------------|----------|----------------------------------------------------------|
| `DATABASE_URL`   | No       | `postgresql://postgres:postgres@localhost:5432/taskmanager` |
| `JWT_SECRET_KEY` | No       | `dev-secret-key`                                         |

## Running Tests

```bash
pytest -v --cov=app --cov-report=term-missing
```

## Docker Deployment

```bash
docker compose up --build
```

## API Endpoints

### Auth

| Method | Endpoint           | Description           | Auth |
|--------|--------------------|-----------------------|------|
| POST   | `/api/auth/register` | Create account       | No   |
| POST   | `/api/auth/login`    | Get access token     | No   |
| GET    | `/api/auth/me`       | Get current user     | Yes  |

### Projects

| Method | Endpoint               | Description          | Auth |
|--------|------------------------|----------------------|------|
| GET    | `/api/projects`        | List projects        | Yes  |
| GET    | `/api/projects/:id`    | Get project + tasks  | Yes  |
| POST   | `/api/projects`        | Create project       | Yes  |
| PUT    | `/api/projects/:id`    | Update project       | Yes  |
| DELETE | `/api/projects/:id`    | Delete project       | Yes  |

### Tasks

| Method | Endpoint            | Description        | Auth |
|--------|---------------------|--------------------|------|
| GET    | `/api/tasks`        | List tasks (filterable) | Yes |
| GET    | `/api/tasks/:id`    | Get task           | Yes  |
| POST   | `/api/tasks`        | Create task        | Yes  |
| PUT    | `/api/tasks/:id`    | Update task        | Yes  |
| DELETE | `/api/tasks/:id`    | Delete task        | Yes  |

### Query Parameters (GET /api/tasks)

| Param       | Type   | Description                          |
|-------------|--------|--------------------------------------|
| `status`    | string | Filter: `todo`, `in_progress`, `done` |
| `priority`  | string | Filter: `low`, `medium`, `high`       |
| `project_id`| int    | Filter by project                     |
| `sort`      | string | Sort field (default: `created_at`)    |
| `order`     | string | `asc` or `desc` (default: `desc`)     |
| `page`      | int    | Page number (default: 1)              |
| `per_page`  | int    | Items per page (default: 20, max: 100)|

## Example Usage

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"secret123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"secret123"}' | jq -r .access_token)

# Create project
curl -X POST http://localhost:5001/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Portfolio","description":"My portfolio projects"}'

# Create task
curl -X POST http://localhost:5001/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Write README","project_id":1,"priority":"high"}'

# List tasks filtered by priority
curl "http://localhost:5001/api/tasks?priority=high" \
  -H "Authorization: Bearer $TOKEN"
```
