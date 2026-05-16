import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const LINE_COLORS = {
  "line-1": "#6366f1",
  "line-2": "#8b5cf6",
  "line-3": "#14b8a6",
};

export default function LiveChart({ history, sensor }) {
  const label = sensor.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const chartData = history.map((tick) => {
    const point = {
      time: new Date(tick.timestamp * 1000).toLocaleTimeString(),
    };
    for (const line of tick.lines) {
      point[line.line_id] = tick.lines.find((l) => l.line_id === line.line_id)
        ?.sensors[sensor]?.value;
    }
    return point;
  });

  const lineIds = history[0]?.lines.map((l) => l.line_id) || [];

  return (
    <div className="live-chart">
      <h3>{label}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            fontSize={10}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#94a3b8" fontSize={10} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              color: "#f1f5f9",
              fontSize: "0.8rem",
            }}
          />
          {lineIds.map((id) => (
            <Line
              key={id}
              type="monotone"
              dataKey={id}
              stroke={LINE_COLORS[id] || "#8b5cf6"}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
