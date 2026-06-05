import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navLinksRef = useRef(null);
  const toggleRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && navLinksRef.current) {
        const focusable = navLinksRef.current.querySelectorAll("a");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
      <div className="header-inner">
        <Link to="/" className="site-logo display-text">
          Regina Reynolds
          <svg className="site-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z" />
            <path d="M12 2 L12 12 L22 7" />
            <path d="M12 12 L2 7" />
            <path d="M12 12 L12 22" />
          </svg>
        </Link>

        <button
          ref={toggleRef}
          className={`menu-toggle${menuOpen ? " menu-toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          ref={navLinksRef}
          id="site-nav"
          className={`site-nav${menuOpen ? " site-nav--open" : ""}`}
        >
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
