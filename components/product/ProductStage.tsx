"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";

/** Бүтээгдэхүүний амьд тайз — жинхэнэ зургийг 2.5D гүнтэй, тавцан + бодит сүүдэр,
 *  зөөлөн тусгал, заагчийн хязгаартай хазайлт (±4°/±7°), гэрлийн урсгал,
 *  зураг солиход гүнээс орж ирэх кино шилжилт, swipe + гар товч + zoom.
 *  Reduced-motion үед бүх хөдөлгөөн унтарч зураг шууд харагдана. */
export function ProductStage({ images, alt = "" }: { images: string[]; alt?: string }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [entered, setEntered] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const stage = useRef<HTMLDivElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) { setEntered(true); return; }
    const el = stage.current;
    if (!el) return;
    const ob = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setEntered(true); ob.disconnect(); } }), { threshold: 0.2 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  // Zoom-ийн гарын товчнууд
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, images.length]);

  function go(dir: 1 | -1) {
    if (images.length < 2) return;
    setPrev(active);
    setActive((a) => (a + dir + images.length) % images.length);
    setTimeout(() => setPrev(null), 650);
  }
  function pick(i: number) {
    if (i === active) return;
    setPrev(active);
    setActive(i);
    setTimeout(() => setPrev(null), 650);
  }

  /** Заагчийн хазайлт — хязгаартай (rotateX ±4°, rotateY ±7°), сүүдэр эсрэг хөдөлнө */
  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || reduced.current) return;
    const el = stage.current, iw = imgWrap.current, sh = shadow.current;
    if (!el || !iw) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    iw.style.transform = `perspective(1100px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-6px) scale(1.02)`;
    if (sh) sh.style.transform = `translateX(${(-px * 14).toFixed(1)}px) scaleX(${(1 + Math.abs(px) * 0.08).toFixed(3)})`;
  }
  function onLeave() {
    const iw = imgWrap.current, sh = shadow.current;
    if (iw) iw.style.transform = "";
    if (sh) sh.style.transform = "";
  }

  function onTouchStart(e: React.TouchEvent) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  }

  if (!images.length) return null;
  const src = images[active];

  return (
    <div className="mb-6">
      <div
        ref={stage}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cx(
          "group relative select-none transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
          entered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
        style={{ perspective: "1100px" }}
      >
        {/* Тайзны уур амьсгал */}
        <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem]" style={{ background: "radial-gradient(70% 65% at 50% 42%, rgba(43,200,187,0.10), transparent 70%)" }} />

        {/* Зураг — гүнтэй шилжилт */}
        <div ref={imgWrap} className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-surface-4 transition-transform duration-300 ease-out will-change-transform" style={{ transformStyle: "preserve-3d" }} data-stage-img>
          {prev !== null && !failed[prev] && (
            <img key={"p" + prev} src={images[prev]} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ animation: "zaStageOut 0.6s ease forwards" }} />
          )}
          {failed[active] ? (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-surface-1 to-surface-4 text-center">
              <div>
                <p className="text-4xl">🛍</p>
                <p className="mt-2 text-sm text-muted">Зураг ачаалагдсангүй</p>
                <button type="button" className="btn btn-outline btn-sm mt-3" onClick={() => setFailed((f) => ({ ...f, [active]: false }))}>Дахин оролдох</button>
              </div>
            </div>
          ) : (
            <img
              key={"a" + active}
              src={src}
              alt={alt}
              onError={() => setFailed((f) => ({ ...f, [active]: true }))}
              className="h-full w-full cursor-zoom-in object-cover"
              style={reduced.current ? undefined : { animation: "zaStageIn 0.65s cubic-bezier(0.22,1,0.36,1) both" }}
              onClick={() => setZoom(true)}
            />
          )}
          {/* Гэрлийн урсгал */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 w-1/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.10), transparent)", animation: "zaSweep 2.6s cubic-bezier(0.4,0,0.2,1) infinite" }} />
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1.5 text-sm font-semibold text-white opacity-0 shadow transition group-hover:opacity-100">🔍 Томруулж харах</span>
          {images.length > 1 && (
            <>
              <button type="button" aria-label="Өмнөх зураг" onClick={() => go(-1)} className="focus-ring tap-target absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-lg text-white backdrop-blur transition hover:bg-black/65 md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100">‹</button>
              <button type="button" aria-label="Дараах зураг" onClick={() => go(1)} className="focus-ring tap-target absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-lg text-white backdrop-blur transition hover:bg-black/65 md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100">›</button>
            </>
          )}
        </div>

        {/* Тусгал */}
        <div aria-hidden className="pointer-events-none relative mx-6 h-14 overflow-hidden opacity-30" style={{ transform: "scaleY(-1)" }}>
          {!failed[active] && (
            <img src={src} alt="" className="h-auto w-full rounded-3xl object-cover blur-[3px]" style={{ maskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 70%)", WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 70%)" }} />
          )}
        </div>

        {/* Бодит зөөлөн сүүдэр — тавцантай холбоно */}
        <div ref={shadow} aria-hidden className="pointer-events-none absolute -bottom-1 left-1/2 h-7 w-3/4 -translate-x-1/2 rounded-[50%] transition-transform duration-300" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.45), transparent 70%)", filter: "blur(6px)" }} />
      </div>

      {/* Жижиг зургууд */}
      {images.length > 1 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} type="button" onClick={() => pick(i)} aria-label={`Зураг ${i + 1}`}
              aria-current={i === active} className={cx("focus-ring h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition", i === active ? "border-primary-500 shadow-glow" : "border-line/60 opacity-70 hover:opacity-100")}>
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" onClick={() => setZoom(false)}>
          <button type="button" className="focus-ring tap-target absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25" onClick={() => setZoom(false)} aria-label="Хаах">✕</button>
          {images.length > 1 && (
            <>
              <button type="button" className="focus-ring tap-target absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Өмнөх">‹</button>
              <button type="button" className="focus-ring tap-target absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Дараах">›</button>
            </>
          )}
          <img src={src} alt={alt} className="max-h-[92vh] max-w-[95vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
