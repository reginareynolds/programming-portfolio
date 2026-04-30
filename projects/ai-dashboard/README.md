# AI Dashboard

A full-stack analytics dashboard that lets users ask questions about data in plain English. An LLM translates natural language into SQL, executes it against a PostgreSQL database, and returns interactive visualizations.

## Features

- **Natural language querying** — type a question, get a chart or table
- **Demo dataset** — 500 synthetic sales records ready to explore out of the box
- **CSV upload** — bring your own data and query it immediately
- **Smart chart selection** — the LLM picks bar, line, pie, table, or single-number display based on the question
- **Query history** — revisit previous results in one click
- **SQL transparency** — expand any result to see the generated SQL

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Vite, Recharts               |
| Backend   | Flask, SQLAlchemy, LangChain        |
| Database  | PostgreSQL                           |
| LLM       | Groq API (Llama 3.3 70B, free tier) |
| Deploy    | Docker Compose, Nginx, Gunicorn     |

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  React   │────▶│  Flask   │────▶│ LangChain│────▶│   Groq   │
│ Frontend │◀────│   API    │◀────│  + LLM   │◀────│ (Llama)  │
└──────────┘     └────┬─────┘     └──────────┘     └──────────┘
                      │
                 ┌────▼─────┐
                 │PostgreSQL│
                 └──────────┘
```

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
cp .env.example .env        # then edit .env with your Groq key
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

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

## Making It Accessible to Others

### Option A: Cloud VM (Recommended for portfolios)

1. Spin up a small VM on **DigitalOcean**, **AWS EC2**, or **Render**
2. Install Docker and Docker Compose
3. Clone this repo and run `docker compose up -d`
4. Point a domain name to the VM's IP
5. Add HTTPS with Let's Encrypt / Caddy

Cost: ~$5-12/month for a small VM.

### Option B: Render.com (Simpler, free tier available)

1. Deploy the backend as a **Web Service** (Docker)
2. Deploy the frontend as a **Static Site** (build command: `npm run build`, publish: `dist/`)
3. Add a **Render PostgreSQL** database (free tier: 256MB)
4. Set `GROQ_API_KEY` and `DATABASE_URL` as environment variables

### Option C: Railway.app

1. Connect your GitHub repo
2. Railway auto-detects the Docker Compose setup
3. Add environment variables in the Railway dashboard
4. Get a public URL automatically

### Important notes for deployment

- The **Groq API key** stays on the server — visitors never see it
- Groq's free tier allows 30 requests/minute, which is plenty for a portfolio
- For higher traffic, add rate limiting to the `/api/query` endpoint

## Example Queries

- "What is the total revenue by region?"
- "Show monthly profit trend"
- "Which product has the highest sales?"
- "Compare revenue across customer segments"
- "Top 5 products by quantity sold"
- "What percentage of sales come from each category?"
