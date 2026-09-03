"use client";

import { useState } from "react";
import Link from "next/link";
import { Coverflow3D } from "./Coverflow3D";
import { TiltCard } from "../motion/TiltCard";
import { embedSrc, youtubeThumb } from "@/lib/video-embed";
import { useI18n } from "@/lib/i18n";
import type { CmsItem, Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });
const EMPTY = Lx(
  "Reel удахгүй нэмэгдэнэ. 🎁", "Reels coming soon. 🎁", "릴이 곧 추가됩니다. 🎁", "リールは近日追加されます。🎁", "短片即将上线。🎁",
);
const MORE = Lx("Дэлгэрэнгүй", "Details", "자세히", "詳細", "详情");

type Reel = { id: string; title: string; url: string; poster: string };

function collect(items: CmsItem[]): Reel[] {
  const out: Reel[] = [];
  for (const it of items) {
    for (const l of it.lessons || []) {
      if (!l.url) continue;
      const e = embedSrc(l.url);
      if (e.type !== "iframe") continue;
      out.push({
        id: it.id + "-" + out.length,
        title: l.title || it.title,
        url: l.url,
        poster: e.youtubeId ? youtubeThumb(e.youtubeId) : it.image || "",
      });
    }
  }
  return out;
}

/** Нэг reel карт — Энергийн заслын карттай ижил дизайны хэлээр (badge, зураг, гарчиг, CTA). */
function GiftCard({ reel }: { reel: Reel }) {
  const [open, setOpen] = useState(false);
  const e = embedSrc(reel.url, true);
  return (
    <div className="glass-lux group flex h-full w-full flex-col text-left">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[1.75rem] bg-surface-3">
        {open ? (
          <iframe
            src={e.src}
            title={reel.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setOpen(true)} aria-label={reel.title} className="absolute inset-0 h-full w-full">
            {reel.poster ? (
              <img src={reel.poster} alt={reel.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />
            )}
            <span className="absolute left-4 top-4 rounded-full bg-[#0B1714]/75 px-3 py-1 text-xs font-semibold text-accent-300 backdrop-blur">🎁 Reel</span>
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-xl text-[#15302C] shadow-lg transition group-hover:scale-110">▶</span>
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{reel.title}</h3>
        <Link href="/gift" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-700">
          Дэлгэрэнгүй <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

/** Гэгээн бэлгийн жагсаалт — Энергийн заслын карттай адилхан 3D coverflow систем ашиглана. */
export function GiftCoverflow({ items }: { items: CmsItem[] }) {
  const { tr } = useI18n();
  const reels = collect(items);
  if (reels.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-12 text-center text-muted">{tr(EMPTY)}</p>;
  }
  return (
    <>
      <Coverflow3D
        items={reels}
        getKey={(r) => r.id}
        renderItem={(r) => <TiltCard max={6} className="h-full"><GiftCard reel={r} /></TiltCard>}
        cardWidthClassName="w-[19rem] sm:w-[21rem]"
        flat
      />
      <div className="mt-2 text-center">
        <Link href="/gift" className="btn btn-outline btn-sm">{tr(MORE)} →</Link>
      </div>
    </>
  );
}
