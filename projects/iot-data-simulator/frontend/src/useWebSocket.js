import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
const MAX_HISTORY = 60;

function generateDemoTick(index) {
  const now = Date.now() / 1000 - (59 - index);
  return {
    timestamp: now,
    alerts: index === 59 ? [
      { level: "warning", line_name: "Packaging Line A", sensor: "temperature", value: 82.3, unit: "°C" },
      { level: "critical", line_name: "Assembly Line C", sensor: "vibration", value: 9.8, unit: "mm/s" },
    ] : [],
    lines: [
      {
        line_id: "line-1",
        line_name: "Packaging Line A",
        product: "Widget Pro X200",
        status: "running",
        sensors: {
          temperature: { value: +(68 + Math.sin(index * 0.15) * 12 + Math.random() * 3).toFixed(1), unit: "°C", alert: index > 55 ? "warning" : "" },
          pressure: { value: +(2.1 + Math.sin(index * 0.1) * 0.4 + Math.random() * 0.1).toFixed(2), unit: "bar", alert: "" },
          vibration: { value: +(3.2 + Math.cos(index * 0.12) * 1.5 + Math.random() * 0.5).toFixed(1), unit: "mm/s", alert: "" },
          humidity: { value: +(45 + Math.sin(index * 0.08) * 8).toFixed(0), unit: "%", alert: "" },
          speed: { value: +(120 + Math.sin(index * 0.05) * 15).toFixed(0), unit: "rpm", alert: "" },
        },
        oee: { oee: 87, availability: 95, performance: 91, quality: 99 },
      },
      {
        line_id: "line-2",
        line_name: "Packaging Line B",
        product: "Widget Lite S100",
        status: "running",
        sensors: {
          temperature: { value: +(62 + Math.cos(index * 0.13) * 8 + Math.random() * 2).toFixed(1), unit: "°C", alert: "" },
          pressure: { value: +(1.8 + Math.cos(index * 0.09) * 0.3 + Math.random() * 0.1).toFixed(2), unit: "bar", alert: "" },
          vibration: { value: +(2.8 + Math.sin(index * 0.11) * 1.2 + Math.random() * 0.3).toFixed(1), unit: "mm/s", alert: "" },
          humidity: { value: +(42 + Math.cos(index * 0.07) * 6).toFixed(0), unit: "%", alert: "" },
          speed: { value: +(105 + Math.cos(index * 0.06) * 10).toFixed(0), unit: "rpm", alert: "" },
        },
        oee: { oee: 78, availability: 88, performance: 92, quality: 96 },
      },
      {
        line_id: "line-3",
        line_name: "Assembly Line C",
        product: "Controller Unit M50",
        status: "running",
        sensors: {
          temperature: { value: +(55 + Math.sin(index * 0.1) * 6 + Math.random() * 2).toFixed(1), unit: "°C", alert: "" },
          pressure: { value: +(3.0 + Math.sin(index * 0.08) * 0.5 + Math.random() * 0.15).toFixed(2), unit: "bar", alert: "" },
          vibration: { value: +(4.5 + Math.sin(index * 0.14) * 2.5 + Math.random() * 0.8).toFixed(1), unit: "mm/s", alert: index > 55 ? "critical" : "" },
          humidity: { value: +(50 + Math.sin(index * 0.06) * 5).toFixed(0), unit: "%", alert: "" },
          speed: { value: +(90 + Math.sin(index * 0.04) * 12).toFixed(0), unit: "rpm", alert: "" },
        },
        oee: { oee: 62, availability: 80, performance: 85, quality: 91 },
      },
    ],
  };
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

  const loadDemoData = useCallback(() => {
    if (demoLoaded.current) return;
    demoLoaded.current = true;
    const ticks = generateDemoData();
    setHistory(ticks);
    setLatestTick(ticks[ticks.length - 1]);
    setConnected(true);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      clearTimeout(demoFallbackTimer.current);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLatestTick(data);
      setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), data]);
    };

    ws.onclose = () => {
      setConnected(false);
      if (!demoLoaded.current) {
        loadDemoData();
      } else {
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => ws.close();
  }, [loadDemoData]);

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
      wsRef.current?.close();
    };
  }, [connect]);

  return { latestTick, history, connected };
}
