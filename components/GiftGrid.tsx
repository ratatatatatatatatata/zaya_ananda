"use client";

import { useState } from "react";
import { embedSrc, youtubeThumb } from "@/lib/video-embed";
import { useI18n } from "@/lib/i18n";
import type { CmsItem, Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });
const WATCH = Lx("Энд үзэх", "Watch here", "여기서 보기", "ここで見る", "在此观看");
const CLOSE = Lx("Хаах", "Close", "닫기", "閉じる", "关闭");
const ALL = Lx("Бүгд", "All", "전체", "すべて", "全部");
const PODCAST = Lx("Podcast", "Podcast", "팟캐스트", "ポッドキャスト", "播客");
const REEL = Lx("Reel", "Reel", "릴", "リール", "短片");

type GiftKind = "all" | "podcast" | "reel";
const GIFT_TABS: { key: GiftKind; label: Record<Locale, string> }[] = [
  { key: "all", label: ALL },
  { key: "podcast", label: PODCAST },
  { key: "reel", label: REEL },
];
const PODCAST_PATTERN = /podcast|подкаст/i;

function giftKind(item: CmsItem): Exclude<GiftKind, "all"> {
  return PODCAST_PATTERN.test(`${item.title} ${item.summary || ""} ${item.category || ""}`) ? "podcast" : "reel";
}

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
  const [kind, setKind] = useState<GiftKind>("all");
  const shown = kind === "all" ? items : items.filter((item) => giftKind(item) === kind);

  if (items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">{emptyText}</p>;
  }

  return (
    <div>
      <div className="mx-auto mb-8 flex w-full max-w-2xl flex-wrap justify-center gap-2" role="group" aria-label="Гэгээн бэлгийн төрөл">
        {GIFT_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => { setKind(tab.key); setPlaying(null); }}
            aria-pressed={kind === tab.key}
            className={
              "focus-ring inline-flex items-center rounded-full px-5 py-2.5 text-[1rem] font-semibold transition " +
              (kind === tab.key
                ? "bg-primary-grad text-white shadow-glow"
                : "border border-line bg-surface-1 text-ink/70 hover:border-primary-400 hover:text-primary-700")
            }
          >
            {tr(tab.label)}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-12 text-center text-muted">{emptyText}</p>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((item) => {
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
      )}
    </div>
  );
}
