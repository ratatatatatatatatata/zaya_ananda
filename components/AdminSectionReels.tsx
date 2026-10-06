"use client";
import { useCallback, useEffect, useState } from "react";
import { isVideoLink } from "@/lib/video-embed";
import { reelCategory, REEL_SECTIONS, type ReelSection } from "@/lib/section-reels";
import { uploadReelMedia } from "@/lib/reel-upload";
import type { CmsItem } from "@/lib/types";

export function AdminSectionReels({ section }: { section: ReelSection }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [draft, setDraft] = useState({ title: "", link: "", image: "", summary: "", lessons: [] as NonNullable<CmsItem["lessons"]> });
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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
  const reset = () => { setEditing(null); setDraft({ title: "", link: "", image: "", summary: "", lessons: [] as NonNullable<CmsItem["lessons"]> }); };
  async function save(event: React.FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    const link = draft.link.trim();
    if (uploading) return;
    if ((link && !isVideoLink(link)) || (!link && !draft.image && !draft.lessons.length)) {
      setError("Бичлэгийн зөв холбоос оруулах эсвэл зураг, видео upload хийнэ үү."); return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/content", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing, kind: "free", category: reelCategory(section), title: draft.title.trim(), link, image: draft.image, images: draft.image ? [draft.image] : [], summary: draft.summary.trim(), lessons: draft.lessons }) });
      if (!response.ok) throw new Error((await response.json()).error || "Хадгалж чадсангүй.");
      reset(); await load(); setMessage("Reel хадгалагдлаа.");
    } catch (error) { setError(error instanceof Error ? error.message : "Алдаа гарлаа."); }
    finally { setBusy(false); }
  }
  async function upload(file: File | undefined, field: "image" | "link") {
    if (!file) return;
    setUploading(true); setProgress(0); setError("");
    try {
      const url = await uploadReelMedia(file, setProgress);
      setDraft(current => ({ ...current, [field]: url, ...(field === "link" ? { lessons: [] } : {}) }));
    } catch (error) { setError(error instanceof Error ? error.message : "Upload алдаа."); }
    finally { setUploading(false); }
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
      <p className="mt-2 text-sm text-muted">Холбоос оруулах эсвэл зураг, видео шууд upload хийнэ. Аяллын Reel нь аяллын хөтөлбөр дотор мөн харагдана. Зураг 10 MB, видео 500 MB хүртэл.</p></div>
    <form onSubmit={save} className="card space-y-4 p-5">
      <label className="block"><span className="field-label">Гарчиг</span><input required disabled={busy || uploading} className="input" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label>
      <label className="block"><span className="field-label">Reel холбоос</span><input disabled={busy || uploading} type="url" placeholder="https://youtube.com/shorts/..." className="input" value={draft.link} onChange={event => setDraft({ ...draft, link: event.target.value, lessons: [] })} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="field-label">Видео upload</span><input disabled={busy || uploading} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" onChange={event => { upload(event.target.files?.[0], "link"); event.target.value = ""; }} /></label>
        <label className="block"><span className="field-label">Нүүр зураг upload</span><input disabled={busy || uploading} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => { upload(event.target.files?.[0], "image"); event.target.value = ""; }} /></label>
      </div>
      {uploading && <p role="status" className="text-sm text-primary-700">Upload хийж байна… {progress}%</p>}
      {draft.image && <div className="flex items-center gap-4"><img src={draft.image} alt="Нүүр зургийн урьдчилсан харагдац" className="h-24 w-40 rounded-lg object-contain" /><button type="button" disabled={busy || uploading} onClick={() => setDraft({ ...draft, image: "" })}>Зураг хасах</button></div>}
      <label className="block"><span className="field-label">Тайлбар</span><textarea disabled={busy || uploading} className="input" rows={3} value={draft.summary} onChange={event => setDraft({ ...draft, summary: event.target.value })} /></label>
      <div className="flex gap-3"><button disabled={busy || uploading} className="btn btn-primary btn-sm">{busy ? "Хүлээнэ үү…" : editing ? "Өөрчлөлт хадгалах" : "Reel нэмэх"}</button>{editing && <button type="button" disabled={busy || uploading} onClick={reset} className="btn btn-outline btn-sm">Болих</button>}</div>
    </form>
    {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
    {message && <p role="status" className="text-sm text-primary-700">{message}</p>}
    <div className="space-y-3">{items.map(item => <article key={item.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0"><h3 className="font-semibold text-ink">{item.title}</h3><p className="mt-1 break-all text-xs text-muted">{item.link}</p></div>
      <div className="flex gap-4"><button disabled={busy || uploading} className="text-sm font-semibold text-primary-700" onClick={() => { setEditing(item.id); setDraft({ title: item.title, link: item.link || "", image: item.image || "", summary: item.summary || "", lessons: item.lessons || [] }); setMessage(""); setError(""); }}>Засах</button><button disabled={busy || uploading} className="text-sm font-semibold text-rose-700" onClick={() => remove(item)}>Устгах</button></div>
    </article>)}</div>
  </section>;
}
