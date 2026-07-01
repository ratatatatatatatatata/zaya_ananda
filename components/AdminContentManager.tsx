"use client";

import { useCallback, useEffect, useState } from "react";
import { formatMNT } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

export function AdminContentManager({ kind }: { kind: CmsItem["kind"] }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const empty = { title: "", category: "", summary: "", body: "", price: "", mode: "online" };
  const [form, setForm] = useState(empty);

  const load = useCallback(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems((d.items || []).filter((i: CmsItem) => i.kind === kind)))
      .catch(() => {});
  }, [kind]);
  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setErr("Гарчиг оруулна уу."); return; }
    setSaving(true); setErr("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, title: form.title, category: form.category, summary: form.summary, body: form.body, price: form.price, mode: kind === "course" ? form.mode : undefined }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setForm(empty); setOpen(false); load();
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }
  async function del(id: string) {
    if (!confirm("Энэ мэдээллийг устгах уу?")) return;
    await fetch("/api/admin/content?id=" + id, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Нийт: {items.length}</h2>
        <button onClick={() => setOpen((o) => !o)} className="btn btn-primary btn-sm">{open ? "Болих" : "+ Мэдээлэл нэмэх"}</button>
      </div>
      {open && (
        <form onSubmit={add} className="card space-y-3 p-5">
          <div><label className="field-label">Гарчиг *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="field-label">Ангилал</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            {kind !== "resource" && <div><label className="field-label">Үнэ (₮)</label><input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>}
            {kind === "course" && <div><label className="field-label">Хэлбэр</label><select className="input" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}><option value="online">Онлайн сургалт</option><option value="tankhim">Танхимын сургалт</option><option value="both">Онлайн + Танхим</option></select></div>}
          </div>
          <div><label className="field-label">Товч тайлбар</label><input className="input" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
          <div><label className="field-label">Дэлгэрэнгүй</label><textarea className="textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "Хадгалж байна..." : "Хадгалах"}</button>
        </form>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead className="border-b border-line bg-aqua"><tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Гарчиг</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Ангилал</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Үнэ</th>
            <th className="px-4 py-3" />
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-ink">{i.title}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{i.category || "—"}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{typeof i.price === "number" ? formatMNT(i.price) : "—"}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => del(i.id)} className="text-sm font-semibold text-rose-500 hover:underline">Устгах</button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td className="px-4 py-6 text-sm text-muted" colSpan={4}>Мэдээлэл алга. “+ Мэдээлэл нэмэх” дарж эхлүүлнэ үү.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
