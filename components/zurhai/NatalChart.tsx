"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { computeChart, localToUtc, splitLon, SIGNS, type NatalChart as Chart, type Element } from "@/lib/astro";

/* ---------------- Хотууд ---------------- */

type Place = { name: string; country?: string; lat: number; lon: number; tz: string };

/** Монголын аймгийн төвүүд — кирилл нэрээр шууд хайгдана. Баруун аймгууд UTC+7 (Asia/Hovd). */
const MN_PLACES: Place[] = [
  { name: "Улаанбаатар", lat: 47.9077, lon: 106.8832, tz: "Asia/Ulaanbaatar" },
  { name: "Эрдэнэт", lat: 49.0333, lon: 104.0833, tz: "Asia/Ulaanbaatar" },
  { name: "Дархан", lat: 49.4867, lon: 105.9228, tz: "Asia/Ulaanbaatar" },
  { name: "Чойбалсан", lat: 48.0667, lon: 114.5, tz: "Asia/Choibalsan" },
  { name: "Мөрөн", lat: 49.6342, lon: 100.1625, tz: "Asia/Ulaanbaatar" },
  { name: "Цэцэрлэг", lat: 47.4769, lon: 101.4539, tz: "Asia/Ulaanbaatar" },
  { name: "Арвайхээр", lat: 46.2639, lon: 102.775, tz: "Asia/Ulaanbaatar" },
  { name: "Баянхонгор", lat: 46.1944, lon: 100.7181, tz: "Asia/Ulaanbaatar" },
  { name: "Даланзадгад", lat: 43.5708, lon: 104.425, tz: "Asia/Ulaanbaatar" },
  { name: "Мандалговь", lat: 45.7625, lon: 106.2708, tz: "Asia/Ulaanbaatar" },
  { name: "Сайншанд", lat: 44.8925, lon: 110.1397, tz: "Asia/Ulaanbaatar" },
  { name: "Баруун-Урт", lat: 46.6806, lon: 113.2792, tz: "Asia/Ulaanbaatar" },
  { name: "Чингис хот (Өндөрхаан)", lat: 47.3194, lon: 110.6556, tz: "Asia/Ulaanbaatar" },
  { name: "Сүхбаатар", lat: 50.2314, lon: 106.2078, tz: "Asia/Ulaanbaatar" },
  { name: "Булган", lat: 48.8125, lon: 103.5347, tz: "Asia/Ulaanbaatar" },
  { name: "Зуунмод", lat: 47.7069, lon: 106.9528, tz: "Asia/Ulaanbaatar" },
  { name: "Чойр", lat: 46.3611, lon: 108.3611, tz: "Asia/Ulaanbaatar" },
  { name: "Налайх", lat: 47.7717, lon: 107.2556, tz: "Asia/Ulaanbaatar" },
  { name: "Ховд", lat: 48.0056, lon: 91.6419, tz: "Asia/Hovd" },
  { name: "Өлгий", lat: 48.9683, lon: 89.9625, tz: "Asia/Hovd" },
  { name: "Улаангом", lat: 49.9811, lon: 92.0667, tz: "Asia/Hovd" },
  { name: "Улиастай", lat: 47.7417, lon: 96.8444, tz: "Asia/Hovd" },
  { name: "Алтай", lat: 46.3722, lon: 96.2583, tz: "Asia/Hovd" },
];

const cyr = /[Ѐ-ӿ]/;

/* ---------------- Өнгө ---------------- */

const ELEMENT_COLOR: Record<Element, string> = {
  fire: "#F08A5D",
  earth: "#9DBA6A",
  air: "#F2C96B",
  water: "#5CB8D6",
};
const ELEMENT_NAME: Record<Element, string> = { fire: "Гал", earth: "Шороо", air: "Агаар", water: "Ус" };

// Текстэн хэлбэрээр (emoji биш) харуулах
const T = (g: string) => g + "︎";

