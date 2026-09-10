"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";

/** Journey3D.tsx-тэй адил дэлгэцэд ойртох хүртэл Canvas огт ачаалагдахгүй (lazy),
 *  WebGL дэмжихгүй / сэдэлт багасгасан / жижиг дэлгэц дээр хөнгөн CSS orb-аар сольно.
 *  next/dynamic(import(...)) ашигласнаар Three.js/R3F код зөвхөн энэ Canvas бодитоор
 *  render хийгдэх мөчид тусдаа chunk-аар ачаалагдана — эхний хуудасны бандлд ордоггүй. */
const Scene = dynamic(() => import("./AboutSphereScene").then((m) => m.AboutSphereScene), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** WebGL байхгүй үед ашиглах хөнгөн, статик CSS орлуулагч — зөөлөн бүдгэрсэн бөмбөлгүүд. */
function StaticOrbs() {
  return (
    <div aria-hidden className="relative h-full w-full">
      {[
        { top: "18%", left: "38%", size: 132, tone: "#8fd6c4", op: 0.9 },
        { top: "8%", left: "58%", size: 72, tone: "#dff0ea", op: 0.85 },
        { top: "40%", left: "58%", size: 168, tone: "#8fd6c4", op: 0.95 },
        { top: "58%", left: "30%", size: 60, tone: "#f0d9a0", op: 0.8 },
        { top: "68%", left: "62%", size: 96, tone: "#dff0ea", op: 0.85 },
        { top: "30%", left: "20%", size: 44, tone: "#f0d9a0", op: 0.75 },
        { top: "78%", left: "44%", size: 54, tone: "#8fd6c4", op: 0.7 },
      ].map((o, i) => (
        <span
          key={i}
          className="anim-float absolute rounded-full"
          style={{
            top: o.top, left: o.left, width: o.size, height: o.size,
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), ${o.tone} 55%, ${o.tone}55 100%)`,
            opacity: o.op,
            boxShadow: `0 18px 40px -14px ${o.tone}99`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${7 + i}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Бидний тухай hero-гийн баруун талын 3D бөмбөлгийн бүлэг — дэлгэцэд ойртсон үед л
 *  ачаалагдана (IntersectionObserver), WebGL-гүй/reduced-motion/жижиг дэлгэц дээр хөнгөн
 *  статик CSS orb-аар автоматаар сольж харуулна. */
export function AboutSphereHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");
  const [near, setNear] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    setMode(supportsWebGL() ? "webgl" : "fallback");
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setNear(true); ob.disconnect(); } }),
      { rootMargin: "300px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const isWebgl = mode === "webgl";

  return (
    <div ref={wrap} className="relative h-full w-full">
      {isWebgl && near ? (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 7.2], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <Scene reducedMotion={reducedMotion} />
        </Canvas>
      ) : (
        <StaticOrbs />
      )}
    </div>
  );
}
