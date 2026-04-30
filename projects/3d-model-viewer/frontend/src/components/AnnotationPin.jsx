import { Html } from "@react-three/drei";
import { useState } from "react";

export default function AnnotationPin({ annotation, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const { position, label, id } = annotation;

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#f59e0b" : "#ef4444"} />
      </mesh>

      {hovered && (
        <Html distanceFactor={5} style={{ pointerEvents: "auto" }}>
          <div className="annotation-tooltip">
            <p>{label}</p>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              >
                Delete
              </button>
            )}
          </div>
        </Html>
      )}

      <Html distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="annotation-marker" />
      </Html>
    </group>
  );
}
