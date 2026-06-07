import GalleryGrid from "../components/Gallery/GalleryGrid.jsx";
import HeroImage from "../components/Hero/HeroModel.jsx";
import SectionHeading from "../components/Shared/SectionHeading.jsx";
import AboutSection from "../components/About/AboutSection.jsx";
import Contact from "../components/Contact/Contact.jsx";
import useScrollReveal from "../useScrollReveal.js";
import { portfolio } from "../data/portfolio.js";
import "./HomePage.css";

const featuredPiece = portfolio[0];

function scrollTo(e, id) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function HomePage() {
  const galleryRef = useScrollReveal();

  return (
    <>
      <section className="home-hero">
        <HeroImage src={featuredPiece.heroImage} alt={featuredPiece.title} />
        <div className="home-hero-content">
          <h1 className="home-hero-name display-text">Regina Reynolds</h1>
          <h2 className="home-hero-title">3D Artist</h2>
          <p className="home-hero-tagline">
            Modeling, sculpting, animation, and visualization
          </p>
          <div className="home-hero-cta">
            <a href="#gallery" className="btn btn--primary" onClick={(e) => scrollTo(e, "gallery")}>See My Work</a>
            <a href="#contact" className="btn btn--outline" onClick={(e) => scrollTo(e, "contact")}>Get in Touch</a>
          </div>
        </div>
        <a href="#gallery" className="home-hero-scroll" aria-label="Scroll to gallery" onClick={(e) => scrollTo(e, "gallery")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </section>
      <section id="gallery" className="section home-gallery" ref={galleryRef}>
        <SectionHeading>Gallery</SectionHeading>
        <GalleryGrid pieces={portfolio} />
      </section>
      <section id="about" className="section">
        <AboutSection />
      </section>
      <Contact />
    </>
  );
}

export default HomePage;
