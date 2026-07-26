import type { GlyphKey } from "@/data/theme-map";

/** Ангилал бүрийн өвөрмөц бэлгэдэл — emoji биш, гараар зурсан SVG.
 *  Тухайн үйлчилгээ/сургалтын утгыг дүрсээр илэрхийлнэ. */
export function CategoryGlyph({ glyph, from, to, className = "h-10 w-10", id }: {
  glyph: GlyphKey; from: string; to: string; className?: string; id?: string;
}) {
  const gid = `g-${glyph}-${id ?? "x"}`;
  const S = { stroke: `url(#${gid})`, fill: "none", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg viewBox="0 0 48 48" className={className} role="presentation" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      {glyph === "aura" && (
        <g {...S}>
          <circle cx="24" cy="24" r="5" />
          <circle cx="24" cy="24" r="10" opacity="0.75" />
          <circle cx="24" cy="24" r="15" opacity="0.5" />
          <circle cx="24" cy="24" r="20" opacity="0.28" strokeDasharray="3 5" />
        </g>
      )}

      {glyph === "scanner" && (
        <g {...S}>
          <rect x="9" y="7" width="30" height="34" rx="4" opacity="0.55" />
          <path d="M14 18h20M14 24h20M14 30h13" opacity="0.5" strokeDasharray="2 3" />
          <path d="M9 24h30" strokeWidth="2.2" />
          <circle cx="24" cy="24" r="3.4" fill={`url(#${gid})`} stroke="none" />
        </g>
      )}

      {glyph === "matrix" && (
        <g {...S}>
          <path d="M24 5 43 24 24 43 5 24Z" />
          <path d="M24 14 34 24 24 34 14 24Z" opacity="0.6" />
          <circle cx="24" cy="24" r="2.6" fill={`url(#${gid})`} stroke="none" />
          <circle cx="24" cy="9.5" r="1.6" fill={`url(#${gid})`} stroke="none" />
          <circle cx="38.5" cy="24" r="1.6" fill={`url(#${gid})`} stroke="none" />
          <circle cx="24" cy="38.5" r="1.6" fill={`url(#${gid})`} stroke="none" />
          <circle cx="9.5" cy="24" r="1.6" fill={`url(#${gid})`} stroke="none" />
        </g>
      )}

      {glyph === "shagai" && (
        <g {...S}>
          <path d="M12 14c3-3 7-2 8 1s-1 6-4 7-6-1-6-4c0-1.6.7-3 2-4Z" />
          <path d="M28 12c4-1 8 1 8 5s-4 6-7 5-4-4-3-7c.3-1.2 1-2.6 2-3Z" opacity="0.8" />
          <path d="M13 30c4-2 8 0 9 4s-3 7-7 6-5-4-4-7c.3-1.2.9-2.4 2-3Z" opacity="0.65" />
          <path d="M29 30c4-2 8 1 8 5s-4 6-7 5-4-4-3-7c.3-1.1.8-2.3 2-3Z" opacity="0.5" />
        </g>
      )}

      {glyph === "advanced" && (
        <g {...S}>
          <path d="M5 30c5-9 9-9 14 0s9 9 14 0 5-9 10-6" />
          <path d="M5 20c5-9 9-9 14 0s9 9 14 0 5-9 10-6" opacity="0.5" />
          <circle cx="24" cy="25" r="2.4" fill={`url(#${gid})`} stroke="none" />
        </g>
      )}

      {glyph === "candle" && (
        <g {...S}>
          <path d="M24 6c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" />
          <path d="M24 13c1.6 2.2 2.6 3.6 2.6 5a2.6 2.6 0 0 1-5.2 0c0-1.4 1-2.8 2.6-5Z" fill={`url(#${gid})`} stroke="none" opacity="0.85" />
          <rect x="18" y="24" width="12" height="17" rx="2.4" />
          <path d="M24 24v-2" />
        </g>
      )}

      {glyph === "jet" && (
        <g {...S}>
          <rect x="8" y="16" width="20" height="16" rx="4" />
          <path d="M28 21h5m-5 3h8m-8 3h5" />
          <path d="M36 18c3 3 3 9 0 12" opacity="0.6" />
          <path d="M40 15c5 5 5 13 0 18" opacity="0.35" />
        </g>
      )}

      {glyph === "ozone" && (
        <g {...S}>
          <circle cx="17" cy="22" r="7" />
          <circle cx="30" cy="17" r="5.5" opacity="0.75" />
          <circle cx="29" cy="31" r="6.5" opacity="0.55" />
          <path d="M22 34c2 3 6 4 9 3" opacity="0.4" strokeDasharray="2 3" />
        </g>
      )}

      {glyph === "destiny" && (
        <g {...S}>
          <path d="M14 8c10 6 10 12 0 18s-10 12 0 18" />
          <path d="M34 8c-10 6-10 12 0 18s10 12 0 18" opacity="0.7" />
          <circle cx="24" cy="24" r="3" fill={`url(#${gid})`} stroke="none" />
        </g>
      )}

      {glyph === "lotus" && (
        <g {...S}>
          <path d="M24 10c4 5 6 10 6 15 0 4-2 7-6 9-4-2-6-5-6-9 0-5 2-10 6-15Z" />
          <path d="M18 34c-5-1-9-5-10-11 5-1 9 1 11 5" opacity="0.8" />
          <path d="M30 34c5-1 9-5 10-11-5-1-9 1-11 5" opacity="0.8" />
          <path d="M24 34c-6 2-11 1-15-2 3-3 8-4 12-2" opacity="0.5" />
          <path d="M24 34c6 2 11 1 15-2-3-3-8-4-12-2" opacity="0.5" />
        </g>
      )}

      {glyph === "mountain" && (
        <g {...S}>
          <path d="M4 36 17 16l8 11 5-6 14 15Z" />
          <path d="M13 24h8M27 27h5" opacity="0.45" />
          <circle cx="35" cy="12" r="4" opacity="0.8" />
          <path d="M4 40h40" opacity="0.35" strokeDasharray="3 4" />
        </g>
      )}

      {glyph === "scroll" && (
        <g {...S}>
          <path d="M14 8h20a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H14" />
          <path d="M14 8a4 4 0 0 0 0 8h4V8" />
          <path d="M14 40a4 4 0 0 0 0-8h4v8" opacity="0.6" />
          <path d="M22 18h12M22 24h12M22 30h8" opacity="0.55" />
        </g>
      )}

      {glyph === "film" && (
        <g {...S}>
          <rect x="7" y="12" width="34" height="24" rx="4" />
          <path d="M21 20l9 4-9 4z" fill={`url(#${gid})`} stroke="none" />
          <path d="M7 18h4M7 24h4M7 30h4M37 18h4M37 24h4M37 30h4" opacity="0.5" />
        </g>
      )}

      {glyph === "stone" && (
        <g {...S}>
          <path d="M24 7 38 17l-5 20H15l-5-20Z" />
          <path d="M10 17h28M24 7v30M15 37 24 17l9 20" opacity="0.5" />
        </g>
      )}

      {glyph === "gift" && (
        <g {...S}>
          <rect x="8" y="19" width="32" height="21" rx="3" />
          <path d="M6 19h36v7H6z" />
          <path d="M24 19v21" />
          <path d="M24 19c-5-1-9-3-9-6a4 4 0 0 1 9 1c0-3 4-5 7-3s1 7-7 8Z" opacity="0.85" />
        </g>
      )}

      {glyph === "default" && (
        <g {...S}>
          <circle cx="24" cy="24" r="16" />
          <path d="M24 8v32M8 24h32" opacity="0.4" />
        </g>
      )}
    </svg>
  );
}
