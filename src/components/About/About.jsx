import SectionHeading from "../Shared/SectionHeading.jsx";
import skills from "../../data/skills.js";
import useScrollReveal from "../../useScrollReveal.js";
import "./About.css";

function About() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="section" ref={ref}>
      <SectionHeading>About</SectionHeading>
      <div className="about-bio reveal">
        <p>
          Results-driven Software Engineer with 8+ years of experience in
          full-stack development, AR/VR applications, and cloud-based solutions.
          I build scalable AI-driven applications, interactive 3D experiences,
          and production-grade APIs using Python, JavaScript, and C#.
        </p>
        <p>
          I hold a Master of IT Management with a focus on Generative AI for
          Business from UNCG, alongside certificates in Business Analytics,
          Cloud Computing, and IT Development. Previously, I built enterprise
          platforms and AR experiences at Harpak-ULMA Packaging and developed
          diagnostic tooling at Volvo Group, including a project that saved the
          company $600,000.
        </p>
      </div>

      <h3 className="about-subtitle reveal">Technical Skills</h3>
      <div className="skills-inline">
        {skills.map((group) => (
          <div key={group.category} className="skill-row reveal reveal-stagger">
            <span className="skill-label">{group.category}</span>
            <span className="skill-items">{group.items.join(" · ")}</span>
          </div>
        ))}
      </div>

      <h3 className="about-subtitle reveal">Education</h3>
      <div className="edu-timeline">
        <div className="edu-entry reveal reveal-stagger">
          <div className="edu-marker" />
          <div className="edu-content">
            <p className="edu-degree">M.S. IT Management</p>
            <p className="edu-focus">Generative AI for Business</p>
            <p className="edu-school">UNC Greensboro &middot; 2026</p>
            <p className="edu-detail">
              Certificates in Business Analytics, Cloud Computing &amp; Security
              Analytics, IT Development
            </p>
          </div>
        </div>
        <div className="edu-entry reveal reveal-stagger">
          <div className="edu-marker" />
          <div className="edu-content">
            <p className="edu-degree">Dual B.S.</p>
            <p className="edu-focus">ECE &amp; Interactive Media / Game Dev</p>
            <p className="edu-school">
              Worcester Polytechnic Institute &middot; May 2018
            </p>
            <p className="edu-detail">Minor in Spanish</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
