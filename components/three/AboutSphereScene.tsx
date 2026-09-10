"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Бидний тухай хуудасны hero-д зориулсан бөмбөлгийн цуглуулга — Worlds.tsx-ийн бусад
 *  "ертөнцүүдтэй" адил байгалиас procedurally (кодоор) үүсгэгдэнэ, GLB татахгүй.
 *  Диагональ тэнхлэг дагуу нягт төвтэй, хэдэн салангид хөвөгч бөмбөлөгтэй. */

type SphereDef = {
  pos: [number, number, number];
  scale: number;
  speed: number;
  offset: number;
  tone: "primary" | "accent" | "pale";
};

function buildSpheres(count = 16): SphereDef[] {
  const out: SphereDef[] = [];
  for (let i = 0; i < count; i++) {
    // Диагональ тэнхлэг дагуу (зүүн дээрээс баруун доош) нягтаршуулж, төгсгөлд нь
    // 3-4 ширхгийг "салангид хөвөгч" болгож холдуулна.
    const t = i / (count - 1);
    const detached = i >= count - 4;
    const axisX = (t - 0.5) * 6.4;
    const axisY = (0.5 - t) * 4.6;
    const jitter = detached ? 1.9 : 0.85;
    const x = axisX + (Math.random() - 0.5) * jitter;
    const y = axisY + (Math.random() - 0.5) * jitter;
    const z = (Math.random() - 0.5) * (detached ? 2.2 : 1.4);
    const scale = detached ? 0.22 + Math.random() * 0.28 : 0.32 + Math.random() * 0.62;
    out.push({
      pos: [x, y, z],
      scale,
      speed: 0.5 + Math.random() * 0.6,
      offset: Math.random() * Math.PI * 2,
      tone: i % 7 === 0 ? "accent" : i % 3 === 0 ? "pale" : "primary",
    });
  }
  return out;
}

const TONE_COLOR: Record<SphereDef["tone"], string> = {
  primary: "#8fd6c4", // цайвар хаш
  pale: "#dff0ea",    // бараг цагаан, зөөлөн
  accent: "#f0d9a0",  // зөөлөн алтан туяа
};

function Sphere({ def, groupSpeed }: { def: SphereDef; groupSpeed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = def.pos[1] + Math.sin(t * def.speed * groupSpeed + def.offset) * 0.16;
    ref.current.position.x = def.pos[0] + Math.cos(t * def.speed * 0.6 * groupSpeed + def.offset) * 0.06;
  });
  return (
    <mesh ref={ref} position={def.pos} scale={def.scale}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshPhysicalMaterial
        color={TONE_COLOR[def.tone]}
        roughness={0.28}
        metalness={0.05}
        clearcoat={0.6}
        clearcoatRoughness={0.35}
        transmission={def.tone === "pale" ? 0.12 : 0}
        thickness={1}
        envMapIntensity={0.9}
      />
    </mesh>
  );
}

/** Сэдэлт багасгах горимд ч, том дэлгэцэнд ч ижил ашиглана — эргэлт маш аажим. */
export function AboutSphereScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const spheres = useMemo(() => buildSpheres(16), []);
  const group = useRef<THREE.Group>(null);
  const groupSpeed = reducedMotion ? 0.35 : 1;

  useFrame(({ clock }) => {
    if (!group.current) return;
    if (reducedMotion) return;
    group.current.rotation.y = clock.elapsedTime * 0.045;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.55} color="#eaf6f1" />
      <directionalLight position={[3.5, 4, 4]} intensity={1.1} color="#fff8ec" />
      <pointLight position={[-3, -1.5, 2]} intensity={6} color="#8fd6c4" />
      <pointLight position={[2, 2.5, -2]} intensity={5} color="#f0d9a0" />
      <group ref={group}>
        {spheres.map((s, i) => (
          <Sphere key={i} def={s} groupSpeed={groupSpeed} />
        ))}
      </group>
    </>
  );
}
