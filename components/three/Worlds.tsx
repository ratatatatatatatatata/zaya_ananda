"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  const starTex = useStarTexture();
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
    // Одод анивчина — агаар мандлын гэрлийн хэлбэлзэл
    const twinkle = 0.82 + Math.sin(clock.elapsedTime * 1.7) * 0.08 + Math.sin(clock.elapsedTime * 3.3 + 1.1) * 0.05;
    (m.material as THREE.PointsMaterial).opacity = (burst ? 0.95 : 0.85) * twinkle;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={starTex ?? undefined} color={color} size={size * 2.6} sizeAttenuation transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
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

/** Орчны гэрэлтүүлгийн зураглал (PMREM) — метал, шил, чулууны гадаргууг бодитой болгоно. */
function EnvLight({ sky = "#2f6b64", horizon = "#123430", ground = "#050c0d" }: { sky?: string; horizon?: string; ground?: string }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 32; c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, sky); g.addColorStop(0.52, horizon); g.addColorStop(1, ground);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromEquirectangular(tex);
    scene.environment = rt.texture;
    tex.dispose(); pmrem.dispose();
    return () => { scene.environment = null; rt.dispose(); };
  }, [gl, scene, sky, horizon, ground]);
  return null;
}

/** Радиаль градиент бүхий зөөлөн текстур — контакт сүүдэр/гэрэлтэлтэд. */
function useRadialTexture(inner: string, outer: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner); g.addColorStop(1, outer);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [inner, outer]);
}

/** Бодит контакт сүүдэр — объектын өндөр, хэмжээнд тохирсон зөөлөн зуйван сүүдэр. */
function ContactShadow({ y = -0.62, scale = 1.9, opacity = 0.55, follow }: { y?: number; scale?: number; opacity?: number; follow?: MutableRefObject<THREE.Mesh | null> }) {
  const tex = useRadialTexture("rgba(0,0,0,0.85)", "rgba(0,0,0,0)");
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current || !follow?.current) return;
    // Объект дээшлэх тусам сүүдэр бүдгэрч томорно
    const h = follow.current.position.y;
    const k = THREE.MathUtils.clamp(1 - (h - 0.55) * 0.55, 0.45, 1.15);
    ref.current.scale.setScalar(scale * (2 - k));
    (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * k;
  });
  if (!tex) return null;
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} scale={scale} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

/** Зөөлөн гэрлийн бүрхүүл (bloom-ийн хямд хувилбар) */
function Glow({ position = [0, 0, 0] as [number, number, number], scale = 3, color = "rgba(124,220,210,0.55)" }) {
  const tex = useRadialTexture(color, "rgba(0,0,0,0)");
  if (!tex) return null;
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.75} />
    </sprite>
  );
}

/** Гараар барьсан мэт камерын нарийн хэлбэлзэл — механик биш, амьд мэдрэмж өгнө. */
function handheld(t: number, amp = 1) {
  return {
    x: (Math.sin(t * 0.31) * 0.6 + Math.sin(t * 0.73 + 1.2) * 0.28 + Math.sin(t * 1.51 + 2.6) * 0.09) * 0.14 * amp,
    y: (Math.sin(t * 0.27 + 0.8) * 0.5 + Math.sin(t * 0.91 + 2.1) * 0.2) * 0.1 * amp,
  };
}


/* ---------- Процедурт текстурууд (canvas дээр кодоор зурагдана) ---------- */

