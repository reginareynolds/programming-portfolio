import { Suspense, useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField.jsx";
import Mascot from "./Mascot.jsx";
import "./Hero.css";

const HOVER_DEBOUNCE = 150;

function Hero() {
  const [ctaHover, setCtaHover] = useState(null);
  const debounceRef = useRef(null);

  const setCtaDebounced = useCallback((value) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setCtaHover(value), HOVER_DEBOUNCE);
  }, []);

  const onPrimaryEnter = useCallback(() => {
    clearTimeout(debounceRef.current);
    setCtaHover("primary");
  }, []);

  const onSecondaryEnter = useCallback(() => {
    clearTimeout(debounceRef.current);
    setCtaHover("secondary");
  }, []);

  const onCtaLeave = useCallback(() => {
    setCtaDebounced(null);
  }, [setCtaDebounced]);

  return (
    <section className="hero">
      <div className="hero-canvas" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={0.8} />
          <ParticleField />
          <Suspense fallback={null}>
            <Mascot ctaHover={ctaHover} />
          </Suspense>
        </Canvas>
      </div>
      <div className="hero-content">
        <h1 className="hero-name display-text">Regina Reynolds</h1>
        <h2 className="hero-title">Software Engineer</h2>
        <p className="hero-tagline">
          Building full-stack applications, AI-driven tools, and interactive 3D
          experiences.
        </p>
        <div className="hero-cta">
          <a
            href="#projects"
            className="btn btn--primary"
            onMouseEnter={onPrimaryEnter}
            onMouseLeave={onCtaLeave}
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="btn btn--outline"
            onMouseEnter={onSecondaryEnter}
            onMouseLeave={onCtaLeave}
          >
            Get in Touch
          </a>
        </div>
      </div>
      <a href="#projects" className="hero-scroll" aria-label="Scroll to projects">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
}

export default Hero;
