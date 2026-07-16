import PlaceholderImage from "../Shared/PlaceholderImage.jsx";
import "./HeroModel.css";

function HeroImage({ src, alt }) {
  return (
    <div className="home-hero-bg">
      <PlaceholderImage src={src} alt={alt} className="home-hero-bg-img" />
    </div>
  );
}

export default HeroImage;
