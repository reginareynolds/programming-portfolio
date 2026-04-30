function OEEBar({ label, value }) {
  const color =
    value >= 85 ? "var(--success)" : value >= 60 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="oee-bar">
      <div className="oee-bar-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="oee-bar-track">
        <div
          className="oee-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function OEEDisplay({ oee }) {
  const oeeColor =
    oee.oee >= 85 ? "var(--success)" : oee.oee >= 60 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="oee-display">
      <div className="oee-score" style={{ color: oeeColor }}>
        {oee.oee}%
        <span className="oee-label">OEE</span>
      </div>
      <div className="oee-bars">
        <OEEBar label="Availability" value={oee.availability} />
        <OEEBar label="Performance" value={oee.performance} />
        <OEEBar label="Quality" value={oee.quality} />
      </div>
    </div>
  );
}
