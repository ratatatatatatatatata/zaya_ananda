"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { embedSrc, youtubeThumb } from "@/lib/video-embed";
import { useI18n } from "@/lib/i18n";
import type { CmsItem, Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const EMPTY = Lx(
  "Reel удахгүй нэмэгдэнэ. 🎁",
  "Reels coming soon. 🎁",
  "릴이 곧 추가됩니다. 🎁",
  "リールは近日追加されます。🎁",
  "短片即将上线。🎁",
);
const PREV = Lx("Өмнөх", "Previous", "이전", "前へ", "上一个");
const NEXT = Lx("Дараах", "Next", "다음", "次へ", "下一个");
const MORE = Lx("Дэлгэрэнгүй", "Details", "자세히", "詳細", "详情");

type Reel = { id: string; title: string; url: string; poster: string };

const AUTOPLAY_MS = 3000;

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

/** Гэгээн бэлгийн reel-үүд — 3 секунд тутам өөрөө гулсдаг зурвас. */
export function ReelsSlider({ items }: { items: CmsItem[] }) {
  const { tr } = useI18n();
  const [reels] = useState(() => collect(items));
  const [playing, setPlaying] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  // 3 секунд тутам дараагийн reel рүү гулсана
  useEffect(() => {
    if (reels.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (paused.current || playing) return;
      setI((v) => (v + 1) % reels.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [reels.length, playing]);

  // Идэвхтэй reel рүү зөөлөн гулсуулах
  useEffect(() => {
    const el = rail.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, [i]);

  if (reels.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-12 text-center text-muted">{tr(EMPTY)}</p>;
  }

  const step = (dir: 1 | -1) => {
    setPlaying(null);
    setI((v) => (v + dir + reels.length) % reels.length);
  };

  return (
    <div
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={tr(PREV)}
          className="focus-ring absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-x-1/3 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={tr(NEXT)}
          className="focus-ring absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 translate-x-1/3 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700"
        >
          ›
        </button>

        <div
          ref={rail}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reels.map((r, k) => {
            const open = playing === r.id;
            const e = embedSrc(r.url, true);
            return (
              <article
                key={r.id}
                className={
                  "relative w-[15rem] shrink-0 snap-start overflow-hidden rounded-[1.25rem] bg-black shadow-card transition duration-500 sm:w-[16.5rem] " +
                  (k === i ? "ring-2 ring-primary-500" : "opacity-90")
                }
              >
                <div className="relative aspect-[9/16] w-full">
                  {open ? (
                    <iframe
                      src={e.src}
                      title={r.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      {r.poster
                        ? <img src={r.poster} alt="" className="h-full w-full object-cover" />
                        : <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />}
                      <div aria-hidden className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(8,20,17,0.9) 0%, rgba(8,20,17,0.1) 55%, transparent 100%)" }} />
                      <button
                        type="button"
                        onClick={() => { setPlaying(r.id); setI(k); }}
                        aria-label={r.title}
                        className="group absolute inset-0 grid place-items-center"
                      >
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-xl text-[#15302C] shadow-lg transition group-hover:scale-110">▶</span>
                      </button>
                      <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 font-display text-sm font-semibold leading-snug text-white">
                        {r.title}
                      </p>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Цэгүүд */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {reels.map((_, k) => (
          <button
            key={k}
            type="button"
            onClick={() => { setPlaying(null); setI(k); }}
            aria-label={`${k + 1}`}
            aria-current={k === i}
            className={"h-2.5 rounded-full transition-all " + (k === i ? "w-7 bg-primary-600" : "w-2.5 bg-line hover:bg-primary-300")}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/gift" className="btn btn-outline btn-sm">{tr(MORE)} →</Link>
      </div>
    </div>
  );
}
