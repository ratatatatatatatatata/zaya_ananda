"use client";

import { useEffect, useRef } from "react";

/** Hero зурган дээгүүр дээш хөвөх зөөлөн гэрлийн бөөмс (canvas).
 *  Зөвхөн дэлгэц дээр харагдаж байхад зурна; reduced-motion үед огт зурахгүй. */
export function HeroMotes({ count = 46 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const color = getComputedStyle(canvas).getPropertyValue("--hero-mote").trim() || "255 240 210";
    const rgb = color.split(/\s+/).join(",");
    const dots = Array.from({ length: count }, () => ({
      u: .08 + Math.random() * .84, v: Math.random(), r: .7 + Math.random() * 2, ph: Math.random() * 6.28, sp: .4 + Math.random() * .8,
    }));
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now();
    const size = () => {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const d of dots) {
        d.v -= .035 * d.sp * dt;
        if (d.v < .05) { d.v = 1.02; d.u = .08 + Math.random() * .84; }
        const x = (d.u + Math.sin(t * .6 + d.ph) * .012) * w;
        const y = d.v * h;
        const rise = Math.min(1, (1.02 - d.v) / .25) * Math.min(1, d.v / .3);
        const a = rise * (.25 + .55 * Math.abs(Math.sin(t * 1.6 + d.ph)));
        const g = ctx.createRadialGradient(x, y, 0, x, y, d.r * 3);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, d.r * 3, 0, 6.283); ctx.fill();
      }
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [count]);
  return <canvas ref={ref} className="zh-hero-motes" aria-hidden="true" />;
}
