import GalleryGrid from "../components/Gallery/GalleryGrid";
import AboutSection from "../components/About/AboutSection";
import Contact from "../components/Contact/Contact";
import { portfolio } from "../data/portfolio";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>3D Art Portfolio</h1>
        <p>Modeling, sculpting, animation, and visualization</p>
      </section>
      <section id="gallery" className="home-gallery">
        <GalleryGrid pieces={portfolio} />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <Contact />
    </div>
  );
}
