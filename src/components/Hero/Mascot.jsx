import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const ANIM = {
  IDLE: "Idle",
  WAVE: "Waving",
  POINT_LEFT: "Pointing left",
  POINT_RIGHT: "Pointing right",
  NOD: "Nodding",
  SHRUG: "Shrugging",
  LOOK_AROUND: "Looking around",
  HAPPY_IDLE: "Happy idle",
  SAD_IDLE: "Sad idle",
};

const FADE_SPEED = 5;
const LEAN_SPEED = 3;
const LEAN_MAX = 0.15;
const LOOK_AROUND_INTERVAL = 12;

function Mascot({ position = [3, -1.5, 0], scale = 2.5, ctaHover = null }) {
  const leanRef = useRef();
  const groupRef = useRef();
  const targetAnim = useRef(null);
  const lastLookAround = useRef(0);
  const introPlayed = useRef(false);
  const introFinished = useRef(false);
  const [hovered, setHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { scene, animations } = useGLTF("/models/MiniMe.glb");
  const { actions, mixer } = useAnimations(animations, groupRef);
  const { viewport, size } = useThree();

  const actionsRef = useRef(actions);
  const mixerRef = useRef(mixer);
  actionsRef.current = actions;
  mixerRef.current = mixer;

  const isMobile = viewport.width < 6;

  useEffect(() => {
    if (leanRef.current) {
      leanRef.current.rotation.y = -Math.PI / 6;
    }
  }, []);

  useEffect(() => {
    const looping = [ANIM.IDLE, ANIM.POINT_LEFT, ANIM.POINT_RIGHT, ANIM.HAPPY_IDLE, ANIM.SAD_IDLE];
    looping.forEach((name) => {
      const action = actions[name];
      if (action) {
        action.play();
        action.setEffectiveWeight(0);
      }
    });
  }, [actions]);

  useEffect(() => {
    if (!actions[ANIM.WAVE] || introPlayed.current) return;
    introPlayed.current = true;

    const wave = actions[ANIM.WAVE];
    wave.reset();
    wave.setLoop(THREE.LoopRepeat, 2);
    wave.repetitions = 2;
    wave.clampWhenFinished = true;
    wave.setEffectiveWeight(1);
    wave.play();

    const handler = (e) => {
      if (e.action === wave) {
        mixerRef.current.removeEventListener("finished", handler);
        introFinished.current = true;
        targetAnim.current = ANIM.IDLE;
      }
    };
    mixerRef.current.addEventListener("finished", handler);
  }, [actions]);

  useEffect(() => {
    if (!introFinished.current) return;

    if (hovered) {
      targetAnim.current = ANIM.HAPPY_IDLE;
    } else if (ctaHover === "primary") {
      targetAnim.current = ANIM.POINT_LEFT;
    } else if (ctaHover === "secondary") {
      targetAnim.current = ANIM.POINT_RIGHT;
    } else {
      targetAnim.current = ANIM.IDLE;
    }
  }, [hovered, ctaHover]);

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e) => {
      mouseRef.current.x = (e.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [size, isMobile]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    if (
      targetAnim.current === ANIM.IDLE &&
      t - lastLookAround.current > LOOK_AROUND_INTERVAL
    ) {
      lastLookAround.current = t;
      const lookAround = actionsRef.current[ANIM.LOOK_AROUND];
      if (lookAround) {
        lookAround.reset();
        lookAround.setLoop(THREE.LoopOnce, 1);
        lookAround.clampWhenFinished = true;
        lookAround.play();
        targetAnim.current = ANIM.LOOK_AROUND;

        const handler = (e) => {
          if (e.action === lookAround) {
            mixerRef.current.removeEventListener("finished", handler);
            targetAnim.current = ANIM.IDLE;
          }
        };
        mixerRef.current.addEventListener("finished", handler);
      }
    }

    // Smoothly blend weights toward the target animation
    const target = targetAnim.current;
    if (target) {
      const acts = actionsRef.current;
      const step = delta * FADE_SPEED;

      Object.entries(acts).forEach(([name, action]) => {
        const current = action.getEffectiveWeight();
        const goal = name === target ? 1 : 0;
        if (current === 0 && goal === 0) return;
        if (Math.abs(current - goal) < 0.001) {
          action.setEffectiveWeight(goal);
          return;
        }
        const next = current + (goal - current) * Math.min(step, 1);
        action.setEffectiveWeight(next);
      });
    }

    if (!isMobile && leanRef.current) {
      const targetLean = -Math.PI / 6 + mouseRef.current.x * LEAN_MAX;
      leanRef.current.rotation.y = THREE.MathUtils.lerp(
        leanRef.current.rotation.y,
        targetLean,
        LEAN_SPEED * 0.016
      );
    }
  });

  return (
    <group
      ref={leanRef}
      position={position}
      scale={isMobile ? scale * 0.7 : scale}
    >
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/MiniMe.glb");

export default Mascot;
