import { useState, useEffect } from "react";
import { fetchDemoSummary, queryData } from "./api";
import DashboardSummary from "./components/DashboardSummary";
import QueryBar from "./components/QueryBar";
import ChartDisplay from "./components/ChartDisplay";
import FileUpload from "./components/FileUpload";
import "./App.css";

const FALLBACK_STATS = {
  total_orders: 9994,
  total_revenue: 2297200.86,
  total_profit: 286397.02,
  avg_order_value: 229.95,
  revenue_by_region: [
    { region: "West", revenue: 725458 },
    { region: "East", revenue: 678781 },
    { region: "Central", revenue: 501240 },
    { region: "South", revenue: 391722 },
  ],
  monthly_revenue: [
    { month: "2023-01", revenue: 178420 },
    { month: "2023-02", revenue: 165890 },
    { month: "2023-03", revenue: 198340 },
    { month: "2023-04", revenue: 187650 },
    { month: "2023-05", revenue: 210780 },
    { month: "2023-06", revenue: 195430 },
    { month: "2023-07", revenue: 224610 },
    { month: "2023-08", revenue: 201390 },
    { month: "2023-09", revenue: 189760 },
    { month: "2023-10", revenue: 215840 },
    { month: "2023-11", revenue: 232510 },
    { month: "2023-12", revenue: 196580 },
  ],
};

const FALLBACK_QUERY_RESULT = {
  chart_type: "bar",
  question: "What is the total revenue by region?",
  columns: ["region", "revenue"],
  data: [
    { region: "West", revenue: 725458 },
    { region: "East", revenue: 678781 },
    { region: "Central", revenue: 501240 },
    { region: "South", revenue: 391722 },
  ],
  sql: "SELECT region, SUM(revenue) as revenue FROM orders GROUP BY region ORDER BY revenue DESC",
  row_count: 4,
};

export default function App() {
  const [stats, setStats] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("demo");

  useEffect(() => {
    fetchDemoSummary()
      .then(setStats)
      .catch(() => {
        setStats(FALLBACK_STATS);
        setQueryResult(FALLBACK_QUERY_RESULT);
        setQueryHistory([FALLBACK_QUERY_RESULT]);
      });
  }, []);

  async function handleQuery(question) {
    setLoading(true);
    setError(null);
    try {
      const result = await queryData(question, activeTab === "custom" && uploadInfo ? "custom" : "demo");
      if (result.error) {
        setError(result.error);
      } else {
        setQueryResult(result);
        setQueryHistory((prev) => [result, ...prev].slice(0, 10));
      }
    } catch (err) {
      setError(err.response?.data?.error || "Query failed");
    } finally {
      setLoading(false);
    }
  }

  function handleUploadComplete(result) {
    setUploadInfo(result);
    setActiveTab("custom");
  }

  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || "https://reginareynolds.vercel.app";

  return (
    <div className="app">
      <header className="app-header">
        <a href={portfolioUrl} className="back-link">&larr; Portfolio</a>
        <div className="header-content">
          <h1>AI Dashboard</h1>
          <p>Ask questions about your data in plain English</p>
        </div>
      </header>

      <main className="app-main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "demo" ? "active" : ""}`}
            onClick={() => setActiveTab("demo")}
          >
            Demo Dataset
          </button>
          <button
            className={`tab ${activeTab === "custom" ? "active" : ""}`}
            onClick={() => setActiveTab("custom")}
          >
            Upload CSV {uploadInfo && "✓"}
          </button>
        </div>

        {activeTab === "custom" && (
          <section className="section">
            <FileUpload onUploadComplete={handleUploadComplete} />
            {uploadInfo && uploadInfo.message && (
              <div className="upload-summary">
                <p>{uploadInfo.message}</p>
                {Array.isArray(uploadInfo.columns) && uploadInfo.types && (
                  <div className="column-tags">
                    {uploadInfo.columns.map((col) => (
                      <span key={col} className="tag">
                        {col} <small>({uploadInfo.types[col] || "unknown"})</small>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "demo" && (
          <section className="section">
            <DashboardSummary stats={stats} />
          </section>
        )}

        <section className="section">
          <QueryBar onSubmit={handleQuery} loading={loading} />
          {error && <div className="error-message">{error}</div>}
          <ChartDisplay result={queryResult} />
        </section>

        {queryHistory.length > 1 && (
          <section className="section">
            <h2>Query History</h2>
            <div className="history-list">
              {queryHistory.slice(1).map((item, i) => (
                <button key={i} className="history-item" onClick={() => setQueryResult(item)}>
                  {item.question}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          &copy; 2026 Regina Reynolds &middot; React &middot; Flask &middot; PostgreSQL &middot; LangChain &middot; Llama
        </p>
      </footer>
    </div>
  );
}
