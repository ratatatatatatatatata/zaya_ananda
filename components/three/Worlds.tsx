"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** "THE JOURNEY INTO ANANDA" — процедурт бүтээсэн 3D ертөнцүүд.
 *  Бүх геометр кодоор үүсдэг (GLB татахгүй — хөнгөн, Draco шаардлагагүй).
 *  Камерын хөдөлгөөнийг scroll progress (0..1) удирдана. */

export type WorldKind =
  | "crystal" | "library" | "gallery" | "seed" | "sanctuary"
  | "chamber" | "path" | "pedestal" | "archive" | "mandala";
type P = MutableRefObject<number>;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

/* ---------- Хуваалцсан элементүүд ---------- */

/** Гэрлийн бөөмс — нэг BufferGeometry (instancing-ийн оронд Points, GPU-д хөнгөн) */
function Particles({ count = 260, radius = 7, color = "#7CDCD2", size = 0.05, burst, progress }: {
  count?: number; radius?: number; color?: string; size?: number;
  burst?: boolean; progress: P;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + Math.random() * 0.65);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(ph) * Math.cos(th);
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      a[i * 3 + 2] = r * Math.cos(ph);
    }
    return a;
  }, [count, radius]);

  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.y = clock.elapsedTime * 0.03;
    const p = progress.current;
    // Болор бутрахад бөөмс гэрлийн үүл болж тэлнэ
    const s = burst ? 1 + ease(Math.max(0, p - 0.6) / 0.4) * 1.8 : 1;
    m.scale.setScalar(s);
    (m.material as THREE.PointsMaterial).opacity = burst ? 0.9 : 0.75;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/** Энергийн бөмбөлөг — хөтөч гэрэл: амьсгалж, progress-оор доош аялна */
function EnergyOrb({ progress, path = [0, 1.6, 0, 0, -0.4, 1.5] }: { progress: P; path?: number[] }) {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    const [x1, y1, z1, x2, y2, z2] = path;
    const breathe = 1 + Math.sin(t * 1.4) * 0.08;
    if (ref.current) {
      ref.current.position.set(lerp(x1, x2, p), lerp(y1, y2, p) + Math.sin(t * 0.9) * 0.08, lerp(z1, z2, p));
      ref.current.scale.setScalar(0.16 * breathe * (1 + p * 0.6));
    }
    if (glow.current && ref.current) {
      glow.current.position.copy(ref.current.position);
      glow.current.scale.setScalar(0.4 * breathe * (1 + p * 0.8));
    }
  });
  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#9BF0E6" />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#2BC8BB" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

function GoldRing({ r = 1.6, tilt = 0.5, speed = 0.12, y = 0 }: { r?: number; tilt?: number; speed?: number; y?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 - tilt, 0, 0]} position={[0, y, 0]}>
      <torusGeometry args={[r, 0.015, 12, 96]} />
      <meshStandardMaterial color="#E3BE62" emissive="#8a6a1f" emissiveIntensity={0.6} metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

/* ---------- 1. CRYSTAL — Үйлчилгээ: ойн сүмийн болор ---------- */
function CrystalWorld({ progress }: { progress: P }) {
  const crystal = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.05) * 0.4, lerp(1.3, 0.5, p), lerp(8.5, 3.4, p));
    camera.lookAt(0, 0.4, 0);
    const shatter = Math.max(0, (progress.current - 0.62) / 0.38);
    const s = (1 + Math.sin(t * 1.1) * 0.03) * (1 - ease(shatter));
    if (crystal.current) { crystal.current.rotation.y = t * 0.25; crystal.current.scale.setScalar(s); }
    if (wire.current) { wire.current.rotation.y = -t * 0.18; wire.current.scale.setScalar(s * 1.25); }
  });
  return (
    <>
      <fog attach="fog" args={["#0c1f22", 5, 15]} />
      <ambientLight intensity={0.35} color="#9adfd6" />
      <pointLight position={[3, 4, 3]} intensity={26} color="#2BC8BB" />
      <pointLight position={[-4, 2, -2]} intensity={14} color="#E3BE62" />
      <pointLight position={[0, -2, 3]} intensity={7} color="#5E8DE0" />
      {/* Болор */}
      <mesh ref={crystal} position={[0, 0.7, 0]}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#134e4a" emissive="#2BC8BB" emissiveIntensity={0.55} metalness={0.35} roughness={0.12} transparent opacity={0.92} />
      </mesh>
      <mesh ref={wire} position={[0, 0.7, 0]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#7CDCD2" wireframe transparent opacity={0.16} />
      </mesh>
      {/* Чулуун тавцан */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.5, 48]} />
        <meshStandardMaterial color="#0f2422" metalness={0.2} roughness={0.85} />
      </mesh>
      <GoldRing r={1.7} tilt={0.45} y={0.7} />
      <GoldRing r={2.2} tilt={-0.3} speed={-0.08} y={0.7} />
      <Particles burst progress={progress} />
      <EnergyOrb progress={progress} path={[1.6, 2.2, 1, 0, 1.9, 1.6]} />
    </>
  );
}

