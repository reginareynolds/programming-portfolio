export default function AlertFeed({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div className="alert-feed">
        <h3>Alerts</h3>
        <p className="no-alerts" aria-live="polite">All systems normal</p>
      </div>
    );
  }

  return (
    <div className="alert-feed">
      <h3>Alerts</h3>
      <ul className="alert-list" aria-live="assertive" aria-atomic="false">
        {alerts.map((alert) => (
          <li key={`${alert.line_name}-${alert.sensor}-${alert.level}`} className={`alert-item ${alert.level}`}>
            <span className="alert-level">{alert.level}</span>
            <span className="alert-detail">
              {alert.line_name} — {alert.sensor.replace(/_/g, " ")}: {alert.value}
              {alert.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
