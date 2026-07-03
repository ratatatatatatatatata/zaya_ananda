"use client";

import { useEffect, useState } from "react";
import type { TeacherPreset } from "@/lib/types";

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

/** "Удирдагч багш нар" цэсэнд харагдах багш нарын профайлыг удирдана. */
export function AdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherPreset[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d?.settings?.teachers)) setTeachers(d.settings.teachers); })
      .catch(() => {});
  }, []);

  const upd = (i: number, patch: Partial<TeacherPreset>) => setTeachers((t) => t.map((m, x) => (x === i ? { ...m, ...patch } : m)));
  async function pickImage(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const file = e.target.files?.[0]; if (!file) return;
    try { upd(i, { image: await compressImage(file) }); } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
  }

  async function save() {
    setSaving(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teachers: teachers.filter((t) => t.name?.trim()) }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setMsg("Хадгаллаа. «Удирдагч багш нар» хуудсанд шинэчлэгдэнэ.");
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Удирдагч багш нар: {teachers.length}</h2>
          <p className="mt-1 text-sm text-muted">Эдгээр профайл «Удирдагч багш нар» цэсэнд гарна. Багш дээр дарахад түүний хөтөлдөг хичээлүүд (контентын «Багшийн нэр»-ээр таарсан) автоматаар харагдана.</p>
        </div>
        <button onClick={() => setTeachers((t) => [...t, { name: "", role: "", info: "", image: "" }])} className="btn btn-primary btn-sm">+ Багш нэмэх</button>
      </div>

      <div className="space-y-3">
        {teachers.map((t, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                {t.image
                  ? <img src={t.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                  : <div className="grid h-24 w-24 place-items-center rounded-2xl border border-dashed border-line text-2xl text-muted">👤</div>}
                <label className="cursor-pointer text-xs font-semibold text-primary-700 hover:underline">Зураг<input type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e, i)} /></label>
              </div>
              <div className="flex-1 space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div><label className="field-label">Нэр *</label><input className="input" value={t.name} onChange={(e) => upd(i, { name: e.target.value })} /></div>
                  <div><label className="field-label">Албан тушаал / чиглэл</label><input className="input" value={t.role || ""} onChange={(e) => upd(i, { role: e.target.value })} placeholder="Жишээ: Энерги засалч, Багш" /></div>
                </div>
                <div><label className="field-label">Дэлгэрэнгүй (мөр бүрд нэг мэдээлэл)</label><textarea className="textarea" rows={3} value={t.info || ""} onChange={(e) => upd(i, { info: e.target.value })} placeholder="Үүсгэн байгуулагч, Сургагч багш&#10;Далд ухамсрын шинжээч" /></div>
              </div>
              <button type="button" onClick={() => { if (confirm("Энэ багшийг устгах уу?")) setTeachers((ts) => ts.filter((_, x) => x !== i)); }} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
            </div>
          </div>
        ))}
        {teachers.length === 0 && <p className="rounded-2xl border border-dashed border-line bg-white/60 px-5 py-10 text-center text-sm text-muted">Багш алга. «+ Багш нэмэх» дарж нэмнэ үү. (Контент хадгалахад багшийн мэдээлэл энд автоматаар нэмэгддэг.)</p>}
      </div>

      {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
      {msg && <p className="rounded-xl bg-jade-400/10 px-4 py-2 text-sm text-jade-600">{msg}</p>}
      <button onClick={save} disabled={saving} className="btn btn-primary btn-md">{saving ? "Хадгалж байна..." : "Хадгалах"}</button>
    </div>
  );
}
