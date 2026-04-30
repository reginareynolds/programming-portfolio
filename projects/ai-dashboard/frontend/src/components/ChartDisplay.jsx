import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#f97316", "#06b6d4"];

function DataTable({ columns, data }) {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>
                  {typeof row[col] === "number"
                    ? row[col].toLocaleString(undefined, { maximumFractionDigits: 2 })
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChartDisplay({ result }) {
  if (!result) return null;

  const { chart_type, columns, data, sql, question, row_count } = result;

  if (data.length === 0) {
    return <div className="chart-container"><p>No results found.</p></div>;
  }

  const labelKey = columns[0];
  const valueKeys = columns.slice(1);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{question}</h3>
        <span className="row-count">{row_count} row{row_count !== 1 ? "s" : ""}</span>
      </div>

      <div className="chart-body">
        {chart_type === "number" && (
          <div className="big-number">
            <div className="big-number-label">{columns[0]}</div>
            <div className="big-number-value">
              {typeof data[0][columns[0]] === "number"
                ? data[0][columns[0]].toLocaleString(undefined, { maximumFractionDigits: 2 })
                : data[0][columns[0]]}
            </div>
          </div>
        )}

        {chart_type === "bar" && (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={labelKey} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }} />
              <Legend />
              {valueKeys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}

        {chart_type === "line" && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={labelKey} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }} />
              <Legend />
              {valueKeys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {chart_type === "pie" && (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={data} dataKey={valueKeys[0]} nameKey={labelKey} cx="50%" cy="50%" outerRadius={120} label>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chart_type === "table" && <DataTable columns={columns} data={data} />}
      </div>

      <details className="sql-details">
        <summary>View SQL</summary>
        <pre>{sql}</pre>
      </details>
    </div>
  );
}
