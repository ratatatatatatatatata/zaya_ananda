"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ZODIAC_SIGNS, zodiacOf, pickIndex, energyScore,
  MOOD_LINES, WORK_LINES, LOVE_LINES, HEALTH_LINES, ADVICE_LINES, LUCKY_COLORS,
} from "@/data/daily-horoscope";

const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

function daysIn(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

/** Одоор эрчим үзүүлэх */
function Stars({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex gap-0.5" aria-label={`${label}: ${n}/5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} aria-hidden className={i <= n ? "text-accent-300" : "text-line"}>★</span>
        ))}
      </span>
    </div>
  );
}

/** Өдрийн зурхай — төрсөн он, сар, өдрөө оруулахад тухайн өдрийн тайлал гарна. */
export function DailyHoroscope() {
  const now = new Date();
  const years = useMemo(() => Array.from({ length: now.getFullYear() - 1929 }, (_, i) => now.getFullYear() - i), [now]);
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");

  const maxDay = month ? daysIn(typeof year === "number" ? year : 2000, month) : 31;
  const z = useMemo(() => (month && day ? zodiacOf(month as number, day as number) : null), [month, day]);

  // Өнөөдрийн огноо — түлхүүр болгож ашиглана (өдөр бүр шинэчлэгдэнэ)
  const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const dateLabel = `${now.getFullYear()} оны ${now.getMonth() + 1} сарын ${now.getDate()}, ${WEEKDAYS[now.getDay()]} гараг`;

  const reading = useMemo(() => {
    if (!z) return null;
    const k = z.key;
    return {
      mood: MOOD_LINES[pickIndex(k + "mood", dateKey, MOOD_LINES.length)],
      work: WORK_LINES[pickIndex(k + "work", dateKey, WORK_LINES.length)],
      love: LOVE_LINES[pickIndex(k + "love", dateKey, LOVE_LINES.length)],
      health: HEALTH_LINES[pickIndex(k + "health", dateKey, HEALTH_LINES.length)],
      advice: ADVICE_LINES[pickIndex(k + "advice", dateKey, ADVICE_LINES.length)],
      color: LUCKY_COLORS[pickIndex(k + "color", dateKey, LUCKY_COLORS.length)],
      number: 1 + pickIndex(k + "num", dateKey, 9),
      hour: 6 + pickIndex(k + "hour", dateKey, 16),
      friend: ZODIAC_SIGNS[pickIndex(k + "friend", dateKey, ZODIAC_SIGNS.length)],
      e: {
        general: energyScore(k, dateKey, "g"),
        work: energyScore(k, dateKey, "w"),
        love: energyScore(k, dateKey, "l"),
        health: energyScore(k, dateKey, "h"),
      },
    };
  }, [z, dateKey]);

  const selCls = "focus-ring w-full rounded-2xl border-2 border-line bg-surface-1 px-4 py-3 font-display text-base font-semibold text-ink outline-none transition hover:border-primary-400/60 focus:border-primary-500";

  return (
    <section className="section"><div className="container-px">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-line justify-center">Өдрийн зурхай</p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">Өнөөдөр таны од юу өгүүлж байна?</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Төрсөн он, сар, өдрөө оруулбал таны ордыг тодорхойлж, <span className="font-semibold text-ink">{dateLabel}</span>-ийн
          зурхайг сэтгэл санаа, ажил хэрэг, хайр дурлал, эрүүл мэндийн хувьд тайлж өгнө.
        </p>
      </div>

      {/* Огнооны сонголт */}
      <div className="panel mx-auto mt-10 max-w-3xl p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Төрсөн он</label>
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
        {!z && <p className="mt-4 text-center text-sm text-muted">Сар, өдрөө сонгоход тайлал шууд гарч ирнэ.</p>}
      </div>

      {/* Тайлал */}
      {z && reading && (
        <div className="mx-auto mt-8 max-w-3xl animate-fade-rise">
          {/* Ордын толгой */}
          <div className="night relative overflow-hidden rounded-[1.75rem] p-7 sm:p-9"
            style={{ backgroundImage: "linear-gradient(150deg,#0F2B26 0%,#12302A 55%,#1E2A1C 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(232,183,95,0.28), transparent 70%)", filter: "blur(10px)" }} />
            <div className="relative z-10 flex flex-wrap items-center gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-accent-300/40 bg-white/5 text-5xl text-accent-300">
                {z.symbol}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-300">{dateLabel}</p>
                <h3 className="mt-1.5 font-display text-3xl font-semibold text-white">{z.name} орд</h3>
                <p className="mt-1 text-sm text-white/70">{z.element} махбод · {z.trait}</p>
              </div>
            </div>
            <p className="relative z-10 mt-6 text-lg leading-relaxed text-white/90">{reading.mood}</p>
          </div>

          {/* Эрчмийн хэмжүүр */}
          <div className="panel mt-5 grid gap-3 p-6 sm:grid-cols-2 sm:gap-x-10">
            <Stars n={reading.e.general} label="Ерөнхий эрчим" />
            <Stars n={reading.e.work} label="Ажил, санхүү" />
            <Stars n={reading.e.love} label="Хайр, харилцаа" />
            <Stars n={reading.e.health} label="Эрүүл мэнд" />
          </div>

          {/* Салбар тус бүр */}
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              { icon: "💼", title: "Ажил хэрэг", text: reading.work },
              { icon: "💗", title: "Хайр дурлал", text: reading.love },
              { icon: "🌿", title: "Эрүүл мэнд", text: reading.health },
            ].map((c) => (
              <article key={c.title} className="panel p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-500/12 text-xl">{c.icon}</span>
                <h4 className="mt-3 font-display text-lg font-semibold text-ink">{c.title}</h4>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{c.text}</p>
              </article>
            ))}
          </div>

          {/* Өдрийн тэмдэг тэмдэглэгээ */}
          <div className="panel mt-5 grid gap-5 p-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Азын тоо</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary-700">{reading.number}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Азын өнгө</p>
              <p className="mt-1.5 inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
                <span aria-hidden className="h-4 w-4 rounded-full ring-1 ring-line" style={{ background: reading.color.hex }} />
                {reading.color.name}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Тохиромжтой цаг</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary-700">{reading.hour}:00</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Ээлтэй орд</p>
              <p className="mt-1 font-display text-base font-semibold text-ink">{reading.friend.symbol} {reading.friend.name}</p>
            </div>
          </div>

          {/* Өдрийн зөвлөгөө */}
          <div className="panel mt-5 p-6 sm:p-7">
            <p className="eyebrow-line">Өдрийн зөвлөгөө</p>
            <p className="mt-3 font-display text-xl leading-relaxed text-ink">“{reading.advice}”</p>
          </div>

          {/* Гүнзгий тайлал руу */}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/matrix" className="btn btn-primary btn-md">🔢 Тоон зурхайн матрикс</Link>
            <Link href="/shop#shop" className="btn btn-gold btn-md">💎 Ордын ээлтэй чулуу</Link>
            <Link href="/services" className="btn btn-outline btn-md">Гүнзгий тайлал захиалах</Link>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Зурхай бол чиглүүлэг — эцсийн шийдвэр үргэлж таных.
          </p>
        </div>
      )}
    </div></section>
  );
}
