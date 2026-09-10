"use client";

import { useState } from "react";
import { embedSrc, youtubeThumb } from "@/lib/video-embed";
import { useI18n } from "@/lib/i18n";
import type { CmsItem, Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });
const WATCH = Lx("Энд үзэх", "Watch here", "여기서 보기", "ここで見る", "在此观看");
const CLOSE = Lx("Хаах", "Close", "닫기", "閉じる", "关闭");

type Vid = { title: string; url: string };

/** Нэг зүйлд холбогдсон бүх бичлэг (line/lessons) — эхнийх нь дангаар биш, бүгдийг нь буцаана. */
function allVideos(item: CmsItem): Vid[] {
  const out: Vid[] = [];
  if (item.link) {
    const direct = embedSrc(item.link);
    if (direct.youtubeId) out.push({ title: item.title, url: item.link });
  }
  for (const l of item.lessons || []) {
    if (l.url && /youtu|vimeo/.test(l.url)) out.push({ title: l.title || item.title, url: l.url });
  }
  return out;
}

/** Нэг бичлэгийн тоглуулагч — poster дээр дарахад байрандаа iframe болж нээгдэнэ. */
function VideoSlot({ v, active, onPlay, onClose, tr }: {
  v: Vid; active: boolean; onPlay: () => void; onClose: () => void; tr: (l: Record<Locale, string>) => string;
}) {
  const e = embedSrc(v.url, true);
  const poster = e.youtubeId ? youtubeThumb(e.youtubeId) : undefined;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[24rem] overflow-hidden bg-black">
        {active ? (
          <iframe
            src={e.src}
            title={v.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {poster
              ? <img src={poster} alt="" className="h-full w-full object-cover" />
              : <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />}
            <button
              type="button"
              onClick={onPlay}
              aria-label={tr(WATCH)}
              className="group absolute inset-0 grid place-items-center bg-black/25 transition hover:bg-black/10"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-2xl text-[#15302C] shadow-lg transition group-hover:scale-110">
                ▶
              </span>
            </button>
          </>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <p className="min-w-0 truncate text-sm font-semibold text-ink">{v.title}</p>
        {active && (
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm shrink-0">{tr(CLOSE)}</button>
        )}
      </div>
    </div>
  );
}

/** Гэгээн бэлэг — нэмсэн бүх бичлэг эндээ (өөр хуудас руу орохгүйгээр) харагдаж, тус тусдаа тоглуулна. */
export function GiftGrid({ items, emptyText }: { items: CmsItem[]; emptyText: string }) {
  const { tr } = useI18n();
  const [playing, setPlaying] = useState<string | null>(null); // "itemId::index"

  if (items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">{emptyText}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const videos = allVideos(item);
        return (
          <article key={item.id} className="card overflow-hidden p-5">
            <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
            {item.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>}
            {videos.length > 0 && (
              <div className="mt-4 space-y-4">
                {videos.map((v, i) => {
                  const key = item.id + "::" + i;
                  return (
                    <VideoSlot
                      key={key}
                      v={v}
                      active={playing === key}
                      onPlay={() => setPlaying(key)}
                      onClose={() => setPlaying(null)}
                      tr={tr}
                    />
                  );
                })}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
