"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

type Comment = { id: string; name: string; text: string; createdAt: string };

/** Хичээлийн сэтгэгдэл — нэвтэрсэн хэрэглэгч бичнэ, бүх хүн шууд харна. */
export function CourseComments({ itemId }: { itemId: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function load() {
    fetch("/api/course-comments?itemId=" + encodeURIComponent(itemId), { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items || []))
      .catch(() => {});
  }
  useEffect(load, [itemId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/course-comments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, text: text.trim() }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setText(""); load();
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setBusy(false); }
  }

  return (
    <div>
      <p className="font-display text-lg font-semibold text-ink">Сэтгэгдэл ({items.length})</p>

      {user ? (
        <form onSubmit={submit} className="mt-4 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-magic-grad text-sm font-bold text-white">
            {(user.name || "?").charAt(0).toUpperCase()}
          </span>
          <div className="flex-1">
            <textarea className="textarea" rows={2} placeholder="Бодлоо хуваалцаарай…" value={text} onChange={(e) => setText(e.target.value)} />
            {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
            <button type="submit" disabled={busy || !text.trim()} className="btn btn-primary btn-sm mt-2 disabled:opacity-60">
              {busy ? "Илгээж байна…" : "Илгээх"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-line bg-surface-2/60 px-5 py-4 text-sm text-muted">
          Сэтгэгдэл бичихийн тулд эхлээд <a href="/login" className="font-semibold text-primary-700 hover:underline">нэвтэрнэ үү</a>.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {items.map((c) => (
          <div key={c.id} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">
              {c.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1 rounded-2xl border border-line bg-surface-1 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-xs text-muted">{c.createdAt.slice(0, 10)}</span>
              </div>
              <p className="mt-1 leading-relaxed text-ink/85">{c.text}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm italic text-muted">Одоогоор сэтгэгдэл алга, эхлүүлээрэй...</p>
        )}
      </div>
    </div>
  );
}
