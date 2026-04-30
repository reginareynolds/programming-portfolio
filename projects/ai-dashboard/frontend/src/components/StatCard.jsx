export default function StatCard({ title, value, prefix = "" }) {
  const formatted =
    typeof value === "number"
      ? prefix + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : value;

  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{formatted}</div>
    </div>
  );
}
