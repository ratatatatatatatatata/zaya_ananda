"use client";

import { useEffect, useMemo, useState } from "react";
import { CmsCard } from "./CmsCard";
import { cx } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

type Zodiac = {
  key: string; name: string; symbol: string;
  from: [number, number]; to: [number, number]; // [сар, өдөр]
  stones: string[];
  meaning: string;
};

const ZODIACS: Zodiac[] = [
  { key: "aries", name: "Хонь", symbol: "♈", from: [3, 21], to: [4, 19], stones: ["Улаан яспер", "Гранат", "Хааны чулуу"], meaning: "Эр зориг, эрч хүчийг нэмж, түргэн зангийн галыг тэнцвэржүүлнэ." },
  { key: "taurus", name: "Үхэр", symbol: "♉", from: [4, 20], to: [5, 20], stones: ["Маргад", "Розе кварц", "Ногоон хаш"], meaning: "Тогтвортой байдал, элбэг дэлбэг байдлыг татаж, сэтгэлийг зөөлрүүлнэ." },
  { key: "gemini", name: "Ихэр", symbol: "♊", from: [5, 21], to: [6, 21], stones: ["Агат", "Цитрин", "Шаргал болор"], meaning: "Оюун санааг тодруулж, харилцааны урсгалыг чөлөөтэй болгоно." },
  { key: "cancer", name: "Мэлхий", symbol: "♋", from: [6, 22], to: [7, 22], stones: ["Сувд", "Сарны чулуу", "Цагаан болор"], meaning: "Сэтгэл хөдлөлийг тэнцвэржүүлж, дотоод хамгаалалт өгнө." },
  { key: "leo", name: "Арслан", symbol: "♌", from: [7, 23], to: [8, 22], stones: ["Наран чулуу", "Цитрин", "Хув"], meaning: "Дотоод гэрэл, итгэл үнэмшлийг бадраана." },
  { key: "virgo", name: "Охин", symbol: "♍", from: [8, 23], to: [9, 22], stones: ["Перидот", "Ногоон хаш", "Агат"], meaning: "Цэгцтэй байдал, эрүүл энергийн урсгалыг дэмжинэ." },
  { key: "libra", name: "Жинлүүр", symbol: "♎", from: [9, 23], to: [10, 23], stones: ["Опал", "Розе кварц", "Номин"], meaning: "Тэнцвэр, эв найрамдал, харилцааны зөөлөн урсгалыг авчирна." },
  { key: "scorpio", name: "Хилэнц", symbol: "♏", from: [10, 24], to: [11, 22], stones: ["Гранат", "Топаз", "Хар болор"], meaning: "Гүн хувирал, дотоод хүчийг сэрээж, сөрөг энергиэс хамгаална." },
  { key: "sagittarius", name: "Нум", symbol: "♐", from: [11, 23], to: [12, 21], stones: ["Оюу", "Аметист", "Номин"], meaning: "Аз хийморийг дуудаж, аяллын замыг тэгшилнэ." },
  { key: "capricorn", name: "Матар", symbol: "♑", from: [12, 22], to: [1, 19], stones: ["Гранат", "Оникс", "Хар хаш"], meaning: "Тууштай байдал, газрын бат бэх энергийг өгнө." },
  { key: "aquarius", name: "Хумх", symbol: "♒", from: [1, 20], to: [2, 18], stones: ["Аметист", "Номин", "Аквамарин"], meaning: "Зөн совин, шинэ санааны сувгийг нээнэ." },
  { key: "pisces", name: "Загас", symbol: "♓", from: [2, 19], to: [3, 20], stones: ["Аквамарин", "Аметист", "Сарны чулуу"], meaning: "Мөрөөдөл, зөн билгийг тодруулж, сэтгэлийг ариусгана." },
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

/** Ордны чулуун тайлал — төрсөн огноо эсвэл ордоо сонгоход чулуу + тохирох бүтээгдэхүүн. */
export function StoneOracle() {
  const now = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: now - 1929 }, (_, i) => now - i), [now]);
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [picked, setPicked] = useState<string | null>(null);
  const [products, setProducts] = useState<CmsItem[]>([]);

  useEffect(() => {
    fetch("/api/content?kinds=product", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setProducts(d.items || []))
      .catch(() => {});
  }, []);

  const maxDay = month ? daysIn(typeof year === "number" ? year : 2000, month) : 31;
  useEffect(() => { if (typeof day === "number" && day > maxDay) setDay(maxDay); }, [maxDay, day]);

  const z = useMemo(() => {
    if (picked) return ZODIACS.find((x) => x.key === picked) || null;
    if (month && day) return zodiacOf(month as number, day as number);
    return null;
  }, [picked, month, day]);

  const matched = useMemo(() => {
    if (!z) return [];
    const keys = z.stones.map((s) => s.toLowerCase());
    return products.filter((p) => {
      const hay = ((p.title || "") + " " + (p.summary || "") + " " + (p.body || "")).toLowerCase();
      return keys.some((k) => hay.includes(k));
    });
  }, [z, products]);

  const selCls = "rounded-2xl border-2 border-line bg-[#121D33] px-4 py-3 font-display text-base font-semibold text-ink outline-none transition focus:border-accent-400 hover:border-accent-400/60";

  return (
    <div className="mb-12 overflow-hidden rounded-4xl border border-accent-300/30 bg-[#1B2038]">
      <div className="relative p-7 sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(227,190,98,0.22), transparent 70%)", filter: "blur(8px)" }} />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(155,110,240,0.18), transparent 70%)", filter: "blur(10px)" }} />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-400">Энергийн хамгаалалт · нэмэлт</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">💎 Ордны чулуун тайлал</h2>
          <p className="mt-2 max-w-2xl text-muted">Төрсөн огноогоо сонгох эсвэл ордоо шууд дарахад таны эрдэнийн чулууг тайлж, тохирсон бүтээгдэхүүнүүдээ санал болгоно.</p>

          {/* Он / Сар / Өдөр — загварлаг сонголт */}
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Он</label>
              <select className={selCls} value={year} onChange={(e) => { setYear(e.target.value ? Number(e.target.value) : ""); setPicked(null); }}>
                <option value="">— Он —</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Сар</label>
              <select className={selCls} value={month} onChange={(e) => { setMonth(e.target.value ? Number(e.target.value) : ""); setPicked(null); }}>
                <option value="">— Сар —</option>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Өдөр</label>
              <select className={selCls} value={day} onChange={(e) => { setDay(e.target.value ? Number(e.target.value) : ""); setPicked(null); }}>
                <option value="">— Өдөр —</option>
                {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <span className="hidden pb-3 text-sm text-muted sm:block">эсвэл ордоо сонгоорой ↓</span>
          </div>

          {/* 12 ордын товч сонголт */}
          <div className="mt-5 flex flex-wrap gap-2">
            {ZODIACS.map((x) => (
              <button
                key={x.key}
                type="button"
                onClick={() => { setPicked(picked === x.key ? null : x.key); }}
                className={cx(
                  "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                  (picked === x.key || (!picked && z?.key === x.key))
                    ? "border-accent-400 bg-accent-300/15 text-accent-300 shadow-[0_0_20px_-6px_rgba(227,190,98,0.5)]"
                    : "border-line bg-white/5 text-ink/70 hover:border-accent-400/50 hover:text-accent-300"
                )}
              >
                <span className="text-lg leading-none">{x.symbol}</span>{x.name}
              </button>
            ))}
          </div>

          {z && (
            <div className="mt-7 rounded-3xl border border-line bg-[#121D33] p-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-accent-400/40 bg-accent-300/10 text-4xl text-accent-300">{z.symbol}</span>
                <div>
                  <p className="font-display text-xl font-semibold text-ink">{z.name} орд</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {z.stones.map((s) => (
                      <span key={s} className="rounded-full border border-accent-400/30 bg-accent-300/10 px-2.5 py-0.5 text-xs font-semibold text-accent-300">💎 {s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 leading-relaxed text-ink/80">{z.meaning}</p>

              <div className="mt-6">
                {matched.length > 0 ? (
                  <>
                    <p className="font-display font-semibold text-primary-300">Танд тохирох бүтээгдэхүүнүүд:</p>
                    <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {matched.slice(0, 6).map((p) => <CmsCard key={p.id} item={p} />)}
                    </div>
                  </>
                ) : (
                  <p className="rounded-xl bg-primary-500/10 px-4 py-3 text-sm text-muted">
                    Таны чулуунд яг тохирсон бүтээгдэхүүн одоогоор бүртгэгдээгүй байна — доорх бүтээгдэхүүнүүдээс сонирхоорой, эсвэл бидэнтэй холбогдож захиалаарай.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
