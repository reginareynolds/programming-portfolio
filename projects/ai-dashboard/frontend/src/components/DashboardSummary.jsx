import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "./StatCard";

export default function DashboardSummary({ stats }) {
  if (!stats) return null;

  return (
    <div className="dashboard-summary">
      <div className="stat-grid">
        <StatCard title="Total Orders" value={stats.total_orders} />
        <StatCard title="Total Revenue" value={stats.total_revenue} prefix="$" />
        <StatCard title="Total Profit" value={stats.total_profit} prefix="$" />
        <StatCard title="Avg Order Value" value={stats.avg_order_value} prefix="$" />
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Revenue by Region</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.revenue_by_region}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="region" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }} />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.monthly_revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", year: "2-digit" })}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }}
                labelFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              />
              <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
