import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const sections = ["gallery", "about", "contact"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const location = useLocation();
  const navLinksRef = useRef(null);
  const toggleRef = useRef(null);
  const scrollingRef = useRef(false);
  const scrollTimerRef = useRef(null);

  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (!isHome) return;

      if (scrollingRef.current) {
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
          scrollingRef.current = false;
        }, 100);
        return;
      }

      const threshold = window.innerHeight * 0.4;
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

      if (atBottom) {
        setActive(sections[sections.length - 1]);
        return;
      }

      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

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

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollingRef.current = true;
    setActive(id);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.__skipScrollToTop = true;
      navigate("/");
      const waitForElement = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          requestAnimationFrame(waitForElement);
        }
      };
      setTimeout(waitForElement, 50);
    }
  };

  const resumePath = import.meta.env.BASE_URL + "Regina_Reynolds_Resume.pdf";

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo display-text" onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          Regina Reynolds
          <svg className="nav-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z" />
            <path d="M12 2 L12 12 L22 7" />
            <path d="M12 12 L2 7" />
            <path d="M12 12 L12 22" />
          </svg>
        </Link>

        <button
          ref={toggleRef}
          className={`nav-toggle${menuOpen ? " nav-toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul
          ref={navLinksRef}
          id="nav-menu"
          className={`nav-links${menuOpen ? " nav-links--open" : ""}`}
        >
          {isHome ? (
            sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={active === id ? "active" : ""}
                  onClick={(e) => scrollToSection(e, id)}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))
          ) : (
            <>
              <li><a href="#/" onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate("/"); }}>Gallery</a></li>
              <li><a href="#about" onClick={(e) => scrollToSection(e, "about")}>About</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Contact</a></li>
            </>
          )}
          <li>
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-resume"
              onClick={() => setMenuOpen(false)}
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
