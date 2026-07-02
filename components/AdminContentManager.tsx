"use client";

import { useCallback, useEffect, useState } from "react";
import { formatMNT } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

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

const EMPTY = { title: "", category: "", summary: "", body: "", price: "", mode: "online", image: "", link: "", videoLessons: "", students: "", views: "", teacherName: "", teacherImage: "", teacherInfo: "", accessDays: "" };

const CAT_OPTS: Record<string, string[]> = {
  service: ["Оношилгоо", "Эмчилгээ"],
  resource: ["Зөвлөгөө", "Видео зөвлөгөө"],
};

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
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Байршуулалт амжилтгүй (" + xhr.status + "): " + String(xhr.responseText).slice(0, 160))));
    xhr.onerror = () => reject(new Error("Сүлжээний алдаа. Дахин оролдоно уу."));
    xhr.send(file);
  });
  return path;
}

function srtToVtt(s: string): string {
  const body = s.replace(/\r+/g, "").replace(/(\d\d:\d\d:\d\d),(\d{1,3})/g, "$1.$2");
  return /^WEBVTT/.test(body.trim()) ? body : "WEBVTT\n\n" + body;
}

type LessonRow = { title: string; path: string; quality: string; subtitles?: string; filename?: string; uploading?: boolean; progress?: number };

