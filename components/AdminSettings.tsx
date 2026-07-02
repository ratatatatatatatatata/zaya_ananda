"use client";

import { useEffect, useState } from "react";

function compressImage(file: File, maxW = 400, quality = 0.85): Promise<string> {
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
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("Зураг буруу байна."));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const EMPTY = { logo: "", aboutTitle: "", aboutBody: "", facebook: "", instagram: "", youtube: "" };

export function AdminSettings() {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.settings) setForm({ ...EMPTY, ...Object.fromEntries(Object.entries(d.settings).filter(([, v]) => v != null)) }); })
      .catch(() => {});
  }, []);

  async function pickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { set("logo", await compressImage(file)); } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setMsg("Хадгаллаа. Шинэ мэдээлэл сайтад тусгагдана.");
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save} className="card max-w-2xl space-y-5 p-6">
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
