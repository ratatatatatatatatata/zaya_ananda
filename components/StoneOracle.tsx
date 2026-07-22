"use client";

import { useEffect, useMemo, useState } from "react";
import { CmsCard } from "./CmsCard";
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

function zodiacOf(month: number, day: number): Zodiac {
  for (const z of ZODIACS) {
    const [fm, fd] = z.from, [tm, td] = z.to;
    if (fm <= tm) { if ((month === fm && day >= fd) || (month === tm && day <= td) || (month > fm && month < tm)) return z; }
    else { if ((month === fm && day >= fd) || (month === tm && day <= td) || month > fm || month < tm) return z; }
  }
  return ZODIACS[0];
}

/** Чулуун тайлал — төрсөн огноогоор ордыг тодорхойлж, тохирох чулуу + бүтээгдэхүүн санал болгоно. */
export function StoneOracle() {
  const [date, setDate] = useState("");
  const [products, setProducts] = useState<CmsItem[]>([]);

  useEffect(() => {
    fetch("/api/content?kinds=product", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setProducts(d.items || []))
      .catch(() => {});
  }, []);

  const z = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    return zodiacOf(d.getMonth() + 1, d.getDate());
  }, [date]);

  const matched = useMemo(() => {
    if (!z) return [];
    const keys = z.stones.map((s) => s.toLowerCase());
    return products.filter((p) => {
      const hay = ((p.title || "") + " " + (p.summary || "") + " " + (p.body || "")).toLowerCase();
      return keys.some((k) => hay.includes(k));
    });
  }, [z, products]);

  return (
    <div className="mb-12 overflow-hidden rounded-4xl border border-accent-300/30 bg-[#1B2038]">
      <div className="relative p-7 sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(227,190,98,0.22), transparent 70%)", filter: "blur(8px)" }} />
        <div className="relative z-10">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">💎 Чулуун тайлал</h2>
          <p className="mt-2 max-w-2xl text-muted">Төрсөн огноогоо оруулбал таны ордод тохирох эрдэнийн чулууг тайлж, түүнд тохирсон бүтээгдэхүүнүүдээ санал болгоё.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input max-w-56" aria-label="Төрсөн огноо" />
          </div>

          {z && (
            <div className="mt-7 rounded-3xl border border-line bg-[#121D33] p-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-accent-300/15 text-4xl">{z.symbol}</span>
                <div>
                  <p className="font-display text-xl font-semibold text-ink">{z.name} орд</p>
                  <p className="text-sm text-muted">Таны чулуунууд: <span className="font-semibold text-accent-300">{z.stones.join(", ")}</span></p>
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
