import type { Scene } from "@/data/journeys";

const PALETTE: Record<Scene, { sky: [string, string, string]; land: string[]; accent: string }> = {
  gobi: { sky: ["#2C1E3D", "#7C4A46", "#E0995A"], land: ["#8B5E42", "#6A452F", "#4A2E20"], accent: "#FFD79A" },
  mountain: { sky: ["#0F2444", "#2F4E7A", "#9AB6D4"], land: ["#7E94B4", "#4A5F80", "#26334C"], accent: "#EAF3FF" },
  monastery: { sky: ["#1C2340", "#5B4A72", "#D9A05B"], land: ["#6B5B48", "#4A3E31", "#2C241C"], accent: "#F0C46B" },
  forest: { sky: ["#0B2019", "#17392C", "#4E7A57"], land: ["#2C5342", "#1C382C", "#0F211A"], accent: "#A9E0BC" },
  steppe: { sky: ["#153252", "#3E6B84", "#D6B071"], land: ["#7E9057", "#556037", "#333B22"], accent: "#FFE2A8" },
  lake: { sky: ["#0D2136", "#28577A", "#8FC6D9"], land: ["#3E7C93", "#245265", "#12303C"], accent: "#D6F2FF" },
};

/** Зураг байхгүй үед харагдах процедур дүрслэл — аяллын төрлөөр өнгө, хэлбэр өөрчлөгдөнө. */
export function SceneArt({ scene, className = "" }: { scene: Scene; className?: string }) {
  const p = PALETTE[scene] || PALETTE.steppe;
  const id = scene;

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`sk-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="58%" stopColor={p.sky[1]} />
          <stop offset="100%" stopColor={p.sky[2]} />
        </linearGradient>
        <radialGradient id={`sn-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.9" />
          <stop offset="60%" stopColor={p.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill={`url(#sk-${id})`} />
      <circle cx="580" cy="230" r="150" fill={`url(#sn-${id})`} />
      <circle cx="580" cy="230" r="34" fill={p.accent} opacity="0.85" />

      {scene === "mountain" ? (
        <>
          <polygon points="-40,500 190,180 300,300 420,140 620,500" fill={p.land[1]} />
          <polygon points="120,300 190,180 262,300" fill={p.accent} opacity="0.85" />
          <polygon points="352,236 420,140 490,236" fill={p.accent} opacity="0.75" />
          <polygon points="380,500 620,240 900,500" fill={p.land[2]} />
        </>
      ) : scene === "monastery" ? (
        <>
          <polygon points="-40,500 200,300 460,500" fill={p.land[1]} opacity="0.8" />
          <g transform="translate(400 0)">
            <rect x="-120" y="380" width="240" height="24" fill={p.land[0]} />
            <rect x="-96" y="330" width="192" height="52" fill={p.land[0]} />
            <polygon points="-124,330 124,330 96,306 -96,306" fill={p.accent} opacity="0.9" />
            <rect x="-62" y="256" width="124" height="52" fill={p.land[0]} />
            <polygon points="-88,256 88,256 62,232 -62,232" fill={p.accent} opacity="0.8" />
            <polygon points="-10,232 10,232 0,196" fill={p.accent} />
          </g>
          <rect x="0" y="400" width="800" height="100" fill={p.land[2]} />
        </>
      ) : scene === "forest" ? (
        <>
          {[60, 150, 250, 330, 470, 560, 660, 740].map((x, i) => (
            <g key={x}>
              <polygon points={`${x - 42},${470 - i % 3 * 12} ${x},${230 + (i % 4) * 26} ${x + 42},${470 - i % 3 * 12}`} fill={i % 2 ? p.land[0] : p.land[1]} opacity={0.92} />
            </g>
          ))}
          <rect x="0" y="452" width="800" height="48" fill={p.land[2]} />
        </>
      ) : scene === "lake" ? (
        <>
          <polygon points="-40,340 180,200 380,340" fill={p.land[1]} />
          <polygon points="300,340 520,180 760,340" fill={p.land[2]} />
          <rect x="0" y="336" width="800" height="164" fill={p.land[0]} opacity="0.9" />
          {[370, 400, 430, 460].map((y, i) => (
            <rect key={y} x={200 - i * 30} y={y} width={340 + i * 60} height="4" rx="2" fill={p.accent} opacity={0.28 - i * 0.05} />
          ))}
        </>
      ) : scene === "gobi" ? (
        <>
          <path d="M-40,420 C120,360 260,400 400,378 C540,356 680,398 840,368 L840,500 L-40,500 Z" fill={p.land[0]} />
          <path d="M-40,452 C160,412 300,448 460,428 C620,408 740,444 840,424 L840,500 L-40,500 Z" fill={p.land[1]} />
          <path d="M-40,486 C200,458 420,486 840,464 L840,500 L-40,500 Z" fill={p.land[2]} />
        </>
      ) : (
        <>
          <path d="M-40,400 C160,352 340,392 520,372 C660,356 760,384 840,366 L840,500 L-40,500 Z" fill={p.land[0]} />
          <path d="M-40,450 C180,420 400,452 840,430 L840,500 L-40,500 Z" fill={p.land[1]} />
          <rect x="0" y="480" width="800" height="20" fill={p.land[2]} />
        </>
      )}

      {/* Зөөлөн харанхуйрал — текст уншигдахуйц болгоно */}
      <rect width="800" height="500" fill="rgba(8,16,14,0.18)" />
    </svg>
  );
}

/** Зураг байвал зураг, үгүй бол процедур дүрслэл */
export function JourneyImage({ src, scene, alt, className = "" }: { src?: string; scene: Scene; alt: string; className?: string }) {
  if (src) return <img src={src} alt={alt} className={className} />;
  return <SceneArt scene={scene} className={className} />;
}
