/**
 * Натал зурхайн тооцоолол — гадны сангүй, цэвэр TypeScript.
 *  - Нар: Meeus, "Astronomical Algorithms" 25-р бүлэг (≈0.01°)
 *  - Сар: Meeus 47-р бүлгийн гол гишүүд (≈0.05°)
 *  - Гарагууд: JPL "Approximate Positions of the Planets" Кеплерийн элементүүд, 1800–2050 он (≈0.1° дотор)
 *  - Өгсөх орд / MC / Placidus гэрүүд: орон нутгийн одон цаг + өргөрөгөөр
 * Бүх уртраг нь тухайн огнооны тропик эклиптикийн уртраг (өрнийн зурхайн стандарт).
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const norm = (x: number) => ((x % 360) + 360) % 360;
const sin = (d: number) => Math.sin(d * D2R);
const cos = (d: number) => Math.cos(d * D2R);
const tan = (d: number) => Math.tan(d * D2R);
const atan2d = (y: number, x: number) => norm(Math.atan2(y, x) * R2D);

export type PlanetKey =
  | "sun" | "moon" | "mercury" | "venus" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";

export const PLANETS: { key: PlanetKey; name: string; glyph: string }[] = [
  { key: "sun", name: "Нар", glyph: "☉" },
  { key: "moon", name: "Сар", glyph: "☽" },
  { key: "mercury", name: "Буд", glyph: "☿" },
  { key: "venus", name: "Сугар", glyph: "♀" },
  { key: "mars", name: "Ангараг", glyph: "♂" },
  { key: "jupiter", name: "Бархасбадь", glyph: "♃" },
  { key: "saturn", name: "Санчир", glyph: "♄" },
  { key: "uranus", name: "Тэнгэрийн ван", glyph: "♅" },
  { key: "neptune", name: "Далайн ван", glyph: "♆" },
  { key: "pluto", name: "Плутон", glyph: "♇" },
];

export type Element = "fire" | "earth" | "air" | "water";

export const SIGNS: { key: string; name: string; glyph: string; element: Element }[] = [
  { key: "aries", name: "Хонь", glyph: "♈", element: "fire" },
  { key: "taurus", name: "Үхэр", glyph: "♉", element: "earth" },
  { key: "gemini", name: "Ихэр", glyph: "♊", element: "air" },
  { key: "cancer", name: "Мэлхий", glyph: "♋", element: "water" },
  { key: "leo", name: "Арслан", glyph: "♌", element: "fire" },
  { key: "virgo", name: "Охин", glyph: "♍", element: "earth" },
  { key: "libra", name: "Жинлүүр", glyph: "♎", element: "air" },
  { key: "scorpio", name: "Хилэнц", glyph: "♏", element: "water" },
  { key: "sagittarius", name: "Нум", glyph: "♐", element: "fire" },
  { key: "capricorn", name: "Матар", glyph: "♑", element: "earth" },
  { key: "aquarius", name: "Хумх", glyph: "♒", element: "air" },
  { key: "pisces", name: "Загас", glyph: "♓", element: "water" },
];

export const signOf = (lon: number) => SIGNS[Math.floor(norm(lon) / 30)];

/** 123.456° → { sign, deg: 3, min: 27 } */
export function splitLon(lon: number) {
  const l = norm(lon);
  const within = l % 30;
  let deg = Math.floor(within);
  let min = Math.round((within - deg) * 60);
  if (min === 60) { min = 0; deg += 1; }
  return { sign: signOf(l), deg, min };
}

/* ---------------- Цаг ---------------- */

export const julianDay = (utcMs: number) => utcMs / 86400000 + 2440587.5;
const centuries = (jd: number) => (jd - 2451545.0) / 36525;

/** Тухайн IANA цагийн бүсийн тухайн агшин дахь UTC-ээс зөрөх зөрүү (мс). Түүхэн зуны цагийг браузерын tzdb-ээр тооцно. */
function tzOffsetMs(utcMs: number, timeZone: string): number {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const p: Record<string, number> = {};
  for (const part of f.formatToParts(new Date(utcMs))) if (part.type !== "literal") p[part.type] = Number(part.value);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
  return asUtc - utcMs;
}

