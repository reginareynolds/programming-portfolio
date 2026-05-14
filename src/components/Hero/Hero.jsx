import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField.jsx";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-canvas" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
          <ParticleField />
        </Canvas>
      </div>
      <div className="hero-content">
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name display-text">Regina Reynolds</h1>
        <h2 className="hero-title">Software Engineer</h2>
        <p className="hero-tagline">
          Building full-stack applications, AI-driven tools, and interactive 3D
          experiences.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn btn--primary">
            View Projects
          </a>
          <a href="#contact" className="btn btn--outline">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
