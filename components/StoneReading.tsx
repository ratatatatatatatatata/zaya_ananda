"use client";

import { useEffect, useMemo, useState } from "react";
import { CmsCard } from "./CmsCard";
import { STONE_LORE, type StoneLore } from "@/data/stone-lore";
import type { CmsItem } from "@/lib/types";

type Zodiac = { key: string; name: string; symbol: string; from: [number, number]; to: [number, number] };

const ZODIACS: Zodiac[] = [
  { key: "aries", name: "Хонь", symbol: "♈", from: [3, 21], to: [4, 19] },
  { key: "taurus", name: "Үхэр", symbol: "♉", from: [4, 20], to: [5, 20] },
  { key: "gemini", name: "Ихэр", symbol: "♊", from: [5, 21], to: [6, 21] },
  { key: "cancer", name: "Мэлхий", symbol: "♋", from: [6, 22], to: [7, 22] },
  { key: "leo", name: "Арслан", symbol: "♌", from: [7, 23], to: [8, 22] },
  { key: "virgo", name: "Охин", symbol: "♍", from: [8, 23], to: [9, 22] },
  { key: "libra", name: "Жинлүүр", symbol: "♎", from: [9, 23], to: [10, 23] },
  { key: "scorpio", name: "Хилэнц", symbol: "♏", from: [10, 24], to: [11, 22] },
  { key: "sagittarius", name: "Нум", symbol: "♐", from: [11, 23], to: [12, 21] },
  { key: "capricorn", name: "Матар", symbol: "♑", from: [12, 22], to: [1, 19] },
  { key: "aquarius", name: "Хумх", symbol: "♒", from: [1, 20], to: [2, 18] },
  { key: "pisces", name: "Загас", symbol: "♓", from: [2, 19], to: [3, 20] },
];

const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];

