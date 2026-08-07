"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ZODIAC_SIGNS, zodiacOf, pickIndex } from "@/data/daily-horoscope";
import { ARCANA } from "@/data/matrix-data";
import {
  LIFE_PATHS, lifePathOf, personalYear, PERSONAL_YEAR_TEXT,
  HD_TYPES, HD_AUTHORITY, DAY_THEMES, MONTH_THEMES, YEAR_ADVICE, seedIndex,
} from "@/data/merge-toorog";

const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
const WD = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();
const fmt = (n: number) => String(n).padStart(2, "0");

/* Мэргэ төөрөгийн 10 хэмжүүр (MysticSync-ийн бүтцээр) */
const DIMENSIONS = [
  { key: "lead", label: "Манлайлал" },
  { key: "create", label: "Бүтээлч" },
  { key: "intu", label: "Зөн совин" },
  { key: "bond", label: "Холбоо" },
  { key: "disc", label: "Сахилга" },
  { key: "spirit", label: "Сүнслэг" },
  { key: "love", label: "Хайр" },
  { key: "wealth", label: "Баялаг" },
  { key: "learn", label: "Сурах" },
  { key: "serve", label: "Үйлчлэх" },
];

type Access = { status: "none" | "pending" | "active" | "expired"; daysLeft?: number | null };
type CmsLite = { id: string; title: string; summary?: string; price?: number };

function reduceArcana(n: number): number {
  let x = n;
  while (x > 22) x -= 22;
  return x || 22;
}
function digitSum(n: number): number {
  return String(n).split("").reduce((a, c) => a + Number(c), 0);
}

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

/** Түгжээтэй хэсэг — худалдан авалт хийгээгүй үед */
function LockedPanel({
  icon, title, desc, item, access, onBuy, busy, err, user,
}: {
  icon: string; title: string; desc: string;
  item: CmsLite | null; access: Access | null;
  onBuy: () => void; busy: boolean; err: string; user: unknown;
}) {
  const st = access?.status;
  return (
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

        {/* Бүдгэрсэн урьдчилсан харагдац */}
        <div aria-hidden className="mt-6 space-y-2.5 select-none" style={{ filter: "blur(5px)", opacity: 0.5 }}>
          <div className="h-3 w-11/12 rounded-full bg-white/25" />
          <div className="h-3 w-9/12 rounded-full bg-white/20" />
          <div className="h-3 w-10/12 rounded-full bg-white/20" />
          <div className="h-3 w-7/12 rounded-full bg-white/15" />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          {typeof item?.price === "number" && item.price > 0 && (
            <span className="font-display text-2xl font-semibold text-accent-300">
              {item.price.toLocaleString("mn-MN")}₮
            </span>
          )}
          {!item ? (
            <p className="text-sm text-white/70">Тун удахгүй нээгдэнэ. Дэлгэрэнгүйг <Link href="/contact" className="font-semibold text-accent-300 underline">холбоо барих</Link> хэсгээс.</p>
          ) : st === "pending" ? (
            <p className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white/85">Захиалга баталгаажихыг хүлээж байна.</p>
          ) : !user ? (
            <Link href="/login" className="btn btn-gold btn-md">Нэвтрээд авах</Link>
          ) : (
            <button onClick={onBuy} disabled={busy} className="btn btn-gold btn-md disabled:opacity-60">
              {busy ? "Илгээж байна…" : st === "expired" ? "Дахин авах" : "🔓 Тайллаа нээх"}
            </button>
          )}
        </div>
        {err && <p className="mt-3 rounded-xl bg-rose-500/20 px-4 py-2 text-sm text-rose-100">{err}</p>}
        {item && !user && <p className="mt-3 text-sm text-white/60">Худалдан авахын тулд эхлээд нэвтэрнэ үү.</p>}
      </div>
    </div>
  );
}

/* ---------- Гол бүрдэл ---------- */