/** Одны цэгийн текстур — дугуй гэрэлтэлт + сул загалмай туяа */
function useStarTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(235,248,255,0.85)");
    g.addColorStop(0.45, "rgba(180,220,240,0.22)");
    g.addColorStop(1, "rgba(160,200,230,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
    // загалмай туяа
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(32, 6); ctx.lineTo(32, 58); ctx.moveTo(6, 32); ctx.lineTo(58, 32); ctx.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/** Утга-шуугиан (fBm) — гарагийн гадаргуу, үүл үүсгэхэд */
function valueNoise(w: number, h: number, octaves = 5) {
  const out = new Float32Array(w * h);
  let amp = 1, total = 0;
  for (let o = 0; o < octaves; o++) {
    const gw = Math.max(3, Math.round(w / Math.pow(2, octaves - o)));
    const gh = Math.max(3, Math.round(h / Math.pow(2, octaves - o)));
    const grid = new Float32Array(gw * gh);
    for (let i = 0; i < grid.length; i++) grid[i] = Math.random();
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const fx = (x / w) * gw, fy = (y / h) * gh;
        const x0 = Math.floor(fx) % gw, y0 = Math.floor(fy) % gh;
        const x1 = (x0 + 1) % gw, y1 = (y0 + 1) % gh;
        const tx = fx - Math.floor(fx), ty = fy - Math.floor(fy);
        const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
        const a = grid[y0 * gw + x0], b = grid[y0 * gw + x1], c2 = grid[y1 * gw + x0], d = grid[y1 * gw + x1];
        const top = a + (b - a) * sx, bot = c2 + (d - c2) * sx;
        out[y * w + x] += (top + (bot - top) * sy) * amp;
      }
    }
    total += amp; amp *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

/** Гарагийн гадаргуугийн зураг: далай → эрэг → тал → өндөрлөг → цас */
function usePlanetTextures() {
  return useMemo(() => {
    const W = 256, H = 128;
    const n = valueNoise(W, H, 5);
    const surf = document.createElement("canvas"); surf.width = W; surf.height = H;
    const bump = document.createElement("canvas"); bump.width = W; bump.height = H;
    const sc = surf.getContext("2d"), bc = bump.getContext("2d");
    if (!sc || !bc) return null;
    const si = sc.createImageData(W, H), bi = bc.createImageData(W, H);
    const stops: [number, number[]][] = [
      [0.00, [8, 34, 40]],    // гүн далай
      [0.42, [12, 62, 62]],   // тунгалаг ус
      [0.50, [24, 84, 72]],   // эрэг
      [0.62, [32, 98, 74]],   // тал
      [0.76, [70, 118, 88]],  // өндөрлөг
      [0.88, [150, 170, 150]],// хад
      [1.00, [226, 240, 235]],// цас
    ];
    for (let y = 0; y < H; y++) {
      // туйл руу цасжилт нэмнэ
      const lat = Math.abs(y / H - 0.5) * 2;
      for (let x = 0; x < W; x++) {
        let v = n[y * W + x];
        v = Math.min(1, v * 1.15 + lat * lat * 0.35);
        let c = stops[0][1];
        for (let i = 1; i < stops.length; i++) {
          if (v <= stops[i][0]) {
            const [p0, c0] = stops[i - 1], [p1, c1] = stops[i];
            const k = (v - p0) / (p1 - p0);
            c = [0, 1, 2].map((j) => c0[j] + (c1[j] - c0[j]) * k);
            break;
          }
          c = stops[i][1];
        }
        const i4 = (y * W + x) * 4;
        si.data[i4] = c[0]; si.data[i4 + 1] = c[1]; si.data[i4 + 2] = c[2]; si.data[i4 + 3] = 255;
        const g = Math.round(v * 255);
        bi.data[i4] = bi.data[i4 + 1] = bi.data[i4 + 2] = g; bi.data[i4 + 3] = 255;
      }
    }
    sc.putImageData(si, 0, 0); bc.putImageData(bi, 0, 0);

    // Үүлний давхарга
    const cn = valueNoise(W, H, 4);
    const cl = document.createElement("canvas"); cl.width = W; cl.height = H;
    const cc = cl.getContext("2d");
    if (!cc) return null;
    const ci = cc.createImageData(W, H);
    for (let i = 0; i < W * H; i++) {
      const v = Math.max(0, (cn[i] - 0.52) / 0.48);
      const a = Math.round(Math.pow(v, 1.4) * 210);
      ci.data[i * 4] = ci.data[i * 4 + 1] = ci.data[i * 4 + 2] = 255;
      ci.data[i * 4 + 3] = a;
    }
    cc.putImageData(ci, 0, 0);

    // Гарагийн цагираг — төвөөс гарах туузан бүтэц (RingGeometry-ийн диск UV-д тохирно)
    const R = 128;
    const rg = document.createElement("canvas"); rg.width = rg.height = R;
    const rc = rg.getContext("2d");
    if (!rc) return null;
    rc.clearRect(0, 0, R, R);
    for (let i = 0; i < 44; i++) {
      const rad = 20 + (i / 44) * 42;
      const alpha = (0.05 + Math.random() * 0.32) * (1 - Math.abs(i / 44 - 0.45));
      rc.beginPath();
      rc.arc(R / 2, R / 2, rad, 0, Math.PI * 2);
      rc.strokeStyle = `rgba(${222 + Math.random() * 24 | 0},${196 + Math.random() * 30 | 0},${150 + Math.random() * 50 | 0},${alpha.toFixed(3)})`;
      rc.lineWidth = 0.6 + Math.random() * 1.4;
      rc.stroke();
    }

    const mk = (c: HTMLCanvasElement, srgb = true) => {
      const t = new THREE.CanvasTexture(c);
      t.wrapS = THREE.RepeatWrapping;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    };
    return { surface: mk(surf), bump: mk(bump, false), clouds: mk(cl), rings: mk(rg) };
  }, []);
}

/* ---------- 1. CRYSTAL — Үйлчилгээ: ойн сүмийн болор ---------- */
function CrystalWorld({ progress }: { progress: P }) {
  const tex = usePlanetTextures();
  const planet = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Mesh>(null);
  const moonPivot = useRef<THREE.Group>(null);
  const atmo = useRef<THREE.Mesh>(null);
  const sun = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = ease(progress.current);
    const hh = handheld(t, 0.7);

    // Камер: сансрын гүнээс гараг руу аажим дөхнө
    camera.position.set(hh.x + Math.sin(t * 0.04) * 0.3, lerp(1.15, 0.35, p) + hh.y, lerp(9.2, 4.2, p));
    camera.lookAt(0, 0.35 + hh.y * 0.3, 0);

    // Гараг тэнхлэгээ тойрон жигд эргэнэ (тэнхлэгийн налуутай)
    if (planet.current) planet.current.rotation.y = t * 0.045;
    // Үүлс арай хурдан, өөр чиглэлд
    if (clouds.current) { clouds.current.rotation.y = t * 0.062; clouds.current.rotation.x = 0.06; }
    // Цагираг маш аажим эргэлдэж, гүйлгэх тусам налуу нь өөрчлөгдөнө
    if (rings.current) {
      rings.current.rotation.z = t * 0.02;
      rings.current.rotation.x = -Math.PI / 2 + 0.42 + p * 0.16;
    }
    // Дагуул тойрог замаараа
    if (moonPivot.current) {
      moonPivot.current.rotation.y = t * 0.16;
      moonPivot.current.rotation.z = 0.22;
    }
    // Агаар мандлын гэрэлтэлт — нар талын хэсэг илүү тод
    if (atmo.current) (atmo.current.material as THREE.MeshBasicMaterial).opacity = 0.16 + Math.sin(t * 0.5) * 0.02 + p * 0.06;
    if (sun.current) sun.current.intensity = 3.2 + Math.sin(t * 0.6) * 0.12;
  });

  return (
    <>
      <fog attach="fog" args={["#040910", 9, 26]} />
      <EnvLight sky="#16303f" horizon="#0a1622" ground="#02050a" />
      <ambientLight intensity={0.12} color="#8fb6cf" />
      {/* Нар — хажуу талаас, терминатор (өдөр/шөнийн зааг) үүсгэнэ */}
      <directionalLight ref={sun} position={[6, 2.6, 3.5]} intensity={3.2} color="#FFF3DA" />
      {/* Тусгал гэрэл — сүүдэрт талыг бүрэн харлуулахгүй */}
      <pointLight position={[-5, -1.5, -3]} intensity={5} color="#2f5f86" />

      {/* Гараг */}
      <group rotation={[0, 0, 0.28]}>
        <mesh ref={planet}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            map={tex?.surface ?? undefined}
            bumpMap={tex?.bump ?? undefined}
            bumpScale={0.035}
            roughness={0.92}
            metalness={0.02}
            envMapIntensity={0.35}
          />
        </mesh>
        {/* Үүлний давхарга */}
        <mesh ref={clouds}>
          <sphereGeometry args={[1.53, 48, 48]} />
          <meshStandardMaterial map={tex?.clouds ?? undefined} transparent opacity={0.42} depthWrite={false} roughness={1} />
        </mesh>
        {/* Агаар мандал — ирмэгийн цэнхэр туяа */}
        <mesh ref={atmo} scale={1.09}>
          <sphereGeometry args={[1.5, 48, 48]} />
          <meshBasicMaterial color="#7fd8ea" transparent opacity={0.16} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Гарагийн цагираг — тоос, мөсний тууз */}
      <mesh ref={rings} rotation={[-Math.PI / 2 + 0.42, 0, 0]}>
        <ringGeometry args={[2.1, 3.5, 128, 1]} />
        <meshBasicMaterial map={tex?.rings ?? undefined} transparent side={THREE.DoubleSide} depthWrite={false} opacity={0.95} />
      </mesh>

      {/* Дагуул сар */}
      <group ref={moonPivot}>
        <mesh position={[4.4, 0.6, 0]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial map={tex?.bump ?? undefined} color="#c9d3d8" roughness={0.98} metalness={0} bumpMap={tex?.bump ?? undefined} bumpScale={0.05} />
        </mesh>
      </group>

      {/* Алсын нар — гялбаа */}
      <Glow position={[6.2, 2.4, -2]} scale={5} color="rgba(255,238,200,0.5)" />
      <Glow position={[0, 0, -3]} scale={9} color="rgba(60,150,190,0.16)" />

      {/* Оддын огторгуй — гурван гүнд, өөр өөр хэмжээтэй */}
      <Particles count={420} radius={16} color="#EAF4FF" size={0.028} progress={progress} />
      <Particles count={220} radius={11} color="#BFD8F0" size={0.045} progress={progress} />
      <Particles burst count={90} radius={7} color="#9BF0E6" size={0.06} progress={progress} />

      <EnergyOrb progress={progress} path={[2.6, 2.6, 1.4, 0.4, 2.1, 2.2]} />
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
      <EnvLight sky="#2c4a80" horizon="#111c3a" ground="#050815" />
      <ambientLight intensity={0.24} color="#8fb2e8" />
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
    const hh = handheld(t, 0.8);
    camera.position.set(hh.x + Math.sin(t * 0.05) * 0.4, lerp(1.6, 0.9, p) + hh.y, lerp(7.5, 3.6, p));
    camera.lookAt(0, 0.5 + hh.y * 0.3, 0);
    if (stone.current) { stone.current.rotation.y = t * 0.3; stone.current.rotation.x = Math.sin(t * 0.4) * 0.1; }
    if (orbit.current) orbit.current.rotation.y = t * 0.12;
  });
  return (
    <>
      <fog attach="fog" args={["#0a1a16", 5, 14]} />
      <EnvLight sky="#3a6f66" horizon="#0f2a26" ground="#050b0a" />
      <ambientLight intensity={0.2} color="#cfe8dd" />
      <spotLight position={[0, 6, 2]} angle={0.5} penumbra={0.85} intensity={60} color="#F0E4C2" />
      <pointLight position={[-4, 1.5, 2]} intensity={10} color="#2BC8BB" />
      {/* Гялгар шал */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#0c1d1a" metalness={0.9} roughness={0.22} envMapIntensity={1.1} />
      </mesh>
      <ContactShadow y={-1.13} scale={1.9} opacity={0.5} follow={stone} />
      {/* Тавцан + гол чулуу */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.9, 36]} />
        <meshStandardMaterial color="#132a26" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh ref={stone} position={[0, 0.6, 0]}>
        <dodecahedronGeometry args={[0.75, 0]} />
        <meshPhysicalMaterial color="#2a5f59" roughness={0.28} metalness={0.25} clearcoat={0.9} clearcoatRoughness={0.2} envMapIntensity={1.4} />
      </mesh>
      <Glow position={[0, 0.6, -0.3]} scale={3} color="rgba(80,210,196,0.3)" />
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
      <EnvLight sky="#4a7a6c" horizon="#153029" ground="#060c0c" />
      <ambientLight intensity={0.24} color="#bfe3da" />
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
      <EnvLight sky="#33566e" horizon="#132335" ground="#05090f" />
      <ambientLight intensity={0.28} color="#a8cfe0" />
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
      <EnvLight sky="#31508a" horizon="#131d3c" ground="#050815" />
      <ambientLight intensity={0.26} color="#a6bde8" />
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
      <EnvLight sky="#43705f" horizon="#12302a" ground="#050b0a" />
      <ambientLight intensity={0.22} color="#d8eadf" />
      <spotLight position={[0, 5, 1]} angle={0.45} penumbra={0.9} intensity={55} color="#F0E4C2" />
      <pointLight position={[-2.5, 1, 2]} intensity={8} color="#2BC8BB" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0c1c18" metalness={0.9} roughness={0.25} envMapIntensity={1.1} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.9, 1.05, 0.85, 32]} />
        <meshStandardMaterial color="#14302b" metalness={0.4} roughness={0.55} />
      </mesh>
      {/* Алтан дөл мэт эрдэнэ */}
      <mesh ref={gem}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial color="#E7C778" metalness={1} roughness={0.18} clearcoat={0.8} envMapIntensity={1.6} />
      </mesh>
      <Glow position={[0, 0.9, -0.3]} scale={2.6} color="rgba(227,190,98,0.4)" />
      <ContactShadow y={-0.83} scale={1.15} opacity={0.55} follow={gem} />
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
      <EnvLight sky="#3a5170" horizon="#141f2e" ground="#05080d" />
      <ambientLight intensity={0.24} color="#bcd2e8" />
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
      <EnvLight sky="#3d6e66" horizon="#122a2c" ground="#050b0c" />
      <ambientLight intensity={0.3} color="#cfe6df" />
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
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;   // кино маягийн өнгөний хувиргалт
        gl.toneMappingExposure = 1.15;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      camera={{ fov: 45, position: [0, 1, 8] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <W progress={progress} />
    </Canvas>
  );
}
