import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import Model from "./Model";
import Camera from "./Camera";

const Scene = ({ gltfName, ...props }: any) => {
  return (
    <Suspense fallback={null}>
      <div
        style={{
          padding: "5rem",
          width: "100%",
          height: "80%",
          background: "lightblue",
        }}
      >
        <Canvas shadows>
          <ambientLight intensity={0} />
          <Model gltfName={gltfName} />
          <Camera />
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, 0.8, 0]}
            opacity={1}
            width={10}
            height={10}
            blur={1.5}
            far={0.8}
          />
        </Canvas>
      </div>
    </Suspense>
  );
};

export default Scene;
