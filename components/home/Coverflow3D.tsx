"use client";

import { useCallback, useEffect, useRef } from "react";

const MAX_TILT_DEG = 26;
const MAX_SCALE_DROP = 0.13;
const MAX_OPACITY_DROP = 0.3;
const AUTOPLAY_MS = 3000;

/**
 * Ерөнхий 3D "coverflow" зөөвөрлөгч — карт бүрийг render хийх функцийг дамжуулбал
 * гүйлгэхэд төвөөс хазайсан хэрээр перспективээр хазайж, зүүн/баруун сумтай,
 * 3 секунд тутам өөрөө хажуу тийш шилждэг нэгдсэн систем гаргаж өгнө.
 */
export function Coverflow3D<T>({
  items,
  getKey,
  renderItem,
  cardWidthClassName = "w-[19rem] sm:w-[21rem]",
  autoPlay = true,
}: {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  cardWidthClassName?: string;
  autoPlay?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const tilt = useCallback(() => {
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
      const deg = -clamped * MAX_TILT_DEG;
      const scale = 1 - unit * MAX_SCALE_DROP;
      const depth = -unit * 70;
      card.style.transform = `perspective(1400px) rotateY(${deg}deg) scale(${scale}) translateZ(${depth}px)`;
      card.style.opacity = String(1 - unit * MAX_OPACITY_DROP);
      card.style.zIndex = String(Math.round((1 - unit) * 10));
    });
    rafId.current = null;
  }, []);

  const requestTilt = useCallback(() => {
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(tilt);
  }, [tilt]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    tilt();
    track.addEventListener("scroll", requestTilt, { passive: true });
    window.addEventListener("resize", requestTilt);
    return () => {
      track.removeEventListener("scroll", requestTilt);
      window.removeEventListener("resize", requestTilt);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [tilt, requestTilt, items.length]);

  const nearestIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cr = card.getBoundingClientRect();
      const d = Math.abs(cr.left + cr.width / 2 - centerX);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }, []);

  const goTo = useCallback((index: number) => {
    const n = items.length;
    if (n === 0) return;
    const wrapped = ((index % n) + n) % n;
    cardRefs.current[wrapped]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [items.length]);

  const next = useCallback(() => goTo(nearestIndex() + 1), [goTo, nearestIndex]);
  const prev = useCallback(() => goTo(nearestIndex() - 1), [goTo, nearestIndex]);

  // 3 секунд тутам дараагийн карт руу өөрөө шилжинэ — hover/хүрэлт үед зогсоно
  useEffect(() => {
    if (!autoPlay || items.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => { if (!pausedRef.current) next(); }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [autoPlay, items.length, next]);

  return (
    <div
      className="relative"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
    >
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Өмнөх"
            className="focus-ring absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-x-1/3 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700 sm:-translate-x-1/2"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Дараах"
            className="focus-ring absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 translate-x-1/3 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700 sm:translate-x-1/2"
          >
            ›
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-10"
        style={{ scrollPaddingLeft: "40%", scrollPaddingRight: "40%" }}
      >
        {items.map((it, i) => (
          <div
            key={getKey(it, i)}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={"shrink-0 snap-center transition-transform duration-150 ease-out will-change-transform " + cardWidthClassName}
          >
            {renderItem(it, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