export function AdminContentManager({ kind }: { kind: CmsItem["kind"] }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const load = useCallback(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems((d.items || []).filter((i: CmsItem) => i.kind === kind)))
      .catch(() => {});
  }, [kind]);
  useEffect(() => { load(); }, [load]);

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>, field: "image" | "teacherImage") {
    const file = e.target.files?.[0]; if (!file) return;
    try { const data = await compressImage(file); set(field, data); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
  }

  const updLesson = (idx: number, patch: Partial<LessonRow>) =>
    setLessons((ls) => ls.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  async function onPickVideo(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0]; if (!file) return;
    updLesson(idx, { uploading: true, progress: 0, filename: file.name });
    try {
      const path = await uploadVideo(file, (p) => updLesson(idx, { progress: p }));
      updLesson(idx, { path, uploading: false, progress: 100 });
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Видео байршуулахад алдаа."); updLesson(idx, { uploading: false }); }
  }
  async function onPickSub(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      let text = await file.text();
      if (/\.srt$/i.test(file.name) || !/^WEBVTT/.test(text.trim())) text = srtToVtt(text);
      updLesson(idx, { subtitles: text });
    } catch { setErr("Хадмал файл уншихад алдаа."); }
  }

  function resetForm() { setForm(EMPTY); setLessons([]); setEditingId(null); setErr(""); setOpen(false); }
  function startNew() { setForm(EMPTY); setLessons([]); setEditingId(null); setErr(""); setOpen(true); }
  function startEdit(it: CmsItem) {
    setForm({
      title: it.title || "", category: it.category || "", summary: it.summary || "", body: it.body || "",
      price: it.price != null ? String(it.price) : "", mode: it.mode || "online", image: it.image || "", link: it.link || "",
      videoLessons: it.videoLessons != null ? String(it.videoLessons) : "",
      students: it.students != null ? String(it.students) : "", views: it.views != null ? String(it.views) : "",
      teacherName: it.teacherName || "", teacherImage: it.teacherImage || "", teacherInfo: it.teacherInfo || "",
      accessDays: it.accessDays != null ? String(it.accessDays) : "",
    });
    setLessons((it.lessons || []).map((l) => ({ title: l.title || "", path: l.path || "", quality: l.quality || "1080p", subtitles: l.subtitles || "" })));
    setEditingId(it.id); setErr(""); setOpen(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setErr("Гарчиг оруулна уу."); return; }
    setSaving(true); setErr("");
    const payload = {
      kind, ...form,
      mode: kind === "course" ? form.mode : undefined,
      lessons: kind === "course" ? lessons.filter((l) => l.title.trim() && l.path).map((l) => ({ title: l.title.trim(), path: l.path, quality: l.quality, subtitles: l.subtitles || "" })) : undefined,
    };
    try {
      const res = await fetch("/api/admin/content", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      resetForm(); load();
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }
  async function del(id: string) {
    if (!confirm("Энэ мэдээллийг устгах уу?")) return;
    await fetch("/api/admin/content?id=" + id, { method: "DELETE" }); load();
  }

  const isCourse = kind === "course";
  const isPromo = kind === "promo";
  const hasTeacher = kind === "course" || kind === "service";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Нийт: {items.length}</h2>
        <button onClick={() => (open ? resetForm() : startNew())} className="btn btn-primary btn-sm">{open ? "Болих" : "+ Мэдээлэл нэмэх"}</button>
      </div>

      {open && (
        <form onSubmit={save} className="card space-y-4 p-5">
          {editingId && <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">Засварлаж байна</p>}

          <div>
            <label className="field-label">{isPromo ? "Баннер зураг" : "Нүүр зураг"}</label>
            <div className="flex items-center gap-3">
              {form.image
                ? <img src={form.image} alt="" className={"rounded-xl object-cover " + (isPromo ? "h-20 w-40" : "h-20 w-28")} />
                : <div className={"grid place-items-center rounded-xl border border-dashed border-line text-2xl text-muted " + (isPromo ? "h-20 w-40" : "h-20 w-28")}>🖼</div>}
              <div className="flex flex-col gap-1">
                <input type="file" accept="image/*" onChange={(e) => pickImage(e, "image")} className="text-sm" />
                {form.image && <button type="button" onClick={() => set("image", "")} className="text-left text-xs font-semibold text-rose-500">Устгах</button>}
              </div>
            </div>
          </div>

          <div><label className="field-label">Гарчиг *</label><input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>

          {isPromo ? (
            <>
              <div><label className="field-label">Холбоос (заавал биш)</label><input className="input" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://... эсвэл /courses" /></div>
              <div><label className="field-label">Богино тайлбар (заавал биш)</label><input className="input" value={form.summary} onChange={(e) => set("summary", e.target.value)} /></div>
            </>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="field-label">Ангилал</label>
                  {CAT_OPTS[kind]
                    ? <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}><option value="">— Сонгох —</option>{CAT_OPTS[kind].map((c) => <option key={c} value={c}>{c}</option>)}</select>
                    : <input className="input" value={form.category} onChange={(e) => set("category", e.target.value)} />}
                </div>
                {kind !== "resource" && <div><label className="field-label">Үнэ (₮)</label><input className="input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></div>}
                {isCourse && <div><label className="field-label">Хэлбэр</label><select className="input" value={form.mode} onChange={(e) => set("mode", e.target.value)}><option value="online">Онлайн сургалт</option><option value="tankhim">Танхимын сургалт</option><option value="both">Онлайн + Танхим</option></select></div>}
              </div>

              {isCourse && (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div><label className="field-label">Суралцагчийн тоо</label><input className="input" type="number" value={form.students} onChange={(e) => set("students", e.target.value)} /></div>
                    <div><label className="field-label">Үзсэн тоо</label><input className="input" type="number" value={form.views} onChange={(e) => set("views", e.target.value)} /></div>
                    <div><label className="field-label">Хандах хугацаа (хоног)</label><input className="input" type="number" value={form.accessDays} onChange={(e) => set("accessDays", e.target.value)} placeholder="жишээ: 30" /></div>
                  </div>
                  <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-display font-semibold text-ink">Видео хичээлүүд <span className="text-sm font-normal text-muted">({lessons.length})</span></p>
                      <button type="button" onClick={() => setLessons((ls) => [...ls, { title: "", path: "", quality: "1080p" }])} className="btn btn-outline btn-sm">+ Хичээл нэмэх</button>
                    </div>
                    <p className="mb-3 text-xs leading-relaxed text-muted">Хичээл бүр гарчигтай байх ёстой. Видео файлаа компьютерээсээ шууд байршуулж, чанарын шошго (1080p/4K) сонгоно. Эдгээр видео зөвхөн төлбөр баталгаажсан хэрэглэгчид харагдана.</p>
                    <div className="space-y-2">
                      {lessons.map((l, idx) => (
                        <div key={idx} className="space-y-2 rounded-xl border border-line bg-white p-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{idx + 1}</span>
                            <input className="input flex-1" placeholder="Хичээлийн гарчиг" value={l.title} onChange={(e) => updLesson(idx, { title: e.target.value })} />
                            <select className="input w-32 shrink-0" value={l.quality} onChange={(e) => updLesson(idx, { quality: e.target.value })}>
                              <option value="480p">480p</option><option value="720p">720p</option><option value="1080p">1080p</option><option value="1440p">1440p (2K)</option><option value="4K">4K</option>
                            </select>
                            <button type="button" onClick={() => setLessons((ls) => ls.filter((_, i) => i !== idx))} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
                          </div>
                          <div className="flex items-center gap-3 pl-9">
                            {l.path
                              ? <span className="text-sm font-medium text-jade-600">✓ Видео байршсан{l.filename ? " — " + l.filename : ""}</span>
                              : l.uploading
                              ? <span className="shrink-0 text-sm font-medium text-primary-700">Байршуулж байна… {l.progress ?? 0}%</span>
                              : <input type="file" accept="video/*" className="text-sm" onChange={(e) => onPickVideo(e, idx)} />}
                            {l.uploading && <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full bg-primary-500 transition-all" style={{ width: (l.progress ?? 0) + "%" }} /></div>}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pl-9">
                            <span className="shrink-0 text-xs font-medium text-muted">English хадмал (.vtt/.srt):</span>
                            {l.subtitles && <span className="text-sm font-medium text-jade-600">✓ Орсон</span>}
                            <input type="file" accept=".vtt,.srt,text/vtt" className="text-sm" onChange={(e) => onPickSub(e, idx)} />
                            {l.subtitles && <button type="button" onClick={() => updLesson(idx, { subtitles: "" })} className="text-xs font-semibold text-rose-500 hover:underline">Устгах</button>}
                          </div>
                        </div>
                      ))}
                      {lessons.length === 0 && <p className="text-sm text-muted">Одоогоор хичээл алга. “+ Хичээл нэмэх” дарж видео хичээл нэмнэ үү.</p>}
                    </div>
                  </div>
                </>
              )}

              <div><label className="field-label">Товч тайлбар</label><input className="input" value={form.summary} onChange={(e) => set("summary", e.target.value)} /></div>
              <div><label className="field-label">Дэлгэрэнгүй тайлбар</label><textarea className="textarea" value={form.body} onChange={(e) => set("body", e.target.value)} /></div>

              {hasTeacher && (
                <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
                  <p className="mb-3 font-display font-semibold text-ink">Заах багшийн мэдээлэл</p>
                  <div className="flex items-center gap-3">
                    {form.teacherImage
                      ? <img src={form.teacherImage} alt="" className="h-20 w-20 rounded-full object-cover" />
                      : <div className="grid h-20 w-20 place-items-center rounded-full border border-dashed border-line text-xl text-muted">👤</div>}
                    <div className="flex flex-col gap-1">
                      <input type="file" accept="image/*" onChange={(e) => pickImage(e, "teacherImage")} className="text-sm" />
                      {form.teacherImage && <button type="button" onClick={() => set("teacherImage", "")} className="text-left text-xs font-semibold text-rose-500">Устгах</button>}
                    </div>
                  </div>
                  <div className="mt-3"><label className="field-label">Багшийн нэр</label><input className="input" value={form.teacherName} onChange={(e) => set("teacherName", e.target.value)} /></div>
                  <div className="mt-3"><label className="field-label">Мэдээлэл (мөр бүрд нэг мэдээлэл)</label><textarea className="textarea" rows={4} placeholder="Үүсгэн байгуулагч, Сургагч багш&#10;Далд ухамсрын шинжээч&#10;..." value={form.teacherInfo} onChange={(e) => set("teacherInfo", e.target.value)} /></div>
                </div>
              )}
            </>
          )}

          {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "Хадгалж байна..." : editingId ? "Засварыг хадгалах" : "Хадгалах"}</button>
            <button type="button" onClick={resetForm} className="btn btn-outline btn-md">Болих</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead className="border-b border-line bg-aqua"><tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Зураг</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Гарчиг</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">{isPromo ? "Холбоос" : "Ангилал"}</th>
            {!isPromo && <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Үнэ</th>}
            <th className="px-4 py-3" />
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">{i.image ? <img src={i.image} alt="" className="h-10 w-14 rounded-lg object-cover" /> : <span className="text-muted">—</span>}</td>
                <td className="px-4 py-3 text-sm font-medium text-ink">{i.title}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{isPromo ? (i.link || "—") : (i.category || "—")}</td>
                {!isPromo && <td className="px-4 py-3 text-sm text-ink/80">{typeof i.price === "number" ? formatMNT(i.price) : "—"}</td>}
                <td className="px-4 py-3 text-right"><div className="flex justify-end gap-3"><button onClick={() => startEdit(i)} className="text-sm font-semibold text-primary-700 hover:underline">Засах</button><button onClick={() => del(i.id)} className="text-sm font-semibold text-rose-500 hover:underline">Устгах</button></div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td className="px-4 py-6 text-sm text-muted" colSpan={5}>Мэдээлэл алга. “+ Мэдээлэл нэмэх” дарж эхлүүлнэ үү.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
