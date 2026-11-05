"use client";

import { useEffect, useRef } from "react";

/** Курсорыг зөөлөн дагах дулаан "дэнлүүний" гэрэл. Зөвхөн нарийн заагчтай, reduced-motion биш үед. */
export function LanternCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, raf = 0, last = performance.now(), shown = false;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; x = tx; y = ty; el.style.opacity = "1"; }
    };
    const leave = () => { shown = false; el.style.opacity = "0"; };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const k = 1 - Math.exp(-10 * Math.min(.05, (now - last) / 1000)); last = now;
      x += (tx - x) * k; y += (ty - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave); };
  }, []);
  return <div ref={ref} className="zh-lantern" aria-hidden="true" />;
}
