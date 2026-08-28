"use client";

import { useEffect, useRef } from "react";
import { ServiceCard } from "./ServiceCard";
import type { CmsItem } from "@/lib/types";

const MAX_TILT_DEG = 26;
const MAX_SCALE_DROP = 0.13;
const MAX_OPACITY_DROP = 0.3;

/**
 * "Хажуу тийш цувдаг" жагсаалт — гүйлгэхэд карт бүр төвөөс хазайсан хэрээр
 * 3D перспективээр хажуу тийшээ хазайж, том/жижиг болж, гүнзгийрч харагдана.
 */
export function ServiceCoverflow({ items }: { items: CmsItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function update() {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const half = rect.width / 2 || 1;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const cr = card.getBoundingClientRect();
        const cardCenter = cr.left + cr.width / 2;
        const raw = (cardCenter - centerX) / half;
        const clamped = Math.max(-1.4, Math.min(1.4, raw));
        const unit = Math.min(Math.abs(clamped), 1);
        const tilt = -clamped * MAX_TILT_DEG;
        const scale = 1 - unit * MAX_SCALE_DROP;
        const depth = -unit * 70;
        card.style.transform = `perspective(1400px) rotateY(${tilt}deg) scale(${scale}) translateZ(${depth}px)`;
        card.style.opacity = String(1 - unit * MAX_OPACITY_DROP);
        card.style.zIndex = String(Math.round((1 - unit) * 10));
      });
      rafId.current = null;
    }

    function onScroll() {
      if (rafId.current != null) return;
      rafId.current = requestAnimationFrame(update);
    }

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [items.length]);

  return (
    <div
      ref={trackRef}
      className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-10"
      style={{ scrollPaddingLeft: "40%", scrollPaddingRight: "40%" }}
    >
      {items.map((it, i) => (
        <div
          key={it.id}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="w-[19rem] shrink-0 snap-center transition-transform duration-150 ease-out will-change-transform sm:w-[21rem]"
        >
          <ServiceCard item={it} />
        </div>
      ))}
    </div>
  );
}
