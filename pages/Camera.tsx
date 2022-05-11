import * as THREE from "three";
import { useState, useRef } from "react";
import {
  OrbitControls,
  OrbitControlsProps,
  PerspectiveCamera,
} from "@react-three/drei";

const sceneConfig = {
  camera: { zoom: 1, fov: 45, position: new THREE.Vector3(0, 2.5, 5) },
  orbitControls: {
    target: [0, 1.75, 0],
    minPolarAngle: Math.PI / 2.8,
    maxPolarAngle: Math.PI / 2,
    enableZoom: true,
    enablePan: false,
    minDistance: 6,
    maxDistance: 7,
  },
};

const Camera = () => {
  const orbitControlRef = useRef<OrbitControlsProps>();

  return (
    <>
      <PerspectiveCamera makeDefault name="camera" {...sceneConfig.camera} />
      <OrbitControls
        // @ts-ignore
        ref={orbitControlRef}
        {...sceneConfig.orbitControls}
        enableRotate
        enableZoom
      />
    </>
  );
};

export default Camera;
