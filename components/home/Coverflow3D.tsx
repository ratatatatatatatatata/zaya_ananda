"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_TILT_DEG = 26;
const MAX_SCALE_DROP = 0.13;
const MAX_OPACITY_DROP = 0.3;
const AUTOPLAY_MS = 3000;
// Хүн гараараа чирж/гүйлгэж байсны дараа автомат шилжилт хэсэг хугацаанд
// (энэ хэдэн мс) орж ирэхгүй — удирдлагыг эхлээд түүнд бүрэн өгнө.
const RESUME_DELAY_MS = 4000;

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
  flat = false,
  cinematic = false,
}: {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  cardWidthClassName?: string;
  autoPlay?: boolean;
  /** true бол 3D хазайлтгүй, эгц урдаас (flat) харагдана — гулсах, автоплэй хэвээр ажиллана */
  flat?: boolean;
  /** Төвийн картыг өргөж, хоёр талын картыг ард давхарласан кино мэт 3D харагдац. */
  cinematic?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const lastUserInteractRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const markInteraction = useCallback(() => { lastUserInteractRef.current = Date.now(); }, []);

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

  const tilt = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    // Жижиг дэлгэц дээр (утас) нэг карт бараг бүтэн өргөнийг эзэлдэг тул
    // 3D хазайлт хэвийн бус, "хазгай" харагдана — тэнд яг урдаас, шулуун харуулна.
    // `flat` prop өгөгдсөн бол дэлгэцийн хэмжээ үл хамааран үргэлж шулуун харуулна.
    const isMobileFlat = typeof window !== "undefined" && window.innerWidth < 640;
    if (flat || (isMobileFlat && !cinematic)) {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "none";
        card.style.opacity = "1";
        card.style.filter = "none";
        card.style.zIndex = "1";
      });
      setActiveIndex(nearestIndex());
      rafId.current = null;
      return;
    }

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
      const deg = -clamped * (cinematic ? 9 : MAX_TILT_DEG);
      const scale = 1 - unit * (cinematic ? 0.2 : MAX_SCALE_DROP);
      const depth = -unit * (cinematic ? 180 : 70);
      const overlap = cinematic ? -clamped * 52 : 0;
      card.style.transform = `perspective(1400px) translateX(${overlap}px) rotateY(${deg}deg) scale(${scale}) translateZ(${depth}px)`;
      card.style.opacity = String(1 - unit * (cinematic ? 0.48 : MAX_OPACITY_DROP));
      card.style.filter = cinematic ? `blur(${(unit * 1.2).toFixed(1)}px)` : "none";
      card.style.zIndex = String(Math.round((1 - unit) * 10));
    });
    setActiveIndex(nearestIndex());
    rafId.current = null;
  }, [cinematic, flat, nearestIndex]);

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

  // Зөвхөн carousel-ийн дотоод хэвтээ гүйлтийг (track.scrollLeft) хөдөлгөнө —
  // scrollIntoView ашигладаггүй нь чухал: тэр функц заримдаа "хамгийн ойрхон" гэсэн
  // тохиргоотой байсан ч хуудасны босоо гүйлтийг бас хөдөлгөж, "дээшээ доошоо
  // гүйгээд байгаа" мэт харагдах шалтгаан болдог байсан.
  const goTo = useCallback((index: number) => {
    const el = trackRef.current;
    const n = items.length;
    if (!el || n === 0) return;
    const wrapped = ((index % n) + n) % n;
    const card = cardRefs.current[wrapped];
    if (!card) return;
    const elRect = el.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const cardLeftInScroll = cardRect.left - elRect.left + el.scrollLeft;
    const target = cardLeftInScroll - (el.clientWidth - card.clientWidth) / 2;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, [items.length]);

  const next = useCallback(() => goTo(nearestIndex() + 1), [goTo, nearestIndex]);
  const prev = useCallback(() => goTo(nearestIndex() - 1), [goTo, nearestIndex]);

  // 3 секунд тутам дараагийн карт руу өөрөө шилжинэ — хүн idle үед л ажиллана.
  // Hover хийж байгаа, эсвэл сая гараараа чирж/гүйлгэсэн бол автомат шилжилт
  // тухайн хүний удирдлагатай мөргөлдөхгүйн тулд хэсэг хугацаагаар түр зогсоно.
  useEffect(() => {
    if (!autoPlay || items.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (hoveringRef.current) return;
      if (Date.now() - lastUserInteractRef.current < RESUME_DELAY_MS) return;
      next();
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [autoPlay, items.length, next]);

  return (
    <div
      className="relative"
      onMouseEnter={() => { hoveringRef.current = true; }}
      onMouseLeave={() => { hoveringRef.current = false; }}
      onPointerDown={markInteraction}
      onWheel={markInteraction}
      onTouchMove={markInteraction}
    >
      {items.length > 1 && !cinematic && (
        <>
          <button
            type="button"
            onClick={() => { markInteraction(); prev(); }}
            aria-label="Өмнөх"
            className="focus-ring absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-x-1/3 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700 sm:-translate-x-1/2"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => { markInteraction(); next(); }}
            aria-label="Дараах"
            className="focus-ring absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 translate-x-1/3 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700 sm:translate-x-1/2"
          >
            ›
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className={`flex snap-x snap-mandatory overflow-x-auto pb-8 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${cinematic ? "gap-0" : "gap-6 px-4 sm:px-10"}`}
        style={cinematic ? { paddingInline: "max(1rem, calc(50% - 10.5rem))", scrollPaddingInline: "50%" } : { scrollPaddingLeft: "40%", scrollPaddingRight: "40%" }}
      >
        {items.map((it, i) => (
          <div
            key={getKey(it, i)}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={"shrink-0 snap-center transition-[transform,opacity,filter] duration-300 ease-out will-change-transform " + cardWidthClassName}
          >
            {renderItem(it, i)}
          </div>
        ))}
      </div>
      {items.length > 1 && cinematic && (
        <div className="mt-1 flex items-center justify-center gap-4">
          <button type="button" onClick={() => { markInteraction(); prev(); }} aria-label="Өмнөх"
            className="focus-ring grid h-12 w-12 place-items-center rounded-full border border-line bg-surface-1 text-xl text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400">‹</button>
          <div className="flex items-center gap-2" aria-label={`${activeIndex + 1} / ${items.length}`}>
            {items.map((_, index) => <span key={index} className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-7 bg-primary-500" : "w-2 bg-primary-200"}`} />)}
          </div>
          <button type="button" onClick={() => { markInteraction(); next(); }} aria-label="Дараах"
            className="focus-ring grid h-12 w-12 place-items-center rounded-full border border-line bg-surface-1 text-xl text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400">›</button>
        </div>
      )}
    </div>
  );
}
