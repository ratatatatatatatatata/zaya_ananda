"use client";

import { useEffect, useRef, useState } from "react";

const FADE_MS = 500;
const FADE_OUT_LEAD = .55;

/** Manually loop with interruptible rAF fades. No CSS video transitions. */
export function FadingVideo({ src, poster, image, hero = false }: { src: string; poster: string; image?: string; hero?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setAllowed(!reduced.matches && !connection?.saveData);
    update();
    reduced.addEventListener("change", update);
    const observer = new IntersectionObserver(entries => setNear(entries[0].isIntersecting), { rootMargin: "160px" });
    if (wrap.current) observer.observe(wrap.current);
    return () => { reduced.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || !allowed || !near || paused || failed || image) return;
    let raf = 0, timer: ReturnType<typeof setTimeout> | undefined;
    let fadingOut = false, disposed = false;
    const fadeTo = (target: number, duration = FADE_MS) => {
      cancelAnimationFrame(raf);
      const from = Number.parseFloat(v.style.opacity) || 0;
      const start = performance.now();
      const step = (time: number) => {
        if (disposed) return;
        const progress = Math.min(1, (time - start) / duration);
        v.style.opacity = String(from + (target - from) * progress);
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const play = () => {
      if (document.hidden || disposed) return;
      v.play().then(() => { if (!disposed) fadeTo(1); }).catch(() => { if (!disposed) setFailed(true); });
    };
    const loaded = () => { v.style.opacity = "0"; play(); };
    const timeupdate = () => {
      const remaining = v.duration - v.currentTime;
      if (!fadingOut && remaining > 0 && remaining <= FADE_OUT_LEAD) { fadingOut = true; fadeTo(0); }
    };
    const ended = () => {
      cancelAnimationFrame(raf);
      v.style.opacity = "0";
      timer = setTimeout(() => { if (!disposed) { v.currentTime = 0; fadingOut = false; play(); } }, 100);
    };
    const visibility = () => { if (document.hidden) { v.pause(); cancelAnimationFrame(raf); } else play(); };
    v.addEventListener("loadeddata", loaded);
    v.addEventListener("timeupdate", timeupdate);
    v.addEventListener("ended", ended);
    document.addEventListener("visibilitychange", visibility);
    if (v.readyState >= 2) loaded();
    return () => {
      disposed = true; cancelAnimationFrame(raf); clearTimeout(timer); v.pause();
      v.removeEventListener("loadeddata", loaded); v.removeEventListener("timeupdate", timeupdate); v.removeEventListener("ended", ended);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [src, image, allowed, near, paused, failed]);

  return <div ref={wrap} className={`cinema-backdrop ${hero ? "cinema-backdrop-hero" : ""}`}>
    {/* The supplied frame remains visible while loading, offline or in reduced motion. */}
    <div className="cinema-media" aria-hidden="true">
      <img src={image || poster} alt="" fetchPriority={hero ? "high" : "auto"} loading={hero ? "eager" : "lazy"} />
      {!image && allowed && near && !failed && <video ref={video} src={src} muted playsInline autoPlay={!paused} preload="auto" aria-hidden="true" style={{ opacity: 0 }} onError={() => setFailed(true)} />}
    </div>
    {!image && allowed && !failed && <button type="button" className="cinema-video-toggle liquid-glass" aria-label={paused ? "Дэвсгэр видео тоглуулах" : "Дэвсгэр видео түр зогсоох"} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? "▷" : "Ⅱ"}</button>}
  </div>;
}