export function MergeToorog() {
  const { user } = useAuth();
  const now = new Date();
  const years = useMemo(() => Array.from({ length: now.getFullYear() - 1929 }, (_, i) => now.getFullYear() - i), [now]);

  const [by, setBy] = useState<number | "">("");
  const [bm, setBm] = useState<number | "">("");
  const [bd, setBd] = useState<number | "">("");
  const [bt, setBt] = useState("");

  // Хуанли
  const [calY, setCalY] = useState(now.getFullYear());
  const [calM, setCalM] = useState(now.getMonth() + 1);
  const [selDay, setSelDay] = useState(now.getDate());

  // Төлбөрт тайллын бараа
  const [items, setItems] = useState<CmsLite[]>([]);
  const [accM, setAccM] = useState<Access | null>(null);
  const [accY, setAccY] = useState<Access | null>(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState<{ k: string; msg: string } | null>(null);

  const ready = typeof by === "number" && typeof bm === "number" && typeof bd === "number";
  const birthKey = ready ? `${by}-${bm}-${bd}-${bt}` : "";

  const monthItem = useMemo(() => items.find((i) => /сарын\s*мэргэ/i.test(i.title)) || null, [items]);
  const yearItem = useMemo(() => items.find((i) => /жилийн\s*мэргэ/i.test(i.title)) || null, [items]);

  useEffect(() => {
    fetch("/api/content?kinds=service", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!user) { setAccM(null); setAccY(null); return; }
    const load = (id: string, set: (a: Access) => void) =>
      fetch("/api/access?itemId=" + encodeURIComponent(id), { cache: "no-store" })
        .then((r) => r.json()).then(set).catch(() => set({ status: "none" }));
    if (monthItem) load(monthItem.id, setAccM);
    if (yearItem) load(yearItem.id, setAccY);
  }, [user, monthItem, yearItem]);

  async function buy(item: CmsLite | null, which: "m" | "y") {
    if (!item) return;
    setBusy(which); setErr(null);
    try {
      const res = await fetch("/api/pay/notify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, method: "bank" }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      (which === "m" ? setAccM : setAccY)({ status: "pending" });
    } catch (e) { setErr({ k: which, msg: e instanceof Error ? e.message : "Алдаа гарлаа." }); } finally { setBusy(""); }
  }

  /* ---- Үндсэн профайл (үнэгүй) ---- */
  const profile = useMemo(() => {
    if (!ready) return null;
    const y = by as number, m = bm as number, d = bd as number;
    const z = zodiacOf(m, d);
    const lp = LIFE_PATHS[lifePathOf(y, m, d)] || LIFE_PATHS[9];
    const dayArc = ARCANA[reduceArcana(d)];
    const monArc = ARCANA[reduceArcana(m)];
    let yr = digitSum(y); if (yr > 22) yr = digitSum(yr);
    const yearArc = ARCANA[reduceArcana(yr)];
    const purpose = ARCANA[reduceArcana(reduceArcana(d) + reduceArcana(m) + reduceArcana(yr))];
    const hd = HD_TYPES[seedIndex(birthKey + "hd", HD_TYPES.length)];
    const auth = HD_AUTHORITY[seedIndex(birthKey + "auth", HD_AUTHORITY.length)];
    const dims = DIMENSIONS.map((dim) => ({ ...dim, value: 30 + seedIndex(birthKey + dim.key, 66) }));
    const py = personalYear(m, d, now.getFullYear());
    return { z, lp, dayArc, monArc, yearArc, purpose, hd, auth, dims, py };
  }, [ready, by, bm, bd, birthKey, now]);

  /* ---- Сонгосон өдрийн тайлал (үнэгүй) ---- */
  const dayRead = useMemo(() => {
    if (!profile) return null;
    const key = `${calY}-${fmt(calM)}-${fmt(selDay)}`;
    const theme = DAY_THEMES[pickIndex(profile.z.key + birthKey, key, DAY_THEMES.length)];
    const arc = ARCANA[reduceArcana(((selDay + calM + digitSum(calY)) % 22) + 1)];
    return {
      key,
      theme,
      arc,
      energy: 2 + pickIndex(birthKey + "e", key, 4),
      work: 2 + pickIndex(birthKey + "w", key, 4),
      love: 2 + pickIndex(birthKey + "l", key, 4),
      luckyN: 1 + pickIndex(birthKey + "n", key, 9),
      hour: 6 + pickIndex(birthKey + "h", key, 15),
      friend: ZODIAC_SIGNS[pickIndex(birthKey + "f", key, 12)],
    };
  }, [profile, calY, calM, selDay, birthKey]);

  /* ---- Сарын тайлал (төлбөртэй) ---- */
  const monthRead = useMemo(() => {
    if (!profile) return null;
    const key = `${calY}-${fmt(calM)}`;
    const head = MONTH_THEMES[pickIndex(birthKey + "M", key, MONTH_THEMES.length)];
    const weeks = [1, 2, 3, 4].map((w) => ({
      w,
      text: DAY_THEMES[pickIndex(birthKey + "w" + w, key, DAY_THEMES.length)].s,
      title: DAY_THEMES[pickIndex(birthKey + "w" + w, key, DAY_THEMES.length)].t,
    }));
    const best = 1 + pickIndex(birthKey + "best", key, daysIn(calY, calM));
    const care = 1 + pickIndex(birthKey + "care", key, daysIn(calY, calM));
    const arc = ARCANA[reduceArcana(((calM + digitSum(calY)) % 22) + 1)];
    return { head, weeks, best, care, arc };
  }, [profile, calY, calM, birthKey]);

  /* ---- Жилийн тайлал (төлбөртэй) ---- */
  const yearRead = useMemo(() => {
    if (!profile) return null;
    const py = personalYear(bm as number, bd as number, calY);
    const advice = YEAR_ADVICE[pickIndex(birthKey + "Y", String(calY), YEAR_ADVICE.length)];
    const months = MONTHS.map((label, i) => ({
      label,
      text: MONTH_THEMES[pickIndex(birthKey + "m" + i, String(calY), MONTH_THEMES.length)],
    }));
    return { py, advice, months };
  }, [profile, bm, bd, calY, birthKey]);

  /* ---- Хуанлийн сүлжээ ---- */
  const grid = useMemo(() => {
    const total = daysIn(calY, calM);
    const first = new Date(calY, calM - 1, 1).getDay(); // 0=Ням
    const lead = (first + 6) % 7; // Даваагаар эхлүүлэх
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
      {/* Толгой */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-line justify-center">Мэргэ төөрөг</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-5xl">Төрсөн огноогоор тайлагдах хувь заяаны зураглал</h1>
        <p className="mt-4 leading-relaxed text-muted">
          Астрологийн зурхай, тоон судлал, хувь тавилангийн матрикс, Human Design —
          дөрвөн системийг нэгтгэн таны гол мөн чанар, сүнсний зорилго, авьяасын төв,
          мөчлөгийн урсгалыг нэг зураглалд харуулна.
        </p>
      </div>

      {/* Огнооны оролт */}
      <div className="panel mx-auto mt-10 max-w-3xl p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Төрсөн он</label>
            <select className={selCls} value={by} onChange={(e) => setBy(e.target.value ? Number(e.target.value) : "")}>
              <option value="">— Он —</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Сар</label>
            <select className={selCls} value={bm} onChange={(e) => setBm(e.target.value ? Number(e.target.value) : "")}>
              <option value="">— Сар —</option>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Өдөр</label>
            <select className={selCls} value={bd} onChange={(e) => setBd(e.target.value ? Number(e.target.value) : "")}>
              <option value="">— Өдөр —</option>
              {Array.from({ length: typeof bm === "number" ? daysIn(typeof by === "number" ? by : 2000, bm) : 31 }, (_, i) => i + 1)
                .map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Цаг <span className="font-normal normal-case">(заавал бус)</span></label>
            <input type="time" className={selCls} value={bt} onChange={(e) => setBt(e.target.value)} />
          </div>
        </div>
        {!ready && <p className="mt-4 text-center text-sm text-muted">Он, сар, өдрөө сонгоход тайлал шууд гарч ирнэ.</p>}
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
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-300">
                  {by} оны {bm} сарын {bd}{bt ? ` · ${bt}` : ""}
                </p>
                <h2 className="mt-1.5 font-display text-3xl font-semibold text-white sm:text-4xl">{profile.z.name} орд · {profile.lp.title}</h2>
                <p className="mt-1.5 text-sm text-white/70">
                  {profile.z.element} махбод · Амьдралын зам {profile.lp.n} · {profile.hd.name}
                </p>
              </div>
            </div>
            <p className="relative z-10 mt-7 text-lg leading-relaxed text-white/90">{profile.lp.core}</p>
            <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-accent-300">Хүчит тал</p>
                <p className="mt-1.5 text-white/85">{profile.lp.strength}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-accent-300">Сурах хичээл</p>
                <p className="mt-1.5 text-white/85">{profile.lp.lesson}</p>
              </div>
            </div>
          </div>

          {/* 10 хэмжүүр */}
          <div className="panel mt-6 p-6 sm:p-8">
            <p className="eyebrow-line">Эрчмийн зураглал</p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">Таны 10 хэмжүүр</h3>
            <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {profile.dims.map((d) => <Meter key={d.key} label={d.label} value={d.value} />)}
            </div>
          </div>

          {/* Дөрвөн систем */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Card eyebrow="Астрологи" title={`${profile.z.name} — ${profile.z.element} махбод`}>
              {profile.z.trait}. Нарны орд таны гадаад илэрхийлэл, амин хүсэл эрмэлзлийн үндсэн өнгө.
              {bt ? " Оруулсан цагаар тань өдрийн эрчмийн нарийвчлал нэмэгдсэн." : " Төрсөн цагаа оруулбал тайлал нарийсна."}
            </Card>
            <Card eyebrow="Human Design" title={`${profile.hd.name}`}>
              {profile.hd.text} <br />
              <span className="mt-2 block font-semibold text-ink">Стратеги: {profile.hd.strategy}</span>
              <span className="block text-sm">{profile.auth}</span>
            </Card>
            <Card eyebrow="Destiny Matrix" title={`Сүнсний зорилго · ${profile.purpose.n}-р аркан`}>
              <span className="font-semibold text-ink">{profile.purpose.name}</span> — {profile.purpose.short}
            </Card>
            <Card eyebrow="Тоон судлал" title={`${new Date().getFullYear()} — таны ${profile.py}-р хувийн жил`}>
              {PERSONAL_YEAR_TEXT[profile.py]}
            </Card>
          </div>

          {/* Матриксын гурван аркан */}
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              { t: "Өдрийн аркан · Мөн чанар", a: profile.dayArc },
              { t: "Сарын аркан · Авьяас", a: profile.monArc },
              { t: "Жилийн аркан · Даалгавар", a: profile.yearArc },
            ].map((x) => (
              <article key={x.t} className="panel p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/12 font-display text-xl font-semibold text-primary-700">{x.a.n}</span>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">{x.t}</p>
                <h4 className="mt-1 font-display text-base font-semibold text-ink">{x.a.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{x.a.short}</p>
              </article>
            ))}
          </div>

          {/* ---------- ХУАНЛИ ---------- */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
            <div className="panel p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <button onClick={() => shiftMonth(-1)} aria-label="Өмнөх сар"
                  className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line text-ink transition hover:bg-primary-500/10">‹</button>
                <p className="font-display text-base font-semibold text-ink">{calY} · {MONTHS[calM - 1]}</p>
                <button onClick={() => shiftMonth(1)} aria-label="Дараах сар"
                  className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line text-ink transition hover:bg-primary-500/10">›</button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                {WD.map((w) => <span key={w} className="py-1 text-[0.7rem] font-bold uppercase tracking-wide text-muted">{w}</span>)}
                {Array.from({ length: grid.lead }, (_, i) => <span key={"x" + i} />)}
                {Array.from({ length: grid.total }, (_, i) => i + 1).map((d) => {
                  const isSel = d === selDay;
                  const isToday = calY === now.getFullYear() && calM === now.getMonth() + 1 && d === now.getDate();
                  return (
                    <button key={d} onClick={() => setSelDay(d)} aria-pressed={isSel}
                      className={`focus-ring aspect-square rounded-xl text-sm font-semibold transition ${
                        isSel ? "bg-primary-600 text-white shadow-sm"
                        : isToday ? "border-2 border-accent-300 text-ink"
                        : "text-ink hover:bg-primary-500/10"}`}>
                      {d}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-xs text-muted">Өдрөө сонгоход тухайн өдрийн тайлал баруун талд гарна.</p>
            </div>

            {/* Сонгосон өдрийн тайлал */}
            {dayRead && (
              <div className="panel p-6 sm:p-8">
                <p className="eyebrow-line">{calY} оны {calM} сарын {selDay}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{dayRead.theme.t}</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{dayRead.theme.s}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[["Ерөнхий эрчим", dayRead.energy], ["Ажил хэрэг", dayRead.work], ["Харилцаа", dayRead.love]].map(([l, v]) => (
                    <div key={l as string} className="rounded-2xl bg-surface-2 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted">{l}</p>
                      <div className="mt-1"><Stars n={v as number} /></div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-line p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Өдрийн аркан · {dayRead.arc.n}</p>
                  <p className="mt-1 font-display text-base font-semibold text-ink">{dayRead.arc.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{dayRead.arc.short}</p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3 text-center">
                  <div><p className="text-xs uppercase tracking-wide text-muted">Азын тоо</p><p className="mt-1 font-display text-2xl font-semibold text-primary-700">{dayRead.luckyN}</p></div>
                  <div><p className="text-xs uppercase tracking-wide text-muted">Тохиромжтой цаг</p><p className="mt-1 font-display text-2xl font-semibold text-primary-700">{dayRead.hour}:00</p></div>
                  <div><p className="text-xs uppercase tracking-wide text-muted">Ээлтэй орд</p><p className="mt-1 font-display text-base font-semibold text-ink">{dayRead.friend.symbol} {dayRead.friend.name}</p></div>
                </div>
              </div>
            )}
          </div>

          {/* ---------- САРЫН ТАЙЛАЛ (төлбөртэй) ---------- */}
          <div className="mt-10">
            {accM?.status === "active" && monthRead ? (
              <div className="panel p-6 sm:p-8">
                <p className="eyebrow-line">Сарын тайлал · {calY} оны {calM} сар</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{monthRead.head}</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {monthRead.weeks.map((w) => (
                    <div key={w.w} className="rounded-2xl bg-surface-2 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{w.w}-р долоо хоног</p>
                      <p className="mt-1 font-display text-base font-semibold text-ink">{w.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{w.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-line p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted">Хамгийн хүчтэй өдөр</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-primary-700">{monthRead.best}</p>
                  </div>
                  <div className="rounded-2xl border border-line p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted">Болгоомжлох өдөр</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-accent-300">{monthRead.care}</p>
                  </div>
                  <div className="rounded-2xl border border-line p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted">Сарын аркан</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-primary-700">{monthRead.arc.n}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted"><span className="font-semibold text-ink">{monthRead.arc.name}</span> — {monthRead.arc.short}</p>
                {typeof accM.daysLeft === "number" && <p className="mt-4 text-xs text-muted">Эрх дуусахад {accM.daysLeft} хоног үлдсэн.</p>}
              </div>
            ) : (
              <LockedPanel icon="🌙" title="Сарын мэргэ төөрөг"
                desc="Сонгосон сарын бүтэн зураглал — долоо хоног тус бүрийн урсгал, хамгийн хүчтэй ба болгоомжлох өдөр, сарын аркан, санхүү, харилцааны чиг хандлага."
                item={monthItem} access={accM} onBuy={() => buy(monthItem, "m")} busy={busy === "m"} err={err?.k === "m" ? err.msg : ""} user={user} />
            )}
          </div>

          {/* ---------- ЖИЛИЙН ТАЙЛАЛ (төлбөртэй) ---------- */}
          <div className="mt-6">
            {accY?.status === "active" && yearRead ? (
              <div className="panel p-6 sm:p-8">
                <p className="eyebrow-line">Жилийн тайлал · {calY}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{calY} — таны {yearRead.py}-р хувийн жил</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{PERSONAL_YEAR_TEXT[yearRead.py]}</p>
                <div className="mt-5 rounded-2xl bg-primary-500/8 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Жилийн түлхүүр зөвлөгөө</p>
                  <p className="mt-1.5 font-display text-lg leading-relaxed text-ink">“{yearRead.advice}”</p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {yearRead.months.map((m) => (
                    <div key={m.label} className="rounded-2xl border border-line p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{m.label}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.text}</p>
                    </div>
                  ))}
                </div>
                {typeof accY.daysLeft === "number" && <p className="mt-4 text-xs text-muted">Эрх дуусахад {accY.daysLeft} хоног үлдсэн.</p>}
              </div>
            ) : (
              <LockedPanel icon="☀️" title="Жилийн мэргэ төөрөг"
                desc="Бүтэн жилийн зураглал — хувийн жилийн эрчим, 12 сар тус бүрийн чиг хандлага, эргэлтийн цэгүүд, жилийн түлхүүр зөвлөгөө."
                item={yearItem} access={accY} onBuy={() => buy(yearItem, "y")} busy={busy === "y"} err={err?.k === "y" ? err.msg : ""} user={user} />
            )}
          </div>

          {/* Холбоос */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/matrix" className="btn btn-outline btn-md">🔢 Тоон зурхайн матрикс</Link>
            <Link href="/toorog" className="btn btn-outline btn-md">🎲 Шагайн төөрөг</Link>
            <Link href="/services" className="btn btn-primary btn-md">Гүнзгий тайлал захиалах</Link>
          </div>
          <p className="mt-4 text-center text-xs text-muted">Мэргэ төөрөг бол чиглүүлэг — эцсийн шийдвэр үргэлж таных.</p>
        </div>
      )}
    </div>
  );
}
