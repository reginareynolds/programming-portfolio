import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div style={{
      maxWidth: "var(--max-width)",
      margin: "0 auto",
      padding: "var(--space-16) var(--space-8)",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "var(--text-4xl)", opacity: 0.2, marginBottom: "var(--space-4)" }}>404</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>
        This page doesn't exist.
      </p>
      <Link to="/" style={{ color: "var(--accent)" }}>
        &larr; Back to Gallery
      </Link>
    </div>
  );
}

export default NotFoundPage;
