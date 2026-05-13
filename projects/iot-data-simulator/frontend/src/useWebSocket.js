import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
const MAX_HISTORY = 60;

const IDEAL_CYCLE_TIME = 0.5;

const lineOeeState = {
  "line-1": { downtimeTicks: 0, totalParts: 0, goodParts: 0, stoppedUntil: -1 },
  "line-2": { downtimeTicks: 0, totalParts: 0, goodParts: 0, stoppedUntil: -1 },
  "line-3": { downtimeTicks: 0, totalParts: 0, goodParts: 0, stoppedUntil: -1 },
};

function updateLine(lineId, index) {
  const state = lineOeeState[lineId];
  let stopped = index < state.stoppedUntil;

  if (!stopped && Math.random() < 0.05) {
    const duration = 5 + Math.floor(Math.random() * 10);
    state.stoppedUntil = index + duration;
    stopped = true;
  }

  if (stopped) {
    state.downtimeTicks++;
  } else {
    const partsThisTick = 2;
    state.totalParts += partsThisTick;
    const defects = Math.random() < 0.007 ? 1 : 0;
    state.goodParts += partsThisTick - defects;
  }

  const elapsed = index + 1;
  const runTicks = elapsed - state.downtimeTicks;
  const availability = runTicks / elapsed;
  const performance = runTicks > 0
    ? (state.totalParts * IDEAL_CYCLE_TIME) / runTicks
    : 0;
  const quality = state.totalParts > 0
    ? state.goodParts / state.totalParts
    : 1;
  const oee = availability * Math.min(performance, 1) * quality;

  return {
    stopped,
    oee: {
      availability: +(availability * 100).toFixed(1),
      performance: +(Math.min(performance, 1) * 100).toFixed(1),
      quality: +(quality * 100).toFixed(1),
      oee: +(oee * 100).toFixed(1),
    },
  };
}

function generateDemoTick(index) {
  const now = Date.now() / 1000 - (59 - index);
  const l1 = updateLine("line-1", index);
  const l2 = updateLine("line-2", index);
  const l3 = updateLine("line-3", index);
  const alerts = [];

  const lines = [
    {
      line_id: "line-1",
      line_name: "Packaging Line A",
      product: "Widget Pro X200",
      status: l1.stopped ? "stopped" : "running",
      sensors: {
        temperature: { value: +(68 + Math.sin(index * 0.15) * 12 + Math.random() * 3).toFixed(1), unit: "°C", alert: "" },
        pressure: { value: +(2.1 + Math.sin(index * 0.1) * 0.4 + Math.random() * 0.1).toFixed(2), unit: "bar", alert: "" },
        vibration: { value: +(3.2 + Math.cos(index * 0.12) * 1.5 + Math.random() * 0.5).toFixed(1), unit: "mm/s", alert: "" },
        humidity: { value: +(45 + Math.sin(index * 0.08) * 8).toFixed(0), unit: "%", alert: "" },
        speed: { value: l1.stopped ? 0 : +(120 + Math.sin(index * 0.05) * 15).toFixed(0), unit: "rpm", alert: "" },
      },
      oee: l1.oee,
    },
    {
      line_id: "line-2",
      line_name: "Packaging Line B",
      product: "Widget Lite S100",
      status: l2.stopped ? "stopped" : "running",
      sensors: {
        temperature: { value: +(62 + Math.cos(index * 0.13) * 8 + Math.random() * 2).toFixed(1), unit: "°C", alert: "" },
        pressure: { value: +(1.8 + Math.cos(index * 0.09) * 0.3 + Math.random() * 0.1).toFixed(2), unit: "bar", alert: "" },
        vibration: { value: +(2.8 + Math.sin(index * 0.11) * 1.2 + Math.random() * 0.3).toFixed(1), unit: "mm/s", alert: "" },
        humidity: { value: +(42 + Math.cos(index * 0.07) * 6).toFixed(0), unit: "%", alert: "" },
        speed: { value: l2.stopped ? 0 : +(105 + Math.cos(index * 0.06) * 10).toFixed(0), unit: "rpm", alert: "" },
      },
      oee: l2.oee,
    },
    {
      line_id: "line-3",
      line_name: "Assembly Line C",
      product: "Controller Unit M50",
      status: l3.stopped ? "stopped" : "running",
      sensors: {
        temperature: { value: +(55 + Math.sin(index * 0.1) * 6 + Math.random() * 2).toFixed(1), unit: "°C", alert: "" },
        pressure: { value: +(3.0 + Math.sin(index * 0.08) * 0.5 + Math.random() * 0.15).toFixed(2), unit: "bar", alert: "" },
        vibration: { value: +(4.5 + Math.sin(index * 0.14) * 2.5 + Math.random() * 0.8).toFixed(1), unit: "mm/s", alert: "" },
        humidity: { value: +(50 + Math.sin(index * 0.06) * 5).toFixed(0), unit: "%", alert: "" },
        speed: { value: l3.stopped ? 0 : +(90 + Math.sin(index * 0.04) * 12).toFixed(0), unit: "rpm", alert: "" },
      },
      oee: l3.oee,
    },
  ];

  for (const line of lines) {
    if (line.status === "stopped") {
      alerts.push({ level: "critical", line_name: line.line_name, sensor: "status", value: "stopped", unit: "" });
    }
    for (const [sensor, data] of Object.entries(line.sensors)) {
      if (data.alert === "warning" || data.alert === "critical") {
        alerts.push({ level: data.alert, line_name: line.line_name, sensor, value: data.value, unit: data.unit });
      }
    }
  }

  return { timestamp: now, alerts, lines };
}

function generateDemoData() {
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    ticks.push(generateDemoTick(i));
  }
  return ticks;
}

export default function useWebSocket() {
  const [latestTick, setLatestTick] = useState(null);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const demoFallbackTimer = useRef(null);
  const demoLoaded = useRef(false);

  const demoIndex = useRef(60);
  const demoInterval = useRef(null);
  const wasConnected = useRef(false);

  const startDemoInterval = useCallback(() => {
    clearInterval(demoInterval.current);
    demoInterval.current = setInterval(() => {
      const tick = generateDemoTick(demoIndex.current++);
      setLatestTick(tick);
      setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), tick]);
    }, 1000);
  }, []);

  const loadDemoData = useCallback(() => {
    if (demoLoaded.current) return;
    demoLoaded.current = true;
    const ticks = generateDemoData();
    setHistory(ticks);
    setLatestTick(ticks[ticks.length - 1]);
    setConnected(true);
    startDemoInterval();
  }, [startDemoInterval]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (demoLoaded.current && !wasConnected.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      wasConnected.current = true;
      setConnected(true);
      clearTimeout(demoFallbackTimer.current);
      clearInterval(demoInterval.current);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLatestTick(data);
      setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), data]);
    };

    ws.onclose = () => {
      if (!wasConnected.current) {
        loadDemoData();
        return;
      }
      setConnected(false);
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => ws.close();
  }, [loadDemoData, startDemoInterval]);

  useEffect(() => {
    demoFallbackTimer.current = setTimeout(() => {
      if (!connected && !latestTick) {
        loadDemoData();
      }
    }, 2000);

    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      clearTimeout(demoFallbackTimer.current);
      clearInterval(demoInterval.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { latestTick, history, connected };
}
