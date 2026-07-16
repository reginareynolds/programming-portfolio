import PlaceholderImage from "../Shared/PlaceholderImage.jsx";
import SectionHeading from "../Shared/SectionHeading.jsx";
import useScrollReveal from "../../useScrollReveal.js";
import "./AboutSection.css";

const SKILL_GROUPS = [
  {
    category: "3D Modeling",
    tools: ["Maya", "3DS Max", "Blender", "ZBrush", "Creo Parametric"],
  },
  {
    category: "Rendering",
    tools: ["KeyShot", "Blender Cycles", "Unreal Engine"],
  },
  {
    category: "Texturing",
    tools: ["Substance Painter", "Photoshop"],
  },
  {
    category: "Animation",
    tools: ["Maya", "Blender", "Creo Illustrate"],
  },
  {
    category: "AR / VR",
    tools: ["Unity", "Unreal Engine", "Vuforia", "ThingWorx"],
  },
  {
    category: "Design",
    tools: ["Adobe Photoshop", "After Effects"],
  },
];

function AboutSection() {
  const ref = useScrollReveal();

  return (
    <div className="about-section" ref={ref}>
      <SectionHeading>About</SectionHeading>
      <section className="about-bio reveal">
        <div className="bio-photo">
          <PlaceholderImage
            src="/images/about/headshot.jpg"
            alt="Regina Reynolds"
            className="headshot"
          />
        </div>
        <div className="bio-text">
          <h2 className="bio-name">Regina Reynolds</h2>
          <p>
            3D artist and software engineer with 8+ years of experience bridging
            the gap between technical engineering and creative visualization.
            Dual B.S. in Electrical & Computer Engineering and Interactive Media
            & Game Development from WPI, with professional experience creating
            AR/VR training applications, CAD-to-visualization pipelines, and
            real-time 3D content for manufacturing environments.
          </p>
          <p>
            My work spans hard-surface mechanical modeling, character sculpting,
            environment art, and technical animation. I bring a unique
            perspective that combines engineering precision with artistic
            sensibility — whether translating complex CAD assemblies into
            interactive AR experiences or sculpting original characters from
            concept to final render.
          </p>
        </div>
      </section>

      <h3 className="about-subtitle reveal">Skills & Tools</h3>
      <div className="skills-inline">
        {SKILL_GROUPS.map((group, index) => (
          <div key={group.category} className="skill-row reveal">
            <span className="skill-label">{group.category}</span>
            <span className="skill-items">{group.tools.join(" · ")}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AboutSection;
