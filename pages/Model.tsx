import { useRef, useLayoutEffect } from "react";
import { Group } from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { applyTextureToGroup, cloneScene } from "../utils/threeHelpers";
import { useRoomEnvironment } from "../hooks/useRoomEnvironment";

const Model = ({ gltfName, ...props }: any) => {
  const group = useRef<Group>();
  const gltf = useGLTF(`./gltf/${gltfName}`);
  const texture = useTexture("./Base_Color_Dark_Green.png");
  const accentTexture = useTexture("./Base_Color_Dark_Green.png");
  console.log(group.current);

  useLayoutEffect(() => {
    const model = group?.current;
    if (gltf) {
      // @ts-ignore
      cloneScene(model, gltf);
    }
    return () => {
      model?.clear();
    };
  }, [gltf]);

  useRoomEnvironment();

  useLayoutEffect(() => {
    applyTextureToGroup(group?.current, texture, accentTexture);
  }, [gltf, texture, accentTexture]);

  return (
    <group
      ref={group}
      {...props}
      scale={[1, 1, 1]}
      dispose={null}
      name="character"
    ></group>
  );
};

export default Model;
