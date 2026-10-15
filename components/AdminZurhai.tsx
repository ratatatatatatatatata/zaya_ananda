"use client";

import { useImageUpload } from "@/lib/use-image-upload";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DEFAULT_ZURHAI, NATAL_CARD } from "@/lib/zurhai-cards";

type Card = { emoji: string; title: string; desc: string; href: string; image?: string };
type Rule = { key: string; text: string };

const EMPTY_CARD: Card = { emoji: "🔮", title: "", desc: "", href: "/merge", image: "" };
const DEFAULT_ADMIN_CARDS: Card[] = [...DEFAULT_ZURHAI, NATAL_CARD].map((card) => ({ ...card, image: card.image || "" }));

/** Preserve saved cards, then append any built-in homepage astrology types that are missing. */
function withHomepageDefaults(saved: Card[]): Card[] {
  const savedLinks = new Set(saved.map((card) => card.href));
  return [...saved, ...DEFAULT_ADMIN_CARDS.filter((card) => !savedLinks.has(card.href))];
}

/** Нүүр хуудасны зурхайн төрлүүд ба тайллын үндсэн алгоритм. */
export function AdminZurhai() {
  const { uploadImage, isUploading, hasPendingUploads } = useImageUpload();
  const [cards, setCards] = useState<Card[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const s = d?.settings;
        if (!s) return;
        if (Array.isArray(s.zurhaiCards)) setCards(withHomepageDefaults(s.zurhaiCards));
        else setCards(DEFAULT_ADMIN_CARDS.map((card) => ({ ...card })));
        if (Array.isArray(s.zurhaiRules)) setRules(s.zurhaiRules);
      })
      .catch(() => {});
  }, []);

  async function save() {
    if (hasPendingUploads()) { setErr("Зураг upload дууссаны дараа хадгална уу."); return; }
    setSaving(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zurhaiCards: cards.filter((c) => c.title.trim()),
          zurhaiRules: rules.filter((r) => r.key.trim() && r.text.trim()),
        }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setMsg("Хадгаллаа ✓");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) { setErr(e instanceof Error ? e.message : "Алдаа гарлаа."); } finally { setSaving(false); }
  }

  const updCard = (i: number, p: Partial<Card>) => setCards((cs) => cs.map((c, k) => (k === i ? { ...c, ...p } : c)));
  const updRule = (i: number, p: Partial<Rule>) => setRules((rs) => rs.map((r, k) => (k === i ? { ...r, ...p } : r)));

  async function pickCardImage(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const file = e.target.files?.[0]; if (!file) return;
    try { updCard(i, { image: await uploadImage(file) }); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Зураг алдаа"); }
    e.target.value = "";
  }

  return (
    <div className="space-y-5">
      {/* Төрлүүд */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Зурхайн төрлүүд</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Энд нүүр хуудсанд харагдах бүх зурхайн төрөл, гарчиг, тайлбар, холбоос, зургийг удирдана.
              Зураг оруулбал нүүр хуудасны дугуй сонголтын дэвсгэрт нэртэйгээ хамт харагдана.
            </p>
          </div>
          <button type="button" onClick={() => setCards((c) => [...c, { ...EMPTY_CARD }])} className="btn btn-outline btn-sm">
            + Төрөл нэмэх
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {cards.map((c, i) => (
            <div key={i} className="rounded-xl border border-line bg-surface-2 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input className="input w-16 text-center" maxLength={4} value={c.emoji} onChange={(e) => updCard(i, { emoji: e.target.value })} title="Зураг оруулаагүй үед харагдах icon" />
                <input className="input min-w-[12rem] flex-1" placeholder="Гарчиг — ж: Өдрийн зурхай" value={c.title} onChange={(e) => updCard(i, { title: e.target.value })} />
                <input className="input w-52" placeholder="Холбоос — /merge эсвэл #zurhai-daily" value={c.href} onChange={(e) => updCard(i, { href: e.target.value })} />
                <button type="button" onClick={() => setCards((cs) => cs.filter((_, k) => k !== i))} className="shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
              </div>
              <textarea className="textarea mt-2 min-h-[70px]" placeholder="Товч тайлбар" value={c.desc} onChange={(e) => updCard(i, { desc: e.target.value })} />
              <div className="mt-2 flex items-center gap-3">
                {c.image
                  ? <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-lg"><Image src={c.image} alt="" fill unoptimized sizes="80px" className="object-contain" /></span>
                  : <div className="grid h-14 w-20 place-items-center rounded-lg bg-surface-3 text-xs text-muted">Зураггүй</div>}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="text-sm" onChange={(e) => pickCardImage(e, i)} />
                {c.image && <button type="button" onClick={() => updCard(i, { image: "" })} className="text-xs font-semibold text-rose-500 hover:underline">Зураг хасах</button>}
              </div>
            </div>
          ))}
          {cards.length === 0 && <p className="text-sm text-muted">Одоогоор зурхайн төрөл нэмээгүй байна.</p>}
        </div>
      </div>

      {/* Алгоритм — тайллын бичвэрүүд */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Тайллын үндсэн алгоритм</h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">
              Түлхүүр бүрд өөрийн тайллаа бичнэ. Систем төрсөн огнооноос гарсан утгад тохирох түлхүүрийг олж, таны бичсэн бичвэрийг харуулна.
              Түлхүүр бичихгүй бол системийн өгөгдмөл тайлал хэвээр ажиллана.
            </p>
          </div>
          <button type="button" onClick={() => setRules((r) => [...r, { key: "", text: "" }])} className="btn btn-outline btn-sm">
            + Дүрэм нэмэх
          </button>
        </div>

        <div className="mt-3 rounded-xl bg-aqua px-4 py-3 text-xs leading-relaxed text-muted">
          <b>Түлхүүрийн жишээ:</b>
          <br />• <code>zodiac:leo</code> — Арслан ордтой хүнд харагдах тайлал
          <br />• <code>life:7</code> — Амьдралын зам 7 бол
          <br />• <code>arcana:12</code> — 12-р аркан гарвал
          <br />• <code>day:mon</code> — Даваа гарагт (mon·tue·wed·thu·fri·sat·sun)
          <br />• <code>element:fire</code> — Гал махбод (fire·earth·air·water)
        </div>

        <div className="mt-4 space-y-3">
          {rules.map((r, i) => (
            <div key={i} className="rounded-xl border border-line bg-surface-2 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input className="input w-56 font-mono text-sm" placeholder="zodiac:leo" value={r.key} onChange={(e) => updRule(i, { key: e.target.value.trim() })} />
                <button type="button" onClick={() => setRules((rs) => rs.filter((_, k) => k !== i))} className="ml-auto shrink-0 text-sm font-semibold text-rose-500 hover:underline">Устгах</button>
              </div>
              <textarea className="textarea mt-2 min-h-[90px]" placeholder="Энэ түлхүүрт харагдах тайллаа бичнэ үү…" value={r.text} onChange={(e) => updRule(i, { text: e.target.value })} />
            </div>
          ))}
          {rules.length === 0 && <p className="text-sm text-muted">Дүрэм нэмээгүй — системийн өгөгдмөл тайлал ажиллаж байна.</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={save} disabled={saving || isUploading} className="btn btn-primary btn-md disabled:opacity-60">
          {saving ? "Хадгалж байна…" : "Хадгалах"}
        </button>
        {msg && <span className="text-sm font-semibold text-jade-600">{msg}</span>}
        {err && <span className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</span>}
      </div>
    </div>
  );
}
