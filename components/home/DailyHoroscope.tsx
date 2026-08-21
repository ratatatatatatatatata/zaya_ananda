"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useZurhaiRules, matchRule } from "@/lib/zurhai-rules";
import { ZODIAC_SIGNS, zodiacOf, pickIndex, energyScore } from "@/data/daily-horoscope";
import { WORK_L, LOVE_L, HEALTH_L, ADVICE_L, COLORS_L, DUI } from "@/data/daily-i18n";
import { DAY_THEMES_L, UI } from "@/data/merge-i18n2";
import { ZODIAC_NAME_L, ELEMENT_L, TRAIT_L } from "@/data/merge-i18n";

function daysIn(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

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
  const { tr } = useI18n();
  const rules = useZurhaiRules();
  const d = (k: string) => tr(DUI[k]);

  const now = useMemo(() => new Date(), []);
  const years = useMemo(() => Array.from({ length: now.getFullYear() - 1929 }, (_, i) => now.getFullYear() - i), [now]);
  const MONTHS = useMemo(() => tr(UI.monthNames).split(","), [tr]);

  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");

  const maxDay = month ? daysIn(typeof year === "number" ? year : 2000, month) : 31;
  const z = useMemo(() => (month && day ? zodiacOf(month as number, day as number) : null), [month, day]);

  const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const dateLabel = `${now.getFullYear()} · ${MONTHS[now.getMonth()]} · ${now.getDate()}`;

  const reading = useMemo(() => {
    if (!z) return null;
    const k = z.key;
    return {
      theme: DAY_THEMES_L[pickIndex(k + "mood", dateKey, DAY_THEMES_L.length)],
      work: WORK_L[pickIndex(k + "work", dateKey, WORK_L.length)],
      love: LOVE_L[pickIndex(k + "love", dateKey, LOVE_L.length)],
      health: HEALTH_L[pickIndex(k + "health", dateKey, HEALTH_L.length)],
      advice: ADVICE_L[pickIndex(k + "advice", dateKey, ADVICE_L.length)],
      color: COLORS_L[pickIndex(k + "color", dateKey, COLORS_L.length)],
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
        <p className="eyebrow-line justify-center">{d("eyebrow")}</p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{d("h2")}</h2>
        <p className="mt-3 leading-relaxed text-muted">{d("lead")}</p>
      </div>

      {/* Огнооны сонголт */}
      <div className="panel mx-auto mt-10 max-w-3xl p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{tr(UI.year)}</label>
            <select className={selCls} value={year} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}>
              <option value="">{tr(UI.pickYear)}</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{tr(UI.month)}</label>
            <select className={selCls} value={month} onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : "")}>
              <option value="">{tr(UI.pickMonth)}</option>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{tr(UI.day)}</label>
            <select className={selCls} value={day} onChange={(e) => setDay(e.target.value ? Number(e.target.value) : "")}>
              <option value="">{tr(UI.pickDay)}</option>
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((dd) => <option key={dd} value={dd}>{dd}</option>)}
            </select>
          </div>
        </div>
        {!z && <p className="mt-4 text-center text-sm text-muted">{tr(UI.hint)}</p>}
      </div>

      {/* Тайлал */}
      {z && reading && (
        <div className="mx-auto mt-8 max-w-3xl animate-fade-rise">
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
                <h3 className="mt-1.5 font-display text-3xl font-semibold text-white">{tr(ZODIAC_NAME_L[z.key])}</h3>
                <p className="mt-1 text-sm text-white/70">{tr(ELEMENT_L[z.element])} · {tr(TRAIT_L[z.key])}</p>
              </div>
            </div>
            <p className="relative z-10 mt-6 font-display text-xl text-white">{tr(reading.theme.t)}</p>
            <p className="relative z-10 mt-2 text-lg leading-relaxed text-white/90">
              {matchRule(rules, { zodiacKey: z.key, element: z.element, date: now }) || tr(reading.theme.s)}
            </p>
          </div>

          {/* Эрчмийн хэмжүүр */}
          <div className="panel mt-5 grid gap-3 p-6 sm:grid-cols-2 sm:gap-x-10">
            <Stars n={reading.e.general} label={d("general")} />
            <Stars n={reading.e.work} label={d("work")} />
            <Stars n={reading.e.love} label={d("love")} />
            <Stars n={reading.e.health} label={d("health")} />
          </div>

          {/* Салбар тус бүр */}
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              { icon: "💼", title: d("work"), text: tr(reading.work) },
              { icon: "💗", title: d("love"), text: tr(reading.love) },
              { icon: "🌿", title: d("health"), text: tr(reading.health) },
            ].map((c) => (
              <article key={c.title} className="panel p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-500/12 text-xl">{c.icon}</span>
                <h4 className="mt-3 font-display text-lg font-semibold text-ink">{c.title}</h4>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{c.text}</p>
              </article>
            ))}
          </div>

          {/* Өдрийн тэмдэглэгээ */}
          <div className="panel mt-5 grid gap-5 p-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">{d("luckyN")}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary-700">{reading.number}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">{d("luckyC")}</p>
              <p className="mt-1.5 inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
                <span aria-hidden className="h-4 w-4 rounded-full ring-1 ring-line" style={{ background: reading.color.hex }} />
                {tr(reading.color.name)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">{d("hour")}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary-700">{reading.hour}:00</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">{d("friend")}</p>
              <p className="mt-1 font-display text-base font-semibold text-ink">{reading.friend.symbol} {tr(ZODIAC_NAME_L[reading.friend.key])}</p>
            </div>
          </div>

          {/* Зөвлөгөө */}
          <div className="panel mt-5 p-6 sm:p-7">
            <p className="eyebrow-line">{d("tip")}</p>
            <p className="mt-3 font-display text-xl leading-relaxed text-ink">“{tr(reading.advice)}”</p>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={`/merge?y=${year}&m=${month}&d=${day}`} className="btn btn-primary btn-md">
              🔮 {d("ctaMerge")}
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-muted">{d("note")}</p>
        </div>
      )}
    </div></section>
  );
}
