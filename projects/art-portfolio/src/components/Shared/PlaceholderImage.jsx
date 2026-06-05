import { useState } from "react";
import "./PlaceholderImage.css";

export default function PlaceholderImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`placeholder-image ${className}`}>
        <div className="placeholder-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span>Coming Soon</span>
        </div>
      </div>
    );
  }

  const resolvedSrc = import.meta.env.BASE_URL + src.replace(/^\//, "");

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
