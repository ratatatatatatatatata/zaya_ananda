"use client";

import { useEffect, useState } from "react";
import type { StaffMember, BankInfo } from "@/lib/types";

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

export function AdminSettings() {
  const [form, setForm] = useState(EMPTY);
  const [team, setTeam] = useState<StaffMember[]>([]);
  const [bank, setBank] = useState<BankInfo>(EMPTY_BANK);
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
        if (Array.isArray(s.team)) setTeam(s.team);
        if (s.bank) setBank({ ...EMPTY_BANK, ...s.bank });
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
  const updMember = (i: number, patch: Partial<StaffMember>) => setTeam((t) => t.map((m, x) => (x === i ? { ...m, ...patch } : m)));
  async function pickMemberImage(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const file = e.target.files?.[0]; if (!file) return;
    try { updMember(i, { image: await compressImage(file, 500) }); } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(""); setMsg("");
    try {
      const payload = { ...form, team: team.filter((m) => m.name?.trim()), bank };
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

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display font-semibold text-ink">Хамт олон</p>
          <button type="button" onClick={() => setTeam((t) => [...t, { name: "", role: "", info: "", image: "" }])} className="btn btn-outline btn-sm">+ Хүн нэмэх</button>
        </div>
        <div className="space-y-3">
          {team.map((m, i) => (
            <div key={i} className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  {m.image
                    ? <img src={m.image} alt="" className="h-16 w-16 rounded-full object-cover" />
                    : <div className="grid h-16 w-16 place-items-center rounded-full border border-dashed border-line text-xl text-muted">👤</div>}
                  <label className="cursor-pointer text-xs font-semibold text-primary-700 hover:underline">Зураг<input type="file" accept="image/*" className="hidden" onChange={(e) => pickMemberImage(e, i)} /></label>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input className="input" placeholder="Нэр" value={m.name} onChange={(e) => updMember(i, { name: e.target.value })} />
                    <input className="input" placeholder="Албан тушаал" value={m.role || ""} onChange={(e) => updMember(i, { role: e.target.value })} />
                  </div>
                  <textarea className="textarea" rows={2} placeholder="Дэлгэрэнгүй мэдээлэл" value={m.info || ""} onChange={(e) => updMember(i, { info: e.target.value })} />
                </div>
                <button type="button" onClick={() => setTeam((t) => t.filter((_, x) => x !== i))} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
              </div>
            </div>
          ))}
          {team.length === 0 && <p className="text-sm text-muted">Хамт олны мэдээлэл алга. “+ Хүн нэмэх” дарж нэмнэ үү. Эдгээр нь “Бидний тухай” хуудсанд харагдана.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
        <p className="mb-3 font-display font-semibold text-ink">Дансны мэдээлэл (худалдан авалтад харагдана)</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div><label className="field-label">Банк</label><input className="input" value={bank.bankName || ""} onChange={(e) => setBank((b) => ({ ...b, bankName: e.target.value }))} placeholder="Хаан банк" /></div>
          <div><label className="field-label">Дансны дугаар</label><input className="input" value={bank.account || ""} onChange={(e) => setBank((b) => ({ ...b, account: e.target.value }))} placeholder="5304611250" /></div>
          <div><label className="field-label">Хүлээн авагч</label><input className="input" value={bank.holder || ""} onChange={(e) => setBank((b) => ({ ...b, holder: e.target.value }))} placeholder="Заяа Бат-Эрдэнэ" /></div>
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
