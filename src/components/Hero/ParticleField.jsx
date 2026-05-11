import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 150;
const CONNECTION_DISTANCE = 1.5;
const MOUSE_INFLUENCE = 2;
const BOUNDS = 6;

function ParticleField() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { size, viewport } = useThree();

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

  const linePositions = useMemo(
    () => new Float32Array(count * count * 3),
    [count]
  );

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e) => {
      mouseRef.current.x = (e.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [size, isMobile]);

  useFrame(() => {
    const pts = pointsRef.current;
    if (!pts) return;

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

    let lineIdx = 0;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          linePositions[lineIdx++] = posArr[i * 3];
          linePositions[lineIdx++] = posArr[i * 3 + 1];
          linePositions[lineIdx++] = posArr[i * 3 + 2];
          linePositions[lineIdx++] = posArr[j * 3];
          linePositions[lineIdx++] = posArr[j * 3 + 1];
          linePositions[lineIdx++] = posArr[j * 3 + 2];
        }
      }
    }

    const lineGeo = linesRef.current.geometry;
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions.slice(0, lineIdx), 3)
    );
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx / 3);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#6366f1"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.12} />
      </lineSegments>
    </>
  );
}

export default ParticleField;
