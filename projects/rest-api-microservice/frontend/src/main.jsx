import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", color: "#f87171", fontFamily: "Inter, sans-serif", background: "#0f172a", minHeight: "100vh" }}>
          <h2>Something went wrong</h2>
          <pre style={{ marginTop: "1rem", color: "#94a3b8", fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer", background: "#6366f1", color: "white", border: "none", borderRadius: "6px" }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
