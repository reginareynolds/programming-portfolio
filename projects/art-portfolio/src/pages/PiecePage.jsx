import { useParams, Link } from "react-router-dom";
import { Suspense } from "react";
import { portfolio } from "../data/portfolio.js";
import PieceHero from "../components/PieceDetail/PieceHero.jsx";
import ModelViewer from "../components/PieceDetail/ModelViewer.jsx";
import ProcessBreakdown from "../components/PieceDetail/ProcessBreakdown.jsx";
import DetailGallery from "../components/PieceDetail/DetailGallery.jsx";
import PieceInfo from "../components/PieceDetail/PieceInfo.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import "./PiecePage.css";

function PiecePage() {
  const { id } = useParams();
  const piece = portfolio.find((p) => p.id === id);

  if (!piece) return <NotFoundPage />;

  return (
    <div className="piece-page">
      <div className="piece-back">
        <Link to="/">&larr; Back to Gallery</Link>
      </div>

      <PieceHero piece={piece} />

      {piece.hasModel && piece.modelPath && (
        <section className="piece-section">
          <h2>Interactive Model</h2>
          <Suspense fallback={<div className="viewer-loading">Loading 3D model...</div>}>
            <ModelViewer modelPath={piece.modelPath} />
          </Suspense>
        </section>
      )}

      {piece.videoPath && (
        <section className="piece-section">
          <h2>Animation</h2>
          <div className="video-container">
            <video controls loop muted playsInline>
              <source src={import.meta.env.BASE_URL + piece.videoPath.replace(/^\//, "")} type="video/mp4" />
            </video>
          </div>
        </section>
      )}

      {piece.processImages.length > 0 && (
        <section className="piece-section">
          <h2>Process</h2>
          <ProcessBreakdown steps={piece.processImages} />
        </section>
      )}

      {piece.detailImages?.length > 0 && (
        <section className="piece-section">
          <h2>Details</h2>
          <DetailGallery images={piece.detailImages} />
        </section>
      )}

      <section className="piece-section">
        <PieceInfo piece={piece} />
      </section>
    </div>
  );
}

export default PiecePage;
