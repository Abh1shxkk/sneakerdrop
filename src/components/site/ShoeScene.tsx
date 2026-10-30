"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Sneaker3D, type ShoePose } from "@/components/site/Sneaker3D";

type Props = { accent: string; active: boolean } & ShoePose;

export default function ShoeScene({ accent, active, progress, pointer }: Props) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.35, 7.6], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      fallback={null}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={2} />
      <directionalLight position={[-5, 2, -3]} intensity={0.9} color="#f4b38e" />

      <Suspense fallback={null}>
        <Sneaker3D accent={accent} progress={progress} pointer={pointer} />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.5} position={[0, 5, 2]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#f4b38e" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
          <Lightformer form="ring" intensity={1.5} position={[5, 2, 1]} rotation-y={-Math.PI / 2} scale={3} />
        </Environment>
      </Suspense>

      <ContactShadows position={[0, -1.35, 0]} opacity={0.4} scale={9} blur={2.4} far={3} resolution={256} color="#2a0f0a" />
    </Canvas>
  );
}
