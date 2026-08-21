"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { PurchaseBox } from "@/components/PurchaseBox";
import { ZODIAC_SIGNS, zodiacOf, pickIndex } from "@/data/daily-horoscope";
import {
  LIFE_PATHS_L, BIRTH_MONTH_L, BIRTH_YEAR_L, ARCANA_L,
  ZODIAC_NAME_L, ELEMENT_L, TRAIT_L,
} from "@/data/merge-i18n";
import {
  DAY_THEMES_L, MONTH_THEMES_L, YEAR_ADVICE_L, PERSONAL_YEAR_L,
  HD_TYPES_L, HD_AUTHORITY_L, UI,
} from "@/data/merge-i18n2";
import { lifePathOf, personalYear, seedIndex, MERGE_ITEMS } from "@/data/merge-toorog";

const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();
const fmt = (n: number) => String(n).padStart(2, "0");
const DIM_KEYS = ["lead", "create", "intu", "bond", "disc", "spirit", "love", "wealth", "learn", "serve"];
const FREE_DAYS = 7;

type Access = { status: "none" | "pending" | "active" | "expired"; daysLeft?: number | null };

function reduceArcana(n: number): number {
  let v = n;
  while (v > 22) v -= 22;
  return v || 22;
}
const digitSum = (n: number) => String(n).split("").reduce((a, c) => a + Number(c), 0);
const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/* ---------- Дэд бүрдлүүд ---------- */

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="font-display text-sm font-semibold text-primary-700">{value}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line/60">
        <div className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${value}%`, backgroundImage: "linear-gradient(90deg,#0F7A66,#E8B75F)" }} />
      </div>
    </div>
  );
}

function Card({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <article className="panel p-6 sm:p-7">
      <p className="eyebrow-line">{eyebrow}</p>
      <h3 className="mt-3 font-display text-xl font-semibold text-ink">{title}</h3>
      <div className="mt-2.5 text-[0.98rem] leading-relaxed text-muted">{children}</div>
    </article>
  );
}

function LockedPanel({
  icon, title, desc, bullets, item, afterPay, daysOpen,
}: {
  icon: string; title: string; desc: string; bullets: string[];
  item: { id: string; title: string; price: number; days: number };
  afterPay: string; daysOpen: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
      <div className="night relative overflow-hidden rounded-[1.75rem] p-7 sm:p-9"
        style={{ backgroundImage: "linear-gradient(150deg,#0F2B26 0%,#12302A 55%,#1E2A1C 100%)" }}>
        <div aria-hidden className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,183,95,0.24), transparent 70%)", filter: "blur(10px)" }} />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-accent-300/40 bg-white/5 text-2xl">{icon}</span>
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-1.5 leading-relaxed text-white/75">{desc}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-white/85">
                <span aria-hidden className="mt-1 text-accent-300">✦</span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
          <div aria-hidden className="mt-6 space-y-2.5 select-none" style={{ filter: "blur(5px)", opacity: 0.45 }}>
            <div className="h-3 w-11/12 rounded-full bg-white/25" />
            <div className="h-3 w-9/12 rounded-full bg-white/20" />
            <div className="h-3 w-10/12 rounded-full bg-white/15" />
          </div>
          <p className="mt-6 text-sm text-white/60">{afterPay} {item.days} {daysOpen}</p>
        </div>
      </div>
      <div className="lg:self-start">
        <PurchaseBox id={item.id} title={item.title} price={item.price} />
      </div>
    </div>
  );
}

/* ---------- Гол бүрдэл ---------- */

export function MergeToorog() {
  const { user } = useAuth();
  const { tr } = useI18n();
  const u = (k: string) => tr(UI[k]);

  const now = useMemo(() => new Date(), []);
  const years = useMemo(() => Array.from({ length: now.getFullYear() - 1929 }, (_, i) => now.getFullYear() - i), [now]);
  const MONTHS = useMemo(() => u("monthNames").split(","), [tr]); // eslint-disable-line react-hooks/exhaustive-deps
  const WD = useMemo(() => u("weekdays").split(","), [tr]); // eslint-disable-line react-hooks/exhaustive-deps
  const DIM_LABELS = useMemo(() => u("dims").split(","), [tr]); // eslint-disable-line react-hooks/exhaustive-deps

  const [by, setBy] = useState<number | "">("");
  const [bm, setBm] = useState<number | "">("");
  const [bd, setBd] = useState<number | "">("");

  /** Нүүр хуудсанд оруулсан огноог хаягаар дамжуулж авна: /merge?y=1994&m=7&d=21 */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const n = (k: string) => { const v = Number(q.get(k)); return Number.isFinite(v) && v > 0 ? v : null; };
    const y = n("y"), m = n("m"), d = n("d");
    if (y && m && d && m <= 12 && d <= 31) { setBy(y); setBm(m); setBd(d); }
  }, []);

  const [calY, setCalY] = useState(now.getFullYear());
  const [calM, setCalM] = useState(now.getMonth() + 1);
  const [selDay, setSelDay] = useState(now.getDate());

  const [accM, setAccM] = useState<Access | null>(null);
  const [accY, setAccY] = useState<Access | null>(null);

  const ready = typeof by === "number" && typeof bm === "number" && typeof bd === "number";
  const birthKey = ready ? `${by}-${bm}-${bd}` : "";

  useEffect(() => {
    if (!user) { setAccM(null); setAccY(null); return; }
    const load = (id: string, set: (a: Access) => void) =>
      fetch("/api/access?itemId=" + encodeURIComponent(id), { cache: "no-store" })
        .then((r) => r.json()).then(set).catch(() => set({ status: "none" }));
    load(MERGE_ITEMS.month.id, setAccM);
    load(MERGE_ITEMS.year.id, setAccY);
  }, [user]);

  const paid = accM?.status === "active" || accY?.status === "active";

  /* ---- Үнэгүй үндсэн профайл ---- */
  const profile = useMemo(() => {
    if (!ready) return null;
    const y = by as number, m = bm as number, d = bd as number;
    const z = zodiacOf(m, d);
    const lp = LIFE_PATHS_L[lifePathOf(y, m, d)] || LIFE_PATHS_L[9];
    const dayArc = ARCANA_L[reduceArcana(d)];
    const monArc = ARCANA_L[reduceArcana(m)];
    let yr = digitSum(y); if (yr > 22) yr = digitSum(yr);
    const yearArc = ARCANA_L[reduceArcana(yr)];
    const purpose = ARCANA_L[reduceArcana(reduceArcana(d) + reduceArcana(m) + reduceArcana(yr))];
    const hd = HD_TYPES_L[seedIndex(birthKey + "hd", HD_TYPES_L.length)];
    const auth = HD_AUTHORITY_L[seedIndex(birthKey + "auth", HD_AUTHORITY_L.length)];
    const dims = DIM_KEYS.map((k, i) => ({ k, label: DIM_LABELS[i] || k, value: 30 + seedIndex(birthKey + k, 66) }));
    const py = personalYear(m, d, now.getFullYear());
    const bMonth = BIRTH_MONTH_L[m];
    const bYear = BIRTH_YEAR_L[((digitSum(y) - 1) % 9) + 1];
    return { z, lp, dayArc, monArc, yearArc, purpose, hd, auth, dims, py, bMonth, bYear };
  }, [ready, by, bm, bd, birthKey, now, DIM_LABELS]);

  /* ---- Сонгосон өдөр ---- */
  const selTime = useMemo(() => new Date(calY, calM - 1, selDay).getTime(), [calY, calM, selDay]);
  const todayT = useMemo(() => dayStart(now), [now]);
  const freeUntil = todayT + (FREE_DAYS - 1) * 86400000;
  const dayUnlocked = paid || (selTime >= todayT && selTime <= freeUntil);

  const dayRead = useMemo(() => {
    if (!profile) return null;
    const key = `${calY}-${fmt(calM)}-${fmt(selDay)}`;
    const theme = DAY_THEMES_L[pickIndex(profile.z.key + birthKey, key, DAY_THEMES_L.length)];
    const arc = ARCANA_L[reduceArcana(((selDay + calM + digitSum(calY)) % 22) + 1)];
    return {
      theme, arc,
      energy: 2 + pickIndex(birthKey + "e", key, 4),
      work: 2 + pickIndex(birthKey + "w", key, 4),
      love: 2 + pickIndex(birthKey + "l", key, 4),
      luckyN: 1 + pickIndex(birthKey + "n", key, 9),
      hour: 6 + pickIndex(birthKey + "h", key, 15),
      friend: ZODIAC_SIGNS[pickIndex(birthKey + "f", key, 12)],
    };
  }, [profile, calY, calM, selDay, birthKey]);

  const monthRead = useMemo(() => {
    if (!profile) return null;
    const key = `${calY}-${fmt(calM)}`;
    const head = MONTH_THEMES_L[pickIndex(birthKey + "M", key, MONTH_THEMES_L.length)];
    const weeks = [1, 2, 3, 4].map((w) => DAY_THEMES_L[pickIndex(birthKey + "w" + w, key, DAY_THEMES_L.length)]);
    return {
      head, weeks,
      best: 1 + pickIndex(birthKey + "best", key, daysIn(calY, calM)),
      care: 1 + pickIndex(birthKey + "care", key, daysIn(calY, calM)),
      arc: ARCANA_L[reduceArcana(((calM + digitSum(calY)) % 22) + 1)],
    };
  }, [profile, calY, calM, birthKey]);

  const yearRead = useMemo(() => {
    if (!profile) return null;
    return {
      py: personalYear(bm as number, bd as number, calY),
      advice: YEAR_ADVICE_L[pickIndex(birthKey + "Y", String(calY), YEAR_ADVICE_L.length)],
      months: MONTHS.map((label, i) => ({ label, text: MONTH_THEMES_L[pickIndex(birthKey + "m" + i, String(calY), MONTH_THEMES_L.length)] })),
    };
  }, [profile, bm, bd, calY, birthKey, MONTHS]);

  const grid = useMemo(() => {
    const total = daysIn(calY, calM);
    const lead = (new Date(calY, calM - 1, 1).getDay() + 6) % 7;
    return { total, lead };
  }, [calY, calM]);

  const shiftMonth = (delta: number) => {
    let m = calM + delta, y = calY;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    setCalY(y); setCalM(m);
    setSelDay((d) => Math.min(d, daysIn(y, m)));
  };

  const selCls = "focus-ring w-full rounded-2xl border-2 border-line bg-surface-1 px-4 py-3 font-display text-base font-semibold text-ink outline-none transition hover:border-primary-400/60 focus:border-primary-500";
  const Stars = ({ n }: { n: number }) => (
    <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <span key={i} aria-hidden className={i <= n ? "text-accent-300" : "text-line"}>★</span>)}</span>
  );

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-line justify-center">{u("eyebrow")}</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-5xl">{u("h1")}</h1>
        <p className="mt-4 leading-relaxed text-muted">{u("intro")}</p>
      </div>

      {/* Огнооны оролт */}
      <div className="panel mx-auto mt-10 max-w-3xl p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{u("year")}</label>
            <select className={selCls} value={by} onChange={(e) => setBy(e.target.value ? Number(e.target.value) : "")}>
              <option value="">{u("pickYear")}</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{u("month")}</label>
            <select className={selCls} value={bm} onChange={(e) => setBm(e.target.value ? Number(e.target.value) : "")}>
              <option value="">{u("pickMonth")}</option>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{u("day")}</label>
            <select className={selCls} value={bd} onChange={(e) => setBd(e.target.value ? Number(e.target.value) : "")}>
              <option value="">{u("pickDay")}</option>
              {Array.from({ length: typeof bm === "number" ? daysIn(typeof by === "number" ? by : 2000, bm) : 31 }, (_, i) => i + 1)
                .map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {!ready && <p className="mt-4 text-center text-sm text-muted">{u("hint")}</p>}
      </div>

      {ready && profile && (
        <div className="mt-10 animate-fade-rise">
          {/* Гол мөн чанар */}
          <div className="night relative overflow-hidden rounded-[1.75rem] p-7 sm:p-10"
            style={{ backgroundImage: "linear-gradient(150deg,#0F2B26 0%,#12302A 55%,#1E2A1C 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(232,183,95,0.28), transparent 70%)", filter: "blur(12px)" }} />
            <div className="relative z-10 flex flex-wrap items-center gap-6">
              <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-accent-300/40 bg-white/5 text-6xl text-accent-300">{profile.z.symbol}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-300">{by} · {MONTHS[(bm as number) - 1]} · {bd}</p>
                <h2 className="mt-1.5 font-display text-3xl font-semibold text-white sm:text-4xl">
                  {tr(ZODIAC_NAME_L[profile.z.key])} · {tr(profile.lp.title)}
                </h2>
                <p className="mt-1.5 text-sm text-white/70">
                  {tr(ELEMENT_L[profile.z.element])} · {u("lifePath")} {profile.lp.n} · {tr(profile.hd.name)}
                </p>
              </div>
            </div>
            <p className="relative z-10 mt-7 text-lg leading-relaxed text-white/90">{tr(profile.lp.core)}</p>
            <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-accent-300">{u("strengths")}</p>
                <p className="mt-1.5 text-white/85">{tr(profile.lp.strength)}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-accent-300">{u("lessonT")}</p>
                <p className="mt-1.5 text-white/85">{tr(profile.lp.lesson)}</p>
              </div>
            </div>
          </div>

          {/* 10 хэмжүүр */}
          <div className="panel mt-6 p-6 sm:p-8">
            <p className="eyebrow-line">{u("mapEyebrow")}</p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">{u("mapTitle")}</h3>
            <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {profile.dims.map((d) => <Meter key={d.k} label={d.label} value={d.value} />)}
            </div>
          </div>

          {/* Дөрвөн систем */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Card eyebrow={u("astro")} title={`${tr(ZODIAC_NAME_L[profile.z.key])} · ${tr(ELEMENT_L[profile.z.element])}`}>
              {tr(TRAIT_L[profile.z.key])}
            </Card>
            <Card eyebrow={u("hd")} title={tr(profile.hd.name)}>
              {tr(profile.hd.text)}
              <span className="mt-2 block font-semibold text-ink">{tr(profile.hd.strategy)}</span>
              <span className="block text-sm">{tr(profile.auth)}</span>
            </Card>
            <Card eyebrow={u("matrix")} title={`${u("purpose")} · ${tr(profile.purpose.name)}`}>
              {tr(profile.purpose.text)}
            </Card>
            <Card eyebrow={u("numerology")} title={`${now.getFullYear()} · ${profile.py}`}>
              {tr(PERSONAL_YEAR_L[profile.py])}
            </Card>
            <Card eyebrow={u("monthTask")} title={tr(profile.bMonth.title)}>
              {tr(profile.bMonth.text)}
            </Card>
            <Card eyebrow={u("yearLesson")} title={`${by}`}>
              {tr(profile.bYear)}
            </Card>
          </div>

          {/* Гурван аркан */}
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              { t: u("arcDay"), a: profile.dayArc, n: reduceArcana(bd as number) },
              { t: u("arcMonth"), a: profile.monArc, n: reduceArcana(bm as number) },
              { t: u("arcYear"), a: profile.yearArc, n: 0 },
            ].map((it) => (
              <article key={it.t} className="panel p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{it.t}</p>
                <h4 className="mt-2 font-display text-lg font-semibold text-ink">{tr(it.a.name)}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{tr(it.a.text)}</p>
              </article>
            ))}
          </div>

          {/* ХУАНЛИ */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
            <div className="panel p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <button onClick={() => shiftMonth(-1)} aria-label={u("prevMonth")}
                  className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line text-ink transition hover:bg-primary-500/10">‹</button>
                <p className="font-display text-base font-semibold text-ink">{calY} · {MONTHS[calM - 1]}</p>
                <button onClick={() => shiftMonth(1)} aria-label={u("nextMonth")}
                  className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line text-ink transition hover:bg-primary-500/10">›</button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                {WD.map((w, i) => <span key={i} className="py-1 text-[0.7rem] font-bold uppercase tracking-wide text-muted">{w}</span>)}
                {Array.from({ length: grid.lead }, (_, i) => <span key={"x" + i} />)}
                {Array.from({ length: grid.total }, (_, i) => i + 1).map((d) => {
                  const t = new Date(calY, calM - 1, d).getTime();
                  const free = paid || (t >= todayT && t <= freeUntil);
                  const isSel = d === selDay;
                  const isToday = t === todayT;
                  return (
                    <button key={d} onClick={() => setSelDay(d)} aria-pressed={isSel}
                      className={`focus-ring relative aspect-square rounded-xl text-sm font-semibold transition ${
                        isSel ? "bg-primary-600 text-white shadow-sm"
                        : isToday ? "border-2 border-accent-300 text-ink"
                        : free ? "text-ink hover:bg-primary-500/10"
                        : "text-muted/60 hover:bg-primary-500/5"}`}>
                      {d}
                      {!free && !isSel && <span aria-hidden className="absolute right-0.5 top-0.5 text-[0.55rem] opacity-70">🔒</span>}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-xs text-muted">{u("calHint")}</p>
            </div>

            {/* Өдрийн тайлал */}
            {dayRead && (
              dayUnlocked ? (
                <div className="panel p-6 sm:p-8">
                  <p className="eyebrow-line">{calY} · {MONTHS[calM - 1]} · {selDay}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{tr(dayRead.theme.t)}</h3>
                  <p className="mt-2.5 leading-relaxed text-muted">{tr(dayRead.theme.s)}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[[u("general"), dayRead.energy], [u("workE"), dayRead.work], [u("loveE"), dayRead.love]].map(([l, v]) => (
                      <div key={l as string} className="rounded-2xl bg-surface-2 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted">{l}</p>
                        <div className="mt-1"><Stars n={v as number} /></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-line p-5">
                    <p className="font-display text-base font-semibold text-ink">{tr(dayRead.arc.name)}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{tr(dayRead.arc.text)}</p>
                  </div>

                  <div className="mt-5 grid gap-4 text-center sm:grid-cols-3">
                    <div><p className="text-xs uppercase tracking-wide text-muted">{u("luckyN")}</p><p className="mt-1 font-display text-2xl font-semibold text-primary-700">{dayRead.luckyN}</p></div>
                    <div><p className="text-xs uppercase tracking-wide text-muted">{u("goodHour")}</p><p className="mt-1 font-display text-2xl font-semibold text-primary-700">{dayRead.hour}:00</p></div>
                    <div><p className="text-xs uppercase tracking-wide text-muted">{u("friendSign")}</p><p className="mt-1 font-display text-base font-semibold text-ink">{dayRead.friend.symbol} {tr(ZODIAC_NAME_L[dayRead.friend.key])}</p></div>
                  </div>
                </div>
              ) : (
                <div className="panel relative overflow-hidden p-6 sm:p-8">
                  <div aria-hidden className="space-y-3 select-none" style={{ filter: "blur(6px)", opacity: 0.35 }}>
                    <div className="h-6 w-2/3 rounded-full bg-ink/30" />
                    <div className="h-3 w-11/12 rounded-full bg-ink/20" />
                    <div className="h-3 w-10/12 rounded-full bg-ink/20" />
                    <div className="mt-6 h-20 w-full rounded-2xl bg-ink/10" />
                    <div className="h-16 w-full rounded-2xl bg-ink/10" />
                  </div>
                  <div className="absolute inset-0 grid place-items-center p-6 text-center">
                    <div className="max-w-sm">
                      <span aria-hidden className="text-3xl">🔒</span>
                      <p className="mt-3 font-display text-xl font-semibold text-ink">{u("lockedDayT")}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{u("lockedDayS")}</p>
                      <a href="#merge-paid" className="btn btn-gold btn-md mt-5">{u("monthReadT")}</a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* САРЫН ТАЙЛАЛ */}
          <div id="merge-paid" className="mt-10 scroll-mt-24">
            {accM?.status === "active" && monthRead ? (
              <div className="panel p-6 sm:p-8">
                <p className="eyebrow-line">{u("monthReadT")} · {calY} · {MONTHS[calM - 1]}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{tr(monthRead.head)}</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {monthRead.weeks.map((w, i) => (
                    <div key={i} className="rounded-2xl bg-surface-2 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{i + 1} {u("weekN")}</p>
                      <p className="mt-1 font-display text-base font-semibold text-ink">{tr(w.t)}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{tr(w.s)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-line p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted">{u("bestDay")}</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-primary-700">{monthRead.best}</p>
                  </div>
                  <div className="rounded-2xl border border-line p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted">{u("careDay")}</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-accent-300">{monthRead.care}</p>
                  </div>
                  <div className="rounded-2xl border border-line p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted">{u("monthCard")}</p>
                    <p className="mt-1 font-display text-base font-semibold text-primary-700">{tr(monthRead.arc.name)}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted">{tr(monthRead.arc.text)}</p>
                {typeof accM.daysLeft === "number" && <p className="mt-4 text-xs text-muted">{u("daysLeft")} {accM.daysLeft}</p>}
              </div>
            ) : (
              <LockedPanel icon="🌙" title={u("monthReadT")} desc={u("monthReadD")}
                bullets={[u("mBul1"), u("mBul2"), u("mBul3"), u("mBul4")]}
                item={MERGE_ITEMS.month} afterPay={u("afterPay")} daysOpen={u("daysOpen")} />
            )}
          </div>

          {/* ЖИЛИЙН ТАЙЛАЛ */}
          <div className="mt-6">
            {accY?.status === "active" && yearRead ? (
              <div className="panel p-6 sm:p-8">
                <p className="eyebrow-line">{u("yearReadT")} · {calY}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{calY} · {yearRead.py}</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{tr(PERSONAL_YEAR_L[yearRead.py])}</p>
                <div className="mt-5 rounded-2xl bg-primary-500/8 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{u("keyAdvice")}</p>
                  <p className="mt-1.5 font-display text-lg leading-relaxed text-ink">“{tr(yearRead.advice)}”</p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {yearRead.months.map((m) => (
                    <div key={m.label} className="rounded-2xl border border-line p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{m.label}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{tr(m.text)}</p>
                    </div>
                  ))}
                </div>
                {typeof accY.daysLeft === "number" && <p className="mt-4 text-xs text-muted">{u("daysLeft")} {accY.daysLeft}</p>}
              </div>
            ) : (
              <LockedPanel icon="☀️" title={u("yearReadT")} desc={u("yearReadD")}
                bullets={[u("yBul1"), u("yBul2"), u("yBul3"), u("yBul4")]}
                item={MERGE_ITEMS.year} afterPay={u("afterPay")} daysOpen={u("daysOpen")} />
            )}
          </div>

          <p className="mt-10 text-center text-xs text-muted">{u("disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
