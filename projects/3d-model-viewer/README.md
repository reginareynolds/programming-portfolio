# 3D Model Viewer

A web-based 3D model viewer for uploading, inspecting, and annotating 3D files directly in the browser. Supports multiple industry-standard formats and persists models and annotations on the server.

## Features

- **Multi-format support** — upload and view `.glb`, `.gltf`, `.obj`, and `.stl` files
- **Interactive 3D viewport** — orbit, zoom, and pan with mouse controls
- **Click-to-annotate** — place labeled pins anywhere on a model's surface
- **Persistent storage** — models and annotations are saved server-side
- **Model library** — manage multiple uploaded models in the sidebar
- **Studio lighting** — HDRI environment for realistic material rendering
- **Auto-scaling** — models are automatically normalized to fit the viewport
- **Demo fallback** — frontend loads sample models when backend is unavailable

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React, Three.js, React Three Fiber, Drei      |
| Backend  | Node.js, Express, Multer                       |
| Storage  | File system (models) + JSON store (metadata)   |
| Infra    | Docker, Docker Compose                          |
| Deploy   | Railway (backend), Vercel (frontend)             |

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   React + R3F   │<------->│  Express API    │
│   3D Viewport   │  REST   │  File uploads   │
│   Annotations   │         │   JSON store    │
└─────────────────┘         └─────────────────┘
```

## Live Demo

- **Frontend:** https://reginareynolds-3d-viewer.vercel.app
- **Backend:** https://3d-model-viewer-api-production.up.railway.app

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:3001`.

Backend environment variables (optional):

| Variable       | Required | Default                |
|----------------|----------|------------------------|
| `PORT`         | No       | `3001`                 |
| `STORAGE_PATH` | No       | `./uploads`            |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

Frontend environment variables (optional):

| Variable       | Required | Default                      |
|----------------|----------|------------------------------|
| `VITE_API_URL` | No       | `http://localhost:3001`      |

## Docker Deployment

```bash
docker compose up --build
```

Visit `http://localhost`. Models and annotations persist across restarts via Docker volumes.

## API Endpoints

| Method   | Endpoint                              | Description              |
|----------|---------------------------------------|--------------------------|
| `GET`    | `/api/models`                         | List all models          |
| `GET`    | `/api/models/:id`                     | Get model details        |
| `POST`   | `/api/models`                         | Upload a model (multipart) |
| `DELETE` | `/api/models/:id`                     | Delete a model           |
| `GET`    | `/api/models/:id/annotations`         | List annotations         |
| `POST`   | `/api/models/:id/annotations`         | Create annotation        |
| `PUT`    | `/api/models/:id/annotations/:annId`  | Update annotation        |
| `DELETE` | `/api/models/:id/annotations/:annId`  | Delete annotation        |

## Supported Formats

| Format | Extension | Notes                                        |
|--------|-----------|----------------------------------------------|
| glTF   | `.glb`, `.gltf` | Web standard, preserves materials and textures |
| OBJ    | `.obj`    | Widely used in CAD/DCC pipelines              |
| STL    | `.stl`    | Common in 3D printing and engineering          |