/* ---------- 2. LIBRARY — Сургалт: ухамсрын номын сан ---------- */
function LibraryWorld({ progress }: { progress: P }) {
  const group = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const books = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        pos: [Math.sin((i / 14) * Math.PI * 2) * (2.2 + (i % 3)), (Math.random() - 0.3) * 3.4, Math.cos((i / 14) * Math.PI * 2) * (2.2 + ((i + 1) % 3))] as [number, number, number],
        rot: Math.random() * Math.PI,
        gold: i % 4 === 0,
      })),
    []
  );
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.04) * 0.5, lerp(0.2, 1.4, p), lerp(9, 4.2, p));
    camera.lookAt(0, lerp(0, 1, p), 0);
    if (group.current) {
      group.current.rotation.y = t * 0.05;
      group.current.scale.setScalar(lerp(1, 0.82, p)); // номууд төв рүү нягтарна
    }
    if (beam.current) (beam.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + p * 0.12;
  });
  return (
    <>
      <fog attach="fog" args={["#0c1430", 6, 16]} />
      <ambientLight intensity={0.3} color="#8fb2e8" />
      <pointLight position={[0, 5, 2]} intensity={22} color="#5E8DE0" />
      <pointLight position={[-3, -1, 3]} intensity={10} color="#2BC8BB" />
      {/* Төв гэрлийн багана */}
      <mesh ref={beam} position={[0, 0.5, -0.5]}>
        <cylinderGeometry args={[0.5, 1.1, 9, 24, 1, true]} />
        <meshBasicMaterial color="#9BC7F0" transparent opacity={0.08} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Хөвөх номууд */}
      <group ref={group}>
        {books.map((b, i) => (
          <mesh key={i} position={b.pos} rotation={[0.1, b.rot, 0.18]}>
            <boxGeometry args={[0.55, 0.75, 0.08]} />
            <meshStandardMaterial
              color={b.gold ? "#E3BE62" : "#16324a"}
              emissive={b.gold ? "#8a6a1f" : "#2BC8BB"}
              emissiveIntensity={b.gold ? 0.4 : 0.25}
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>
      <GoldRing r={2.9} tilt={0.9} speed={0.06} y={0.4} />
      <Particles count={340} radius={8} color="#9BC7F0" size={0.04} progress={progress} />
      <EnergyOrb progress={progress} path={[-1.8, 2.4, 0.5, 0, 0.9, 1.8]} />
    </>
  );
}

/* ---------- 3. GALLERY — Дэлгүүр: тансаг галерей ---------- */
function GalleryWorld({ progress }: { progress: P }) {
  const stone = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.05) * 0.6, lerp(1.6, 0.9, p), lerp(7.5, 3.6, p));
    camera.lookAt(0, 0.5, 0);
    if (stone.current) { stone.current.rotation.y = t * 0.3; stone.current.rotation.x = Math.sin(t * 0.4) * 0.1; }
    if (orbit.current) orbit.current.rotation.y = t * 0.12;
  });
  return (
    <>
      <fog attach="fog" args={["#0a1a16", 5, 14]} />
      <ambientLight intensity={0.3} color="#cfe8dd" />
      <spotLight position={[0, 6, 2]} angle={0.5} penumbra={0.7} intensity={60} color="#F0E4C2" />
      <pointLight position={[-4, 1.5, 2]} intensity={10} color="#2BC8BB" />
      {/* Гялгар шал */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#0c1d1a" metalness={0.85} roughness={0.35} />
      </mesh>
      {/* Тавцан + гол чулуу */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.9, 36]} />
        <meshStandardMaterial color="#132a26" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh ref={stone} position={[0, 0.6, 0]}>
        <dodecahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial color="#1d4440" emissive="#2BC8BB" emissiveIntensity={0.35} metalness={0.5} roughness={0.25} />
      </mesh>
      {/* Тойрон хөвөх жижиг чулуунууд */}
      <group ref={orbit}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.sin((i / 5) * Math.PI * 2) * 2.4, 0.4 + (i % 2) * 0.7, Math.cos((i / 5) * Math.PI * 2) * 2.4]}>
            <dodecahedronGeometry args={[0.22 + (i % 3) * 0.07, 0]} />
            <meshStandardMaterial color={i % 2 ? "#E3BE62" : "#35625c"} emissive={i % 2 ? "#8a6a1f" : "#2BC8BB"} emissiveIntensity={0.3} metalness={0.6} roughness={0.35} />
          </mesh>
        ))}
      </group>
      <GoldRing r={2.5} tilt={0.25} y={0.5} />
      <Particles count={220} radius={6.5} color="#F0E4C2" size={0.035} progress={progress} />
      <EnergyOrb progress={progress} path={[2, 2, 0.5, 0, 1.8, 1.4]} />
    </>
  );
}

