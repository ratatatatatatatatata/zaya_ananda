/** Tropical natal positions from Astronomy Engine; house cusps use local sidereal time. */
import { Body, Ecliptic, GeoVector, SiderealTime, MakeTime, e_tilt } from "astronomy-engine";

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
  const minutes = Math.round(norm(lon) * 60) % (360 * 60);
  const l = minutes / 60;
  return { sign: signOf(l), deg: Math.floor(l % 30), min: minutes % 60 };
}

/* ---------------- Цаг ---------------- */

export const julianDay = (utcMs: number) => utcMs / 86400000 + 2440587.5;

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

/** Reject invalid zones, nonexistent times and ambiguous DST hours instead of silently guessing. */
export function localToUtc(y: number, m: number, d: number, h: number, mi: number, timeZone: string, offsetMinutes?: number): number {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const value = new Date(guess);
  if (y < 1800 || y > 2100 || value.getUTCFullYear() !== y || value.getUTCMonth() !== m - 1 || value.getUTCDate() !== d || h < 0 || h > 23 || mi < 0 || mi > 59) throw new Error("Төрсөн огноо, цаг буруу байна.");
  // Validate the IANA zone before using it.
  tzOffsetMs(guess, timeZone);
  if (offsetMinutes !== undefined) {
    const candidate = guess - offsetMinutes * 60000;
    if (candidate + tzOffsetMs(candidate, timeZone) !== guess) throw new Error("UTC зөрүү энэ хотын тухайн огноо, цагтай тохирохгүй байна.");
    return candidate;
  }
  const offsets = new Set([-36, -12, 0, 12, 36].map(hours => tzOffsetMs(guess + hours * 3600000, timeZone)));
  const candidates = [...offsets].map(offset => guess - offset).filter(utc => utc + tzOffsetMs(utc, timeZone) === guess);
  if (!candidates.length) throw new Error("Энэ цаг зуны цагийн шилжилтэд алгассан байна. Төрсний гэрчилгээний цагаа шалгана уу.");
  if (candidates.length > 1) throw new Error("Энэ цаг зуны цагийн шилжилтэд хоёр удаа давтагдсан байна. Нэмэлт тохиргоонд тухайн үеийн UTC зөрүүг оруулна уу.");
  return candidates[0];
}

const BODIES: Record<PlanetKey, Body> = {
  sun: Body.Sun, moon: Body.Moon, mercury: Body.Mercury, venus: Body.Venus, mars: Body.Mars,
  jupiter: Body.Jupiter, saturn: Body.Saturn, uranus: Body.Uranus, neptune: Body.Neptune, pluto: Body.Pluto,
};
const planetLongitude = (key: PlanetKey, utcMs: number) => Ecliptic(GeoVector(BODIES[key], new Date(utcMs), true)).elon;

/* ---------------- Өгсөх орд, гэрүүд ---------------- */

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
  return null;
}

export type HouseSystem = "placidus" | "equal" | "whole";

export type NatalChart = {
  utcMs: number;
  timeKnown: boolean;
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

export function computeChart(opts: { utcMs: number; lat?: number; lon?: number; timeKnown: boolean; houseSystem?: HouseSystem }): NatalChart {
  if (!Number.isFinite(opts.utcMs) || opts.utcMs < Date.UTC(1800, 0, 1) || opts.utcMs > Date.UTC(2101, 0, 1)) throw new Error("Тооцоолох огноо буруу байна.");
  if (opts.timeKnown && (!Number.isFinite(opts.lat) || !Number.isFinite(opts.lon) || Math.abs(opts.lat!) > 89.5 || Math.abs(opts.lon!) > 180)) throw new Error("Төрсөн газрын өргөрөг, уртраг буруу байна.");

  let asc: number | null = null, mc: number | null = null, cusps: number[] | null = null;
  let houseSystem: HouseSystem | null = null;

  if (opts.timeKnown && typeof opts.lat === "number" && typeof opts.lon === "number") {
    const eps = e_tilt(MakeTime(new Date(opts.utcMs))).tobl;
    const ramc = norm(SiderealTime(new Date(opts.utcMs)) * 15 + opts.lon);
    const lat = Math.max(-89.9, Math.min(89.9, opts.lat));
    mc = atan2d(sin(ramc), cos(ramc) * cos(eps));
    asc = atan2d(cos(ramc), -(sin(ramc) * cos(eps) + tan(lat) * sin(eps)));

    const c11 = placidusCusp(ramc, eps, lat, 11);
    const c12 = placidusCusp(ramc, eps, lat, 12);
    const c2 = placidusCusp(ramc, eps, lat, 2);
    const c3 = placidusCusp(ramc, eps, lat, 3);
    const requested = opts.houseSystem ?? "placidus";
    if (requested === "whole" || requested === "equal") {
      const origin = requested === "whole" ? Math.floor(asc / 30) * 30 : asc;
      cusps = Array.from({ length: 12 }, (_, i) => norm(origin + i * 30));
      houseSystem = requested;
    } else if (Math.abs(lat) < 66 && c11 !== null && c12 !== null && c2 !== null && c3 !== null) {
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
    const lon = planetLongitude(p.key, opts.utcMs);
    let retro = false;
    if (p.key !== "sun" && p.key !== "moon") {
      const dt = 0.5 * 86400000; // хагас хоног
      const before = planetLongitude(p.key, opts.utcMs - dt);
      const after = planetLongitude(p.key, opts.utcMs + dt);
      retro = ((after - before + 540) % 360) - 180 < 0;
    }
    return { ...p, lon, retro, house: cusps ? houseOf(lon, cusps) : null };
  });

  const elements: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const p of planets) elements[signOf(p.lon).element] += 1;
  if (asc !== null) elements[signOf(asc).element] += 1;

  return { utcMs: opts.utcMs, timeKnown: opts.timeKnown, planets, asc, mc, cusps, houseSystem, elements };
}
