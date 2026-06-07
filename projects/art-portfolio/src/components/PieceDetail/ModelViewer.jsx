import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { useState } from "react";
import ModelLoader from "../Shared/ModelLoader.jsx";
import "./ModelViewer.css";

function ModelViewer({ modelPath }) {
  const [interacted, setInteracted] = useState(false);

  return (
    <div className="model-viewer" onPointerDown={() => setInteracted(true)}>
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />

        <Environment preset="studio" background={false} />

        <ModelLoader url={modelPath} />

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
          maxDistance={15}
        />
      </Canvas>

      {!interacted && (
        <div className="viewer-hint">
          Drag to rotate &middot; Scroll to zoom
        </div>
      )}
    </div>
  );
}

export default ModelViewer;
