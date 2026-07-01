"use client";

import { useEffect, useRef, useState } from "react";
import { MeditationFigure } from "./MeditationFigure";
import { T } from "./T";

const stars = Array.from({ length: 10 }, (_, i) => ({
  x: 8 + ((i * 9.3) % 84),
  y: 20 + ((i * 37) % 64),
  s: 3 + ((i * 7) % 5),
  d: (i % 5) * 0.12,
}));

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function MeditationReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setP(1); return; }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const vh = window.innerHeight;
        const total = el.offsetHeight - vh;
        const passed = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
        setP(total > 0 ? passed / total : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const figO = clamp01((p - 0.28) / 0.4);
  const auraO = clamp01((p - 0.12) / 0.4);
  const waveO = clamp01((p - 0.5) / 0.3);
  const headO = clamp01((p - 0.62) / 0.3);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* peaceful cosmic wash that grows (kept light & calm) */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, rgba(14,116,110,${(0.06 + p * 0.18).toFixed(3)}) 0%, rgba(155,110,240,${(0.04 + p * 0.12).toFixed(3)}) 38%, transparent 72%)` }} />

        {/* rising stars */}
        {stars.map((st, i) => (
          <span key={i} className="absolute rounded-full bg-white"
            style={{ left: st.x + "%", top: st.y + "%", width: st.s, height: st.s, opacity: auraO * (0.5 + (i % 3) * 0.18), boxShadow: "0 0 10px #9B6EF0", transform: `translateY(${(-p * (90 + i * 12)).toFixed(0)}px)` }} />
        ))}

        {/* aura + energy waves + figure */}
        <div className="relative grid place-items-center">
          <div className="absolute h-[30rem] w-[30rem] rounded-full"
            style={{ opacity: auraO, transform: `scale(${0.8 + p * 0.4})`, background: "radial-gradient(circle, rgba(22,175,164,0.28), rgba(155,110,240,0.10) 55%, transparent 72%)" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} className="absolute rounded-full border border-primary-300/50"
              style={{ width: 240 + i * 90, height: 240 + i * 90, opacity: waveO * (0.5 - i * 0.12), transform: `scale(${1 + p * (0.4 + i * 0.25)})` }} />
          ))}
          <div style={{ opacity: figO, filter: `blur(${((1 - figO) * 9).toFixed(1)}px)`, transform: `scale(${(0.9 + figO * 0.1).toFixed(3)})` }}>
            <MeditationFigure tone="jade" className="w-64 sm:w-80" />
          </div>
        </div>

        {/* headline */}
        <div className="absolute bottom-[12vh] left-0 right-0 px-6 text-center" style={{ opacity: headO, transform: `translateY(${((1 - headO) * 24).toFixed(0)}px)` }}>
          <span className="eyebrow justify-center"><T k="meditate.eyebrow" /></span>
          <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-3xl font-semibold text-ink sm:text-5xl"><T k="meditate.title" /></h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/70"><T k="meditate.sub" /></p>
        </div>
      </div>
    </section>
  );
}
