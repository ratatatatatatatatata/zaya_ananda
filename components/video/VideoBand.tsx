"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Clip } from "./VideoHero";

/** Хуудас дундах бичлэгэн тууз — амьсгал авах зогсолт.
 *  Хоёр хэсгийн хооронд байгалийн дүрслэлээр сэтгэлийг чөлөөлнө. */
export function VideoBand({
  clip,
  quote,
  author,
  cta,
}: {
  clip: Clip;
  quote: ReactNode;
  author?: ReactNode;
  cta?: { href: string; label: ReactNode };
}) {
  const wrap = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = wrap.current, v = video.current;
    if (!el || !v || !motion) return;
    const ob = new IntersectionObserver(
      (es) => es.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())),
      { threshold: 0.15 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [motion]);

  useEffect(() => {
    if (!motion) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el || !layer.current) return;
        const r = el.getBoundingClientRect();
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        layer.current.style.transform = `translate3d(0, ${((p - 0.5) * 14).toFixed(2)}%, 0) scale(1.12)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, [motion]);

  return (
    <section ref={wrap} className="night relative isolate flex min-h-[58svh] items-center overflow-hidden">
      <div ref={layer} aria-hidden className="absolute inset-0 -z-10 will-change-transform">
        {motion ? (
          <video ref={video} className="h-full w-full object-cover" src={`/video/${clip}.mp4`} poster={`/video/${clip}.jpg`} muted loop playsInline preload="none" />
        ) : (
          <img src={`/video/${clip}.jpg`} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(105deg, rgba(8,20,17,0.9) 0%, rgba(8,20,17,0.62) 46%, rgba(8,20,17,0.25) 100%)" }} />

      <div className="container-px py-20">
        <figure className="max-w-2xl">
          <span aria-hidden className="block font-display text-5xl leading-none text-accent-300/70">“</span>
          <blockquote className="mt-2 font-display text-2xl leading-snug text-white sm:text-[2rem]">{quote}</blockquote>
          {author && <figcaption className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-white/60">{author}</figcaption>}
          {cta && (
            <Link href={cta.href} className="btn btn-gold btn-md mt-8">
              {cta.label}
            </Link>
          )}
        </figure>
      </div>
    </section>
  );
}