/* ---------- 4. SEED — Бидний тухай: нэг гэрлээс Ananda ---------- */
function SeedWorld({ progress }: { progress: P }) {
  const seed = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const rays = useRef<THREE.Group>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(0, 0.2, lerp(6.5, 4.2, p));
    camera.lookAt(0, 0.2, 0);
    const grow = 0.14 + p * 1.9;
    if (seed.current) seed.current.scale.setScalar(grow * (1 + Math.sin(t * 1.3) * 0.05));
    if (halo.current) {
      halo.current.scale.setScalar(grow * 2.6);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + p * 0.2;
    }
    if (rays.current) {
      rays.current.rotation.z = t * 0.05;
      rays.current.scale.setScalar(0.2 + p * 1.6);
      rays.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = p * 0.35;
      });
    }
  });
  return (
    <>
      <fog attach="fog" args={["#070d1a", 4, 13]} />
      <ambientLight intensity={0.16} />
      <pointLight position={[0, 0.2, 2]} intensity={20} color="#F0E4C2" />
      {/* Гэрлийн үр */}
      <mesh ref={seed} position={[0, 0.2, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#FFF3D6" />
      </mesh>
      <mesh ref={halo} position={[0, 0.2, -0.2]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#E3BE62" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Гэрлийн туяанууд */}
      <group ref={rays} position={[0, 0.2, -0.5]}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
            <planeGeometry args={[0.06, 7]} />
            <meshBasicMaterial color="#F0E4C2" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <GoldRing r={2.1} tilt={0.5} speed={0.1} y={0.2} />
      <Particles count={300} radius={5.5} color="#F0E4C2" size={0.04} progress={progress} />
      <EnergyOrb progress={progress} path={[0, 2.6, 0.5, 0, 1.6, 1.2]} />
    </>
  );
}

/* ---------- 5. SANCTUARY — Сүнслэг аялал: ариун хөндий ---------- */
function SanctuaryWorld({ progress }: { progress: P }) {
  const lights = useMemo(() => Array.from({ length: 9 }, (_, i) => [Math.sin(i * 1.7) * 1.1, -0.7 + i * 0.06, -i * 1.6] as [number, number, number]), []);
  const orb = useRef<THREE.Mesh>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.06) * 0.3, 0.6, lerp(4, -8, p)); // зам дагуу урагшилна
    camera.lookAt(0, 0.6, camera.position.z - 5);
    if (orb.current) orb.current.scale.setScalar(0.5 * (1 + Math.sin(t * 1.2) * 0.1));
  });
  return (
    <>
      <fog attach="fog" args={["#0d1f26", 4, 16]} />
      <ambientLight intensity={0.3} color="#bfe3da" />
      <pointLight position={[0, 3, -16]} intensity={40} color="#F0B27A" /> {/* алсын нар мандалт */}
      <pointLight position={[2, 3, 0]} intensity={10} color="#2BC8BB" />
      {/* Газар */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, -6]}>
        <planeGeometry args={[30, 50]} />
        <meshStandardMaterial color="#0e2622" roughness={0.9} />
      </mesh>
      {/* Гэрлийн зам */}
      {lights.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#9BF0E6" />
        </mesh>
      ))}
      {/* Замын төгсгөлийн бөмбөлөг */}
      <mesh ref={orb} position={[0, 0.7, -15]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#FFE9B8" />
      </mesh>
      <GoldRing r={1.4} tilt={0.4} y={0.7} />
      <Particles count={260} radius={9} color="#BFE8DE" size={0.045} progress={progress} />
    </>
  );
}