function zodiacOf(month: number, day: number): Zodiac {
  for (const z of ZODIACS) {
    const [fm, fd] = z.from, [tm, td] = z.to;
    if (fm <= tm) { if ((month === fm && day >= fd) || (month === tm && day <= td) || (month > fm && month < tm)) return z; }
    else { if ((month === fm && day >= fd) || (month === tm && day <= td) || month > fm || month < tm) return z; }
  }
  return ZODIACS[0];
}
function daysIn(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function StoneCard({ s, products, universal }: { s: StoneLore; products: CmsItem[]; universal?: boolean }) {
  const matched = useMemo(() => {
    const keys = s.match.map((k) => k.toLowerCase());
    return products.filter((p) => {
      const hay = ((p.title || "") + " " + (p.summary || "") + " " + (p.body || "")).toLowerCase();
      return keys.some((k) => hay.includes(k));
    });
  }, [s, products]);

  return (
    <div className="overflow-hidden rounded-4xl border border-accent-300/25 bg-[#1B2038]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-accent-300/[0.06] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent-400/40 bg-accent-300/10 text-xl">💎</span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{s.name}</p>
            <p className="text-xs font-semibold tracking-wide text-accent-300/80">{s.latin}</p>
          </div>
        </div>
        {universal && <span className="rounded-full border border-primary-500/40 bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">Бүх ордод ээлтэй</span>}
      </div>
      <div className="px-6 py-5">
        <p className="leading-relaxed text-ink/80">{s.desc}</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-accent-400">🌟 Билэгдэл ба энергийн утга</p>
        <ul className="mt-2.5 space-y-2">
          {s.points.map((pt, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/75"><span className="mt-0.5 shrink-0 text-accent-400">✦</span><span>{pt}</span></li>
          ))}
        </ul>
        {matched.length > 0 && (
          <div className="mt-5 border-t border-line pt-5">
            <p className="font-display text-sm font-semibold text-primary-300">Танд тохирох бүтээгдэхүүн:</p>
            <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matched.slice(0, 3).map((p) => <CmsCard key={p.id} item={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Ордуудын ээлтэй чулуу — төрсөн он, сар, өдрөө оруулахад орд нь шууд гарч,
 *  ээлтэй чулуунуудыг тайлбартай нь + тохирох бүтээгдэхүүнтэй харуулна. */
export function StoneReading() {
  const now = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: now - 1929 }, (_, i) => now - i), [now]);
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [products, setProducts] = useState<CmsItem[]>([]);
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    fetch("/api/content?kinds=product", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setProducts(d.items || []))
      .catch(() => {});
  }, []);

  const maxDay = month ? daysIn(typeof year === "number" ? year : 2000, month) : 31;
  useEffect(() => { if (typeof day === "number" && day > maxDay) setDay(maxDay); }, [maxDay, day]);

  const z = useMemo(() => (month && day ? zodiacOf(month as number, day as number) : null), [month, day]);

  const zodiacStones = useMemo(() => (z ? STONE_LORE.filter((s) => Array.isArray(s.zodiacs) && s.zodiacs.includes(z.key)) : []), [z]);
  const universalStones = useMemo(() => STONE_LORE.filter((s) => s.zodiacs === "all"), []);
  const otherStones = useMemo(() => STONE_LORE.filter((s) => Array.isArray(s.zodiacs) && (!z || !s.zodiacs.includes(z.key)) && s.zodiacs.length === 0), [z]);

  const selCls = "rounded-2xl border-2 border-line bg-[#121D33] px-4 py-3 font-display text-base font-semibold text-ink outline-none transition focus:border-accent-400 hover:border-accent-400/60";

  return (
    <div>
      {/* Төрсөн огноо */}
      <div className="relative overflow-hidden rounded-4xl border border-accent-300/30 bg-[#1B2038] p-7 sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(227,190,98,0.22), transparent 70%)", filter: "blur(8px)" }} />
        <div className="relative z-10">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Төрсөн огноогоо оруулна уу</h2>
          <p className="mt-2 max-w-2xl text-muted">Таны орд шууд тодорхойлогдож, ээлтэй эрдэнийн чулуунууд тайлбарын хамт гарч ирнэ.</p>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Он</label>
              <select className={selCls} value={year} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}>
                <option value="">— Он —</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Сар</label>
              <select className={selCls} value={month} onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : "")}>
                <option value="">— Сар —</option>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Өдөр</label>
              <select className={selCls} value={day} onChange={(e) => setDay(e.target.value ? Number(e.target.value) : "")}>
                <option value="">— Өдөр —</option>
                {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {z && (
        <>
          {/* Таны орд */}
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-4xl border border-accent-400/40 bg-accent-300/[0.07] p-6 sm:p-7">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-accent-400/50 bg-accent-300/10 text-4xl text-accent-300 shadow-[0_0_30px_-8px_rgba(227,190,98,0.6)]">{z.symbol}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-400">Таны орд</p>
              <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">{z.name}</p>
            </div>
          </div>

          {/* Ордын ээлтэй чулуунууд */}
          {zodiacStones.length > 0 && (
            <>
              <h3 className="mt-10 font-display text-xl font-semibold text-ink sm:text-2xl">💎 {z.name} ордод ээлтэй чулуунууд</h3>
              <div className="mt-5 space-y-6">
                {zodiacStones.map((s) => <StoneCard key={s.key} s={s} products={products} />)}
              </div>
            </>
          )}

          {/* Бүх ордод ээлтэй */}
          <h3 className="mt-10 font-display text-xl font-semibold text-ink sm:text-2xl">✨ Бүх ордод ээлтэй чулуунууд</h3>
          <div className="mt-5 space-y-6">
            {universalStones.map((s) => <StoneCard key={s.key} s={s} products={products} universal />)}
          </div>

          {/* Бусад чулуунууд */}
          {otherStones.length > 0 && (
            <div className="mt-10">
              <button type="button" onClick={() => setShowOthers(!showOthers)} className="btn btn-outline btn-md">
                {showOthers ? "Бусад чулуунуудыг хураах ↑" : `Бусад эрдэнийн чулуунууд үзэх (${otherStones.length}) ↓`}
              </button>
              {showOthers && (
                <div className="mt-6 space-y-6">
                  {otherStones.map((s) => <StoneCard key={s.key} s={s} products={products} />)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
