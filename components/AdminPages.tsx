"use client";

import { useCallback, useEffect, useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { SitePage, CmsTranslations } from "@/lib/types";

const LANG_TABS = [
  { k: "mn" as const, l: "🇲🇳 Монгол" },
  { k: "en" as const, l: "🇬🇧 English" },
  { k: "ko" as const, l: "🇰🇷 한국어" },
  { k: "ja" as const, l: "🇯🇵 日本語" },
  { k: "zh" as const, l: "🇨🇳 中文" },
];
type TrLang = "en" | "ko" | "ja" | "zh";

function compressImage(file: File, maxW = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Зураг уншиж чадсангүй."));
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas алдаа"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Зураг буруу байна."));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
async function uploadVideo(file: File, onProgress: (p: number) => void): Promise<string> {
  const r = await fetch("/api/admin/video-upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name }) });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || "Байршуулах URL авахад алдаа гарлаа.");
  const { uploadUrl, path } = (await r.json()) as { uploadUrl: string; path: string };
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    if (SB_ANON) { xhr.setRequestHeader("apikey", SB_ANON); xhr.setRequestHeader("authorization", "Bearer " + SB_ANON); }
    xhr.setRequestHeader("x-upsert", "true");
    if (file.type) xhr.setRequestHeader("content-type", file.type);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Байршуулалт амжилтгүй (" + xhr.status + ")")));
    xhr.onerror = () => reject(new Error("Сүлжээний алдаа. Дахин оролдоно уу."));
    xhr.send(file);
  });
  return path;
}

const EMPTY = { title: "", navLabel: "", body: "", image: "", video: "", position: "0" };