/* ---------- 6. CHAMBER — Үйлчилгээний дэлгэрэнгүй: дотоод өргөө ---------- */
const CHAKRAS = ["#e05252", "#e08a3c", "#e0c84a", "#4ec77a", "#4aa8d8", "#5a6ee0", "#9B6EF0"];
function ChamberWorld({ progress }: { progress: P }) {
  const scan = useRef<THREE.Mesh>(null);
  const aura = useRef<THREE.Mesh>(null);
  const points = useRef<THREE.Group>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.08 + p * 2) * lerp(4.5, 2.6, p), 1 + p * 0.4, Math.cos(t * 0.08 + p * 2) * lerp(4.5, 2.6, p));
    camera.lookAt(0, 1, 0);
    if (scan.current) scan.current.position.y = 0.1 + ((t * 0.35) % 1) * 1.9; // сканнерийн гэрэл дээшилнэ
    if (aura.current) aura.current.scale.setScalar(1 + Math.sin(t * 1.1) * 0.05 + p * 0.15);
    if (points.current) points.current.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      m.scale.setScalar(0.09 * (1 + 0.35 * Math.sin(t * 1.6 + i * 0.9)));
    });
  });
  return (
    <>
      <fog attach="fog" args={["#101a2e", 4, 12]} />
      <ambientLight intensity={0.35} color="#a8cfe0" />
      <pointLight position={[2.5, 3, 2]} intensity={16} color="#2BC8BB" />
      <pointLight position={[-3, 1, -2]} intensity={8} color="#9B6EF0" />
      {/* Хүний хийсвэр дүрс */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.35, 1.1, 8, 16]} />
        <meshStandardMaterial color="#183a45" emissive="#2BC8BB" emissiveIntensity={0.2} transparent opacity={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#183a45" emissive="#2BC8BB" emissiveIntensity={0.2} transparent opacity={0.5} roughness={0.3} />
      </mesh>
      {/* 7 чакра */}
      <group ref={points}>
        {CHAKRAS.map((c, i) => (
          <mesh key={c} position={[0, 0.35 + i * 0.3, 0.36]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshBasicMaterial color={c} />
          </mesh>
        ))}
      </group>
      {/* Аура бүрхүүл + сканнер */}
      <mesh ref={aura} position={[0, 1.15, 0]}>
        <sphereGeometry args={[1.15, 24, 24]} />
        <meshBasicMaterial color="#2BC8BB" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.012, 10, 64]} />
        <meshBasicMaterial color="#9BF0E6" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.3, 40]} />
        <meshStandardMaterial color="#101f2b" roughness={0.8} />
      </mesh>
      <GoldRing r={1.9} tilt={0.35} y={1.1} />
      <Particles count={200} radius={5.5} color="#9BC7F0" size={0.035} progress={progress} />
      <EnergyOrb progress={progress} path={[1.5, 2.6, 0.5, 0, 2.5, 0.8]} />
    </>
  );
}

