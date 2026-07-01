"use client";

import { useEffect, useRef } from "react";

export function Interactions() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let rx = tx, ry = ty, raf = 0, last = 0;
    let tiltEl: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${tx}px,${ty}px)`;
      // trail particle (throttled)
      const now = performance.now();
      if (now - last > 90) {
        last = now;
        const s = document.createElement("span");
        s.className = "zx-spark";
        s.style.left = tx + "px"; s.style.top = ty + "px";
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 750);
      }
      // tilt
      const el = (e.target as HTMLElement)?.closest?.("[data-tilt]") as HTMLElement | null;
      if (tiltEl && tiltEl !== el) { tiltEl.style.transform = ""; tiltEl.style.transition = "transform .4s ease"; }
      if (el) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform .08s ease";
        el.style.transform = `perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg) translateY(-4px)`;
      }
      tiltEl = el;
    };
    const loop = () => { rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16; if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop); };

    document.body.classList.add("zx-cursor-on");
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); document.body.classList.remove("zx-cursor-on"); };
  }, []);

  return (
    <>
      <div ref={ring} className="zx-ring" aria-hidden />
      <div ref={dot} className="zx-dot" aria-hidden />
    </>
  );
}
