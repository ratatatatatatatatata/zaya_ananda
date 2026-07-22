"use client";

import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/format";

/** Хүүхэд элемент бүрийг дараалсан хоцролттойгоор гүн ухаанч зөөлөн илэрхийлнэ.
 *  Reduced-motion үед шууд харагдана; grid контейнер болгон ашиглаж болно. */
export function Stagger({ children, className, step = 70 }: { children: ReactNode; className?: string; step?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setInView(true); return; }
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setInView(true); ob.disconnect(); } }),
      { threshold: 0.06 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const arr = Children.toArray(children);
  return (
    <div ref={ref} className={className}>
      {arr.map((c, i) => (
        <div
          key={isValidElement(c) && c.key != null ? c.key : i}
          className={cx(
            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ transitionDelay: `${Math.min(i, 10) * step}ms` }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}
