"use client";

import Link from "next/link";
import { Coverflow3D } from "./Coverflow3D";
import { TiltCard } from "../motion/TiltCard";
import { JourneyImage } from "../journey/SceneArt";
import type { Journey } from "@/data/journeys";

/** Нэг аяллын карт — Энергийн заслын карттай ижил дизайны хэлээр (badge, зураг, гарчиг, мэдээллийн мөр, CTA). */
export function JourneyCard({ j }: { j: Journey }) {
  return (
    <TiltCard max={6} className="h-full">
      {/* prefetch={false}: урьдчилан татсан хуучин RSC өгөгдөл slug-той таарахгүй үед
          "дэлгэрэнгүй" рүү орохад 404 үзүүлэх эрсдэлийг арилгана — дарахад л шинээр татна. */}
      <Link href={`/ayalal/${j.slug}`} prefetch={false} className="glass-lux group flex h-full w-full flex-col text-left">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[1.75rem] bg-surface-3">
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
    </TiltCard>
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

/** Сүнслэг аяллын статик жагсаалт — гулгалтгүй, доод тал нь 3 аяллыг эгнүүлж харуулна. */
export function JourneyStaticGrid({ items }: { items: Journey[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((j) => <JourneyCard key={j.slug} j={j} />)}
    </div>
  );
}
