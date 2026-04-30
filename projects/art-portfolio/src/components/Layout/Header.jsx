import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="site-logo">
          Regina Reynolds
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className={isActive("/about") ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
