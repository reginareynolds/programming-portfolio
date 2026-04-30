import { useState, useEffect } from "react";
import { fetchDemoSummary, queryData } from "./api";
import DashboardSummary from "./components/DashboardSummary";
import QueryBar from "./components/QueryBar";
import ChartDisplay from "./components/ChartDisplay";
import FileUpload from "./components/FileUpload";
import "./App.css";

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
      .catch(() => setError("Failed to load dashboard data"));
  }, []);

  async function handleQuery(question) {
    setLoading(true);
    setError(null);
    try {
      const result = await queryData(question);
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

  return (
    <div className="app">
      <header className="app-header">
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
            {uploadInfo && (
              <div className="upload-summary">
                <p>{uploadInfo.message}</p>
                <div className="column-tags">
                  {uploadInfo.columns.map((col) => (
                    <span key={col} className="tag">
                      {col} <small>({uploadInfo.types[col]})</small>
                    </span>
                  ))}
                </div>
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
          Built by Regina Reynolds &middot; React &middot; Flask &middot; PostgreSQL &middot; LangChain &middot; Llama
        </p>
      </footer>
    </div>
  );
}
