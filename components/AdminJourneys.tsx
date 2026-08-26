"use client";

import { useCallback, useEffect, useState } from "react";
import type { Journey, JourneyDay, Person, Scene } from "@/data/journeys";

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

const SCENES: { key: Scene; label: string }[] = [
  { key: "gobi", label: "Говь" },
  { key: "mountain", label: "Уул" },
  { key: "monastery", label: "Хийд" },
  { key: "forest", label: "Ой" },
  { key: "steppe", label: "Тал хээр" },
  { key: "lake", label: "Нуур" },
];

const EMPTY_PERSON: Person = { name: "", role: "", info: "", image: "" };
const EMPTY_DAY: JourneyDay = { label: "", title: "", text: "", bullets: [], image: "", scene: "steppe" };

const EMPTY = {
  slug: "", name: "", tagline: "", scene: "steppe" as Scene, image: "",
  days: "", groupSize: "", transport: "", stay: "",
  audience: "", summary: "", included: "", excluded: "", price: "",
  prepay: "",
};

/** Сүнслэг аяллын мэдээлэл нэмэх/засах — жагсаалт, хөтөлбөр, баг, урьдчилгаа. */
export function AdminJourneys() {
  const [items, setItems] = useState<Journey[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY);
  const [itinerary, setItinerary] = useState<JourneyDay[]>([]);
  const [lead, setLead] = useState<Person>(EMPTY_PERSON);
  const [crew, setCrew] = useState<Person[]>([]);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const load = useCallback(() => {
    fetch("/api/admin/journeys", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items || []))
      .catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm(EMPTY); setItinerary([]); setLead(EMPTY_PERSON); setCrew([]);
    setEditingId(null); setErr(""); setOpen(false);
  }
  function startNew() {
    setForm(EMPTY); setItinerary([]); setLead(EMPTY_PERSON); setCrew([]);
    setEditingId(null); setErr(""); setOpen(true);
  }
  function startEdit(j: Journey) {
    setForm({
      slug: j.slug, name: j.name, tagline: j.tagline || "", scene: j.scene || "steppe", image: j.image || "",
      days: j.days || "", groupSize: j.groupSize || "", transport: j.transport || "", stay: j.stay || "",
      audience: j.audience || "", summary: j.summary || "", included: j.included || "", excluded: j.excluded || "", price: j.price || "",
      prepay: j.prepay ? String(j.prepay) : "",
    });
    setItinerary(j.itinerary && j.itinerary.length ? j.itinerary : []);
    setLead(j.lead || EMPTY_PERSON);
    setCrew(j.crew || []);
    setEditingId(j.id); setErr(""); setOpen(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>, onDone: (data: string) => void) {
    const file = e.target.files?.[0]; if (!file) return;
    try { onDone(await compressImage(file)); } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
    e.target.value = "";
  }

  const addDay = () => setItinerary((ds) => [...ds, { ...EMPTY_DAY }]);
  const updDay = (i: number, patch: Partial<JourneyDay>) => setItinerary((ds) => ds.map((d, k) => (k === i ? { ...d, ...patch } : d)));
  const delDay = (i: number) => setItinerary((ds) => ds.filter((_, k) => k !== i));

  const addCrew = () => setCrew((cs) => [...cs, { ...EMPTY_PERSON }]);
  const updCrew = (i: number, patch: Partial<Person>) => setCrew((cs) => cs.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  const delCrew = (i: number) => setCrew((cs) => cs.filter((_, k) => k !== i));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Аяллын нэрийг оруулна уу."); return; }
    setSaving(true); setErr("");
    const payload = {
      ...form,
      prepay: Number(form.prepay) || 0,
      itinerary,
      lead,
      crew,
    };
    try {
      const res = await fetch("/api/admin/journeys", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      resetForm(); load();
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("Энэ аяллыг устгах уу? Холбоотой захиалга, сэтгэгдэл устахгүй хэвээр үлдэнэ.")) return;
    await fetch("/api/admin/journeys?id=" + id, { method: "DELETE" }); load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Нийт: {items.length}</h2>
        <button onClick={() => (open ? resetForm() : startNew())} className="btn btn-primary btn-sm">{open ? "Болих" : "+ Аялал нэмэх"}</button>
      </div>

      {open && (
        <form onSubmit={save} className="card space-y-4 p-5">
          {editingId && <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">Засварлаж байна</p>}

          <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
            <p className="mb-2 font-display font-semibold text-ink">Нүүр зураг</p>
            <div className="flex items-center gap-3">
              {form.image
                ? <div className="relative"><img src={form.image} alt="" className="h-24 w-40 rounded-xl object-cover" />
                    <button type="button" onClick={() => set("image", "")} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-xs font-bold text-white shadow">✕</button>
                  </div>
                : <label className="grid h-24 w-40 cursor-pointer place-items-center rounded-xl border border-dashed border-line text-2xl text-muted hover:bg-white/10">
                    🖼+
                    <input type="file" accept="image/*" onChange={(e) => pickImage(e, (d) => set("image", d))} className="hidden" />
                  </label>}
            </div>
            <p className="mt-2 text-xs text-muted">Байхгүй бол доор сонгосон дүр зураг (Говь/Уул гэх мэт) автоматаар зурагдана.</p>
            <div className="mt-3">
              <label className="field-label">Дүр зураг</label>
              <select className="input max-w-xs" value={form.scene} onChange={(e) => set("scene", e.target.value)}>
                {SCENES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="field-label">Нэр *</label><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Шамбалын орон — Говийн энергийн аялал" /></div>
            <div><label className="field-label">Slug (латинаар, URL-д орно)</label><input className="input" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="хоосон бол нэрнээс автоматаар үүснэ" /></div>
          </div>
          <div><label className="field-label">Тайлбар мөр (tagline)</label><input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Дорноговь · Хамарын хийд · Данзанравжаагийн өв" /></div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div><label className="field-label">Үргэлжлэх хугацаа</label><input className="input" value={form.days} onChange={(e) => set("days", e.target.value)} placeholder="2 өдөр, 1 шөнө" /></div>
            <div><label className="field-label">Бүлгийн хэмжээ</label><input className="input" value={form.groupSize} onChange={(e) => set("groupSize", e.target.value)} placeholder="Дээд тал нь 15 хүн" /></div>
            <div><label className="field-label">Тээвэр</label><input className="input" value={form.transport} onChange={(e) => set("transport", e.target.value)} placeholder="Тохилог автобус" /></div>
            <div><label className="field-label">Байрлах</label><input className="input" value={form.stay} onChange={(e) => set("stay", e.target.value)} placeholder="Жуулчны бааз (гэр)" /></div>
          </div>

          <div><label className="field-label">Хэнд тохирох вэ</label><textarea className="textarea" rows={2} value={form.audience} onChange={(e) => set("audience", e.target.value)} /></div>
          <div><label className="field-label">Товч танилцуулга</label><textarea className="textarea" rows={4} value={form.summary} onChange={(e) => set("summary", e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="field-label">Багтсан</label><textarea className="textarea" rows={2} value={form.included} onChange={(e) => set("included", e.target.value)} /></div>
            <div><label className="field-label">Багтаагүй</label><textarea className="textarea" rows={2} value={form.excluded} onChange={(e) => set("excluded", e.target.value)} /></div>
          </div>

          <div className="rounded-2xl border border-primary-500/30 bg-primary-50/60 p-4">
            <p className="font-display font-semibold text-ink">Үнэ, урьдчилгаа</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div><label className="field-label">Үнийн бичвэр (харагдах)</label><input className="input" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Жишээ: 850,000₮ эсвэл “Үнэ тодорхойлогдож байна”" /></div>
              <div>
                <label className="field-label">Урьдчилгаа дүн (₮)</label>
                <input className="input" inputMode="numeric" value={form.prepay} onChange={(e) => set("prepay", e.target.value.replace(/[^\d]/g, ""))} placeholder="жишээ: 100000" />
                <p className="mt-1 text-xs text-muted">Захиалгыг баталгаажуулахад шаардах урьдчилгаа. 0 бол урьдчилгаа авахгүй.</p>
              </div>
            </div>
          </div>

          {/* Өдөр өдрийн хөтөлбөр */}
          <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display font-semibold text-ink">Өдөр өдрийн хөтөлбөр <span className="text-sm font-normal text-muted">({itinerary.length})</span></p>
              <button type="button" onClick={addDay} className="btn btn-outline btn-sm">+ Өдөр нэмэх</button>
            </div>
            <div className="space-y-3">
              {itinerary.map((d, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface-3 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{i + 1}</span>
                    <button type="button" onClick={() => delDay(i)} className="text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input className="input" placeholder="Шошго — жишээ: 1-р өдөр · өглөө" value={d.label} onChange={(e) => updDay(i, { label: e.target.value })} />
                    <input className="input" placeholder="Гарчиг" value={d.title} onChange={(e) => updDay(i, { title: e.target.value })} />
                  </div>
                  <textarea className="textarea mt-2" rows={2} placeholder="Тайлбар" value={d.text} onChange={(e) => updDay(i, { text: e.target.value })} />
                  <input className="input mt-2" placeholder="Хийх зүйлс — таслалаар тусгаарлана" value={(d.bullets || []).join(", ")}
                    onChange={(e) => updDay(i, { bullets: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <select className="input w-40" value={d.scene} onChange={(e) => updDay(i, { scene: e.target.value as Scene })}>
                      {SCENES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                    {d.image
                      ? <div className="relative"><img src={d.image} alt="" className="h-14 w-20 rounded-lg object-cover" />
                          <button type="button" onClick={() => updDay(i, { image: "" })} className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">✕</button>
                        </div>
                      : <input type="file" accept="image/*" className="text-sm" onChange={(e) => pickImage(e, (dd) => updDay(i, { image: dd }))} />}
                  </div>
                </div>
              ))}
              {itinerary.length === 0 && <p className="text-sm text-muted">Одоогоор өдөр алга. “+ Өдөр нэмэх” дарж эхлүүлнэ үү.</p>}
            </div>
          </div>

          {/* Хариуцах хүн */}
          <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
            <p className="mb-3 font-display font-semibold text-ink">Аяллыг хариуцах хүн</p>
            <div className="flex items-center gap-3">
              {lead.image
                ? <img src={lead.image} alt="" className="h-16 w-16 rounded-full object-cover" />
                : <div className="grid h-16 w-16 place-items-center rounded-full border border-dashed border-line text-xl text-muted">👤</div>}
              <input type="file" accept="image/*" className="text-sm" onChange={(e) => pickImage(e, (d) => setLead((p) => ({ ...p, image: d })))} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="Нэр" value={lead.name} onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))} />
              <input className="input" placeholder="Албан тушаал" value={lead.role} onChange={(e) => setLead((p) => ({ ...p, role: e.target.value }))} />
            </div>
            <textarea className="textarea mt-3" rows={2} placeholder="Мэдээлэл" value={lead.info} onChange={(e) => setLead((p) => ({ ...p, info: e.target.value }))} />
          </div>

          {/* Хамт явах баг */}
          <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display font-semibold text-ink">Хамт явах баг <span className="text-sm font-normal text-muted">({crew.length})</span></p>
              <button type="button" onClick={addCrew} className="btn btn-outline btn-sm">+ Гишүүн нэмэх</button>
            </div>
            <div className="space-y-3">
              {crew.map((c, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface-3 p-3">
                  <div className="flex items-center gap-3">
                    {c.image
                      ? <img src={c.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                      : <div className="grid h-12 w-12 place-items-center rounded-full border border-dashed border-line text-lg text-muted">👤</div>}
                    <input type="file" accept="image/*" className="text-sm" onChange={(e) => pickImage(e, (d) => updCrew(i, { image: d }))} />
                    <button type="button" onClick={() => delCrew(i)} className="ml-auto text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input className="input" placeholder="Нэр" value={c.name} onChange={(e) => updCrew(i, { name: e.target.value })} />
                    <input className="input" placeholder="Албан тушаал" value={c.role} onChange={(e) => updCrew(i, { role: e.target.value })} />
                  </div>
                  <textarea className="textarea mt-2" rows={2} placeholder="Мэдээлэл" value={c.info} onChange={(e) => updCrew(i, { info: e.target.value })} />
                </div>
              ))}
              {crew.length === 0 && <p className="text-sm text-muted">Одоогоор гишүүн алга.</p>}
            </div>
          </div>

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
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Нэр</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Урьдчилгаа</th>
            <th className="px-4 py-3" />
          </tr></thead>
          <tbody>
            {items.map((j) => (
              <tr key={j.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">{j.image ? <img src={j.image} alt="" className="h-10 w-14 rounded-lg object-cover" /> : <span className="text-muted">—</span>}</td>
                <td className="px-4 py-3 text-sm font-medium text-ink">{j.name}<span className="ml-2 text-xs text-muted">/{j.slug}</span></td>
                <td className="px-4 py-3 text-sm text-ink/80">{j.prepay ? j.prepay.toLocaleString("mn-MN") + "₮" : "—"}</td>
                <td className="px-4 py-3 text-right"><div className="flex justify-end gap-3"><button onClick={() => startEdit(j)} className="text-sm font-semibold text-primary-700 hover:underline">Засах</button><button onClick={() => del(j.id)} className="text-sm font-semibold text-rose-500 hover:underline">Устгах</button></div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td className="px-4 py-6 text-sm text-muted" colSpan={4}>Аялал алга. “+ Аялал нэмэх” дарж эхлүүлнэ үү.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
