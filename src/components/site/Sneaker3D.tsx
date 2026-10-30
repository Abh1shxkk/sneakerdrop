"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/**
 * Procedural sneaker — no external model needed, and every part is tintable
 * from the product's accent colour. Toe points to +X, sole sits on y = 0.
 */

const smooth = THREE.MathUtils.smoothstep;
const LENGTH = 1.95;
const UPPER_Y = 0.5;

/** 0 at the heel, 1 at the toe. */
const along = (x: number) => (x + LENGTH) / (LENGTH * 2);
const upperHeight = (t: number) => 1.45 - 0.85 * smooth(t, 0.35, 1.0);
const upperWidth = (t: number) => 0.68 * (1 - 0.2 * smooth(t, 0.62, 1)) * (1 - 0.1 * (1 - smooth(t, 0, 0.18)));
/** Toe spring and heel kick shared by sole and upper. */
const spring = (x: number) => 0.3 * smooth(x, 1.1, 2.15) ** 2 + 0.06 * smooth(-x, 1.6, 2.15);
/** Height of the upper's top surface at a given x. */
const topAt = (x: number) => UPPER_Y + spring(x) + upperHeight(along(x)) * 0.9;

function buildUpper() {
  const geo = new THREE.SphereGeometry(1, 192, 128);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const normY = new Float32Array(pos.count);

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const x = v.x * LENGTH;
    const t = along(x);
    const h = upperHeight(t);
    const y = v.y >= 0 ? Math.min(v.y * h, h * 0.9) : v.y * 0.12;
    normY[i] = Math.max(0, y) / h;
    pos.setXYZ(i, x, y + spring(x), v.z * upperWidth(t));
  }
  geo.setAttribute("normY", new THREE.BufferAttribute(normY, 1));
  geo.computeVertexNormals();
  return geo;
}

function paintUpper(geo: THREE.BufferGeometry, accent: THREE.Color) {
  const pos = geo.attributes.position;
  const normY = geo.attributes.normY;
  const cream = new THREE.Color("#f7ede2");
  const mudguard = accent.clone().lerp(new THREE.Color("#1f1411"), 0.35);
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const t = along(pos.getX(i));
    const yN = normY.getX(i);
    // Soft-edged zones so vertex-colour interpolation stays smooth.
    const toeCap = smooth(t, 0.84, 0.88);
    const stripeDist = Math.abs(yN - (0.8 - 1.05 * (t - 0.28)));
    const stripe = (1 - smooth(stripeDist, 0.05, 0.075)) * smooth(t, 0.28, 0.33) * (1 - smooth(t, 0.8, 0.85));
    const mud = Math.max(1 - smooth(yN, 0.17, 0.22), (1 - smooth(t, 0.12, 0.16)) * (1 - smooth(yN, 0.58, 0.64)));
    c.copy(accent).lerp(mudguard, mud).lerp(cream, Math.max(toeCap, stripe));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

/** Rounded footprint (plan view) extruded upwards, then bent for toe spring. */
function buildSole(height: number, grow = 0) {
  const shape = new THREE.Shape();
  const n = 2.6;
  const steps = 96;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const x = (2.08 + grow) * Math.sign(c) * Math.abs(c) ** (2 / n);
    const t = along(x);
    // Wider forefoot, slimmer arch, rounded heel.
    const half = 0.56 + 0.08 * smooth(t, 0.45, 0.7) - 0.05 * smooth(t, 0.25, 0.45) * (1 - smooth(t, 0.45, 0.6)) + grow;
    const z = half * Math.sign(sn) * Math.abs(sn) ** (2 / n);
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.06,
    bevelSegments: 6,
    curveSegments: 1,
  });
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) + 0.07 + spring(pos.getX(i)));
  geo.computeVertexNormals();
  return geo;
}

