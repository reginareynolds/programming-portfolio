import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import ModelLoader from "../Shared/ModelLoader.jsx";
import "./ModelViewer.css";

function LoadingOverlay() {
  return (
    <div className="viewer-loading">
      <div className="viewer-spinner" />
      <span>Loading model…</span>
    </div>
  );
}

function FallbackNotice() {
  return (
    <div className="viewer-fallback" role="status">
      <span>3D preview unavailable on this device.</span>
      <span>The process images below show this model in detail.</span>
    </div>
  );
}

function ModelViewer({ modelPath }) {
  const [interacted, setInteracted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  // Remounting the Canvas creates a fresh <canvas> element, which is the only
  // way to get a new WebGL context after an unrestored loss (one context per
  // canvas element, ever). Dev StrictMode teardown can strand the canvas in
  // that state, so retry once with a clean element before giving up.
  const [canvasKey, setCanvasKey] = useState(0);
  const retriedRef = useRef(false);
  const restoreTriedRef = useRef(false);
  const containerRef = useRef(null);

  function failOrRetry() {
    if (retriedRef.current) {
      setWebglFailed(true);
    } else {
      retriedRef.current = true;
      restoreTriedRef.current = false;
      setCanvasKey((k) => k + 1);
    }
  }

  function checkCanvasHealth() {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    if (!canvas.hasAttribute("data-engine")) {
      // three.js stamps data-engine on the canvas when the renderer
      // initializes. Missing = renderer never came up: either WebGL is
      // unavailable (fail over) or it's just slow (a later check recurs).
      const scratch = document.createElement("canvas");
      if (scratch.getContext("webgl2") || scratch.getContext("webgl")) return;
      failOrRetry();
      return;
    }
    const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (ctx && !ctx.isContextLost()) return;
    // Losses triggered through WEBGL_lose_context (r3f's own dev-mode
    // teardown) are reversible in place — try that before remounting,
    // since three.js reinitializes itself on webglcontextrestored.
    if (ctx && !restoreTriedRef.current) {
      restoreTriedRef.current = true;
      try {
        ctx.getExtension("WEBGL_lose_context")?.restoreContext();
      } catch {
        // Loss didn't come from the extension — not restorable this way
      }
      setTimeout(checkCanvasHealth, 500);
      return;
    }
    failOrRetry();
  }

  // Context loss can strike before any listener attaches (dev StrictMode
  // teardown fires it during r3f's own re-init), and when WebGL is disabled
  // the renderer never constructs at all — so poll canvas health on a
  // schedule instead of trusting events. A dead canvas can never get a new
  // context, so the retry remounts the Canvas for a fresh element.
  useEffect(() => {
    const timers = [setTimeout(checkCanvasHealth, 1500), setTimeout(checkCanvasHealth, 4000)];
    return () => timers.forEach(clearTimeout);
  }, [canvasKey]);

  if (webglFailed) return <FallbackNotice />;

  return (
    <div className="model-viewer" ref={containerRef} onPointerDown={() => setInteracted(true)}>
      {!loaded && <LoadingOverlay />}
      <Canvas
        key={canvasKey}
        camera={{ position: [3, 2, 3], fov: 50 }}
        onCreated={({ gl }) => {
          // Mid-session losses still get caught promptly via the event
          gl.domElement.addEventListener("webglcontextlost", () => {
            setTimeout(checkCanvasHealth, 1000);
          });
        }}
        fallback={<FallbackNotice />}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />

        <Environment preset="studio" background={false} />

        <Suspense fallback={null}>
          <ModelLoader url={modelPath} onLoad={() => setLoaded(true)} />
        </Suspense>

        <Grid
          args={[10, 10]}
          position={[0, -1.01, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#38342b"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#4a4437"
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
