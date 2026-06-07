import PlaceholderImage from "../Shared/PlaceholderImage.jsx";
import "./DetailGallery.css";

function DetailGallery({ images }) {
  return (
    <div className="detail-gallery">
      {images.map((img, i) => (
        <figure key={i} className="detail-item">
          <div className="detail-image">
            <PlaceholderImage src={img.src} alt={img.label} className="detail-img" />
          </div>
          <figcaption className="detail-label">{img.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default DetailGallery;
