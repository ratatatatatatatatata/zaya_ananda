"use client";

import Link from "next/link";
import { Coverflow3D } from "./Coverflow3D";
import { JourneyImage } from "../journey/SceneArt";
import type { Journey } from "@/data/journeys";

/** Нэг аяллын карт — Энергийн заслын карттай ижил дизайны хэлээр (badge, зураг, гарчиг, мэдээллийн мөр, CTA). */
function JourneyCard({ j }: { j: Journey }) {
  return (
    <Link href={`/ayalal/${j.slug}`} className="card group flex h-full w-full flex-col overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-3">
        <JourneyImage src={j.image} scene={j.scene} alt={j.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[#0B1714]/75 px-3 py-1 text-xs font-semibold text-accent-300 backdrop-blur">
          {j.tagline}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{j.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{j.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-4 text-xs text-muted">
          <span>🗓 {j.days}</span><span>👥 {j.groupSize}</span><span>⛺ {j.stay}</span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-700">
          Дэлгэрэнгүй <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

/** Сүнслэг аяллын жагсаалт — Энергийн заслын карттай адилхан 3D coverflow систем ашиглана. */
export function JourneyCoverflow({ items }: { items: Journey[] }) {
  return (
    <Coverflow3D
      items={items}
      getKey={(j) => j.slug}
      renderItem={(j) => <JourneyCard j={j} />}
      cardWidthClassName="w-[19rem] sm:w-[21rem]"
    />
  );
}
