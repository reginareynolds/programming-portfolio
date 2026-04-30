import { useParams, Link } from "react-router-dom";
import { Suspense } from "react";
import { portfolio } from "../data/portfolio";
import PieceHero from "../components/PieceDetail/PieceHero";
import ModelViewer from "../components/PieceDetail/ModelViewer";
import ProcessBreakdown from "../components/PieceDetail/ProcessBreakdown";
import PieceInfo from "../components/PieceDetail/PieceInfo";
import NotFoundPage from "./NotFoundPage";
import "./PiecePage.css";

export default function PiecePage() {
  const { id } = useParams();
  const piece = portfolio.find((p) => p.id === id);

  if (!piece) return <NotFoundPage />;

  return (
    <main className="piece-page">
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
              <source src={piece.videoPath} type="video/mp4" />
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

      <section className="piece-section">
        <PieceInfo piece={piece} />
      </section>
    </main>
  );
}
