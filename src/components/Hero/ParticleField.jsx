import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 150;
const MOUSE_INFLUENCE = 2;
const BOUNDS = 6;

function ParticleField() {
  const pointsRef = useRef();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { size, viewport } = useThree();
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isMobile = size.width < 640;
  const count = isMobile ? 80 : PARTICLE_COUNT;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useEffect(() => {
    if (isMobile || reducedMotion) return;
    const handleMove = (e) => {
      mouseRef.current.x = (e.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [size, isMobile, reducedMotion]);

  useFrame(() => {
    const pts = pointsRef.current;
    if (!pts || reducedMotion) return;

    const posArr = pts.geometry.attributes.position.array;
    const mx = mouseRef.current.x * viewport.width * 0.5;
    const my = mouseRef.current.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      posArr[ix] += velocities[ix];
      posArr[ix + 1] += velocities[ix + 1];
      posArr[ix + 2] += velocities[ix + 2];

      for (let axis = 0; axis < 3; axis++) {
        const bound = axis === 2 ? 2 : BOUNDS;
        if (posArr[ix + axis] > bound || posArr[ix + axis] < -bound) {
          velocities[ix + axis] *= -1;
        }
      }

      if (!isMobile) {
        const dx = posArr[ix] - mx;
        const dy = posArr[ix + 1] - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_INFLUENCE && dist > 0) {
          const force = (1 - dist / MOUSE_INFLUENCE) * 0.002;
          posArr[ix] += dx * force;
          posArr[ix + 1] += dy * force;
        }
      }
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Mirrors --accent (#6366f1) — update if token changes */}
      <pointsMaterial
        size={0.04}
        color="#6366f1"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export default ParticleField;
