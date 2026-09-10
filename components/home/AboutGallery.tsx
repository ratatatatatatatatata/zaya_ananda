"use client";

import { useEffect, useRef, useState } from "react";

type GalleryImg = { image: string; caption?: string };

// Багана дотор зургийн өндрийг ээлжлэн сольж, OPPO Community маягийн масоник
// (том/жижиг холилдсон, шатлан байрлах) харагдацыг үүсгэнэ.
const HEIGHTS = ["h-44 sm:h-52", "h-60 sm:h-72", "h-48 sm:h-56", "h-56 sm:h-64", "h-40 sm:h-48"];

/** Зургуудыг баганад хувааж, зарим баганыг ганц өндөр зурагтай, заримыг 2 давхарласан
 *  зурагтай болгоно — OPPO Community-гийн шатлан байрлах галерейтэй төстэй. */
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

/** "Бидний тухай" хуудасны олон зургийн галерей — хажуу тийш аяндаа гулсаж, зогсоох/
 *  тоглуулах товчтой, OPPO Community-гийн масоник үзэмжийг санагдуулна. */
export function AboutGallery({ images }: { images: GalleryImg[] }) {
  const [playing, setPlaying] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    if (!playing) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const step = () => {
      const track = trackRef.current;
      if (track && !hoveringRef.current) {
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) track.scrollLeft = 0;
        else track.scrollLeft += 0.6;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  if (images.length === 0) return null;
  const columns = buildColumns(images);
  const loop = [...columns, ...columns, ...columns];

  return (
    <div
      className="relative"
      onMouseEnter={() => { hoveringRef.current = true; }}
      onMouseLeave={() => { hoveringRef.current = false; }}
    >
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Зогсоох" : "Тоглуулах"}
        className="focus-ring absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface-1/90 text-ink/70 shadow-sm backdrop-blur transition hover:text-primary-700"
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loop.map((col, ci) => (
          <div key={ci} className="flex w-48 shrink-0 flex-col gap-4 sm:w-60">
            {col.map((img, ii) => (
              <div key={ii} className={"relative overflow-hidden rounded-2xl bg-surface-3 " + HEIGHTS[(ci + ii) % HEIGHTS.length]}>
                <img src={img.image} alt={img.caption || ""} className="h-full w-full object-cover" loading="lazy" />
                {img.caption && (
                  <span className="absolute inset-x-2 bottom-2 line-clamp-2 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    {img.caption}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
