import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "4rem 2rem",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "4rem", opacity: 0.2, marginBottom: "1rem" }}>404</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        This page doesn't exist.
      </p>
      <Link to="/" style={{ color: "var(--accent)" }}>
        &larr; Back to Gallery
      </Link>
    </main>
  );
}
