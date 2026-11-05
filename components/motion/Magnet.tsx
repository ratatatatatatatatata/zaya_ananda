"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Курсор ойртоход хүүхэд элементийг зөөлөн татна (зөвхөн нарийн заагч, reduced-motion биш үед). */
export function Magnet({ children, padding = 90, strength = 4, className }: { children: ReactNode; padding?: number; strength?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let active = false, raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = node.getBoundingClientRect();
        const near = e.clientX > r.left - padding && e.clientX < r.right + padding && e.clientY > r.top - padding && e.clientY < r.bottom + padding;
        if (near) {
          const x = (e.clientX - (r.left + r.width / 2)) / strength;
          const y = (e.clientY - (r.top + r.height / 2)) / strength;
          node.style.transition = "transform .3s ease-out";
          node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          active = true;
        } else if (active) {
          node.style.transition = "transform .6s ease-in-out";
          node.style.transform = "translate3d(0, 0, 0)";
          active = false;
        }
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, [padding, strength]);
  return <span ref={el} className={className} style={{ display: "inline-flex", willChange: "transform" }}>{children}</span>;
}
