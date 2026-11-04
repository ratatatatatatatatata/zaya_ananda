"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useI18n } from "@/lib/i18n";

/** "Бидний зорилго" — scroll хийхэд тэмдэгт бүр 0.18 → 1 тодорно. */
export function HomeManifesto() {
  const { t } = useI18n();
  const text = t("home.manifesto");
  const reduced = useReducedMotion();
  const box = useRef<HTMLParagraphElement>(null);
  const chars = useRef<HTMLSpanElement[]>([]);
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 0.85", "end 0.35"] });

  const paint = (p: number) => {
    const list = chars.current, n = list.length;
    for (let i = 0; i < n; i++) {
      const local = Math.min(1, Math.max(0, p * (n + 12) - i) / 12);
      list[i].style.opacity = String(.18 + .82 * local);
    }
  };
  useMotionValueEvent(scrollYProgress, "change", p => { if (!reduced) paint(p); });
  useEffect(() => { paint(reduced ? 1 : scrollYProgress.get()); }); // хэл солигдох, анхны зураг

  chars.current = [];
  let k = 0;
  return (
    <section className="zh-manifesto" aria-labelledby="zh-manifesto-title">
      <div className="zh-manifesto-inner">
        <p id="zh-manifesto-title" className="zh-hero-kicker zh-manifesto-kicker">{t("home.manifestoEyebrow")}</p>
        <p ref={box} className="zh-manifesto-text">
          <span className="sr-only">{text}</span>
          {words.map((w, wi) => /^\s+$/.test(w) ? " " : (
            <span key={wi} className="zh-manifesto-word" aria-hidden="true">
              {Array.from(w).map((c) => {
                const idx = k++;
                return <span key={idx} ref={el => { if (el) chars.current[idx] = el; }}>{c}</span>;
              })}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
