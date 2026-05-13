# AI Dashboard

A full-stack analytics dashboard that lets users ask questions about data in plain English. An LLM translates natural language into SQL, executes it against a PostgreSQL database, and returns interactive visualizations.

## Features

- **Natural language querying** — type a question, get a chart or table
- **Demo dataset** — 500 synthetic sales records ready to explore out of the box
- **CSV upload** — bring your own data and query it immediately
- **Smart chart selection** — the LLM picks bar, line, pie, table, or single-number display based on the question
- **Query history** — revisit previous results in one click
- **SQL transparency** — expand any result to see the generated SQL
- **Demo fallback** — frontend loads sample visualizations when backend is unavailable

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Vite, Recharts               |
| Backend   | Flask, SQLAlchemy, LangChain        |
| Database  | PostgreSQL                           |
| LLM       | Groq API (Llama 3.3 70B, free tier) |
| Deploy    | Railway (backend + DB), Vercel (frontend) |

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  React   │<--->│  Flask   │<--->│ LangChain│<--->│   Groq   │
│ Frontend │     │   API    │     │  + LLM   │     │ (Llama)  │
└──────────┘     └────┬─────┘     └──────────┘     └──────────┘
                      │
                 ┌────v─────┐
                 │PostgreSQL│
                 └──────────┘
```

## Live Demo

- **Frontend:** https://reginareynolds-ai-dashboard.vercel.app
- **Backend:** https://ai-dashboard-api-production.up.railway.app

## Quick Start (Local Development)

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL running locally (or use Docker)
- A free [Groq API key](https://console.groq.com)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # then edit .env with your keys
python app.py
```

Backend environment variables (see `.env.example`):

| Variable         | Required | Default                                          |
|------------------|----------|--------------------------------------------------|
| `GROQ_API_KEY`   | Yes      | —                                                |
| `DATABASE_URL`   | No       | `postgresql://postgres:postgres@localhost:5432/ai_dashboard` |
| `FLASK_SECRET_KEY` | No    | `dev-secret-key`                                 |

Runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. Set `VITE_API_URL` to override the default backend URL (`http://localhost:5000`).

## Docker Deployment

The entire stack runs with one command:

```bash
# Set your Groq API key
export GROQ_API_KEY=your_key_here

# Build and start all services
docker compose up --build
```

This starts:
- **PostgreSQL** on port 5432
- **Flask API** on port 5000
- **Nginx + React** on port 80

Visit `http://localhost` to use the app.

## Deployment

- **Backend + Database:** Flask API and PostgreSQL on Railway
- **Frontend:** React on Vercel

## Example Queries

- "What is the total revenue by region?"
- "Show monthly profit trend"
- "Which product has the highest sales?"
- "Compare revenue across customer segments"
- "Top 5 products by quantity sold"
- "What percentage of sales come from each category?"
