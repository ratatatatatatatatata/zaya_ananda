"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/format";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShow(true); return; }
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setShow(true); ob.disconnect(); } }), { threshold: 0.12 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: delay + "ms" }}
      className={cx("transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]", show ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0", className)}>
      {children}
    </div>
  );
}
