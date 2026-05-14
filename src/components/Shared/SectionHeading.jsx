import "./SectionHeading.css";

function SectionHeading({ children }) {
  return (
    <h2 className="section-heading reveal">
      <span className="display-text">{children}</span>
    </h2>
  );
}

export default SectionHeading;
