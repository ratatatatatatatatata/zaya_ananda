"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { JourneyReview } from "@/lib/types";

/** Аяллын сэтгэгдэл — хөтчийн доор харагдана. Оролцсон хүн шинээр үлдээнэ. */
export function JourneyReviews({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<JourneyReview[]>([]);
  const [canWrite, setCanWrite] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/journey/review?slug=" + encodeURIComponent(slug), { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items || []))
      .catch(() => {});
  }, [slug]);

  // Энэ аялалд оролцсон эсэхийг шалгана
  useEffect(() => {
    if (!user) { setCanWrite(false); return; }
    fetch("/api/journey/booking", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => {
        const today = new Date().toISOString().slice(0, 10);
        setCanWrite(
          (d.items || []).some(
            (b: { slug: string; date: string; status: string }) =>
              b.slug === slug && b.status !== "cancelled" && b.date <= today,
          ),
        );
      })
      .catch(() => {});
  }, [user, slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/journey/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, rating, text: text.trim() }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setDone(true); setOpen(false); setText("");
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setBusy(false); }
  }

  const Stars = ({ n }: { n: number }) => (
    <span className="flex gap-0.5" aria-label={n + "/5"}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} aria-hidden className={i <= n ? "text-accent-300" : "text-line"}>★</span>)}
    </span>
  );

  if (items.length === 0 && !canWrite && !done) return null;

  return (
    <div className="mt-10">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">Аялсан хүмүүсийн сэтгэгдэл</p>

      {items.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {items.map((r) => (
            <blockquote key={r.id} className="rounded-2xl border border-line bg-surface-1 p-5">
              <Stars n={r.rating} />
              <p className="mt-3 text-[0.96rem] leading-relaxed text-ink/85">“{r.text}”</p>
              <footer className="mt-3 text-sm font-semibold text-primary-700">— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      )}

      {done && (
        <p className="mt-4 rounded-2xl bg-jade-400/12 px-5 py-4 text-sm text-jade-600">
          Сэтгэгдэл илгээгдлээ. Баярлалаа! Админ сонгосны дараа нийтэд харагдана.
        </p>
      )}

      {canWrite && !done && (
        <div className="mt-5">
          {open ? (
            <form onSubmit={submit} className="panel p-6">
              <p className="font-display text-lg font-semibold text-ink">Аяллын сэтгэгдлээ үлдээх</p>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted">Үнэлгээ:</span>
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" onClick={() => setRating(i)} aria-label={i + " од"}
                    className={"text-2xl transition " + (i <= rating ? "text-accent-300" : "text-line hover:text-accent-300/60")}>
                    ★
                  </button>
                ))}
              </div>

              <textarea className="textarea mt-4" rows={4} required value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Аялал танд юу өгсөн бэ? Хамгийн санагдсан мөч аль нь байв?" />

              {err && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}

              <div className="mt-4 flex flex-wrap gap-3">
                <button type="submit" disabled={busy || !text.trim()} className="btn btn-primary btn-sm disabled:opacity-60">
                  {busy ? "Илгээж байна…" : "Илгээх"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn btn-outline btn-sm">Болих</button>
              </div>
            </form>
          ) : (
            <button type="button" onClick={() => setOpen(true)} className="btn btn-outline btn-md">
              ✍️ Сэтгэгдлээ үлдээх
            </button>
          )}
        </div>
      )}
    </div>
  );
}
