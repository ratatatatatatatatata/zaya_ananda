"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { formatMNT } from "@/lib/format";
import type { L } from "@/lib/types";
import * as TZ from "@/data/toorog";

const fnv = (s: string) => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
const pickN = (base: number, max: number, n: number) => {
  const out: number[] = []; let x = (base ^ 0x9e3779b9) >>> 0;
  while (out.length < Math.min(n, max)) { x = (Math.imul(x, 1103515245) + 12345) >>> 0; const v = 1 + (x % max); if (!out.includes(v)) out.push(v); }
  return out.sort((a, b) => a - b);
};
const MONTH_PRICE = 9900;
const YEAR_PRICE = 29900;
const TAG: Record<string, string> = { mn: "mn", en: "en-US", ko: "ko", ja: "ja", zh: "zh-CN" };
const TEASER_MONTH: L = { mn: "Тухайн сарын дэлгэрэнгүй төөргийг үзмээр байна уу?", en: "Would you like to see the detailed monthly reading?", ko: "해당 월의 상세 운세를 보시겠어요?", ja: "その月の詳しい運勢をご覧になりますか？", zh: "想查看该月的详细运势吗？" };
const TEASER_YEAR: L = { mn: "Тухайн жилийн дэлгэрэнгүй төөргийг үзмээр байна уу?", en: "Would you like to see the detailed yearly reading?", ko: "해당 연도의 상세 운세를 보시겠어요?", ja: "その年の詳しい運勢をご覧になりますか？", zh: "想查看该年的详细运势吗？" };

