"use client";

import { useMemo } from "react";

/** Шамбалын дүр төрх — процедураар зурсан дэвсгэр.
 *  Найман цасан оргилын цагираг, төвд алтан ордон, наран туяа, оддын тэнгэр.
 *  Гадаад зураг ашиглаагүй тул ачаалал бага, ямар ч дэлгэцэнд тод харагдана. */

const STAR_COUNT = 90;

function mulberry(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Оргилуудын шугам — тодорхой seed-ээр тогтмол хэлбэртэй */
function ridge(seed: number, baseY: number, amp: number, steps: number) {
  const rnd = mulberry(seed);
  const pts: string[] = [`0,900`, `0,${baseY}`];
  const w = 1440 / steps;
  for (let i = 0; i <= steps; i++) {
    const x = i * w;
    const peak = baseY - amp * (0.45 + rnd() * 0.55);
    const valley = baseY - amp * 0.12 * rnd();
    if (i > 0) pts.push(`${(x - w / 2).toFixed(1)},${peak.toFixed(1)}`);
    pts.push(`${x.toFixed(1)},${valley.toFixed(1)}`);
  }
  pts.push(`1440,900`);
  return pts.join(" ");
}

export function ShambhalaBg() {
  const stars = useMemo(() => {
    const rnd = mulberry(20260817);
    return Array.from({ length: STAR_COUNT }, () => ({
      cx: +(rnd() * 1440).toFixed(1),
      cy: +(rnd() * 470).toFixed(1),
      r: +(0.6 + rnd() * 1.7).toFixed(2),
      o: +(0.25 + rnd() * 0.65).toFixed(2),
      d: +(rnd() * 6).toFixed(2),
    }));
  }, []);

  const rays = useMemo(() => Array.from({ length: 28 }, (_, i) => i * (360 / 28)), []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Тэнгэр — гүн индиго → нил ягаан → алтан хаяа */}
          <linearGradient id="sbSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07142E" />
            <stop offset="34%" stopColor="#132349" />
            <stop offset="62%" stopColor="#2E2A63" />
            <stop offset="82%" stopColor="#5B3A6B" />
            <stop offset="100%" stopColor="#8A5A50" />
          </linearGradient>

          {/* Төвийн алтан гэрэлтэлт */}
          <radialGradient id="sbHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.95" />
            <stop offset="32%" stopColor="#F3C167" stopOpacity="0.55" />
            <stop offset="68%" stopColor="#D98F45" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D98F45" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="sbRay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDD9C" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFDD9C" stopOpacity="0" />
          </linearGradient>

          {/* Уулс — холоос ойр руу гэрлээс харанхуй */}
          <linearGradient id="sbFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B9C7E8" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#6C7CAE" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#3A4478" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="sbMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8FA2CF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#3C4A80" />
            <stop offset="100%" stopColor="#232C55" />
          </linearGradient>
          <linearGradient id="sbNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#31406F" />
            <stop offset="100%" stopColor="#111A33" />
          </linearGradient>

          {/* Алтан ордон */}
          <linearGradient id="sbGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE7A8" />
            <stop offset="52%" stopColor="#E8B75F" />
            <stop offset="100%" stopColor="#B57C2E" />
          </linearGradient>

          {/* Манан */}
          <linearGradient id="sbMist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E7D8C4" stopOpacity="0" />
            <stop offset="50%" stopColor="#E7D8C4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#E7D8C4" stopOpacity="0" />
          </linearGradient>

          <filter id="sbSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="sbSoft2" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Тэнгэр */}
        <rect width="1440" height="900" fill="url(#sbSky)" />

        {/* Од */}
        <g>
          {stars.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#FFFFFF" opacity={s.o}>
              <animate
                attributeName="opacity"
                values={`${s.o};${(s.o * 0.28).toFixed(2)};${s.o}`}
                dur={`${(3.4 + (i % 5) * 0.9).toFixed(1)}s`}
                begin={`${s.d}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Наран туяа — төвөөс тарах */}
        <g transform="translate(720 560)" opacity="0.5">
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="180s" repeatCount="indefinite" />
            {rays.map((a, i) => (
              <polygon
                key={i}
                points="-7,0 7,0 0,-620"
                fill="url(#sbRay)"
                opacity={i % 2 === 0 ? 0.85 : 0.4}
                transform={`rotate(${a})`}
              />
            ))}
          </g>
        </g>

        {/* Төвийн гэрэлт бөмбөрцөг */}
        <circle cx="720" cy="560" r="330" fill="url(#sbHalo)" />

        {/* Алсын цасан оргилууд */}
        <polygon points={ridge(11, 620, 190, 9)} fill="url(#sbFar)" opacity="0.55" />
        <polygon points={ridge(29, 665, 235, 8)} fill="url(#sbMid)" opacity="0.9" />

        {/* Манангийн зурвас */}
        <rect x="0" y="600" width="1440" height="90" fill="url(#sbMist)" filter="url(#sbSoft)" opacity="0.7" />

        {/* Төвийн ордон — шатлаг суварга */}
        <g transform="translate(720 0)">
          {/* гэрлийн ореол */}
          <ellipse cx="0" cy="612" rx="150" ry="70" fill="#FFD98A" opacity="0.22" filter="url(#sbSoft)" />
          {/* суурь */}
          <rect x="-96" y="600" width="192" height="18" rx="5" fill="url(#sbGold)" opacity="0.95" />
          <rect x="-80" y="566" width="160" height="36" rx="4" fill="url(#sbGold)" opacity="0.9" />
          {/* дунд давхар */}
          <rect x="-60" y="522" width="120" height="46" rx="4" fill="url(#sbGold)" opacity="0.92" />
          <polygon points="-84,522 84,522 60,506 -60,506" fill="url(#sbGold)" opacity="0.8" />
          {/* дээд давхар */}
          <rect x="-40" y="470" width="80" height="38" rx="3" fill="url(#sbGold)" />
          <polygon points="-60,470 60,470 40,454 -40,454" fill="url(#sbGold)" opacity="0.85" />
          {/* оройн бөмбөрцөг ба шонх */}
          <ellipse cx="0" cy="446" rx="20" ry="16" fill="url(#sbGold)" />
          <polygon points="-9,432 9,432 0,398" fill="url(#sbGold)" />
          <circle cx="0" cy="392" r="7" fill="#FFF1C6">
            <animate attributeName="r" values="7;9.5;7" dur="4.5s" repeatCount="indefinite" />
          </circle>
          {/* цонхнууд */}
          <g fill="#1B1332" opacity="0.5">
            <rect x="-52" y="534" width="12" height="20" rx="3" />
            <rect x="-18" y="534" width="12" height="20" rx="3" />
            <rect x="16" y="534" width="12" height="20" rx="3" />
            <rect x="40" y="534" width="12" height="20" rx="3" />
            <rect x="-30" y="482" width="12" height="18" rx="3" />
            <rect x="18" y="482" width="12" height="18" rx="3" />
          </g>
        </g>

        {/* Ойрын уулс — найман дэлбээ мэт */}
        <polygon points={ridge(47, 780, 175, 7)} fill="url(#sbNear)" />

        {/* Лянхуа дэлбээний нуман хэлбэр — доод хүрээ */}
        <g transform="translate(720 900)" opacity="0.35">
          {[-72, -48, -24, 0, 24, 48, 72].map((a, i) => (
            <ellipse
              key={i}
              cx="0" cy="-14" rx="86" ry="150"
              fill="none" stroke="#E8B75F" strokeWidth="1.2"
              opacity={0.55 - Math.abs(a) / 260}
              transform={`rotate(${a})`}
            />
          ))}
        </g>

        {/* Хамгийн доод нам гүм давхарга */}
        <path d="M0,830 C260,798 480,846 720,832 C980,816 1200,860 1440,836 L1440,900 L0,900 Z" fill="#0A1226" opacity="0.92" />
      </svg>

      {/* Зөөлөн харанхуйрал — контент дээр текст тод унших боломжтой болно */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(7,14,30,0.05) 0%, rgba(7,14,30,0.42) 58%, rgba(6,11,24,0.72) 100%)" }} />
    </div>
  );
}
