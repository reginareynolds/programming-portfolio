# IoT Data Simulator

A real-time industrial sensor data simulator with live WebSocket streaming and interactive visualization. Simulates three production lines with temperature, pressure, vibration, motor RPM, and power draw sensors, plus OEE (Overall Equipment Effectiveness) calculations.

Inspired by OEE monitoring systems deployed on industrial IoT gateways in manufacturing environments.

## Features

- **Real-time streaming** — WebSocket pushes sensor data every second
- **3 production lines** — each with 5 sensor types and independent OEE metrics
- **Live charts** — 60-second rolling time series for temperature, pressure, and vibration
- **Alert system** — warning and critical thresholds with visual indicators
- **OEE dashboard** — availability, performance, and quality breakdowns per line
- **Anomaly simulation** — random events trigger sensor spikes and line stoppages
- **Auto-reconnect** — WebSocket reconnects automatically on disconnect

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React, Vite, Recharts             |
| Backend  | FastAPI, WebSockets, uvicorn      |
| Protocol | WebSocket (real-time streaming)   |
| Deploy   | Docker Compose, Nginx             |

## Architecture

```
┌──────────────┐   WebSocket    ┌──────────────┐
│   React UI   │◀──────────────▶│   FastAPI     │
│  Live Charts │    (1s ticks)  │  Simulator    │
│  OEE Gauges  │                │  Engine       │
│  Alert Feed  │                │              │
└──────────────┘                └──────────────┘
```

## Simulated Sensors

| Sensor     | Range        | Warning   | Critical  | Unit  |
|------------|-------------|-----------|-----------|-------|
| Temperature| 60–85       | ≥82       | ≥90       | °C    |
| Pressure   | 28–35       | ≥33       | ≥38       | PSI   |
| Vibration  | 0.5–2.5     | ≥2.2      | ≥3.0      | mm/s  |
| Motor RPM  | 1400–1600   | ≥1550     | ≥1650     | RPM   |
| Power Draw | 12–18       | ≥17       | ≥20       | kW    |

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Runs on `http://localhost:8000`. WebSocket endpoint at `ws://localhost:8000/ws`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` with proxy to backend.

## Docker Deployment

```bash
docker compose up --build
```

Visit `http://localhost`. No configuration needed — the simulator generates data automatically.

## API Endpoints

| Method | Endpoint      | Description                          |
|--------|---------------|--------------------------------------|
| GET    | `/api/health` | Health check                         |
| GET    | `/api/config` | Get production line and sensor config |
| WS     | `/ws`         | WebSocket stream (1 tick/second)      |
