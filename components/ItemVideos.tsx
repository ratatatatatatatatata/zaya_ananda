"use client";

import { useEffect, useState } from "react";

type Video = { title: string; url: string; quality?: string; subtitles?: string };

function embed(url: string): { type: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([\w-]{11})/);
  if (yt) return { type: "iframe", src: "https://www.youtube.com/embed/" + yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: "https://player.vimeo.com/video/" + vm[1] };
  return { type: "video", src: url };
}

function Player({ v, index }: { v: Video; index: number }) {
  const [subUrl, setSubUrl] = useState<string | undefined>();
  useEffect(() => {
    if (!v.subtitles) { setSubUrl(undefined); return; }
    const blob = new Blob([v.subtitles], { type: "text/vtt" });
    const u = URL.createObjectURL(blob);
    setSubUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [v.subtitles]);
  const e = embed(v.url);
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#1A2742] shadow-card">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">{index + 1}</span>
        <span className="font-display font-semibold text-ink">{v.title}</span>
        {v.subtitles && <span className="ml-auto rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">CC</span>}
      </div>
      <div className="relative aspect-video w-full bg-black">
        {v.quality && <span className="absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-white">{v.quality}</span>}
        {e.type === "iframe" ? (
          <iframe src={e.src} title={v.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <video controls className="h-full w-full" controlsList="nodownload">
            <source src={e.src} />
            {subUrl && <track kind="subtitles" srcLang="en" label="English" src={subUrl} default />}
          </video>
        )}
      </div>
    </div>
  );
}

export function ItemVideos({ videos }: { videos: Video[] }) {
  const shown = videos.filter((v) => v.url);
  if (shown.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-semibold text-ink">Видео <span className="text-base font-normal text-muted">({shown.length})</span></h2>
      <div className="mt-5 space-y-5">
        {shown.map((v, i) => <Player key={i} v={v} index={i} />)}
      </div>
    </div>
  );
}
