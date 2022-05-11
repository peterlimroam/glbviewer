import type { NextPage } from "next";
import Head from "next/head";
import Scene from "./Scene";
import { useState } from "react";

const Home: NextPage = () => {
  const [gltfName, setGltfName] = useState("ASMilated_GameBear_Body.glb");
  const [gltfInput, setGltfInput] = useState("");

  const checkAndSetGltf = async () => {
    const res = await fetch(`./gltf/${gltfInput}`, {
      method: "HEAD",
    });
    if (res.status === 200) {
      setGltfName(gltfInput);
    }
  };

  return (
    <div style={{ background: "grey", height: "100vh", width: "100vw" }}>
      <Head>
        <title>GLB Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <label>file name</label>
      <input
        autoComplete="on"
        style={{ width: "300px" }}
        value={gltfInput}
        onChange={(e) => setGltfInput(e.target.value)}
        onSubmit={(e) => console.log(e)}
      />
      <button onClick={() => checkAndSetGltf()}>submit</button>
      <Scene gltfName={gltfName} />
    </div>
  );
};

export default Home;