/** Орон нутгийн огноо/цаг + цагийн бүс → UTC мс */
export function localToUtc(y: number, m: number, d: number, h: number, mi: number, timeZone: string): number {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  try {
    const off1 = tzOffsetMs(guess, timeZone);
    const off2 = tzOffsetMs(guess - off1, timeZone);
    return guess - off2;
  } catch {
    return guess - 8 * 3600000; // Танигдаагүй бүс — Улаанбаатарын цаг (UTC+8)
  }
}

/* ---------------- Нар ---------------- */

function sunLongitude(T: number): number {
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.000289 * sin(3 * M);
  const omega = 125.04 - 1934.136 * T;
  return norm(L0 + C - 0.00569 - 0.00478 * sin(omega));
}

/* ---------------- Сар ---------------- */

// [D, M, M', F, коэффициент ×1e-6°]
const MOON_TERMS: [number, number, number, number, number][] = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700],
  [2, 1, -2, 0, 691], [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520], [1, 0, -2, 0, -487],
];

function moonLongitude(T: number): number {
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const A1 = 119.75 + 131.849 * T;

  let sl = 0;
  for (const [d, m, mp, f, c] of MOON_TERMS) {
    const e = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1;
    sl += c * e * sin(d * D + m * M + mp * Mp + f * F);
  }
  sl += 3958 * sin(A1) + 1962 * sin(Lp - F);
  const omega = 125.04452 - 1934.136261 * T;
  return norm(Lp + sl / 1e6 - 0.00478 * sin(omega));
}

/* ---------------- Гарагууд (JPL Кеплерийн элементүүд) ---------------- */

type Elem = [number, number, number, number, number, number]; // a, e, I, L, ϖ, Ω
const ELEMENTS: Record<string, { v: Elem; r: Elem }> = {
  mercury: { v: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593], r: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081] },
  venus: { v: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255], r: [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418] },
  earth: { v: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0], r: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0] },
  mars: { v: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891], r: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343] },
  jupiter: { v: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], r: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106] },
  saturn: { v: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], r: [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794] },
  uranus: { v: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.9542763, 74.01692503], r: [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589] },
  neptune: { v: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574], r: [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664] },
  pluto: { v: [39.48211675, 0.2488273, 17.14001206, 238.92903833, 224.06891629, 110.30393684], r: [-0.00031596, 0.0000517, 0.00004818, 145.20780515, -0.04062942, -0.01183482] },
};