/* ---------- 7. PATH — Сургалтын дэлгэрэнгүй: мэдлэгийн зам ---------- */
function PathWorld({ progress }: { progress: P }) {
  const isles = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ x: Math.sin(i * 1.1) * 1.4, y: -0.4 + Math.sin(i * 2.1) * 0.25, z: -i * 2.4 })), []);
  const gate = useRef<THREE.Mesh>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.06) * 0.4, 0.9, lerp(3.5, -12, p)); // модулиудын дундуур аялна
    camera.lookAt(0, 0.5, camera.position.z - 5);
    if (gate.current) { gate.current.rotation.z = t * 0.15; gate.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04); }
  });
  return (
    <>
      <fog attach="fog" args={["#0d1530", 4, 15]} />
      <ambientLight intensity={0.32} color="#a6bde8" />
      <pointLight position={[0, 4, -6]} intensity={20} color="#5E8DE0" />
      <pointLight position={[0, 2, -16]} intensity={30} color="#E3BE62" />
      {/* Модулийн арлууд */}
      {isles.map((pos, i) => (
        <group key={i} position={[pos.x, pos.y, pos.z]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.75, 0.25, 24]} />
            <meshStandardMaterial color="#14263e" metalness={0.3} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#2BC8BB" emissive="#2BC8BB" emissiveIntensity={0.5} metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Гэрлэн зам */}
      {isles.slice(0, -1).map((a, i) => {
        const b = isles[i + 1];
        return (
          <mesh key={"l" + i} position={[(a.x + b.x) / 2, (a.y + b.y) / 2 + 0.35, (a.z + b.z) / 2]} rotation={[0, Math.atan2(b.x - a.x, b.z - a.z), 0]}>
            <cylinderGeometry args={[0.012, 0.012, Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z), 6]} />
            <meshBasicMaterial color="#7CDCD2" transparent opacity={0.5} />
          </mesh>
        );
      })}
      {/* Төгсгөлийн гэрэлт хаалга */}
      <mesh ref={gate} position={[0, 1.2, -17]}>
        <torusGeometry args={[1.6, 0.06, 16, 80]} />
        <meshStandardMaterial color="#E3BE62" emissive="#b8912f" emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
      </mesh>
      <Particles count={260} radius={8} color="#9BC7F0" size={0.04} progress={progress} />
      <EnergyOrb progress={progress} path={[0, 2, 1, 0, 1.4, -3]} />
    </>
  );
}

/* ---------- 8. PEDESTAL — Бүтээгдэхүүний дэлгэрэнгүй: зорилгын эрдэнэ ---------- */
function PedestalWorld({ progress }: { progress: P }) {
  const gem = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.1) * lerp(3.4, 2.2, p), 1 + p * 0.5, Math.cos(t * 0.1) * lerp(3.4, 2.2, p));
    camera.lookAt(0, 0.8, 0);
    if (gem.current) { gem.current.rotation.y = t * 0.4; gem.current.position.y = 0.9 + Math.sin(t * 0.9) * 0.07 + p * 0.3; }
    if (orbit.current) orbit.current.rotation.y = -t * 0.2;
  });
  return (
    <>
      <fog attach="fog" args={["#0b1a17", 4, 11]} />
      <ambientLight intensity={0.32} color="#d8eadf" />
      <spotLight position={[0, 5, 1]} angle={0.45} penumbra={0.8} intensity={55} color="#F0E4C2" />
      <pointLight position={[-2.5, 1, 2]} intensity={8} color="#2BC8BB" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0c1c18" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.9, 1.05, 0.85, 32]} />
        <meshStandardMaterial color="#14302b" metalness={0.4} roughness={0.55} />
      </mesh>
      {/* Алтан дөл мэт эрдэнэ */}
      <mesh ref={gem}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#7a5a18" emissive="#E3BE62" emissiveIntensity={0.7} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Ач тусын бэлгэдлүүд тойрно */}
      <group ref={orbit}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.sin((i / 5) * Math.PI * 2) * 1.7, 0.9 + Math.sin(i * 2) * 0.3, Math.cos((i / 5) * Math.PI * 2) * 1.7]}>
            <octahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color="#2BC8BB" emissive="#2BC8BB" emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <GoldRing r={1.6} tilt={0.3} y={0.9} />
      <Particles count={180} radius={5} color="#F0E4C2" size={0.032} progress={progress} />
      <EnergyOrb progress={progress} path={[1.6, 2.2, 0.4, 0, 2, 1]} />
    </>
  );
}

