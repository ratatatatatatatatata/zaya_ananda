"use client";

import { useEffect, useState } from "react";

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

/** "Бидний тухай" хуудасны бүх агуулга — гарчиг/дэлгэрэнгүй/видео, эрхэм зорилго, түүх,
 *  тоо баримт, үнэт зүйлс, түгээмэл асуултууд. Тус бүрийг хоосон орхивол data/content.ts-ийн
 *  өгөгдмөл (олон хэлтэй) агуулга харагдсаар байна. */
export function AdminAbout() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [video, setVideo] = useState("");
  const [mission, setMission] = useState("");
  const [story, setStory] = useState("");
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [values, setValues] = useState<{ glyph: string; title: string; text: string }[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.settings) return;
        const s = d.settings;
        setTitle(s.aboutTitle || ""); setBody(s.aboutBody || ""); setVideo(s.aboutVideo || "");
        setMission(s.aboutMission || ""); setStory(s.aboutStory || "");
        if (Array.isArray(s.aboutStats)) setStats(s.aboutStats);
        if (Array.isArray(s.aboutValues)) setValues(s.aboutValues);
        if (Array.isArray(s.aboutFaqs)) setFaqs(s.aboutFaqs);
      })
      .catch(() => {});
  }, []);

  async function pickVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setErr(""); setVideoProgress(0);
    try { const path = await uploadVideo(file, setVideoProgress); setVideo(path); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Видео байршуулахад алдаа."); }
    finally { setVideoProgress(null); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(""); setMsg("");
    try {
      const payload = {
        aboutTitle: title, aboutBody: body, aboutVideo: video,
        aboutMission: mission, aboutStory: story, aboutStats: stats, aboutValues: values, aboutFaqs: faqs,
      };
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setMsg("Хадгаллаа. Шинэ мэдээлэл сайтад тусгагдана.");
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Бидний тухай</h2>
        <p className="mt-1 text-sm text-muted">Энд оруулсан мэдээлэл нүүр хуудас болон «Бидний тухай» бүтэн хуудсанд харагдана. Хоосон орхивол өгөгдмөл агуулга харагдсаар байна.</p>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="mb-3 font-display font-semibold text-ink">Танилцуулга</p>
        <div><label className="field-label">Гарчиг</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Жишээ: Бидний тухай" /></div>
        <div className="mt-3"><label className="field-label">Дэлгэрэнгүй</label><textarea className="textarea" rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Төвийн тухай мэдээлэл…" /></div>
        <div className="mt-3">
          <label className="field-label">Танилцуулга видео</label>
          {video
            ? <div className="flex items-center gap-3"><span className="text-sm font-medium text-jade-600">✓ Видео орсон</span><button type="button" onClick={() => setVideo("")} className="text-xs font-semibold text-rose-500 hover:underline">Устгах</button></div>
            : videoProgress !== null
            ? <div className="flex items-center gap-3"><span className="text-sm font-medium text-primary-700">Байршуулж байна… {videoProgress}%</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full bg-primary-500 transition-all" style={{ width: videoProgress + "%" }} /></div></div>
            : <input type="file" accept="video/*" onChange={pickVideo} className="text-sm" />}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="mb-3 font-display font-semibold text-ink">Эрхэм зорилго ба түүх</p>
        <div><label className="field-label">Эрхэм зорилго</label><textarea className="textarea" rows={3} value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Хоосон орхивол өгөгдмөл (олон хэлтэй) текст харагдана." /></div>
        <div className="mt-3"><label className="field-label">Түүх / танилцуулга</label><textarea className="textarea" rows={3} value={story} onChange={(e) => setStory(e.target.value)} placeholder="Хоосон орхивол өгөгдмөл (олон хэлтэй) текст харагдана." /></div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display font-semibold text-ink">Тоо, баримт</p>
          <button type="button" onClick={() => setStats((a) => [...a, { value: "", label: "" }])} className="btn btn-outline btn-sm">+ Нэмэх</button>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted">Хоосон орхивол өгөгдмөл 4 тоо (жилийн туршлага, үйлчлүүлэгч гэх мэт) харагдана.</p>
        <div className="mt-3 space-y-2.5">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface-1 px-3 py-2.5">
              <input className="input w-28" placeholder="10+" value={s.value} onChange={(e) => setStats((a) => a.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)))} />
              <input className="input min-w-[12rem] flex-1" placeholder="жилийн туршлага" value={s.label} onChange={(e) => setStats((a) => a.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
              <button type="button" onClick={() => setStats((a) => a.filter((_, k) => k !== i))} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
            </div>
          ))}
          {stats.length === 0 && <p className="text-sm text-muted">Одоогоор нэмээгүй — өгөгдмөл 4 тоо ажиллаж байна.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display font-semibold text-ink">Үнэт зүйлс</p>
          <button type="button" onClick={() => setValues((a) => [...a, { glyph: "✶", title: "", text: "" }])} className="btn btn-outline btn-sm">+ Нэмэх</button>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted">Хоосон орхивол өгөгдмөл 4 үнэт зүйл (хүндлэл, аюулгүй байдал гэх мэт) харагдана.</p>
        <div className="mt-3 space-y-2.5">
          {values.map((v, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-line bg-surface-1 px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <input className="input w-16 text-center" maxLength={4} value={v.glyph} onChange={(e) => setValues((a) => a.map((x, k) => (k === i ? { ...x, glyph: e.target.value } : x)))} />
                <input className="input min-w-[10rem] flex-1" placeholder="Гарчиг — ж: Хүндлэл" value={v.title} onChange={(e) => setValues((a) => a.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} />
                <button type="button" onClick={() => setValues((a) => a.filter((_, k) => k !== i))} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
              </div>
              <textarea className="textarea" rows={2} placeholder="Тайлбар" value={v.text} onChange={(e) => setValues((a) => a.map((x, k) => (k === i ? { ...x, text: e.target.value } : x)))} />
            </div>
          ))}
          {values.length === 0 && <p className="text-sm text-muted">Одоогоор нэмээгүй — өгөгдмөл 4 үнэт зүйл ажиллаж байна.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display font-semibold text-ink">Түгээмэл асуултууд</p>
          <button type="button" onClick={() => setFaqs((a) => [...a, { q: "", a: "" }])} className="btn btn-outline btn-sm">+ Нэмэх</button>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted">Хоосон орхивол өгөгдмөл асуулт-хариултууд харагдана.</p>
        <div className="mt-3 space-y-2.5">
          {faqs.map((f, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-line bg-surface-1 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <input className="input flex-1" placeholder="Асуулт" value={f.q} onChange={(e) => setFaqs((a) => a.map((x, k) => (k === i ? { ...x, q: e.target.value } : x)))} />
                <button type="button" onClick={() => setFaqs((a) => a.filter((_, k) => k !== i))} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
              </div>
              <textarea className="textarea" rows={2} placeholder="Хариулт" value={f.a} onChange={(e) => setFaqs((a) => a.map((x, k) => (k === i ? { ...x, a: e.target.value } : x)))} />
            </div>
          ))}
          {faqs.length === 0 && <p className="text-sm text-muted">Одоогоор нэмээгүй — өгөгдмөл асуулт-хариултууд ажиллаж байна.</p>}
        </div>
      </div>

      <p className="rounded-xl bg-aqua px-4 py-2.5 text-sm text-muted">ℹ️ «Хамт олон» (багш нар)-ыг зүүн цэсний <b>«Хамт олон»</b> таб дээр удирдана.</p>

      {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
      {msg && <p className="rounded-xl bg-jade-400/10 px-4 py-2 text-sm text-jade-600">{msg}</p>}
      <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "Хадгалж байна..." : "Хадгалах"}</button>
    </form>
  );
}
