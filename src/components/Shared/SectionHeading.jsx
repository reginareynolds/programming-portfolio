import "./SectionHeading.css";

function SectionHeading({ children }) {
  return (
    <h2 className="section-heading">
      <span className="gradient-text">{children}</span>
    </h2>
  );
}

export default SectionHeading;
