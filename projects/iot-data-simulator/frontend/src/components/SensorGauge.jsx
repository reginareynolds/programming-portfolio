export default function SensorGauge({ name, value, unit, alert }) {
  const label = name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={`sensor-gauge ${alert}`}>
      <div className="sensor-label">{label}</div>
      <div className="sensor-value">
        {value}
        <span className="sensor-unit">{unit}</span>
      </div>
    </div>
  );
}
