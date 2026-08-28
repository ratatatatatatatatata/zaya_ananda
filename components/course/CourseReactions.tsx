"use client";

import { useEffect, useState } from "react";

/** Үзэх (дэмжих) урвал — хувийн төхөөрөмж дээр хадгалагдана, нэвтрэх шаардлагагүй. */
export function CourseReactions({ id }: { id: string }) {
  const [liked, setLiked] = useState(false);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("za_reaction_" + id);
      if (raw) {
        const d = JSON.parse(raw);
        setLiked(!!d.liked);
        setVoted(d.voted === "up" || d.voted === "down" ? d.voted : null);
      }
    } catch { /* localStorage хаалттай байж болно */ }
  }, [id]);

  function persist(next: { liked: boolean; voted: "up" | "down" | null }) {
    try { localStorage.setItem("za_reaction_" + id, JSON.stringify(next)); } catch { /* үл хамаарна */ }
  }
  function toggleLike() {
    setLiked((v) => { const n = !v; persist({ liked: n, voted }); return n; });
  }
  function vote(v: "up" | "down") {
    setVoted((cur) => { const n = cur === v ? null : v; persist({ liked, voted: n }); return n; });
  }
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ url, title: document.title }); return; }
    } catch { /* хэрэглэгч цуцалсан байж болно */ }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard хандалт хаалттай байж болно */ }
  }

  const btn = "grid h-10 w-10 shrink-0 place-items-center rounded-full border text-lg transition";
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={toggleLike} aria-label="Дэмжих" title="Дэмжих"
        className={btn + " " + (liked ? "border-rose-300 bg-rose-50" : "border-line text-ink/60 hover:border-rose-300")}>
        {liked ? "❤️" : "🤍"}
      </button>
      <button type="button" onClick={() => vote("up")} aria-label="Таалагдсан" title="Таалагдсан"
        className={btn + " " + (voted === "up" ? "border-jade-400 bg-jade-400/10" : "border-line text-ink/60 hover:border-jade-400")}>
        👍
      </button>
      <button type="button" onClick={() => vote("down")} aria-label="Таалагдаагүй" title="Таалагдаагүй"
        className={btn + " " + (voted === "down" ? "border-rose-400 bg-rose-400/10" : "border-line text-ink/60 hover:border-rose-400")}>
        👎
      </button>
      <button type="button" onClick={share} aria-label="Хуваалцах" title="Хуваалцах"
        className={btn + " border-line text-ink/60 hover:border-primary-400"}>
        🔗
      </button>
      {copied && <span className="text-xs font-semibold text-jade-600">Холбоос хууллаа!</span>}
    </div>
  );
}
