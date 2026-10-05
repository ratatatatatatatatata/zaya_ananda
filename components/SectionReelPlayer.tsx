"use client";
import { useState } from "react";
import { embedSrc } from "@/lib/video-embed";
import type { PublicEpisode } from "@/lib/public-media";

export function SectionReelPlayer({ reels }: { reels: PublicEpisode[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  return <div className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" aria-label="Reel бичлэгүүд">
    {reels.map(reel => {
      const embed = embedSrc(reel.url, true);
      const open = playing === reel.id;
      return <article key={reel.id} className="w-[min(78vw,280px)] shrink-0 snap-start">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-[#10251e]">
          {open ? embed.type === "iframe" ? <iframe src={embed.src} title={reel.title} className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            : <video src={embed.src} className="absolute inset-0 h-full w-full object-contain" controls autoPlay playsInline aria-label={reel.title} />
            : <button type="button" onClick={() => setPlaying(reel.id)} aria-label={`${reel.title} — тоглуулах`} className="group absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-white">
              <img src={reel.poster} alt="" loading="lazy" className="h-full w-full object-cover opacity-80" />
              <span className="absolute inset-0 grid place-items-center"><span className="grid size-14 place-items-center rounded-full bg-white text-xl text-primary-800 shadow-lg transition group-hover:scale-110">▶</span></span>
            </button>}
        </div>
        <h3 className="mt-3 text-base font-semibold leading-6 text-ink">{reel.title}</h3>
        {open && <button type="button" className="mt-2 text-sm font-semibold text-primary-700 underline" onClick={() => setPlaying(null)}>Тоглуулагчийг хаах</button>}
      </article>;
    })}
  </div>;
}
