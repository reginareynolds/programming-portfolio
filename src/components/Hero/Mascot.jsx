import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const ANIM = {
  IDLE: "Idle",
  WAVE: "Waving",
  POINT_LEFT: "Pointing up and left",
  POINT_RIGHT: "Pointing up and right",
  NOD: "Nodding",
  SHRUG: "Shrugging",
  LOOK_AROUND: "Looking around",
  HAPPY_IDLE: "Happy idle",
  SAD_IDLE: "Sad idle",
};

const FADE_SPEED = 5;
const LEAN_SPEED = 3;
const LEAN_MAX = 0.4;
const LOOK_AROUND_INTERVAL = 12;

const MODEL_HEIGHT = 0.677;

function Mascot({ ctaHover = null, availableHeight = 0 }) {
  const leanRef = useRef();
  const groupRef = useRef();
  const targetAnim = useRef(null);
  const lastLookAround = useRef(0);
  const introPlayed = useRef(false);
  const introFinished = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { scene, animations } = useGLTF("/models/MiniMe.glb");
  const { actions, mixer } = useAnimations(animations, groupRef);
  const { viewport } = useThree();

  const actionsRef = useRef(actions);
  const mixerRef = useRef(mixer);
  actionsRef.current = actions;
  mixerRef.current = mixer;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1005px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const distFromCam = 3;
  const visibleHeight = viewport.height * (distFromCam / viewport.distance);
  const worldPerPx = visibleHeight / window.innerHeight;
  const availableWorld = availableHeight * worldPerPx;
  const fitScale = availableWorld > 0 ? (availableWorld * 0.75) / MODEL_HEIGHT : 1.5;
  const scale = Math.max(Math.min(fitScale, 2.5), 0.5);
  const mascotWorldHeight = MODEL_HEIGHT * scale;
  const ctaBottomPx = window.innerHeight - availableHeight - 56;
  const ctaBottomWorld = (visibleHeight / 2) - (ctaBottomPx * worldPerPx);
  const responsiveX = 0;
  const centerY = ctaBottomWorld - availableWorld / 2;
  const responsiveY = centerY - mascotWorldHeight / 2;

  useEffect(() => {
    if (leanRef.current) {
      leanRef.current.rotation.y = 0;
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

    let next;
    if (hovered) {
      next = ANIM.HAPPY_IDLE;
    } else if (ctaHover === "primary") {
      next = ANIM.POINT_LEFT;
    } else if (ctaHover === "secondary") {
      next = ANIM.POINT_RIGHT;
    } else {
      next = ANIM.IDLE;
      lastLookAround.current = -1;
    }

    if (next !== targetAnim.current && actions[next]) {
      actions[next].reset();
    }
    targetAnim.current = next;
  }, [hovered, ctaHover, actions]);

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [isMobile]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    if (lastLookAround.current === -1) {
      lastLookAround.current = t;
    }

    if (
      targetAnim.current === ANIM.IDLE &&
      t - lastLookAround.current > LOOK_AROUND_INTERVAL
    ) {
      lastLookAround.current = t;
      const pick = Math.random() < 0.5 ? ANIM.LOOK_AROUND : ANIM.SAD_IDLE;
      const action = actionsRef.current[pick];
      if (action) {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
        targetAnim.current = pick;

        const handler = (e) => {
          if (e.action === action) {
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
      const targetLean = mouseRef.current.x * LEAN_MAX;
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
      position={[responsiveX, responsiveY, 2]}
      scale={scale}
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
