import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { useState, useCallback } from "react";
import ModelLoader from "./ModelLoader";
import AnnotationPin from "./AnnotationPin";

export default function Viewer({
  modelUrl,
  format,
  annotations,
  annotateMode,
  onAnnotationPlace,
  onAnnotationDelete,
}) {
  const [modelLoaded, setModelLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setModelLoaded(true);
  }, []);

  function handleClick(e) {
    if (!annotateMode) return;
    e.stopPropagation();
    const point = e.point;
    const normal = e.face?.normal || null;
    onAnnotationPlace({
      x: point.x,
      y: point.y,
      z: point.z,
    }, normal ? { x: normal.x, y: normal.y, z: normal.z } : null);
  }

  return (
    <div className="viewer-canvas">
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />

        <Environment preset="studio" background={false} />

        {modelUrl && (
          <group onClick={handleClick}>
            <ModelLoader url={modelUrl} format={format} onLoad={handleLoad} />
          </group>
        )}

        {annotations.map((ann) => (
          <AnnotationPin
            key={ann.id}
            annotation={ann}
            onDelete={onAnnotationDelete}
          />
        ))}

        <Grid
          args={[10, 10]}
          position={[0, -1.01, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#334155"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#475569"
          fadeDistance={10}
          infiniteGrid
        />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.1}
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>

      {annotateMode && (
        <div className="annotate-hint">Click on the model to place an annotation</div>
      )}
    </div>
  );
}