/** Ерөнхий тохиргоо — цэсэнд шинэ мөр (хуудас) нэмж, агуулгыг нь засварлана. */
export function AdminPages() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const [langTab, setLangTab] = useState<"mn" | TrLang>("mn");
  const [i18n, setI18n] = useState<CmsTranslations>({});
  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setTr = (l: TrLang, field: "title" | "navLabel" | "body", v: string) =>
    setI18n((prev) => ({ ...prev, [l]: { ...(prev[l] || {}), [field]: v } }));

  const load = useCallback(() => {
    fetch("/api/admin/pages", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { pages: [] }))
      .then((d) => setPages(d.pages || []))
      .catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { set("image", await compressImage(file)); } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
  }
  async function pickVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setErr(""); setVideoProgress(0);
    try { set("video", await uploadVideo(file, setVideoProgress)); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Видео байршуулахад алдаа."); }
    finally { setVideoProgress(null); }
  }

  function resetForm() { setForm(EMPTY); setI18n({}); setLangTab("mn"); setEditingId(null); setErr(""); setOpen(false); }
  function startEdit(p: SitePage) {
    setForm({ title: p.title || "", navLabel: p.navLabel || "", body: p.body || "", image: p.image || "", video: p.video || "", position: String(p.position ?? 0) });
    setI18n(p.i18n || {}); setLangTab("mn");
    setEditingId(p.id); setErr(""); setOpen(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setErr("Гарчиг оруулна уу."); return; }
    setSaving(true); setErr("");
    try {
      const res = await fetch("/api/admin/pages", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form, i18n } : { ...form, i18n }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      resetForm(); load();
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }
  async function del(id: string) {
    if (!confirm("Энэ хуудсыг устгах уу? Цэснээс мөн арилна.")) return;
    await fetch("/api/admin/pages?id=" + id, { method: "DELETE" }); load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Цэсний хуудсууд: {pages.length}</h2>
          <p className="mt-1 text-sm text-muted">Энд нэмсэн хуудас сайтын дээд цэсэнд шинэ мөр болж гарна.</p>
        </div>
        <button onClick={() => (open ? resetForm() : setOpen(true))} className="btn btn-primary btn-sm">{open ? "Болих" : "+ Хуудас нэмэх"}</button>
      </div>

      {open && (
        <form onSubmit={save} className="card space-y-4 p-5">
          {editingId && <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">Засварлаж байна</p>}
          <div className="flex flex-wrap gap-1.5">
            {LANG_TABS.map((lt) => (
              <button key={lt.k} type="button" onClick={() => setLangTab(lt.k)}
                className={"rounded-full px-3.5 py-1.5 text-sm font-semibold transition " + (langTab === lt.k ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-white/5 text-ink/60 hover:text-primary-300")}>
                {lt.l}
              </button>
            ))}
          </div>
          {langTab !== "mn" && <p className="rounded-lg bg-aqua px-3 py-1.5 text-xs text-muted">Энэ хэл дээрх орчуулгаа оруулна уу. Хоосон орхивол монгол хувилбар нь харагдана.</p>}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="field-label">Хуудасны гарчиг {langTab === "mn" ? "*" : "(" + langTab.toUpperCase() + ")"}</label>
              {langTab === "mn"
                ? <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
                : <input className="input" placeholder={form.title} value={i18n[langTab]?.title || ""} onChange={(e) => setTr(langTab, "title", e.target.value)} />}
            </div>
            <div>
              <label className="field-label">Цэсэнд харагдах нэр {langTab !== "mn" && "(" + langTab.toUpperCase() + ")"}</label>
              {langTab === "mn"
                ? <input className="input" value={form.navLabel} onChange={(e) => set("navLabel", e.target.value)} placeholder="Хоосон бол гарчиг" />
                : <input className="input" placeholder={form.navLabel || form.title} value={i18n[langTab]?.navLabel || ""} onChange={(e) => setTr(langTab, "navLabel", e.target.value)} />}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="field-label">Дараалал (цэсэнд)</label><input className="input" type="number" value={form.position} onChange={(e) => set("position", e.target.value)} /></div>
            <div>
              <label className="field-label">Зураг</label>
              {form.image
                ? <div className="flex items-center gap-2"><img src={form.image} alt="" className="h-14 w-20 rounded-lg object-cover" /><button type="button" onClick={() => set("image", "")} className="text-xs font-semibold text-rose-500 hover:underline">Устгах</button></div>
                : <input type="file" accept="image/*" onChange={pickImage} className="text-sm" />}
            </div>
            <div>
              <label className="field-label">Видео</label>
              {form.video
                ? <div className="flex items-center gap-2"><span className="text-sm font-medium text-jade-600">✓ Орсон</span><button type="button" onClick={() => set("video", "")} className="text-xs font-semibold text-rose-500 hover:underline">Устгах</button></div>
                : videoProgress !== null
                ? <span className="text-sm font-medium text-primary-700">Байршуулж байна… {videoProgress}%</span>
                : <input type="file" accept="video/*" onChange={pickVideo} className="text-sm" />}
            </div>
          </div>
          <div>
            <label className="field-label">Агуулга {langTab !== "mn" && "(" + langTab.toUpperCase() + ")"}</label>
            {langTab === "mn"
              ? <RichTextEditor key="mn" value={form.body} onChange={(html) => set("body", html)} minHeight={240} />
              : <RichTextEditor key={langTab} value={i18n[langTab]?.body || ""} onChange={(html) => setTr(langTab, "body", html)} minHeight={240} />}
          </div>
          {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "Хадгалж байна..." : editingId ? "Засварыг хадгалах" : "Хадгалах"}</button>
            <button type="button" onClick={resetForm} className="btn btn-outline btn-md">Болих</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead className="border-b border-line bg-aqua"><tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Цэсний нэр</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Гарчиг</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Дараалал</th>
            <th className="px-4 py-3" />
          </tr></thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-ink">{p.navLabel || p.title}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{p.title}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{p.position ?? 0}</td>
                <td className="px-4 py-3 text-right"><div className="flex justify-end gap-3">
                  <a href={"/p/" + p.id} target="_blank" rel="noreferrer" className="text-sm font-semibold text-ink/60 hover:underline">Харах</a>
                  <button onClick={() => startEdit(p)} className="text-sm font-semibold text-primary-700 hover:underline">Засах</button>
                  <button onClick={() => del(p.id)} className="text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
                </div></td>
              </tr>
            ))}
            {pages.length === 0 && <tr><td className="px-4 py-6 text-sm text-muted" colSpan={4}>Хуудас алга. “+ Хуудас нэмэх” дарж цэсэнд шинэ хуудас нэмнэ үү.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