/* ---------- 9. ARCHIVE — Зөвлөгөө мэдээлэл: мэргэдийн архив ---------- */
function ArchiveWorld({ progress }: { progress: P }) {
  const tablets = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    x: (i % 2 === 0 ? -1 : 1) * (1.8 + Math.random() * 0.9),
    y: 0.3 + Math.random() * 2,
    z: -1 - Math.floor(i / 2) * 2.1,
    r: (Math.random() - 0.5) * 0.4,
  })), []);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(Math.sin(t * 0.05) * 0.3, 1.1, lerp(2.5, -11, p)); // архивын танхимаар урагшилна
    camera.lookAt(0, 1, camera.position.z - 5);
  });
  return (
    <>
      <fog attach="fog" args={["#0e1826", 3.5, 14]} />
      <ambientLight intensity={0.3} color="#bcd2e8" />
      <pointLight position={[0, 4, -4]} intensity={18} color="#E3BE62" />
      <pointLight position={[0, 2, -12]} intensity={16} color="#5E8DE0" />
      {/* Гэрлийн багана — тоос харагдана */}
      {[-3, -8].map((z) => (
        <mesh key={z} position={[0.6, 2.5, z]} rotation={[0, 0, 0.25]}>
          <planeGeometry args={[0.8, 6]} />
          <meshBasicMaterial color="#F0E4C2" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Хөвөх чулуун хавтангууд */}
      {tablets.map((tb, i) => (
        <mesh key={i} position={[tb.x, tb.y, tb.z]} rotation={[0, tb.r, 0.06]}>
          <boxGeometry args={[0.7, 1, 0.07]} />
          <meshStandardMaterial color={i % 5 === 0 ? "#E3BE62" : "#1c3040"} emissive={i % 5 === 0 ? "#8a6a1f" : "#2BC8BB"} emissiveIntensity={i % 5 === 0 ? 0.35 : 0.15} metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      {/* Уншлагын тавцан */}
      <mesh position={[0, -0.6, -6]}>
        <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#122334" roughness={0.7} />
      </mesh>
      <Particles count={240} radius={8} color="#E8DDBB" size={0.04} progress={progress} />
      <EnergyOrb progress={progress} path={[0, 2.4, 0.5, 0, 1.6, -4]} />
    </>
  );
}

/* ---------- 10. MANDALA — Миний булан: хувийн мандал ---------- */
function MandalaWorld({ progress }: { progress: P }) {
  const petals = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    camera.position.set(0, lerp(2.4, 1.4, p), lerp(5, 3.6, p));
    camera.lookAt(0, 0.4, 0);
    if (petals.current) petals.current.rotation.y = t * 0.08;
    if (rings.current) rings.current.rotation.y = -t * 0.05;
  });
  return (
    <>
      <fog attach="fog" args={["#0e1c26", 4, 12]} />
      <ambientLight intensity={0.4} color="#cfe6df" />
      <pointLight position={[0, 3, 2]} intensity={14} color="#2BC8BB" />
      <pointLight position={[-2, 1, -2]} intensity={6} color="#E3BE62" />
      {/* Дэлбээнүүд */}
      <group ref={petals}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[Math.sin((i / 12) * Math.PI * 2) * 1.5, 0.15, Math.cos((i / 12) * Math.PI * 2) * 1.5]} rotation={[0.5, (i / 12) * Math.PI * 2, 0]}>
            <coneGeometry args={[0.16, 0.55, 8]} />
            <meshStandardMaterial color={i % 2 ? "#1d4440" : "#35625c"} emissive="#2BC8BB" emissiveIntensity={0.25} roughness={0.5} />
          </mesh>
        ))}
      </group>
      {/* Ахицын цагиргууд */}
      <group ref={rings}>
        <GoldRing r={2} tilt={0.15} y={0.3} />
        <GoldRing r={2.5} tilt={-0.1} speed={-0.07} y={0.3} />
      </group>
      {/* Төв бөмбөлөг */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#134e4a" emissive="#2BC8BB" emissiveIntensity={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.9, 2.1, 0.25, 48]} />
        <meshStandardMaterial color="#10241f" roughness={0.85} />
      </mesh>
      <Particles count={150} radius={5} color="#BFE8DE" size={0.035} progress={progress} />
    </>
  );
}

/* ---------- Canvas ---------- */
const WORLDS: Record<WorldKind, (p: { progress: P }) => JSX.Element> = {
  crystal: CrystalWorld,
  library: LibraryWorld,
  gallery: GalleryWorld,
  seed: SeedWorld,
  sanctuary: SanctuaryWorld,
  chamber: ChamberWorld,
  path: PathWorld,
  pedestal: PedestalWorld,
  archive: ArchiveWorld,
  mandala: MandalaWorld,
};

export default function Worlds({ world, progress }: { world: WorldKind; progress: P }) {
  const W = WORLDS[world];
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 45, position: [0, 1, 8] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <W progress={progress} />
    </Canvas>
  );
}
