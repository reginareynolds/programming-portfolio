import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

function GLTFModel({ url, onLoad }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      scene.scale.setScalar(scale);
      scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      if (onLoad) onLoad(scene);
    }
  }, [scene, onLoad]);

  return <primitive ref={ref} object={scene} />;
}

function OBJModel({ url, onLoad }) {
  const ref = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(url, (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: "#8b8b8b" });
        }
      });
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      obj.scale.setScalar(scale);
      obj.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      if (ref.current) {
        ref.current.clear();
        ref.current.add(obj);
      }
      if (onLoad) onLoad(obj);
    });
  }, [url, onLoad]);

  return <group ref={ref} />;
}

function STLModel({ url, onLoad }) {
  const ref = useRef();

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(url, (geometry) => {
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({ color: "#8b8b8b" });
      const mesh = new THREE.Mesh(geometry, material);

      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      mesh.scale.setScalar(scale);
      mesh.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      if (ref.current) {
        ref.current.clear();
        ref.current.add(mesh);
      }
      if (onLoad) onLoad(mesh);
    });
  }, [url, onLoad]);

  return <group ref={ref} />;
}

export default function ModelLoader({ url, format, onLoad }) {
  if (format === "glb" || format === "gltf") {
    return <GLTFModel url={url} onLoad={onLoad} />;
  }
  if (format === "obj") {
    return <OBJModel url={url} onLoad={onLoad} />;
  }
  if (format === "stl") {
    return <STLModel url={url} onLoad={onLoad} />;
  }
  return null;
}
