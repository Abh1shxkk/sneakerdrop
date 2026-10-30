"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Sneaker3D, type ShoePose } from "@/components/site/Sneaker3D";

export default function ShoeScene({ accent, progress, pointer }: { accent: string } & ShoePose) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [0, 0.35, 7.6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      fallback={null}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#f4b38e" />

      <Sneaker3D accent={accent} progress={progress} pointer={pointer} />

      <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={9} blur={2.6} far={3} color="#2a0f0a" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, 2]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#f4b38e" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[5, 2, 1]} rotation-y={-Math.PI / 2} scale={3} />
      </Environment>
    </Canvas>
  );
}
