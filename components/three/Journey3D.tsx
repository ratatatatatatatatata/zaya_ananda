"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Atmosphere } from "../motion/Atmosphere";
import type { WorldKind } from "./Worlds";

const Worlds = dynamic(() => import("./Worlds"), {
  ssr: false,
  loading: () => <SceneLoader />,
});

/** Ачаалах үеийн брэнд цагираг */
function SceneLoader() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-20 w-20">
        <div className="anim-breathe absolute inset-0 rounded-full border-2 border-primary-500/50" />
        <div className="absolute inset-3 rounded-full border border-accent-400/40" style={{ animation: "zaSpinSlow 6s linear infinite" }} />
        <div className="absolute inset-0 grid place-items-center text-xl">✶</div>
      </div>
    </div>
  );
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** "THE JOURNEY INTO ANANDA" — scroll-оор камер удирддаг кино 3D hero.
 *  - Sticky тайзан дээр WebGL ертөнц; урт зам дундуур камер аялна
 *  - Reduced-motion / WebGL-гүй / сул төхөөрөмжид: Atmosphere fallback
 *  - Дэлгэцэд ойртох хүртэл canvas огт ачаалагдахгүй (lazy) */
export function Journey3D({
  world,
  eyebrow,
  title,
  desc,
  heightVh = 190,
  cta,
}: {
  world: WorldKind;
  eyebrow?: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  heightVh?: number;
  cta?: { href: string; label: ReactNode }[];
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const overlay = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");
  const [near, setNear] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 640;
    setMode(!reduced && !small && supportsWebGL() ? "webgl" : "fallback");
  }, []);

  // Canvas-ийг дэлгэцэд ойртсон үед л ачаална
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setNear(true); ob.disconnect(); } }),
      { rootMargin: "400px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  // Scroll progress (rAF throttle) + текстийн параллакс
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
        progress.current = p;
        if (overlay.current) {
          overlay.current.style.opacity = String(1 - Math.max(0, (p - 0.55) / 0.35));
          overlay.current.style.transform = `translateY(${p * -46}px)`;
        }
        if (hint.current) hint.current.style.opacity = String(1 - p * 3);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const isWebgl = mode === "webgl";

  return (
    <section ref={wrap} className="relative" style={{ height: isWebgl ? `${heightVh}vh` : undefined }}>
      <div className={isWebgl ? "sticky top-0 h-screen overflow-hidden" : "relative overflow-hidden"} style={{ background: "radial-gradient(80% 90% at 50% 10%, #10322f 0%, #0b1626 55%, #070d18 100%)" }}>
        {/* Дүрслэл */}
        {isWebgl && near && <Worlds world={world} progress={progress} />}
        {mode === "fallback" && (
          <>
            <Atmosphere className="pointer-events-none absolute inset-0 h-full w-full" density={1.4} />
            <div aria-hidden className="anim-breathe pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(43,200,187,0.35), transparent 70%)", filter: "blur(10px)" }} />
          </>
        )}

        {/* Уншигдахуйц байдлын scrim */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,13,24,0.82) 0%, rgba(7,13,24,0.15) 38%, rgba(7,13,24,0.25) 100%)" }} />

        {/* Текст — тайзны дотор */}
        <div className={isWebgl ? "absolute inset-x-0 bottom-0" : "relative"}>
          <div ref={overlay} className="container-px pb-16 pt-24 sm:pb-24" style={{ willChange: "transform, opacity" }}>
            {eyebrow && <p className="animate-fade-rise text-xs font-bold uppercase tracking-[0.3em] text-primary-300">{eyebrow}</p>}
            <h1 className="animate-fade-rise-delay mt-3 max-w-3xl text-balance text-4xl font-semibold text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] sm:text-6xl">{title}</h1>
            {desc && <p className="animate-fade-rise-delay-2 mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{desc}</p>}
            {cta && cta.length > 0 && (
              <div className="animate-fade-rise-delay-2 mt-7 flex flex-wrap gap-3">
                {cta.map((c, i) => (
                  <Link key={i} href={c.href} className={i === 0 ? "btn btn-primary btn-md" : "btn btn-outline btn-md"}>{c.label}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Доош гүйлгэх сануулга */}
        {isWebgl && (
          <div ref={hint} className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60">
            <div className="flex flex-col items-center gap-1 text-xs tracking-[0.25em]">
              <span>ГҮЙЛГЭЖ АЯЛААРАЙ</span>
              <span className="anim-float text-lg">↓</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
