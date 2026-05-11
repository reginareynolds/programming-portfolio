import SectionHeading from "../Shared/SectionHeading.jsx";
import skills from "../../data/skills.js";
import "./About.css";

function About() {
  return (
    <section id="about" className="section">
      <SectionHeading>About</SectionHeading>
      <div className="about-bio">
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

      <h3 className="about-subtitle">Technical Skills</h3>
      <div className="skills-grid">
        {skills.map((group) => (
          <div key={group.category} className="skill-card">
            <h4 className="skill-category">{group.category}</h4>
            <p className="skill-items">{group.items.join(" · ")}</p>
          </div>
        ))}
      </div>

      <h3 className="about-subtitle">Education</h3>
      <div className="education-grid">
        <div className="edu-card">
          <p className="edu-degree">M.S. IT Management</p>
          <p className="edu-focus">Generative AI for Business</p>
          <p className="edu-school">UNC Greensboro &middot; 2026</p>
          <p className="edu-detail">
            Certificates in Business Analytics, Cloud Computing &amp; Security
            Analytics, IT Development
          </p>
        </div>
        <div className="edu-card">
          <p className="edu-degree">Dual B.S.</p>
          <p className="edu-focus">ECE &amp; Interactive Media / Game Dev</p>
          <p className="edu-school">
            Worcester Polytechnic Institute &middot; May 2018
          </p>
          <p className="edu-detail">Minor in Spanish</p>
        </div>
      </div>
    </section>
  );
}

export default About;
