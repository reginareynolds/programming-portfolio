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

const TOKENS = {
  border: "#334155",
  textSecondary: "#94a3b8",
  textPrimary: "#f1f5f9",
  bgSecondary: "#1e293b",
  accent: "#6366f1",
  accentHover: "#818cf8",
};

const TOOLTIP_STYLE = {
  backgroundColor: TOKENS.bgSecondary,
  border: `1px solid ${TOKENS.border}`,
  color: TOKENS.textPrimary,
};

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
              <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.border} />
              <XAxis dataKey="region" stroke={TOKENS.textSecondary} fontSize={12} />
              <YAxis stroke={TOKENS.textSecondary} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="revenue" fill={TOKENS.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.monthly_revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.border} />
              <XAxis
                dataKey="month"
                stroke={TOKENS.textSecondary}
                fontSize={12}
                tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", year: "2-digit" })}
              />
              <YAxis stroke={TOKENS.textSecondary} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              />
              <Line type="monotone" dataKey="revenue" stroke={TOKENS.accentHover} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