function helio(key: string, T: number): [number, number, number] {
  const { v, r } = ELEMENTS[key];
  const a = v[0] + r[0] * T, e = v[1] + r[1] * T, I = v[2] + r[2] * T;
  const L = v[3] + r[3] * T, peri = v[4] + r[4] * T, node = v[5] + r[5] * T;
  const w = peri - node;
  const M = norm(L - peri);
  // Кеплерийн тэгшитгэл (Ньютоны арга)
  const Mr = M * D2R;
  let E = Mr + e * Math.sin(Mr);
  for (let i = 0; i < 12; i++) E -= (E - e * Math.sin(E) - Mr) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cw = cos(w), sw = sin(w), cO = cos(node), sO = sin(node), cI = cos(I), sI = sin(I);
  return [
    (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    sw * sI * xp + cw * sI * yp,
  ];
}

/** J2000 эклиптикээс тухайн огнооны эклиптик рүү — ерөнхий прецесс (≈5029″/зуун) */
const precession = (T: number) => 1.3969713 * T + 0.0003086 * T * T;

function planetLongitude(key: PlanetKey, T: number): number {
  if (key === "sun") return sunLongitude(T);
  if (key === "moon") return moonLongitude(T);
  const p = helio(key, T);
  const e = helio("earth", T);
  return norm(atan2d(p[1] - e[1], p[0] - e[0]) + precession(T));
}

/* ---------------- Өгсөх орд, гэрүүд ---------------- */

const obliquity = (T: number) => 23.439291 - 0.0130042 * T;

function localSiderealDeg(jd: number, lonEast: number): number {
  const T = centuries(jd);
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000;
  return norm(gmst + lonEast);
}

const eclFromRA = (ra: number, eps: number) => atan2d(sin(ra), cos(ra) * cos(eps));

function placidusCusp(ramc: number, eps: number, lat: number, house: 11 | 12 | 2 | 3): number | null {
  let lon = eclFromRA(ramc + ({ 11: 30, 12: 60, 2: 120, 3: 150 } as const)[house], eps);
  for (let i = 0; i < 30; i++) {
    const dec = Math.asin(sin(eps) * sin(lon)) * R2D;
    const x = -tan(lat) * tan(dec);
    if (x < -1 || x > 1) return null;
    const sda = Math.acos(x) * R2D;
    const sna = 180 - sda;
    const ra =
      house === 11 ? ramc + sda / 3 :
      house === 12 ? ramc + (2 * sda) / 3 :
      house === 2 ? ramc + 180 - (2 * sna) / 3 :
      ramc + 180 - sna / 3;
    const next = eclFromRA(ra, eps);
    if (Math.abs(((next - lon + 540) % 360) - 180) < 1e-7) return next;
    lon = next;
  }
  return lon;
}

export type HouseSystem = "placidus" | "equal";

export type NatalChart = {
  utcMs: number;
  planets: { key: PlanetKey; name: string; glyph: string; lon: number; retro: boolean; house: number | null }[];
  asc: number | null;
  mc: number | null;
  cusps: number[] | null; // 12 гэрийн эхлэл (1..12)
  houseSystem: HouseSystem | null;
  elements: Record<Element, number>;
};

/** Уртраг аль гэрт унахыг олно (cusps[0] = 1-р гэр). */
function houseOf(lon: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    const span = norm(b - a);
    if (norm(lon - a) < span) return i + 1;
  }
  return 12;
}

export function computeChart(opts: { utcMs: number; lat?: number; lon?: number; timeKnown: boolean }): NatalChart {
  const jd = julianDay(opts.utcMs);
  const T = centuries(jd);

  let asc: number | null = null, mc: number | null = null, cusps: number[] | null = null;
  let houseSystem: HouseSystem | null = null;

  if (opts.timeKnown && typeof opts.lat === "number" && typeof opts.lon === "number") {
    const eps = obliquity(T);
    const ramc = localSiderealDeg(jd, opts.lon);
    const lat = Math.max(-89.9, Math.min(89.9, opts.lat));
    mc = atan2d(sin(ramc), cos(ramc) * cos(eps));
    asc = atan2d(cos(ramc), -(sin(ramc) * cos(eps) + tan(lat) * sin(eps)));

    const c11 = placidusCusp(ramc, eps, lat, 11);
    const c12 = placidusCusp(ramc, eps, lat, 12);
    const c2 = placidusCusp(ramc, eps, lat, 2);
    const c3 = placidusCusp(ramc, eps, lat, 3);
    if (c11 !== null && c12 !== null && c2 !== null && c3 !== null) {
      const first = [asc, c2, c3, norm(mc + 180), norm(c11 + 180), norm(c12 + 180)];
      cusps = [...first, ...first.map((x) => norm(x + 180))];
      houseSystem = "placidus";
    } else {
      // Туйлын ойролцоо Placidus тодорхойлогдохгүй — тэнцүү гэр
      cusps = Array.from({ length: 12 }, (_, i) => norm(asc! + i * 30));
      houseSystem = "equal";
    }
  }

  const planets = PLANETS.map((p) => {
    const lon = planetLongitude(p.key, T);
    let retro = false;
    if (p.key !== "sun" && p.key !== "moon") {
      const dt = 0.5 / 36525; // хагас хоног
      const before = planetLongitude(p.key, T - dt);
      const after = planetLongitude(p.key, T + dt);
      retro = ((after - before + 540) % 360) - 180 < 0;
    }
    return { ...p, lon, retro, house: cusps ? houseOf(lon, cusps) : null };
  });

  const elements: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const p of planets) elements[signOf(p.lon).element] += 1;
  if (asc !== null) elements[signOf(asc).element] += 1;

  return { utcMs: opts.utcMs, planets, asc, mc, cusps, houseSystem, elements };
}
