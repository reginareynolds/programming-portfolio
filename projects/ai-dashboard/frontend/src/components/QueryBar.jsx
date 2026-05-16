import { useState } from "react";

const EXAMPLE_QUERIES = [
  "What is the total revenue by region?",
  "Show monthly profit trend",
  "Which product has the highest sales?",
  "Compare revenue across customer segments",
  "Top 5 products by quantity sold",
];

export default function QueryBar({ onSubmit, loading }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
    }
  }

  function handleExample(q) {
    setQuestion(q);
    onSubmit(q);
  }

  return (
    <div className="query-section">
      <form onSubmit={handleSubmit} className="query-bar">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to know?"
          aria-label="Ask a question about your data"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question.trim()} className={loading ? "loading" : ""}>
          {loading ? "Thinking…" : "Query"}
        </button>
      </form>
      <div className="example-queries">
        <span>Try:</span>
        {EXAMPLE_QUERIES.map((q) => (
          <button key={q} onClick={() => handleExample(q)} disabled={loading}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
