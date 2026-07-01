"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function MouseParallax({ children, strength = 14, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const el = ref.current; if (!el) return;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => { tx = (e.clientX / window.innerWidth - 0.5) * strength; ty = (e.clientY / window.innerHeight - 0.5) * strength; };
    const loop = () => { cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08; el.style.transform = `translate(${cx.toFixed(2)}px,${cy.toFixed(2)}px)`; raf = requestAnimationFrame(loop); };
    window.addEventListener("pointermove", onMove, { passive: true }); raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [strength]);
  return <div ref={ref} className={className}>{children}</div>;
}
