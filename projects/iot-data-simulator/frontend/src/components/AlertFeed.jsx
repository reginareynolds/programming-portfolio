export default function AlertFeed({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div className="alert-feed">
        <h3>Alerts</h3>
        <p className="no-alerts">All systems normal</p>
      </div>
    );
  }

  return (
    <div className="alert-feed">
      <h3>Alerts</h3>
      <ul className="alert-list">
        {alerts.map((alert, i) => (
          <li key={i} className={`alert-item ${alert.level}`}>
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
