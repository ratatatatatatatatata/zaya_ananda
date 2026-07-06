"use client";

import { useEffect, useState } from "react";

/** Зургийн галерей — үндсэн зураг, жижиг зургууд, дарахад томруулж харах lightbox. */
export function ImageGallery({ images, alt = "" }: { images: string[]; alt?: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [zoom, images.length]);

  if (!images.length) return null;

  return (
    <div className="mb-6">
      <button type="button" onClick={() => setZoom(true)} className="group relative block w-full cursor-zoom-in overflow-hidden rounded-3xl">
        <img src={images[active]} alt={alt} className="max-h-[520px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1.5 text-sm font-semibold text-white shadow">🔍 Томруулж харах</span>
      </button>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button key={i} type="button" onClick={() => setActive(i)}
              className={"h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition " + (i === active ? "border-primary-500" : "border-transparent opacity-70 hover:opacity-100")}>
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" onClick={() => setZoom(false)}>
          <button type="button" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25" onClick={() => setZoom(false)} aria-label="Хаах">✕</button>
          {images.length > 1 && (
            <>
              <button type="button" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25"
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); }} aria-label="Өмнөх">‹</button>
              <button type="button" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25"
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); }} aria-label="Дараах">›</button>
            </>
          )}
          <img src={images[active]} alt={alt} className="max-h-[92vh] max-w-[95vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