/* ---------------- Дугуй зураг ---------------- */

const CX = 200, CY = 200;
const R_OUT = 196, R_SIGN = 164, R_GLYPH = 146, R_DEG = 128, R_IN = 92;

export function NatalWheel({ chart }: { chart: Chart }) {
  const rot = chart.asc ?? 0;
  const pt = (r: number, lon: number) => {
    const th = ((180 + lon - rot) * Math.PI) / 180;
    return { x: CX + r * Math.cos(th), y: CY - r * Math.sin(th) };
  };

  // Гарагуудыг давхцуулахгүй тараах
  const placed = useMemo(() => {
    const items = chart.planets.map((p) => ({ ...p, disp: p.lon })).sort((a, b) => a.lon - b.lon);
    const MIN = 10;
    for (let it = 0; it < 80 && items.length > 1; it++) {
      let moved = false;
      for (let i = 0; i < items.length; i++) {
        const a = items[i], b = items[(i + 1) % items.length];
        const gap = (((b.disp - a.disp) % 360) + 360) % 360;
        if (gap < MIN) {
          const push = (MIN - gap) / 2 + 0.01;
          a.disp -= push; b.disp += push; moved = true;
        }
      }
      if (!moved) break;
    }
    return items;
  }, [chart]);

  const line = (r1: number, r2: number, lon: number) => {
    const a = pt(r1, lon), b = pt(r2, lon);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  };

  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full" role="img" aria-label="Натал зурхайн дугуй зураг">
      <defs>
        <radialGradient id="natal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E4A42" />
          <stop offset="100%" stopColor="#0E2622" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={R_OUT} fill="#0B1F1B" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />

      {/* 12 орд */}
      {SIGNS.map((s, i) => {
        const a0 = i * 30, a1 = a0 + 30;
        const p0 = pt(R_OUT, a0), p1 = pt(R_OUT, a1), q1 = pt(R_SIGN, a1), q0 = pt(R_SIGN, a0);
        const g = pt((R_OUT + R_SIGN) / 2, a0 + 15);
        return (
          <g key={s.key}>
            <path
              d={`M${p0.x},${p0.y} A${R_OUT},${R_OUT} 0 0 0 ${p1.x},${p1.y} L${q1.x},${q1.y} A${R_SIGN},${R_SIGN} 0 0 1 ${q0.x},${q0.y} Z`}
              fill={ELEMENT_COLOR[s.element]}
              fillOpacity={0.14}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="0.8"
            />
            <text x={g.x} y={g.y} textAnchor="middle" dominantBaseline="central" fontSize="17" fill={ELEMENT_COLOR[s.element]}>
              {T(s.glyph)}
            </text>
          </g>
        );
      })}

      {/* Градусын зураас */}
      {Array.from({ length: 72 }, (_, i) => i * 5).map((d) => (
        <line key={d} {...line(R_SIGN, R_SIGN - (d % 10 === 0 ? 6 : 3), d)} stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
      ))}

      <circle cx={CX} cy={CY} r={R_SIGN} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={R_IN} fill="url(#natal-core)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />

      {/* Гэрүүд */}
      {chart.cusps?.map((c, i) => {
        const angle = i === 0 || i === 3 || i === 6 || i === 9;
        const next = chart.cusps![(i + 1) % 12];
        const mid = c + ((((next - c) % 360) + 360) % 360) / 2;
        const n = pt(R_IN + 11, mid);
        return (
          <g key={i}>
            <line {...line(R_IN, R_SIGN, c)} stroke={angle ? "rgba(242,201,107,0.85)" : "rgba(255,255,255,0.22)"} strokeWidth={angle ? 1.4 : 0.7} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="rgba(255,255,255,0.55)">
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* ASC / MC тэмдэг */}
      {chart.asc !== null && (() => { const p = pt(R_OUT + 0.1, chart.asc); return <circle cx={p.x} cy={p.y} r="3" fill="#F2C96B" />; })()}
      {chart.mc !== null && (() => { const p = pt(R_OUT + 0.1, chart.mc); return <circle cx={p.x} cy={p.y} r="3" fill="#F2C96B" />; })()}
      {chart.asc !== null && (() => { const p = pt(R_IN - 14, chart.asc); return <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="700" fill="#F2C96B">ASC</text>; })()}
      {chart.mc !== null && (() => { const p = pt(R_IN - 14, chart.mc); return <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="700" fill="#F2C96B">MC</text>; })()}

      {/* Гарагууд */}
      {placed.map((p) => {
        const g = pt(R_GLYPH, p.disp);
        const dg = pt(R_DEG, p.disp);
        const tick = line(R_SIGN, R_SIGN - 9, p.lon);
        const from = pt(R_SIGN - 9, p.lon), to = pt(R_GLYPH + 9, p.disp);
        const s = splitLon(p.lon);
        const col = ELEMENT_COLOR[s.sign.element];
        return (
          <g key={p.key}>
            <line {...tick} stroke={col} strokeWidth="1.4" />
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
            <text x={g.x} y={g.y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill="#FFFFFF">
              {T(p.glyph)}
            </text>
            <text x={dg.x} y={dg.y} textAnchor="middle" dominantBaseline="central" fontSize="7.5" fill="rgba(255,255,255,0.7)">
              {s.deg}°{p.retro ? "℞" : ""}
            </text>
          </g>
        );
      })}

      <text x={CX} y={CY - 6} textAnchor="middle" fontSize="18" fill="rgba(242,201,107,0.9)">✦</text>
      <text x={CX} y={CY + 14} textAnchor="middle" fontSize="7.5" letterSpacing="1.5" fill="rgba(255,255,255,0.55)">NATAL</text>
    </svg>
  );
}

/* ---------------- Үндсэн бүрэлдэхүүн ---------------- */

const fmtPos = (lon: number) => {
  const s = splitLon(lon);
  return { glyph: s.sign.glyph, name: s.sign.name, element: s.sign.element, text: `${s.deg}°${String(s.min).padStart(2, "0")}′` };
};

export function NatalChart() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [place, setPlace] = useState<Place>(MN_PLACES[0]);
  const [query, setQuery] = useState(MN_PLACES[0].name);
  const [remote, setRemote] = useState<Place[]>([]);
  const [openList, setOpenList] = useState(false);
  const [searching, setSearching] = useState(false);
  const [chart, setChart] = useState<Chart | null>(null);
  const [err, setErr] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // Латин нэрээр дэлхийн хотуудыг Open-Meteo геокодоос хайна (түлхүүргүй, үнэгүй)
  useEffect(() => {
    const q = query.trim();
    if (!openList || q.length < 2 || cyr.test(q)) { setRemote([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setSearching(true);
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const list: Place[] = (d?.results || [])
            .filter((x: { timezone?: string }) => x.timezone)
            .map((x: { name: string; country?: string; admin1?: string; latitude: number; longitude: number; timezone: string }) => ({
              name: x.admin1 && x.admin1 !== x.name ? `${x.name}, ${x.admin1}` : x.name,
              country: x.country,
              lat: x.latitude,
              lon: x.longitude,
              tz: x.timezone,
            }));
          setRemote(list);
        })
        .catch(() => {})
        .finally(() => setSearching(false));
    }, 350);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query, openList]);

  const local = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return MN_PLACES;
    return MN_PLACES.filter((p) => p.name.toLocaleLowerCase().includes(q));
  }, [query]);

  const choose = (p: Place) => {
    setPlace(p);
    setQuery(p.country ? `${p.name} (${p.country})` : p.name);
    setOpenList(false);
  };

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!m) { setErr("Төрсөн огноогоо оруулна уу."); return; }
    const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    if (y < 1800 || y > 2050) { setErr("1800–2050 оны хооронд төрсөн огноо оруулна уу."); return; }
    let h = 12, mi = 0;
    if (!timeUnknown) {
      const t = /^(\d{1,2}):(\d{2})/.exec(time);
      if (!t) { setErr("Төрсөн цагаа оруулна уу, эсвэл «Цагаа мэдэхгүй» гэдгийг сонгоно уу."); return; }
      h = Number(t[1]); mi = Number(t[2]);
    }
    const utcMs = localToUtc(y, mo, d, h, mi, place.tz);
    setChart(computeChart({ utcMs, lat: place.lat, lon: place.lon, timeKnown: !timeUnknown }));
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  const inputCls = "focus-ring w-full rounded-2xl border-2 border-line bg-surface-1 px-4 py-3 text-[1rem] text-ink outline-none transition hover:border-primary-400/60 focus:border-primary-500";

  const big3 = chart
    ? [
        { label: "Нар", sub: "Үндсэн мөн чанар", lon: chart.planets[0].lon },
        { label: "Сар", sub: "Сэтгэл хөдлөл", lon: chart.planets[1].lon },
        ...(chart.asc !== null ? [{ label: "Өгсөх орд", sub: "Гадаад төрх", lon: chart.asc }] : []),
      ]
    : [];

  return (
    <div className="space-y-6">
      <form onSubmit={calculate} className="panel p-6 sm:p-8">
        <p className="eyebrow-line">Натал зурхай</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink">Төрсөн мөчийн тэнгэрийн зураглал</h3>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted">
          Төрсөн огноо, цаг, газраа оруулахад таныг төрөх агшинд Нар, Сар болон гарагууд аль ордод, аль гэрт байсныг
          одон орны тооцооллоор гаргаж, натал дугуй зургийг зурна.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="nc-date">Төрсөн огноо *</label>
            <input id="nc-date" type="date" required min="1800-01-01" max="2050-12-31" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="nc-time">Төрсөн цаг</label>
            <input id="nc-time" type="time" disabled={timeUnknown} className={inputCls + " disabled:opacity-50"} value={time} onChange={(e) => setTime(e.target.value)} />
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} className="h-4 w-4 accent-[#0F7A66]" />
              Цагаа мэдэхгүй
            </label>
          </div>
          <div className="relative sm:col-span-2 lg:col-span-1">
            <label className="field-label" htmlFor="nc-place">Төрсөн газар *</label>
            <input
              id="nc-place"
              autoComplete="off"
              className={inputCls}
              value={query}
              onFocus={(e) => { setOpenList(true); e.currentTarget.select(); }}
              onBlur={() => setTimeout(() => setOpenList(false), 180)}
              onChange={(e) => { setQuery(e.target.value); setOpenList(true); }}
              placeholder="Жишээ: Эрдэнэт, Seoul, Berlin"
            />
            {openList && (local.length > 0 || remote.length > 0 || searching) && (
              <ul className="absolute z-30 mt-1.5 max-h-72 w-full overflow-auto rounded-2xl border border-line bg-surface-1 p-1.5 shadow-lift">
                {local.map((p) => (
                  <li key={"mn-" + p.name}>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(p)}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-primary-50">
                      {p.name} <span className="text-xs text-muted">· Монгол</span>
                    </button>
                  </li>
                ))}
                {remote.map((p, i) => (
                  <li key={"r-" + i}>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(p)}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-primary-50">
                      {p.name} {p.country && <span className="text-xs text-muted">· {p.country}</span>}
                    </button>
                  </li>
                ))}
                {searching && <li className="px-3 py-2 text-xs text-muted">Хайж байна…</li>}
              </ul>
            )}
            <p className="mt-1.5 text-xs text-muted">Гадаадын хотыг латинаар бичнэ үү.</p>
          </div>
        </div>

        {err && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{err}</p>}

        <button type="submit" className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">Натал зурхай гаргах ✦</button>
      </form>

      {chart && (
        <div ref={resultRef} className="scroll-mt-28 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="night relative overflow-hidden rounded-[1.75rem] p-5 sm:p-7"
            style={{ backgroundImage: "linear-gradient(150deg,#0F2B26 0%,#12302A 55%,#1E2A1C 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(232,183,95,0.22), transparent 70%)", filter: "blur(12px)" }} />
            <div className="relative mx-auto max-w-[30rem]">
              <NatalWheel chart={chart} />
            </div>
            <div className="relative mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-white/70">
              {(Object.keys(ELEMENT_COLOR) as Element[]).map((el) => (
                <span key={el} className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: ELEMENT_COLOR[el] }} />
                  {ELEMENT_NAME[el]}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {big3.map((b) => {
                const f = fmtPos(b.lon);
                return (
                  <div key={b.label} className="panel p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">{b.label}</p>
                    <p className="mt-1.5 text-2xl" style={{ color: ELEMENT_COLOR[f.element] }}>{T(f.glyph)}</p>
                    <p className="font-display text-lg font-semibold text-ink">{f.name}</p>
                    <p className="text-xs text-muted">{b.sub}</p>
                  </div>
                );
              })}
            </div>

            <div className="panel overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-line bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-bold">Гараг</th>
                    <th className="px-4 py-2.5 font-bold">Орд</th>
                    <th className="px-4 py-2.5 font-bold">Байрлал</th>
                    {chart.cusps && <th className="px-4 py-2.5 text-center font-bold">Гэр</th>}
                  </tr>
                </thead>
                <tbody>
                  {chart.planets.map((p) => {
                    const f = fmtPos(p.lon);
                    return (
                      <tr key={p.key} className="border-b border-line last:border-0">
                        <td className="px-4 py-2.5 text-ink"><span className="mr-2 inline-block w-4 text-center">{T(p.glyph)}</span>{p.name}</td>
                        <td className="px-4 py-2.5 text-ink">
                          <span className="mr-1.5" style={{ color: ELEMENT_COLOR[f.element] }}>{T(f.glyph)}</span>{f.name}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-muted">
                          {f.text}{p.retro && <span className="ml-1.5 font-semibold text-rose-500" title="Ухрах хөдөлгөөнтэй">℞</span>}
                        </td>
                        {chart.cusps && <td className="px-4 py-2.5 text-center tabular-nums text-ink">{p.house}</td>}
                      </tr>
                    );
                  })}
                  {chart.asc !== null && chart.mc !== null && (
                    <>
                      {[{ k: "ASC", n: "Өгсөх орд", lon: chart.asc }, { k: "MC", n: "Тэнгэрийн орой", lon: chart.mc }].map((r) => {
                        const f = fmtPos(r.lon);
                        return (
                          <tr key={r.k} className="border-b border-line bg-accent-300/5 last:border-0">
                            <td className="px-4 py-2.5 font-semibold text-ink"><span className="mr-2 inline-block w-4 text-center text-[0.65rem]">{r.k}</span>{r.n}</td>
                            <td className="px-4 py-2.5 text-ink"><span className="mr-1.5" style={{ color: ELEMENT_COLOR[f.element] }}>{T(f.glyph)}</span>{f.name}</td>
                            <td className="px-4 py-2.5 tabular-nums text-muted">{f.text}</td>
                            {chart.cusps && <td className="px-4 py-2.5 text-center text-ink">{r.k === "ASC" ? 1 : 10}</td>}
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-xs leading-relaxed text-muted">
              {chart.cusps
                ? `Тропик зурхай · ${chart.houseSystem === "placidus" ? "Placidus" : "Тэнцүү"} гэрийн систем · ${place.name}`
                : "Төрсөн цаг тодорхойгүй тул өгсөх орд болон гэрүүдийг тооцоогүй. Гарагуудыг 12:00 цагаар тооцсон — Сарны байрлал ±6° зөрж болно."}
              {" "}℞ — ухрах хөдөлгөөнтэй гараг.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
