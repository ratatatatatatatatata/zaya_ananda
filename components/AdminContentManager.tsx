"use client";

import { useCallback, useEffect, useState } from "react";
import { formatMNT } from "@/lib/format";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SERVICE_GROUPS, COURSE_CATS, MOODS } from "@/data/cms-taxonomy";
import type { CmsItem, TeacherPreset, CmsTranslations } from "@/lib/types";

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

const EMPTY = { title: "", category: "", summary: "", body: "", price: "", mode: "online", link: "", videoLessons: "", students: "", views: "", teacherName: "", teacherImage: "", teacherRole: "", teacherInfo: "", accessDays: "" };

const LANG_TABS = [
  { k: "mn" as const, l: "🇲🇳 Монгол" },
  { k: "en" as const, l: "🇬🇧 English" },
  { k: "ko" as const, l: "🇰🇷 한국어" },
  { k: "ja" as const, l: "🇯🇵 日本語" },
  { k: "zh" as const, l: "🇨🇳 中文" },
];
type TrLang = "en" | "ko" | "ja" | "zh";

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

const MAX_IMAGES = 3;

export function AdminContentManager({ kind }: { kind: CmsItem["kind"] }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState<string[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherPreset[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<"mn" | TrLang>("mn");
  const [i18n, setI18n] = useState<CmsTranslations>({});
  const [moods, setMoods] = useState<string[]>([]);
  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setTr = (l: TrLang, field: "title" | "body", v: string) =>
    setI18n((prev) => ({ ...prev, [l]: { ...(prev[l] || {}), [field]: v } }));

  const load = useCallback(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems((d.items || []).filter((i: CmsItem) => i.kind === kind)))
      .catch(() => {});
  }, [kind]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d?.settings?.teachers)) setTeachers(d.settings.teachers); })
      .catch(() => {});
  }, [open]);

  const multiImage = kind === "product";

  async function addImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const datas: string[] = [];
      for (const f of files.slice(0, MAX_IMAGES)) datas.push(await compressImage(f));
      setImages((prev) => (multiImage ? [...prev, ...datas].slice(0, MAX_IMAGES) : [datas[0]]));
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
    e.target.value = "";
  }
  async function pickTeacherImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { const data = await compressImage(file); set("teacherImage", data); }
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

  function applyTeacher(name: string) {
    const t = teachers.find((x) => x.name === name);
    if (!t) return;
    setForm((f) => ({ ...f, teacherName: t.name, teacherImage: t.image || "", teacherRole: t.role || "", teacherInfo: t.info || "" }));
  }

  function resetForm() { setForm(EMPTY); setImages([]); setLessons([]); setI18n({}); setMoods([]); setLangTab("mn"); setEditingId(null); setErr(""); setOpen(false); }
  function startNew() { setForm(EMPTY); setImages([]); setLessons([]); setI18n({}); setMoods([]); setLangTab("mn"); setEditingId(null); setErr(""); setOpen(true); }
  function startEdit(it: CmsItem) {
    setForm({
      title: it.title || "", category: it.category || "", summary: it.summary || "", body: it.body || "",
      price: it.price != null ? String(it.price) : "", mode: it.mode || "online", link: it.link || "",
      videoLessons: it.videoLessons != null ? String(it.videoLessons) : "",
      students: it.students != null ? String(it.students) : "", views: it.views != null ? String(it.views) : "",
      teacherName: it.teacherName || "", teacherImage: it.teacherImage || "",
      teacherRole: teachers.find((t) => t.name === it.teacherName)?.role || "", teacherInfo: it.teacherInfo || "",
      accessDays: it.accessDays != null ? String(it.accessDays) : "",
    });
    setImages(it.images && it.images.length ? it.images.slice(0, MAX_IMAGES) : it.image ? [it.image] : []);
    setI18n(it.i18n || {});
    setMoods(it.moods || []);
    setLangTab("mn");
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
      image: images[0] || "",
      images,
      i18n,
      moods,
      mode: kind === "course" ? form.mode : undefined,
      lessons: lessons.filter((l) => l.title.trim() && l.path).map((l) => ({ title: l.title.trim(), path: l.path, quality: l.quality, subtitles: l.subtitles || "" })),
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
  const isFree = kind === "free";
  const hasTeacher = kind === "course" || kind === "service";
  const hasMoods = kind === "course" || kind === "resource" || kind === "free";
  const catOptions: { group?: string; opts: string[] }[] =
    kind === "service" ? SERVICE_GROUPS.map((g) => ({ group: g.group, opts: g.subs }))
    : kind === "course" ? [{ opts: COURSE_CATS }]
    : kind === "resource" ? [{ opts: ["Зөвлөгөө", "Видео зөвлөгөө"] }]
    : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Нийт: {items.length}</h2>
        <button onClick={() => (open ? resetForm() : startNew())} className="btn btn-primary btn-sm">{open ? "Болих" : "+ Мэдээлэл нэмэх"}</button>
      </div>

      {open && (
        <form onSubmit={save} className="card space-y-4 p-5">
          {editingId && <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">Засварлаж байна</p>}

          {/* Зураг + видео зэрэгцээ */}
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
              <p className="mb-2 font-display font-semibold text-ink">
                {isPromo ? "Баннер зураг" : multiImage ? "Зураг (1–3 ширхэг)" : "Нүүр зураг"}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className={"rounded-xl object-cover " + (isPromo ? "h-20 w-40" : "h-24 w-32")} />
                    <button type="button" onClick={() => setImages((arr) => arr.filter((_, x) => x !== i))}
                      className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-xs font-bold text-white shadow">✕</button>
                    {i === 0 && images.length > 1 && <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">Нүүр</span>}
                  </div>
                ))}
                {(multiImage ? images.length < MAX_IMAGES : images.length === 0) && (
                  <label className={"grid cursor-pointer place-items-center rounded-xl border border-dashed border-line text-2xl text-muted hover:bg-white " + (isPromo ? "h-20 w-40" : "h-24 w-32")}>
                    🖼+
                    <input type="file" accept="image/*" multiple={multiImage} onChange={addImage} className="hidden" />
                  </label>
                )}
              </div>
              {multiImage && <p className="mt-2 text-xs text-muted">Эхний зураг нүүр зураг болно. Дэлгэрэнгүй хуудсанд бүх зураг харагдаж, дарахад томорно.</p>}
            </div>

            <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display font-semibold text-ink">{isCourse ? "Видео хичээлүүд" : "Видео"} <span className="text-sm font-normal text-muted">({lessons.length})</span></p>
                <button type="button" onClick={() => setLessons((ls) => [...ls, { title: "", path: "", quality: "1080p" }])} className="btn btn-outline btn-sm">{isCourse ? "+ Хичээл нэмэх" : "+ Видео нэмэх"}</button>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted">{isCourse ? "Видео зөвхөн төлбөр баталгаажсан хэрэглэгчид харагдана." : "Видео дэлгэрэнгүй хуудсанд нээлттэй харагдана."}</p>
              <div className="space-y-2">
                {lessons.map((l, idx) => (
                  <div key={idx} className="space-y-2 rounded-xl border border-line bg-white p-3">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{idx + 1}</span>
                      <input className="input flex-1" placeholder={isCourse ? "Хичээлийн гарчиг" : "Видеоны гарчиг"} value={l.title} onChange={(e) => updLesson(idx, { title: e.target.value })} />
                      <select className="input w-28 shrink-0" value={l.quality} onChange={(e) => updLesson(idx, { quality: e.target.value })}>
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
                {lessons.length === 0 && <p className="text-sm text-muted">Одоогоор видео алга. {isCourse ? "“+ Хичээл нэмэх”" : "“+ Видео нэмэх”"} дарж нэмнэ үү.</p>}
              </div>
            </div>
          </div>

          {/* Хэлний таб — гарчиг, дэлгэрэнгүй мэдээллийг хэл бүрээр оруулна */}
          <div className="flex flex-wrap gap-1.5">
            {LANG_TABS.map((lt) => (
              <button key={lt.k} type="button" onClick={() => setLangTab(lt.k)}
                className={"rounded-full px-3.5 py-1.5 text-sm font-semibold transition " + (langTab === lt.k ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-white text-ink/60 hover:text-primary-700")}>
                {lt.l}
              </button>
            ))}
          </div>
          {langTab !== "mn" && <p className="rounded-lg bg-aqua px-3 py-1.5 text-xs text-muted">Энэ хэл дээрх орчуулгаа оруулна уу. Хоосон орхивол монгол хувилбар нь харагдана.</p>}

          <div>
            <label className="field-label">Гарчиг {langTab === "mn" ? "*" : "(" + langTab.toUpperCase() + ")"}</label>
            {langTab === "mn"
              ? <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
              : <input className="input" placeholder={form.title} value={i18n[langTab]?.title || ""} onChange={(e) => setTr(langTab, "title", e.target.value)} />}
          </div>

          {isPromo ? (
            <div><label className="field-label">Холбоос (заавал биш)</label><input className="input" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://... эсвэл /courses" /></div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {catOptions.length > 0 && (
                  <div>
                    <label className="field-label">Ангилал</label>
                    <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
                      <option value="">— Сонгох —</option>
                      {catOptions.map((g, gi) =>
                        g.group
                          ? <optgroup key={gi} label={g.group}>{g.opts.map((c) => <option key={c} value={c}>{c}</option>)}</optgroup>
                          : g.opts.map((c) => <option key={c} value={c}>{c}</option>)
                      )}
                    </select>
                  </div>
                )}
                {kind !== "resource" && !isFree && <div><label className="field-label">Үнэ (₮)</label><input className="input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></div>}
                {isCourse && <div><label className="field-label">Хэлбэр</label><select className="input" value={form.mode} onChange={(e) => set("mode", e.target.value)}><option value="online">Онлайн сургалт</option><option value="tankhim">Танхимын сургалт</option><option value="both">Онлайн + Танхим</option></select></div>}
              </div>

              {hasMoods && (
                <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
                  <p className="mb-1 font-display font-semibold text-ink">Сэтгэлийн туяа (мүүд)</p>
                  <p className="mb-3 text-xs text-muted">Энэ контент ямар сэтгэл санаатай хүнд тохирохыг сонговол “Сэтгэлийн туяа” хуудсанд санал болгогдоно.</p>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button key={m.key} type="button"
                        onClick={() => setMoods((ms) => (ms.includes(m.key) ? ms.filter((x) => x !== m.key) : [...ms, m.key]))}
                        className={"rounded-full px-3.5 py-1.5 text-sm font-medium transition " + (moods.includes(m.key) ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-white text-ink/70 hover:border-primary-300")}>
                        {m.emoji} {m.label.mn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isCourse && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div><label className="field-label">Суралцагчийн тоо</label><input className="input" type="number" value={form.students} onChange={(e) => set("students", e.target.value)} /></div>
                  <div><label className="field-label">Үзсэн тоо</label><input className="input" type="number" value={form.views} onChange={(e) => set("views", e.target.value)} /></div>
                  <div><label className="field-label">Хандах хугацаа (хоног)</label><input className="input" type="number" value={form.accessDays} onChange={(e) => set("accessDays", e.target.value)} placeholder="жишээ: 30" /></div>
                </div>
              )}

              <div>
                <label className="field-label">Дэлгэрэнгүй мэдээлэл {langTab !== "mn" && "(" + langTab.toUpperCase() + ")"}</label>
                {langTab === "mn"
                  ? <RichTextEditor key="mn" value={form.body} onChange={(html) => set("body", html)} />
                  : <RichTextEditor key={langTab} value={i18n[langTab]?.body || ""} onChange={(html) => setTr(langTab, "body", html)} />}
              </div>

              {hasTeacher && (
                <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display font-semibold text-ink">Заах багшийн мэдээлэл</p>
                    {teachers.length > 0 && (
                      <select className="input w-56" value="" onChange={(e) => applyTeacher(e.target.value)}>
                        <option value="">— Өмнөх багш сонгох —</option>
                        {teachers.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {form.teacherImage
                      ? <img src={form.teacherImage} alt="" className="h-20 w-20 rounded-full object-cover" />
                      : <div className="grid h-20 w-20 place-items-center rounded-full border border-dashed border-line text-xl text-muted">👤</div>}
                    <div className="flex flex-col gap-1">
                      <input type="file" accept="image/*" onChange={pickTeacherImage} className="text-sm" />
                      {form.teacherImage && <button type="button" onClick={() => set("teacherImage", "")} className="text-left text-xs font-semibold text-rose-500">Устгах</button>}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div><label className="field-label">Багшийн нэр</label><input className="input" value={form.teacherName} onChange={(e) => set("teacherName", e.target.value)} /></div>
                    <div><label className="field-label">Албан тушаал / чиглэл</label><input className="input" value={form.teacherRole} onChange={(e) => set("teacherRole", e.target.value)} placeholder="Жишээ: Энерги засалч, Багш" /></div>
                  </div>
                  <div className="mt-3"><label className="field-label">Мэдээлэл (мөр бүрд нэг мэдээлэл)</label><textarea className="textarea" rows={4} placeholder="Үүсгэн байгуулагч, Сургагч багш&#10;Далд ухамсрын шинжээч&#10;..." value={form.teacherInfo} onChange={(e) => set("teacherInfo", e.target.value)} /></div>
                  <p className="mt-2 text-xs text-muted">Багшийн мэдээлэл автоматаар хадгалагдаж, дараагийн удаад дээрх жагсаалтаас сонгож болно.</p>
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
            {isPromo && <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Холбоос</th>}
            {!isPromo && <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Үнэ</th>}
            <th className="px-4 py-3" />
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">{i.image ? <img src={i.image} alt="" className="h-10 w-14 rounded-lg object-cover" /> : <span className="text-muted">—</span>}</td>
                <td className="px-4 py-3 text-sm font-medium text-ink">{i.title}</td>
                {isPromo && <td className="px-4 py-3 text-sm text-ink/80">{i.link || "—"}</td>}
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
