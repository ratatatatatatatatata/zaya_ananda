"use client";
import { useRef } from "react";
import { Stars } from "./ui";
import { Tr } from "./T";
import type { Testimonial } from "@/lib/types";

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={track} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((t) => (
          <figure key={t.id} className="relative w-[300px] shrink-0 snap-center glass p-6 sm:w-[350px]">
            <span className="pointer-events-none absolute right-5 top-1 font-display text-7xl leading-none text-primary-200">”</span>
            <Stars rating={t.rating} />
            <blockquote className="relative mt-3 text-[1.05rem] leading-relaxed text-ink/80">«<Tr v={t.quote} />»</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-magic-grad text-base font-bold text-white">{t.name.replace(/^.+\. ?/, "").charAt(0)}</span>
              <span><span className="block font-semibold text-ink">{t.name}</span><span className="block text-sm text-muted"><Tr v={t.role} /></span></span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => scroll(-1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-line bg-[#111B2D] text-xl text-ink/70 transition hover:border-primary-300 hover:text-primary-700" aria-label="Previous">←</button>
        <button onClick={() => scroll(1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-line bg-[#111B2D] text-xl text-ink/70 transition hover:border-primary-300 hover:text-primary-700" aria-label="Next">→</button>
      </div>
    </div>
  );
}
