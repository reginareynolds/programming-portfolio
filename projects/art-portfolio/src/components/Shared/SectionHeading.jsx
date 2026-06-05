import "./SectionHeading.css";

export default function SectionHeading({ children }) {
  return (
    <h2 className="section-heading">
      <span className="display-text">{children}</span>
    </h2>
  );
}
