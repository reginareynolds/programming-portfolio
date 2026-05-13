import { useState } from "react";
import * as api from "../api";

export default function AuthForm({ onAuth, onDemoMode }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await api.login(username, password)
          : await api.register(username, email, password);
      api.setAuthToken(data.access_token);
      onAuth(data.user, data.access_token);
    } catch (err) {
      const data = err.response?.data;
      if (data?.error) {
        setError(data.error);
      } else if (data?.errors) {
        setError(Object.values(data.errors).flat().join(", "));
      } else {
        setError("Connection failed. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card-accent" />
        <div className="auth-card-body">
          <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            {mode === "register" && (
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div className="auth-toggle">
            {mode === "login" ? "No account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}>
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </div>
          <div className="auth-divider">or</div>
          <button className="btn-demo" onClick={onDemoMode}>
            Try Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
}
