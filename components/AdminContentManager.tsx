"use client";

import { useCallback, useEffect, useState } from "react";
import { formatMNT } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

function compressImage(file: File, maxW = 900, quality = 0.82): Promise<string> {
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

const EMPTY = { title: "", category: "", summary: "", body: "", price: "", mode: "online", image: "", videoLessons: "", students: "", views: "", teacherName: "", teacherImage: "", teacherInfo: "", accessDays: "" };

export function AdminContentManager({ kind }: { kind: CmsItem["kind"] }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(EMPTY);
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

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setErr("Гарчиг оруулна уу."); return; }
    setSaving(true); setErr("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...form, mode: kind === "course" ? form.mode : undefined }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setForm(EMPTY); setOpen(false); load();
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }
  async function del(id: string) {
    if (!confirm("Энэ мэдээллийг устгах уу?")) return;
    await fetch("/api/admin/content?id=" + id, { method: "DELETE" }); load();
  }

  const isCourse = kind === "course";
  const hasTeacher = kind === "course" || kind === "service";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Нийт: {items.length}</h2>
        <button onClick={() => setOpen((o) => !o)} className="btn btn-primary btn-sm">{open ? "Болих" : "+ Мэдээлэл нэмэх"}</button>
      </div>

      {open && (
        <form onSubmit={add} className="card space-y-4 p-5">
          {/* main image */}
          <div>
            <label className="field-label">Нүүр зураг</label>
            <div className="flex items-center gap-3">
              {form.image
                ? <img src={form.image} alt="" className="h-20 w-28 rounded-xl object-cover" />
                : <div className="grid h-20 w-28 place-items-center rounded-xl border border-dashed border-line text-2xl text-muted">🖼</div>}
              <div className="flex flex-col gap-1">
                <input type="file" accept="image/*" onChange={(e) => pickImage(e, "image")} className="text-sm" />
                {form.image && <button type="button" onClick={() => set("image", "")} className="text-left text-xs font-semibold text-rose-500">Устгах</button>}
              </div>
            </div>
          </div>

          <div><label className="field-label">Гарчиг *</label><input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="field-label">Ангилал</label><input className="input" value={form.category} onChange={(e) => set("category", e.target.value)} /></div>
            {kind !== "resource" && <div><label className="field-label">Үнэ (₮)</label><input className="input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></div>}
            {isCourse && <div><label className="field-label">Хэлбэр</label><select className="input" value={form.mode} onChange={(e) => set("mode", e.target.value)}><option value="online">Онлайн сургалт</option><option value="tankhim">Танхимын сургалт</option><option value="both">Онлайн + Танхим</option></select></div>}
          </div>

          {isCourse && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className="field-label">Видео хичээлийн тоо</label><input className="input" type="number" value={form.videoLessons} onChange={(e) => set("videoLessons", e.target.value)} /></div>
              <div><label className="field-label">Суралцагчийн тоо</label><input className="input" type="number" value={form.students} onChange={(e) => set("students", e.target.value)} /></div>
              <div><label className="field-label">Үзсэн тоо</label><input className="input" type="number" value={form.views} onChange={(e) => set("views", e.target.value)} /></div>
              <div><label className="field-label">Хандах хугацаа (хоног)</label><input className="input" type="number" value={form.accessDays} onChange={(e) => set("accessDays", e.target.value)} placeholder="жишээ: 30" /></div>
            </div>
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

          {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "Хадгалж байна..." : "Хадгалах"}</button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead className="border-b border-line bg-aqua"><tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Зураг</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Гарчиг</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Ангилал</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Үнэ</th>
            <th className="px-4 py-3" />
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">{i.image ? <img src={i.image} alt="" className="h-10 w-14 rounded-lg object-cover" /> : <span className="text-muted">—</span>}</td>
                <td className="px-4 py-3 text-sm font-medium text-ink">{i.title}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{i.category || "—"}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{typeof i.price === "number" ? formatMNT(i.price) : "—"}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => del(i.id)} className="text-sm font-semibold text-rose-500 hover:underline">Устгах</button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td className="px-4 py-6 text-sm text-muted" colSpan={5}>Мэдээлэл алга. “+ Мэдээлэл нэмэх” дарж эхлүүлнэ үү.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
