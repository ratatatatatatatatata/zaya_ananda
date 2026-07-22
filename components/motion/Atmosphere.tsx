"use client";

import { useEffect, useRef } from "react";

/** Агаарт хөвөх гэрлийн тоос — canvas дээр хөнгөн бөөмс.
 *  - prefers-reduced-motion үед бүрэн унтарна
 *  - Дэлгэцээс гарсан/таб идэвхгүй үед зогсоно (CPU хэмнэнэ)
 *  - dpr дээд тал нь 1.5, бөөмсийн тоо талбайд тааруулж хязгаарлагдана */
export function Atmosphere({ className, density = 1, color = "182,224,214" }: {
  className?: string;
  density?: number;
  color?: string; // "r,g,b"
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0, running = false, w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    type P = { x: number; y: number; r: number; s: number; a: number; p: number };
    let parts: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(64, ((w * h) / 20000) * density));
      parts = Array.from({ length: Math.max(10, target) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.7,
        s: 0.08 + Math.random() * 0.3,
        a: 0.1 + Math.random() * 0.3,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const pt of parts) {
        pt.y -= pt.s;
        pt.x += Math.sin(t / 2600 + pt.p) * 0.14;
        if (pt.y < -4) { pt.y = h + 4; pt.x = Math.random() * w; }
        const tw = pt.a * (0.55 + 0.45 * Math.sin(t / 950 + pt.p));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${tw.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    start();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting && !document.hidden ? start() : stop())));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [density, color]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
