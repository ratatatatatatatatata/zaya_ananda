"use client";

import { useEffect, useState } from "react";

type Lesson = { title: string; url: string; quality?: string; subtitles?: string };
type Data = { status: "none" | "pending" | "active" | "expired"; lessons: Lesson[] };

function embed(url: string): { type: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return { type: "iframe", src: "https://www.youtube.com/embed/" + yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: "https://player.vimeo.com/video/" + vm[1] };
  return { type: "video", src: url };
}

export function CourseLessons({ id }: { id: string }) {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    fetch("/api/lessons?itemId=" + encodeURIComponent(id), { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ status: "none", lessons: [] }));
  }, [id]);

  if (!data || data.lessons.length === 0) return null;
  const locked = data.status !== "active";
  const notice =
    data.status === "pending"
      ? "Захиалга баталгаажихыг хүлээж байна. Баталгаажсаны дараа видео хичээлүүд нээгдэнэ."
      : data.status === "expired"
      ? "Таны үзэх хугацаа дууссан байна. Дахин худалдаж авснаар үргэлжлүүлэн үзэх боломжтой."
      : "Эдгээр видео хичээл төлбөр баталгаажсаны дараа нээгдэнэ.";

  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-semibold text-ink">
        Видео хичээлүүд <span className="text-base font-normal text-muted">({data.lessons.length})</span>
      </h2>
      {locked && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <span>🔒</span>
          <span>{notice}</span>
        </div>
      )}
      <div className="mt-5 space-y-5">
        {data.lessons.map((l, i) => {
          if (locked) {
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-[#111B2D] px-4 py-3.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">{i + 1}</span>
                <span className="flex-1 font-medium text-ink/80">{l.title}</span>
                <span className="text-muted">🔒</span>
              </div>
            );
          }
          return <LessonVideo key={i} lesson={l} index={i} />;
        })}
      </div>
    </div>
  );
}

function LessonVideo({ lesson, index }: { lesson: Lesson; index: number }) {
  const [subUrl, setSubUrl] = useState<string | undefined>();
  useEffect(() => {
    if (!lesson.subtitles) { setSubUrl(undefined); return; }
    const blob = new Blob([lesson.subtitles], { type: "text/vtt" });
    const u = URL.createObjectURL(blob);
    setSubUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [lesson.subtitles]);
  const e = embed(lesson.url);
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#111B2D] shadow-card">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">{index + 1}</span>
        <span className="font-display font-semibold text-ink">{lesson.title}</span>
        {lesson.subtitles && <span className="ml-auto rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">CC</span>}
      </div>
      <div className="relative aspect-video w-full bg-black">
        {lesson.quality && <span className="absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-white">{lesson.quality}</span>}
        {e.type === "iframe" ? (
          <iframe src={e.src} title={lesson.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <video controls className="h-full w-full" controlsList="nodownload">
            <source src={e.src} />
            {subUrl && <track kind="subtitles" srcLang="en" label="English" src={subUrl} default />}
          </video>
        )}
      </div>
      {lesson.subtitles && e.type !== "iframe" && (
        <p className="px-4 py-2 text-xs text-muted">English хадмал бэлэн — тоглуулагчийн хадмал (CC) товчоор асаана/унтраана.</p>
      )}
    </div>
  );
}
