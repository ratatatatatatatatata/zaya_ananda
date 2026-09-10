"use client";

/** Бидний тухай hero-гийн баруун талын бөмбөлгийн бүлэг — хөнгөн, найдвартай, цэвэр CSS
 *  дүрслэл (radial-gradient + box-shadow). Анх Three.js/React Three Fiber Canvas-аар
 *  хийсэн ч тестийн явцад зарим орчинд (програмчлагдсан viewport, WebGL software
 *  rendering) canvas огт зурагдахгүй хоосон гарах нь ажиглагдсан тул илүү найдвартай,
 *  бүх төхөөрөмж дээр баталгаатай харагддаг CSS хувилбар руу шилжүүлсэн. Бүлэг бүхэлдээ
 *  маш аажим эргэлдэж (animate-spinSlow, tailwind.config.ts), бөмбөлөг тус бүр өөр
 *  saatал/хугацаатай зөөлөн хөвнө (anim-float, globals.css) — хоёул
 *  prefers-reduced-motion үед globals.css-ийн ерөнхий дүрмээр автоматаар зогсоно. */

type Orb = { top: string; left: string; size: number; tone: string; delay: number; duration: number };

const ORBS: Orb[] = [
  { top: "6%", left: "46%", size: 60, tone: "#f0d9a0", delay: 0.2, duration: 8 },
  { top: "14%", left: "62%", size: 84, tone: "#dff0ea", delay: 1.4, duration: 9.5 },
  { top: "24%", left: "30%", size: 46, tone: "#f0d9a0", delay: 0.8, duration: 7.5 },
  { top: "30%", left: "50%", size: 150, tone: "#8fd6c4", delay: 0, duration: 10 },
  { top: "26%", left: "72%", size: 68, tone: "#dff0ea", delay: 2.2, duration: 8.6 },
  { top: "48%", left: "20%", size: 58, tone: "#8fd6c4", delay: 1.1, duration: 9 },
  { top: "50%", left: "40%", size: 118, tone: "#8fd6c4", delay: 0.5, duration: 11 },
  { top: "46%", left: "64%", size: 92, tone: "#dff0ea", delay: 1.8, duration: 8.2 },
  { top: "64%", left: "76%", size: 54, tone: "#f0d9a0", delay: 0.3, duration: 7.8 },
  { top: "70%", left: "54%", size: 72, tone: "#8fd6c4", delay: 2.6, duration: 9.2 },
  { top: "78%", left: "34%", size: 40, tone: "#dff0ea", delay: 1.6, duration: 8.8 },
];

export function AboutSphereHero() {
  return (
    <div aria-hidden className="relative h-full w-full">
      <div className="animate-spinSlow absolute inset-[6%]" style={{ transformOrigin: "50% 50%" }}>
        {ORBS.map((o, i) => (
          <span
            key={i}
            className="anim-float absolute rounded-full"
            style={{
              top: o.top,
              left: o.left,
              width: o.size,
              height: o.size,
              background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.95), ${o.tone} 55%, ${o.tone}66 100%)`,
              boxShadow: `0 ${Math.round(o.size / 4)}px ${Math.round(o.size / 1.4)}px -${Math.round(o.size / 5)}px ${o.tone}aa`,
              animationDelay: `${o.delay}s`,
              animationDuration: `${o.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
