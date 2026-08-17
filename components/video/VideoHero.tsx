"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";

export type Clip = "meditation" | "stream" | "temple" | "stones";

/** Бодит бичлэгээр дүрсэлсэн кино толгой.
 *  - Видео нь чимээгүй, давтагдана; дэлгэцээс гарахад зогсоно (батарей/CPU хэмнэнэ)
 *  - Гүйлгэхэд зураг нь удаан хөдөлж (parallax), текст дээшилнэ
 *  - reduced-motion / өгөгдөл хэмнэх горимд зөвхөн постер зураг харагдана */
export function VideoHero({
  clip,
  src,
  eyebrow,
  title,
  desc,
  cta,
  height = "tall",
  align = "left",
}: {
  clip: Clip;
  /** Админаас байршуулсан бичлэгийн хаяг — байвал өгөгдмөл клипийг орлоно */
  src?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  cta?: { href: string; label: ReactNode; variant?: "gold" }[];
  height?: "tall" | "mid" | "short";
  align?: "left" | "center";
}) {
  const wrap = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // @ts-expect-error — Save-Data нь бүх хөтөч дээр байхгүй
    const saveData = navigator.connection?.saveData === true;
    setMotion(!reduced && !saveData);
  }, []);

  // Дэлгэцэд байхад л тоглоно
  useEffect(() => {
    const el = wrap.current, v = video.current;
    if (!el || !v || !motion) return;
    const ob = new IntersectionObserver(
      (es) => es.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())),
      { threshold: 0.05 }
    );
    ob.observe(el);
    const onVis = () => (document.hidden ? v.pause() : v.play().catch(() => {}));
    document.addEventListener("visibilitychange", onVis);
    return () => { ob.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [motion]);

  // Parallax — зураг удаан, текст хурдан
  useEffect(() => {
    if (!motion) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
        if (layer.current) layer.current.style.transform = `translate3d(0, ${(p * 16).toFixed(2)}%, 0) scale(${(1.06 + p * 0.06).toFixed(3)})`;
        if (copy.current) {
          copy.current.style.transform = `translate3d(0, ${(-p * 40).toFixed(1)}px, 0)`;
          copy.current.style.opacity = String(Math.max(0, 1 - p * 1.35));
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, [motion]);

  const h = height === "tall" ? "min-h-[86svh]" : height === "mid" ? "min-h-[64svh]" : "min-h-[46svh]";

  return (
    <section ref={wrap} className={`night relative isolate flex ${h} items-end overflow-hidden`}>
      {/* Дүрслэл */}
      <div ref={layer} aria-hidden className="absolute inset-0 -z-10 will-change-transform">
        {motion ? (
          <video
            ref={video}
            className="h-full w-full object-cover"
            src={src || `/video/${clip}.mp4`}
            poster={`/video/${clip}.jpg`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={`/video/${clip}.jpg`} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      {/* Уншигдахуйц болгох давхаргууд — ойн ногооноос гүн нарс руу */}
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(to top, rgba(8,20,17,0.92) 0%, rgba(8,20,17,0.45) 34%, rgba(8,20,17,0.12) 62%, rgba(8,20,17,0.35) 100%)" }} />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(80% 60% at 78% 12%, rgba(232,183,95,0.16), transparent 62%)" }} />

      {/* Агуулга */}
      <div className={`container-px w-full pb-16 pt-32 sm:pb-24 ${align === "center" ? "text-center" : ""}`}>
        <div ref={copy} className={align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"} style={{ willChange: "transform, opacity" }}>
          {eyebrow && (
            <p className={`animate-fade-rise flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.34em] text-accent-300 ${align === "center" ? "justify-center" : ""}`}>
              <span aria-hidden className="h-px w-8 bg-accent-300/60" />
              {eyebrow}
            </p>
          )}
          <h1 className="animate-fade-rise-delay mt-5 text-balance font-display text-[2.6rem] font-semibold leading-[1.06] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {desc && <p className={`animate-fade-rise-delay-2 mt-5 max-w-xl text-lg leading-relaxed text-white/80 ${align === "center" ? "mx-auto" : ""}`}>{desc}</p>}
          {cta && cta.length > 0 && (
            <div className={`animate-fade-rise-delay-2 mt-8 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
              {cta.map((c, i) => (
                <Link key={i} href={c.href} className={`btn btn-lg ${c.variant === "gold" ? "btn-gold" : i === 0 ? "btn-primary" : "btn-outline"}`}>
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Доод ирмэг — цаасан хуудас руу зөөлөн шилжинэ */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to bottom, transparent, rgb(var(--c-cream)))" }} />
    </section>
  );
}
