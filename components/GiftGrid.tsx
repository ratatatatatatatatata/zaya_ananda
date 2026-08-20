"use client";

import { useState } from "react";
import Link from "next/link";
import { embedSrc, youtubeThumb } from "@/lib/video-embed";
import { useI18n } from "@/lib/i18n";
import type { CmsItem, Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });
const WATCH = Lx("Энд үзэх", "Watch here", "여기서 보기", "ここで見る", "在此观看");
const CLOSE = Lx("Хаах", "Close", "닫기", "閉じる", "关闭");
const MORE = Lx("Дэлгэрэнгүй", "Details", "자세히", "詳細", "详情");

type Vid = { title: string; url: string };

function firstVideo(item: CmsItem): Vid | null {
  const l = (item.lessons || []).find((x) => x.url && /youtu|vimeo/.test(x.url));
  return l?.url ? { title: l.title || item.title, url: l.url } : null;
}

/** Гэгээн бэлэг — YouTube бичлэгийг хуудаснаасаа гаралгүй, байрандаа тоглуулна. */
export function GiftGrid({ items, emptyText }: { items: CmsItem[]; emptyText: string }) {
  const { tr } = useI18n();
  const [playing, setPlaying] = useState<string | null>(null);

  if (items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">{emptyText}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const v = firstVideo(item);
        const e = v ? embedSrc(v.url, true) : null;
        const open = playing === item.id;
        const poster = e?.youtubeId ? youtubeThumb(e.youtubeId) : item.image;

        return (
          <article key={item.id} className="card overflow-hidden">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {open && e ? (
                <iframe
                  src={e.src}
                  title={item.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {poster
                    ? <img src={poster} alt="" className="h-full w-full object-cover" />
                    : <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />}
                  {v && (
                    <button
                      type="button"
                      onClick={() => setPlaying(item.id)}
                      aria-label={tr(WATCH)}
                      className="group absolute inset-0 grid place-items-center bg-black/25 transition hover:bg-black/10"
                    >
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-2xl text-[#15302C] shadow-lg transition group-hover:scale-110">
                        ▶
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
              {item.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {v && (
                  <button
                    type="button"
                    onClick={() => setPlaying(open ? null : item.id)}
                    className={open ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}
                  >
                    {open ? tr(CLOSE) : "▶ " + tr(WATCH)}
                  </button>
                )}
                <Link href={"/item/" + item.id} className="text-sm font-semibold text-primary-700 hover:underline">
                  {tr(MORE)} →
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
