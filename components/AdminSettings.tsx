"use client";

import { useEffect, useState } from "react";
import type { BankInfo } from "@/lib/types";

function compressImage(file: File, maxW = 800, quality = 0.85): Promise<string> {
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

const EMPTY = { logo: "", aboutTitle: "", aboutBody: "", aboutVideo: "", facebook: "", instagram: "", youtube: "" };
const EMPTY_BANK: BankInfo = { bankName: "", account: "", holder: "" };

type ContactInfo = { phone: string; email: string; address: string; hours: string; mapQuery: string };
const EMPTY_CONTACT: ContactInfo = { phone: "", email: "", address: "", hours: "", mapQuery: "" };

export function AdminSettings() {
  const [form, setForm] = useState(EMPTY);
  const [bank, setBank] = useState<BankInfo>(EMPTY_BANK);
  const [contact, setContact] = useState<ContactInfo>(EMPTY_CONTACT);
  const [prepay, setPrepay] = useState("");
  const [moods, setMoods] = useState<{ key: string; emoji: string; label: string }[]>([]);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.settings) return;
        const s = d.settings;
        setForm({
          logo: s.logo || "", aboutTitle: s.aboutTitle || "", aboutBody: s.aboutBody || "", aboutVideo: s.aboutVideo || "",
          facebook: s.facebook || "", instagram: s.instagram || "", youtube: s.youtube || "",
        });
        if (s.bank) setBank({ ...EMPTY_BANK, ...s.bank });
        if (s.contact) setContact({ ...EMPTY_CONTACT, ...s.contact });
        if (s.servicePrepay) setPrepay(String(s.servicePrepay));
        if (Array.isArray(s.customMoods)) setMoods(s.customMoods);
      })
      .catch(() => {});
  }, []);

  async function pickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { set("logo", await compressImage(file, 400)); } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
  }
  async function pickAboutVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setErr(""); setVideoProgress(0);
    try { const path = await uploadVideo(file, setVideoProgress); set("aboutVideo", path); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Видео байршуулахад алдаа."); }
    finally { setVideoProgress(null); }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(""); setMsg("");
    try {
      const payload = { ...form, bank, contact, servicePrepay: Number(prepay) || 0, customMoods: moods };
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setMsg("Хадгаллаа. Шинэ мэдээлэл сайтад тусгагдана.");
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Сайтын тохиргоо</h2>

      <div>
        <label className="field-label">Лого</label>
        <div className="flex items-center gap-3">
          {form.logo
            ? <img src={form.logo} alt="" className="h-16 w-16 rounded-2xl border border-line object-cover" />
            : <div className="grid h-16 w-16 place-items-center rounded-2xl border border-dashed border-line text-2xl text-muted">✶</div>}
          <div className="flex flex-col gap-1">
            <input type="file" accept="image/*" onChange={pickLogo} className="text-sm" />
            {form.logo && <button type="button" onClick={() => set("logo", "")} className="text-left text-xs font-semibold text-rose-500">Устгах (өгөгдмөл лого руу буцаана)</button>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="mb-3 font-display font-semibold text-ink">Бидний тухай</p>
        <div><label className="field-label">Гарчиг</label><input className="input" value={form.aboutTitle} onChange={(e) => set("aboutTitle", e.target.value)} placeholder="Жишээ: Бидний тухай" /></div>
        <div className="mt-3"><label className="field-label">Дэлгэрэнгүй</label><textarea className="textarea" rows={6} value={form.aboutBody} onChange={(e) => set("aboutBody", e.target.value)} placeholder="Төвийн тухай мэдээлэл…" /></div>
        <div className="mt-3">
          <label className="field-label">Танилцуулга видео</label>
          {form.aboutVideo
            ? <div className="flex items-center gap-3"><span className="text-sm font-medium text-jade-600">✓ Видео орсон</span><button type="button" onClick={() => set("aboutVideo", "")} className="text-xs font-semibold text-rose-500 hover:underline">Устгах</button></div>
            : videoProgress !== null
            ? <div className="flex items-center gap-3"><span className="text-sm font-medium text-primary-700">Байршуулж байна… {videoProgress}%</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full bg-primary-500 transition-all" style={{ width: videoProgress + "%" }} /></div></div>
            : <input type="file" accept="video/*" onChange={pickAboutVideo} className="text-sm" />}
          <p className="mt-1 text-xs text-muted">Видео нь “Бидний тухай” хуудсанд харагдана.</p>
        </div>
      </div>

      <p className="rounded-xl bg-aqua px-4 py-2.5 text-sm text-muted">ℹ️ Нүүр хуудасны <b>зурхайн төрөл</b> болон <b>тайллын алгоритмыг</b> зүүн цэсний <b>«Зурхай»</b> таб дээр удирдана.</p>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display font-semibold text-ink">Сэтгэлийн туяа — нэмэлт мэдрэмжүүд</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Системийн үндсэн 9 мэдрэмж дээр нэмж өөрийн мэдрэмж үүсгэнэ. Энд нэмсэн мэдрэмж «Сэтгэлийн туяа» хэсэг
              болон контент нэмэх хуудсанд шууд гарч ирнэ.
            </p>
          </div>
          <button type="button" onClick={() => setMoods((m) => [...m, { key: "mood-" + (m.length + 1), emoji: "✨", label: "" }])} className="btn btn-outline btn-sm">
            + Мэдрэмж нэмэх
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {moods.map((m, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface-1 px-3 py-2.5">
              <input className="input w-16 text-center" value={m.emoji} maxLength={4}
                onChange={(e) => setMoods((z) => z.map((x, k) => (k === i ? { ...x, emoji: e.target.value } : x)))} />
              <input className="input min-w-[12rem] flex-1" placeholder="Мэдрэмжийн нэр — ж: Урам хугарсан" value={m.label}
                onChange={(e) => setMoods((z) => z.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
              <input className="input w-40" placeholder="Түлхүүр (латинаар)" value={m.key}
                onChange={(e) => setMoods((z) => z.map((x, k) => (k === i ? { ...x, key: e.target.value.trim() } : x)))} />
              <button type="button" onClick={() => setMoods((z) => z.filter((_, k) => k !== i))} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">
                Устгах
              </button>
            </div>
          ))}
          {moods.length === 0 && <p className="text-sm text-muted">Одоогоор нэмэлт мэдрэмж алга — үндсэн 9 мэдрэмж ажиллаж байна.</p>}
        </div>
      </div>

      <p className="rounded-xl bg-aqua px-4 py-2.5 text-sm text-muted">ℹ️ Хуудас бүрийн <b>толгойн дэвсгэр</b> (видео/зураг)-ийг зүүн цэсний <b>«Цэс / Шинэ хуудас»</b> таб дээр тухайн хуудсан дээр нь шууд солино.</p>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="mb-3 font-display font-semibold text-ink">Дансны мэдээлэл (худалдан авалтад харагдана)</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div><label className="field-label">Банк</label><input className="input" value={bank.bankName || ""} onChange={(e) => setBank((b) => ({ ...b, bankName: e.target.value }))} placeholder="Хаан банк" /></div>
          <div><label className="field-label">Дансны дугаар</label><input className="input" value={bank.account || ""} onChange={(e) => setBank((b) => ({ ...b, account: e.target.value }))} placeholder="5304611250" /></div>
          <div><label className="field-label">Хүлээн авагч</label><input className="input" value={bank.holder || ""} onChange={(e) => setBank((b) => ({ ...b, holder: e.target.value }))} placeholder="Заяа Бат-Эрдэнэ" /></div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="font-display font-semibold text-ink">Энергийн заслын урьдчилгаа төлбөр</p>
        <p className="mb-3 mt-1 text-xs leading-relaxed text-muted">
          Цаг захиалахад шаардах урьдчилгаа дүн. Захиалагчид дансны мэдээлэл, гүйлгээний утга харагдана.
          <b className="text-ink"> 0</b> бол урьдчилгаа авахгүй.
        </p>
        <div className="max-w-xs">
          <label className="field-label">Урьдчилгаа дүн (₮)</label>
          <input className="input" inputMode="numeric" value={prepay}
            onChange={(e) => setPrepay(e.target.value.replace(/[^\d]/g, ""))} placeholder="20000" />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="font-display font-semibold text-ink">Холбоо барих мэдээлэл</p>
        <p className="mb-3 mt-1 text-xs leading-relaxed text-muted">
          Энд оруулсан мэдээлэл нүүр хуудасны «Бидний тухай», сүнслэг аяллын хуудас болон холбоо барих хэсэгт харагдана.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label">Утас</label>
            <input className="input" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} placeholder="+976 9900 0000" />
          </div>
          <div>
            <label className="field-label">Имэйл</label>
            <input className="input" type="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} placeholder="info@zayasananda.mn" />
          </div>
        </div>
        <div className="mt-3">
          <label className="field-label">Хаяг</label>
          <textarea className="textarea" rows={2} value={contact.address} onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
            placeholder="Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо…" />
        </div>
        <div className="mt-3">
          <label className="field-label">Ажиллах цаг</label>
          <input className="input" value={contact.hours} onChange={(e) => setContact((c) => ({ ...c, hours: e.target.value }))}
            placeholder="Да–Ба: 10:00–18:00 · Бя–Ня: амарна" />
        </div>
        <div className="mt-3">
          <label className="field-label">Газрын зургийн хайлт</label>
          <input className="input" value={contact.mapQuery} onChange={(e) => setContact((c) => ({ ...c, mapQuery: e.target.value }))}
            placeholder="Zaya's Ananda, Ulaanbaatar" />
          <p className="mt-1 text-xs text-muted">Google Maps дээр хайх нэр эсвэл хаяг. Хоосон бол газрын зураг харагдахгүй.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="mb-3 font-display font-semibold text-ink">Сошиал хаяг</p>
        <div><label className="field-label">Facebook</label><input className="input" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/..." /></div>
        <div className="mt-3"><label className="field-label">Instagram</label><input className="input" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/..." /></div>
        <div className="mt-3"><label className="field-label">YouTube</label><input className="input" value={form.youtube} onChange={(e) => set("youtube", e.target.value)} placeholder="https://youtube.com/..." /></div>
      </div>

      {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
      {msg && <p className="rounded-xl bg-jade-400/10 px-4 py-2 text-sm text-jade-600">{msg}</p>}
      <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "Хадгалж байна..." : "Хадгалах"}</button>
    </form>
  );
}
