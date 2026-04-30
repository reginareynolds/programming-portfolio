import asyncio
import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from simulator import SensorSimulator, PRODUCTION_LINES, NORMAL_RANGES, ALERT_THRESHOLDS

app = FastAPI(title="IoT Data Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = SensorSimulator()
connected_clients = set()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/config")
def get_config():
    return {
        "lines": PRODUCTION_LINES,
        "sensors": NORMAL_RANGES,
        "thresholds": ALERT_THRESHOLDS,
    }


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connected_clients.add(ws)
    try:
        while True:
            tick = simulator.generate_tick()
            await ws.send_text(json.dumps(tick))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        connected_clients.discard(ws)
    except Exception:
        connected_clients.discard(ws)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
