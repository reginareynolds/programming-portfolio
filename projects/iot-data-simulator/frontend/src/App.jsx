import useWebSocket from "./useWebSocket";
import LineCard from "./components/LineCard";
import LiveChart from "./components/LiveChart";
import AlertFeed from "./components/AlertFeed";
import "./App.css";

const CHARTED_SENSORS = ["temperature", "pressure", "vibration"];

export default function App() {
  const { latestTick, history, connected } = useWebSocket();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>IoT Data Simulator</h1>
          <p>Real-time industrial sensor monitoring</p>
        </div>
        <div className={`connection-status ${connected ? "online" : "offline"}`}>
          <span className="status-dot" />
          {connected ? "Live" : "Reconnecting..."}
        </div>
      </header>

      <main className="app-main">
        {!latestTick ? (
          <div className="loading">Waiting for data stream...</div>
        ) : (
          <>
            <section className="lines-section">
              {latestTick.lines.map((line) => (
                <LineCard key={line.line_id} line={line} />
              ))}
            </section>

            <section className="charts-section">
              <h2>Sensor Trends (last 60s)</h2>
              <div className="charts-grid">
                {CHARTED_SENSORS.map((sensor) => (
                  <LiveChart
                    key={sensor}
                    history={history}
                    sensor={sensor}
                  />
                ))}
              </div>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{ background: "#6366f1" }} />
                  Packaging Line A
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ background: "#22d3ee" }} />
                  Packaging Line B
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ background: "#f59e0b" }} />
                  Assembly Line C
                </span>
              </div>
            </section>

            <section className="alerts-section">
              <AlertFeed alerts={latestTick.alerts} />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built by Regina Reynolds &middot; FastAPI &middot; WebSockets &middot;
          React &middot; Recharts
        </p>
      </footer>
    </div>
  );
}