function Laces({ color }: { color: string }) {
  const laces = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const x = -0.38 + i * 0.3;
        return { x, y: topAt(x) - 0.01, w: upperWidth(along(x)) * 0.75 };
      }),
    [],
  );
  return (
    <group>
      {laces.map((l) => (
        <mesh key={l.x} position={[l.x, l.y, 0]} rotation={[Math.PI / 2, 0, 0.12]} castShadow>
          <capsuleGeometry args={[0.045, l.w, 6, 12]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export type ShoePose = { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> };

export function Sneaker3D({ accent, progress, pointer }: { accent: string } & ShoePose) {
  const group = useRef<THREE.Group>(null);
  const upper = useMemo(buildUpper, []);
  const sole = useMemo(() => buildSole(0.3), []);
  const outsole = useMemo(() => buildSole(0.02, 0.015), []);
  const target = useMemo(() => new THREE.Color(accent), [accent]);
  const current = useRef(new THREE.Color(accent));
  // Shrink the shoe on narrow (portrait) viewports so it never covers the copy.
  const fit = useThree((state) => Math.min(1, state.viewport.width / 6.4));

  useLayoutEffect(() => paintUpper(upper, current.current), [upper]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // Smoothly blend to a newly selected colourway.
    if (!current.current.equals(target)) {
      current.current.lerp(target, 1 - Math.pow(0.001, delta));
      if (current.current.getHex() === target.getHex()) current.current.copy(target);
      paintUpper(upper, current.current);
    }

    const p = progress.current ?? 0;
    const p1 = smooth(p, 0, 0.36); // full spin
    const p2 = smooth(p, 0.36, 0.68); // ¾ hero angle
    const p3 = smooth(p, 0.7, 1); // top-down

    const tY = -0.45 + p1 * Math.PI * 2 + p2 * 0.95 - p3 * 0.35;
    const tX = 0.05 + p2 * 0.35 + p3 * 0.95;
    const tZ = 0.08 - p2 * 0.08 - p3 * 0.25;
    const pt = pointer.current ?? { x: 0, y: 0 };
    const time = state.clock.elapsedTime;

    const k = 1 - Math.pow(0.0005, delta);
    g.rotation.y += (tY + pt.x * 0.25 - g.rotation.y) * k;
    g.rotation.x += (tX + pt.y * 0.12 - g.rotation.x) * k;
    g.rotation.z += (tZ - g.rotation.z) * k;

    const scale = (1 + p2 * 0.15 - p3 * 0.3) * fit;
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * k);
    g.position.x += (0.55 * fit * (1 - p2) - g.position.x) * k;
    g.position.y = (fit < 1 ? 0.1 : -0.55) + p3 * 0.35 + Math.sin(time * 1.4) * 0.06;
  });

  return (
    <group ref={group} dispose={null}>
      <group position={[0, -0.75, 0]}>
        <mesh geometry={upper} position={[0, UPPER_Y, 0]} castShadow>
          <meshPhysicalMaterial vertexColors roughness={0.62} sheen={1} sheenRoughness={0.5} sheenColor="#ffffff" />
        </mesh>

        <mesh geometry={sole} position={[0, 0.06, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#f7ede2" roughness={0.45} clearcoat={0.3} />
        </mesh>
        <mesh geometry={outsole} position={[0, -0.04, 0]}>
          <meshStandardMaterial color="#3a2420" roughness={0.9} />
        </mesh>

        {/* Collar opening + padded rim */}
        <mesh position={[-0.98, topAt(-0.98) + 0.01, 0]} scale={[1.25, 0.18, 0.78]}>
          <sphereGeometry args={[0.42, 32, 16]} />
          <meshStandardMaterial color="#2a1a16" roughness={0.9} />
        </mesh>
        <mesh position={[-0.98, topAt(-0.98) + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.25, 0.78, 1]}>
          <torusGeometry args={[0.44, 0.09, 16, 48]} />
          <meshStandardMaterial color="#f7ede2" roughness={0.75} />
        </mesh>

        {/* Tongue */}
        <mesh position={[-0.58, topAt(-0.58) + 0.08, 0]} rotation={[0, 0, 0.6]} scale={[0.55, 1, 1.4]}>
          <capsuleGeometry args={[0.2, 0.22, 8, 16]} />
          <meshStandardMaterial color={accent} roughness={0.7} />
        </mesh>


        <Laces color="#f7ede2" />
      </group>
    </group>
  );
}
