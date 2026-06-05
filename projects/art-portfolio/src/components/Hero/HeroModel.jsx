import PlaceholderImage from "../Shared/PlaceholderImage";
import "./HeroModel.css";

export default function HeroImage({ src, alt }) {
  return (
    <div className="home-hero-bg">
      <PlaceholderImage src={src} alt={alt} className="home-hero-bg-img" />
    </div>
  );
}
