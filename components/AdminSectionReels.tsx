"use client";
import { useCallback, useEffect, useState } from "react";
import { embedSrc } from "@/lib/video-embed";
import { reelCategory, REEL_SECTIONS, type ReelSection } from "@/lib/section-reels";
import type { CmsItem } from "@/lib/types";

export function AdminSectionReels({ section }: { section: ReelSection }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [draft, setDraft] = useState({ title: "", link: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (!response.ok) throw new Error("Reel жагсаалтыг уншиж чадсангүй.");
    const data = await response.json();
    setItems((data.items || []).filter((item: CmsItem) => item.kind === "free" && item.category === reelCategory(section)));
  }, [section]);
  useEffect(() => { load().catch(error => setError(error.message)); }, [load]);
  const reset = () => { setEditing(null); setDraft({ title: "", link: "" }); };
  async function save(event: React.FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    const link = draft.link.trim();
    const embed = embedSrc(link);
    if (!/^https:\/\//i.test(link) || (embed.type !== "iframe" && !/\.(mp4|webm|m4v)(\?|$)/i.test(link))) {
      setError("YouTube Shorts, YouTube, Vimeo эсвэл шууд MP4/WebM холбоос оруулна уу."); return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/content", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing, kind: "free", category: reelCategory(section), title: draft.title.trim(), link, summary: "" }) });
      if (!response.ok) throw new Error((await response.json()).error || "Хадгалж чадсангүй.");
      reset(); await load(); setMessage("Reel хадгалагдлаа.");
    } catch (error) { setError(error instanceof Error ? error.message : "Алдаа гарлаа."); }
    finally { setBusy(false); }
  }
  async function remove(item: CmsItem) {
    if (!confirm(`«${item.title}» Reel-ийг устгах уу?`)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/admin/content?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Устгаж чадсангүй.");
      if (editing === item.id) reset();
      await load(); setMessage("Reel устгагдлаа.");
    } catch (error) { setError(error instanceof Error ? error.message : "Алдаа гарлаа."); }
    finally { setBusy(false); }
  }
  return <section className="mt-10 space-y-5 border-t border-line pt-8">
    <div><h2 className="font-display text-xl font-semibold text-ink">{REEL_SECTIONS[section]} — Reel</h2>
      <p className="mt-2 text-sm text-muted">Энд нэмсэн Reel зөвхөн энэ цэсэнд харагдана. YouTube Shorts, YouTube, Vimeo эсвэл шууд MP4/WebM холбоос ашиглана.</p></div>
    <form onSubmit={save} className="card space-y-4 p-5">
      <label className="block"><span className="field-label">Гарчиг</span><input required disabled={busy} className="input" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label>
      <label className="block"><span className="field-label">Reel холбоос</span><input required disabled={busy} type="url" placeholder="https://youtube.com/shorts/..." className="input" value={draft.link} onChange={event => setDraft({ ...draft, link: event.target.value })} /></label>
      <div className="flex gap-3"><button disabled={busy} className="btn btn-primary btn-sm">{busy ? "Хүлээнэ үү…" : editing ? "Өөрчлөлт хадгалах" : "Reel нэмэх"}</button>{editing && <button type="button" disabled={busy} onClick={reset} className="btn btn-outline btn-sm">Болих</button>}</div>
    </form>
    {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
    {message && <p role="status" className="text-sm text-primary-700">{message}</p>}
    <div className="space-y-3">{items.map(item => <article key={item.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0"><h3 className="font-semibold text-ink">{item.title}</h3><p className="mt-1 break-all text-xs text-muted">{item.link}</p></div>
      <div className="flex gap-4"><button disabled={busy} className="text-sm font-semibold text-primary-700" onClick={() => { setEditing(item.id); setDraft({ title: item.title, link: item.link || "" }); setMessage(""); setError(""); }}>Засах</button><button disabled={busy} className="text-sm font-semibold text-rose-700" onClick={() => remove(item)}>Устгах</button></div>
    </article>)}</div>
  </section>;
}