export function ToorogReading() {
  const { tr, lang } = useI18n();
  const tag = TAG[lang] || "en-US";
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const maxDate = useMemo(() => { const d = new Date(today); d.setMonth(d.getMonth() + 1); return d; }, [today]);
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const nowY = today.getFullYear();
  const years = useMemo(() => Array.from({ length: nowY - 1929 }, (_, i) => nowY - i), [nowY]);
  const [by, setBy] = useState(""); const [bm, setBm] = useState(""); const [bd, setBd] = useState("");
  const birthOk = !!by && !!bm && !!bd;

  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [sel, setSel] = useState("");
  const effISO = sel || todayISO; // daily/premium default to today until a day is picked

  // separate unlocks (monthly + yearly), each with its own price
  const [unlockedM, setUnlockedM] = useState(false);
  const [unlockedY, setUnlockedY] = useState(false);
  const [payPlan, setPayPlan] = useState<null | "month" | "year">(null);
  useEffect(() => { try { if (localStorage.getItem("toorog_month") === "1") setUnlockedM(true); if (localStorage.getItem("toorog_year") === "1") setUnlockedY(true); } catch { /* ignore */ } }, []);
  const confirmPay = () => {
    if (payPlan === "month") { setUnlockedM(true); try { localStorage.setItem("toorog_month", "1"); } catch { /* ignore */ } }
    else if (payPlan === "year") { setUnlockedY(true); try { localStorage.setItem("toorog_year", "1"); } catch { /* ignore */ } }
    setPayPlan(null);
  };

  const y = view.getFullYear(), m = view.getMonth();
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
  const dim = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  const canPrev = y > today.getFullYear() || (y === today.getFullYear() && m > today.getMonth());
  const canNext = y < maxDate.getFullYear() || (y === maxDate.getFullYear() && m < maxDate.getMonth());
  const iso = (d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const cellDate = (d: number) => new Date(y, m, d);
  const offDay = (d: number) => cellDate(d) < today || cellDate(d) > maxDate;

  const wd = useMemo(() => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(tag, { weekday: "short" }).format(new Date(2024, 0, 1 + i))), [tag]);
  const monthLabel = new Intl.DateTimeFormat(tag, { year: "numeric", month: "long" }).format(view);
  const trA = (arr: L[], salt: string, base: number) => tr(arr[(base ^ fnv(salt)) % arr.length]);

  const daily = useMemo(() => {
    if (!birthOk) return null;
    const base = fnv(`${by}.${bm}.${bd}#D${effISO}`);
    const ei = (base ^ fnv("el")) % TZ.T_ELEMENTS.length;
    return {
      stars: 3 + ((base >>> 7) % 3),
      element: tr(TZ.T_ELEMENTS[ei]), elementNote: tr(TZ.T_ELNOTE[ei]),
      mood: trA(TZ.T_MOOD, "mood", base), work: trA(TZ.T_WORK, "work", base), love: trA(TZ.T_LOVE, "love", base),
      health: trA(TZ.T_HEALTH, "health", base), advice: trA(TZ.T_ADVICE, "advice", base),
      color: trA(TZ.T_COLORS, "color", base), dir: trA(TZ.T_DIRS, "dir", base), num: 1 + (base % 9),
      dateLabel: new Intl.DateTimeFormat(tag, { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(new Date(effISO + "T00:00:00")),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthOk, effISO, by, bm, bd, lang]);

  const pr = useMemo(() => {
    if (!birthOk) return null;
    const [yy, mm] = effISO.split("-").map(Number);
    const mBase = fnv(`${by}.${bm}.${bd}#M${yy}-${mm}`);
    const yBase = fnv(`${by}.${bm}.${bd}#Y${yy}`);
    const dimM = new Date(yy, mm, 0).getDate();
    const monthName = (n: number) => new Intl.DateTimeFormat(tag, { month: "long" }).format(new Date(2025, n - 1, 1));
    return {
      monthLabel: new Intl.DateTimeFormat(tag, { year: "numeric", month: "long" }).format(new Date(yy, mm - 1, 1)),
      yearLabel: String(yy),
      mTheme: trA(TZ.M_THEME, "mt", mBase), mCareer: trA(TZ.M_CAREER, "mc", mBase), mLove: trA(TZ.M_LOVE, "ml", mBase),
      mHealth: trA(TZ.M_HEALTH, "mh", mBase), mFinance: trA(TZ.M_FINANCE, "mf", mBase), mAdvice: trA(TZ.M_ADVICE, "ma", mBase),
      luckyDays: pickN(mBase, dimM, 3),
      yTheme: trA(TZ.Y_THEME, "yt", yBase), yGrowth: trA(TZ.Y_GROWTH, "yg", yBase), yRelations: trA(TZ.Y_RELATIONS, "yr", yBase),
      yCareer: trA(TZ.Y_CAREER, "yc", yBase), yCaution: trA(TZ.Y_CAUTION, "yx", yBase), yAffirm: trA(TZ.Y_AFFIRM, "yaf", yBase),
      luckyMonths: pickN(yBase, 12, 3).map(monthName),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthOk, effISO, by, bm, bd, lang]);

  const facet = (label: L, value: string, icon: string) => (
    <div className="rounded-2xl border border-line bg-[#111B2D] p-4">
      <p className="font-display font-semibold text-ink">{icon} {tr(label)}</p>
      <p className="mt-1.5 text-[1.04rem] leading-relaxed text-muted">{value}</p>
    </div>
  );

  const lockedCard = (title: L, price: number, plan: "month" | "year") => (
    <div className="card overflow-hidden border-2 border-accent-200">
      <div className="bg-gold-grad px-6 py-5 text-white"><p className="font-display text-xl font-semibold">🔒 {tr(title)}</p></div>
      <div className="p-6 text-center">
        <p className="mx-auto max-w-md text-[1.05rem] leading-relaxed text-muted">{tr(plan === "year" ? TEASER_YEAR : TEASER_MONTH)}</p>
        <p className="mt-4 text-3xl font-bold text-ink">{formatMNT(price)}</p>
        <button onClick={() => setPayPlan(plan)} className="btn btn-gold btn-lg mt-5">{tr(TZ.TUI.unlock)}</button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="eyebrow justify-center"><span className="h-px w-6 bg-primary-400" />✦ Zaya&apos;s Ananda</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{tr(TZ.TUI.title)}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">{tr(TZ.TUI.intro)}</p>
      </div>

      {/* birth date */}
      <div className="card mt-8 p-6">
        <p className="field-label">{tr(TZ.TUI.birth)}</p>
        <div className="grid grid-cols-3 gap-3">
          <label className="block"><span className="mb-1 block text-sm text-muted">{tr(TZ.TUI.year)}</span>
            <select value={by} onChange={(e) => setBy(e.target.value)} className="input"><option value="">—</option>{years.map((yy) => <option key={yy} value={yy}>{yy}</option>)}</select></label>
          <label className="block"><span className="mb-1 block text-sm text-muted">{tr(TZ.TUI.month)}</span>
            <select value={bm} onChange={(e) => setBm(e.target.value)} className="input"><option value="">—</option>{Array.from({ length: 12 }, (_, i) => i + 1).map((mm) => <option key={mm} value={mm}>{mm}</option>)}</select></label>
          <label className="block"><span className="mb-1 block text-sm text-muted">{tr(TZ.TUI.day)}</span>
            <select value={bd} onChange={(e) => setBd(e.target.value)} className="input"><option value="">—</option>{Array.from({ length: 31 }, (_, i) => i + 1).map((dd) => <option key={dd} value={dd}>{dd}</option>)}</select></label>
        </div>
      </div>

      {!birthOk ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line bg-white/5 px-5 py-6 text-center text-muted">{tr(TZ.TUI.need)}</p>
      ) : (
        <>
          {/* calendar (today .. +1 month) */}
          <div className="card mt-6 p-6">
            <div className="flex items-center justify-between">
              <p className="field-label mb-0">{tr(TZ.TUI.pick)}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => canPrev && setView(new Date(y, m - 1, 1))} disabled={!canPrev} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink/70 transition enabled:hover:border-primary-300 disabled:opacity-30" aria-label="Prev">‹</button>
                <span className="min-w-[150px] text-center font-semibold text-ink">{monthLabel}</span>
                <button onClick={() => canNext && setView(new Date(y, m + 1, 1))} disabled={!canNext} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink/70 transition enabled:hover:border-primary-300 disabled:opacity-30" aria-label="Next">›</button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-sm text-muted">{wd.map((d, i) => <div key={i} className="py-1 font-semibold">{d}</div>)}</div>
            <div className="mt-1 grid grid-cols-7 gap-1.5">
              {cells.map((d, i) => {
                if (d === null) return <div key={i} />;
                const v = iso(d); const off = offDay(d); const active = effISO === v;
                return (<button key={i} disabled={off} onClick={() => setSel(v)} className={"aspect-square rounded-xl text-[1.02rem] font-semibold transition " + (off ? "cursor-not-allowed text-ink/20" : active ? "bg-primary-grad text-white shadow-soft" : "text-ink/80 hover:bg-primary-50")}>{d}</button>);
              })}
            </div>
          </div>

          {/* DAILY (free, shown for every day) */}
          {daily && (
            <div className="card mt-6 overflow-hidden">
              <div className="bg-magic-grad px-6 py-6 text-center text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/80">{daily.dateLabel}</p>
                <div className="mt-2 text-2xl">{"★".repeat(daily.stars)}{"☆".repeat(5 - daily.stars)}</div>
                <p className="mt-2 text-lg font-semibold">{tr(TZ.TUI.element)}: {daily.element} — {daily.elementNote}</p>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                {facet(TZ.TUI.mood, daily.mood, "💗")}{facet(TZ.TUI.work, daily.work, "🌱")}{facet(TZ.TUI.love, daily.love, "🤝")}{facet(TZ.TUI.health, daily.health, "🍃")}
              </div>
              <div className="grid grid-cols-3 gap-3 px-6 text-center">
                <div className="rounded-2xl bg-primary-50 p-3"><p className="text-xs text-muted">{tr(TZ.TUI.color)}</p><p className="mt-1 font-semibold text-ink">{daily.color}</p></div>
                <div className="rounded-2xl bg-lavender-100 p-3"><p className="text-xs text-muted">{tr(TZ.TUI.num)}</p><p className="mt-1 font-semibold text-ink">{daily.num}</p></div>
                <div className="rounded-2xl bg-blush-100 p-3"><p className="text-xs text-muted">{tr(TZ.TUI.dir)}</p><p className="mt-1 font-semibold text-ink">{daily.dir}</p></div>
              </div>
              <div className="m-6 mt-4 rounded-2xl bg-gradient-to-br from-primary-50 to-lavender-100 p-5"><p className="font-display font-semibold text-primary-700">✦ {tr(TZ.TUI.advice)}</p><p className="mt-1.5 text-[1.06rem] leading-relaxed text-ink/80">{daily.advice}</p></div>
            </div>
          )}

          {/* MONTHLY (paid, separate) */}
          {pr && (
            <div className="mt-6">
              {!unlockedM ? lockedCard(TZ.TUI.monthlyTitle, MONTH_PRICE, "month") : (
                <div className="card overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-jade px-6 py-5 text-white"><p className="text-sm font-semibold uppercase tracking-wide text-white/80">{pr.monthLabel} · {tr(TZ.TUI.paid)}</p><p className="font-display text-xl font-semibold">{tr(TZ.TUI.monthlyTitle)}</p></div>
                  <div className="p-6">
                    <p className="text-[1.08rem] font-semibold leading-relaxed text-ink">{pr.mTheme}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">{facet(TZ.TUI.career, pr.mCareer, "💼")}{facet(TZ.TUI.love, pr.mLove, "🤝")}{facet(TZ.TUI.health, pr.mHealth, "🍃")}{facet(TZ.TUI.finance, pr.mFinance, "💰")}</div>
                    <div className="mt-4 rounded-2xl bg-primary-50 p-4"><p className="font-semibold text-primary-700">📅 {tr(TZ.TUI.luckyDays)}: <span className="text-ink">{pr.luckyDays.join(", ")}</span></p></div>
                    <div className="mt-3 rounded-2xl bg-gradient-to-br from-primary-50 to-lavender-100 p-4"><p className="font-semibold text-primary-700">✦ {tr(TZ.TUI.advice)}</p><p className="mt-1 leading-relaxed text-ink/80">{pr.mAdvice}</p></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* YEARLY (paid, separate, pricier) */}
          {pr && (
            <div className="mt-6">
              {!unlockedY ? lockedCard(TZ.TUI.yearlyTitle, YEAR_PRICE, "year") : (
                <div className="card overflow-hidden">
                  <div className="bg-gradient-to-r from-grape to-blue px-6 py-5 text-white"><p className="text-sm font-semibold uppercase tracking-wide text-white/80">{pr.yearLabel} · {tr(TZ.TUI.paid)}</p><p className="font-display text-xl font-semibold">{tr(TZ.TUI.yearlyTitle)}</p></div>
                  <div className="p-6">
                    <p className="text-[1.08rem] font-semibold leading-relaxed text-ink">{pr.yTheme}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">{facet(TZ.TUI.growth, pr.yGrowth, "🌟")}{facet(TZ.TUI.relations, pr.yRelations, "🤝")}{facet(TZ.TUI.career, pr.yCareer, "💼")}{facet(TZ.TUI.caution, pr.yCaution, "⚠️")}</div>
                    <div className="mt-4 rounded-2xl bg-lavender-100 p-4"><p className="font-semibold text-grape">🌙 {tr(TZ.TUI.luckyMonths)}: <span className="text-ink">{pr.luckyMonths.join(", ")}</span></p></div>
                    <div className="mt-3 rounded-2xl bg-gradient-to-br from-blush-100 to-lavender-100 p-4"><p className="font-semibold text-grape">✦ {tr(TZ.TUI.affirm)}</p><p className="mt-1 text-[1.06rem] italic leading-relaxed text-ink/80">“{pr.yAffirm}”</p></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <p className="mt-4 text-center text-sm text-muted">{tr(TZ.TUI.note)}</p>

      {/* PAYMENT modal */}
      {payPlan && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setPayPlan(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-[#111B2D] p-6 text-center shadow-lift" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-xl font-semibold text-ink">{tr(payPlan === "year" ? TZ.TUI.yearlyTitle : TZ.TUI.monthlyTitle)}</p>
            <p className="text-sm text-muted">{tr(TZ.TUI.payTitle)}</p>
            <p className="mt-1 text-3xl font-bold text-primary-700">{formatMNT(payPlan === "year" ? YEAR_PRICE : MONTH_PRICE)}</p>
            <div className="mx-auto mt-4 grid h-44 w-44 grid-cols-9 gap-0.5 rounded-2xl border border-line bg-[#111B2D] p-2">
              {Array.from({ length: 81 }).map((_, i) => <div key={i} className={(fnv(payPlan + "qr" + i) % 10 < 5) ? "bg-ink" : "bg-[#111B2D]"} />)}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{tr(TZ.TUI.payDesc)}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setPayPlan(null)} className="btn btn-outline btn-md flex-1">{tr(TZ.TUI.payClose)}</button>
              <button onClick={confirmPay} className="btn btn-primary btn-md flex-1">{tr(TZ.TUI.payConfirm)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
