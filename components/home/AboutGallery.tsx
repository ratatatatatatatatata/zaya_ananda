"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type GalleryImg = { image: string; caption?: string };

/** Зургуудыг баганад хувааж, зарим баганыг ганц зурагтай, заримыг 2 давхарласан зурагтай
 *  болгоно — OPPO Community-гийн шатлан байрлах галерейтэй төстэй. */
function buildColumns(images: GalleryImg[]) {
  const cols: GalleryImg[][] = [];
  let i = 0, colIdx = 0;
  while (i < images.length) {
    const size = colIdx % 3 === 0 ? 1 : 2;
    cols.push(images.slice(i, i + size));
    i += size;
    colIdx++;
  }
  return cols;
}

/** "Бидний тухай" хуудасны олон зургийн галерей — хажуу тийш аяндаа аажим гулсдаг,
 *  зураг бүрийг бүтнээр (тайрахгүй) харуулна. */
export function AboutGallery({ images, layout = "mosaic", label = "Манай орчны зургийн цомог" }: {
  images: GalleryImg[]; layout?: "mosaic" | "landscape"; label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);
  const touchingRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [copies, setCopies] = useState(3);
  const reduced = useReducedMotion();
  const canMove = images.length > 1 && !reduced;

  useEffect(() => {
    const track = trackRef.current;
    const cycle = cycleRef.current;
    if (!track || !cycle || !canMove) return;
    const measure = () => {
      if (cycle.offsetWidth > 0) setCopies(Math.max(2, Math.ceil(track.clientWidth / cycle.offsetWidth) + 1));
    };
    const resize = new ResizeObserver(measure);
    resize.observe(track); resize.observe(cycle); measure();
    return () => resize.disconnect();
  }, [canMove, images]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !canMove || paused) return;
    let frame = 0, previous = 0, remainder = 0;
    let visible = false;
    const step = (time: number) => {
      const elapsed = previous ? Math.min(time - previous, 64) : 0;
      previous = time;
      if (visible && !document.hidden && !hoveringRef.current && !focusedRef.current && !touchingRef.current) {
        // Accumulate fractional pixels: writing 0.22 to scrollLeft each frame
        // can round back to zero, leaving the original gallery stationary.
        remainder += elapsed * 0.028;
        const pixels = Math.floor(remainder);
        remainder -= pixels;
        const width = cycleRef.current?.offsetWidth || 0;
        if (pixels && width) track.scrollLeft = (track.scrollLeft + pixels) % width;
      }
      frame = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, {threshold:0});
    observer.observe(track);
    frame = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [canMove, paused]);

  if (images.length === 0) return null;
  const columns = layout === "landscape" ? images.map(image => [image]) : buildColumns(images);

  return (
    <div className="relative min-w-0" role="region" aria-label={label}>
      {canMove && <div className="mb-4 flex justify-end">
        <button type="button" className="rounded-full border border-line px-4 py-2 text-sm text-muted" aria-pressed={paused} onClick={() => setPaused(v => !v)}>
          {paused ? "Зургийн хөдөлгөөнийг үргэлжлүүлэх" : "Зургийн хөдөлгөөнийг түр зогсоох"}
        </button>
      </div>}
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Зургууд — хажуу тийш гүйлгэж үзэх"
        onPointerEnter={e => { if(e.pointerType === "mouse") hoveringRef.current = true; }}
        onPointerLeave={() => { hoveringRef.current = false; }}
        onPointerDown={() => { touchingRef.current = true; }}
        onPointerUp={() => { touchingRef.current = false; }}
        onPointerCancel={() => { touchingRef.current = false; }}
        onFocus={() => { focusedRef.current = true; }}
        onBlur={() => { focusedRef.current = false; touchingRef.current = false; }}
        className="flex overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{scrollBehavior:"auto", overflowAnchor:"none"}}
      >
        {Array.from({length:canMove ? copies : 1}, (_, copy) => <div key={copy} ref={copy === 0 ? cycleRef : undefined} aria-hidden={copy > 0 ? true : undefined} className="flex shrink-0 items-start gap-4 pr-4">
          {columns.map((col, ci) => (
            <div key={ci} className={layout === "landscape" ? "flex w-[75vw] max-w-[28rem] shrink-0 flex-col gap-4 sm:w-[28rem]" : "flex w-48 shrink-0 flex-col gap-4 sm:w-60"}>
              {col.map((img, ii) => (
                <div key={ii} className="relative overflow-hidden rounded-2xl bg-surface-3">
                  <img src={img.image} alt={img.caption || ""} className={layout === "landscape" ? "aspect-[4/3] w-full object-cover" : "h-auto w-full"} loading="lazy" />
                  {img.caption && (
                    <span className="absolute inset-x-2 bottom-2 line-clamp-2 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                      {img.caption}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>)}
      </div>
    </div>
  );
}
