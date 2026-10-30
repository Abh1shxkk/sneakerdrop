"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/**
 * Real sneaker model ("Materials Variants Shoe" © Shopify, CC-BY 4.0), compressed to ~420 KB.
 * A shader swaps the saturated panels of the texture for the product's accent colour,
 * so every colourway in the database gets its own shoe while blacks and whites stay intact.
 */

// Swap in any sneaker GLB here. Set RECOLOUR to false for models whose own textures should stay untouched.
const MODEL_URL = "/models/shoe.glb";
const RECOLOUR = true;
const smooth = THREE.MathUtils.smoothstep;

export type ShoePose = { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> };

function useRecolouredShoe(initialAccent: string) {
  const { scene } = useGLTF(MODEL_URL);
  const firstAccent = useRef(initialAccent);

  return useMemo(() => {
    const root = scene.clone(true);
    const uniforms = { uAccent: { value: new THREE.Color(firstAccent.current) } };

    root.traverse((obj) => {
      if (!RECOLOUR || !(obj instanceof THREE.Mesh)) return;
      const material = (obj.material as THREE.MeshStandardMaterial).clone();
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uAccent = uniforms.uAccent;
        shader.fragmentShader = shader.fragmentShader
          .replace("#include <common>", "#include <common>\nuniform vec3 uAccent;")
          .replace(
            "#include <map_fragment>",
            `#ifdef USE_MAP
              vec4 texel = texture2D( map, vMapUv );
              float hi = max( texel.r, max( texel.g, texel.b ) );
              float lo = min( texel.r, min( texel.g, texel.b ) );
              float paint = smoothstep( 0.06, 0.2, hi - lo );
              float lum = dot( texel.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
              // 0.22 ≈ average brightness of the painted panels, so the accent lands true and keeps the knit shading.
              vec3 tinted = clamp( uAccent * clamp( lum / 0.22, 0.45, 1.5 ), 0.0, 1.0 );
              diffuseColor.rgb *= mix( texel.rgb, tinted, paint );
            #endif`,
          );
      };
      material.customProgramCacheKey = () => "sneaker-recolour";
      obj.material = material;
    });

    // Lay the shoe along X, then centre it and scale it to ~4 world units long.
    const raw = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
    if (raw.z > raw.x) root.rotation.y = Math.PI / 2;
    const fitted = new THREE.Group();
    fitted.add(root);
    const box = new THREE.Box3().setFromObject(fitted);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const scale = 4.2 / size.x;
    fitted.scale.setScalar(scale);
    fitted.position.set(-centre.x * scale, -centre.y * scale, -centre.z * scale);

    return { root: fitted, uniforms };
  }, [scene]);
}

export function Sneaker3D({ accent, progress, pointer }: { accent: string } & ShoePose) {
  const group = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Color(accent), [accent]);
  const { root, uniforms } = useRecolouredShoe(accent);
  // Shrink the shoe on narrow (portrait) viewports so it never covers the copy.
  const fit = useThree((state) => Math.min(1, state.viewport.width / 6.4));

  useEffect(
    () => () =>
      root.traverse((o) => {
        if (o instanceof THREE.Mesh) (o.material as THREE.Material).dispose();
      }),
    [root],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    uniforms.uAccent.value.lerp(target, 1 - Math.pow(0.002, delta));

    const p = progress.current ?? 0;
    const p1 = smooth(p, 0, 0.36); // full spin
    const p2 = smooth(p, 0.36, 0.68); // ¾ hero angle
    const p3 = smooth(p, 0.7, 1); // top-down

    const tY = -0.35 + p1 * Math.PI * 2 + p2 * 0.9 - p3 * 0.3;
    const tX = 0.08 + p2 * 0.25 + p3 * 0.95;
    const tZ = 0.12 - p2 * 0.12 - p3 * 0.2;
    const pt = pointer.current ?? { x: 0, y: 0 };
    const time = state.clock.elapsedTime;

    const k = 1 - Math.pow(0.0005, delta);
    g.rotation.y += (tY + pt.x * 0.25 - g.rotation.y) * k;
    g.rotation.x += (tX + pt.y * 0.12 - g.rotation.x) * k;
    g.rotation.z += (tZ - g.rotation.z) * k;

    const scale = (1 + p2 * 0.15 - p3 * 0.25) * fit;
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * k);
    g.position.x += (0.45 * fit * (1 - p2) - g.position.x) * k;
    g.position.y = (fit < 1 ? 0.25 : -0.35) + p3 * 0.3 + Math.sin(time * 1.4) * 0.06;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={root} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
