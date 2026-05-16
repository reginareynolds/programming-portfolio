import StatusBadge from "./StatusBadge";
import SensorGauge from "./SensorGauge";
import OEEDisplay from "./OEEDisplay";

export default function LineCard({ line }) {
  const sensorEntries = Object.entries(line.sensors);

  return (
    <article className={`line-card ${line.status}`}>
      <div className="line-header">
        <div>
          <h2>{line.line_name}</h2>
          <span className="line-product">{line.product}</span>
        </div>
        <StatusBadge status={line.status} />
      </div>

      <div className="sensor-grid">
        {sensorEntries.map(([name, data]) => (
          <SensorGauge
            key={name}
            name={name}
            value={data.value}
            unit={data.unit}
            alert={data.alert}
          />
        ))}
      </div>

      <OEEDisplay oee={line.oee} />
    </article>
  );
}
