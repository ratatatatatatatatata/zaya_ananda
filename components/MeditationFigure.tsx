const toneColors: Record<string, [string, string]> = {
  violet: ["#34C6BA", "#0E746E"],
  gold: ["#DFBC5E", "#B8912F"],
  jade: ["#34BBA2", "#14806C"],
  rose: ["#6FDACE", "#0F9189"],
  sky: ["#6FDACE", "#0F9189"],
};

/* Original, tasteful lotus-pose meditation silhouette (abstract, non-explicit). */
export function MeditationFigure({
  tone = "violet",
  className = "",
  showAura = true,
}: {
  tone?: string;
  className?: string;
  showAura?: boolean;
}) {
  const [c1, c2] = toneColors[tone] ?? toneColors.violet;
  const fig = "medfig-" + tone;
  const aura = "medaura-" + tone;

  return (
    <svg viewBox="0 0 200 210" className={className} role="img" aria-label="Meditation">
      <defs>
        <linearGradient id={fig} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <radialGradient id={aura} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.38" />
          <stop offset="60%" stopColor={c1} stopOpacity="0.10" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>

      {showAura && <circle cx="100" cy="116" r="96" fill={"url(#" + aura + ")"} />}

      {/* concentric energy rings */}
      <circle cx="100" cy="116" r="86" fill="none" stroke={c1} strokeOpacity="0.18" strokeWidth="0.8" />
      <circle cx="100" cy="64" r="31" fill="none" stroke={c1} strokeOpacity="0.45" strokeWidth="1.4" />
      <circle cx="100" cy="38" r="3.2" fill="#E6C25A" />

      {/* shadow of folded legs */}
      <ellipse cx="100" cy="178" rx="54" ry="12" fill="#000000" opacity="0.06" />

      <g fill={"url(#" + fig + ")"}>
        {/* head */}
        <circle cx="100" cy="64" r="17" />
        {/* body: shoulders, torso and folded-leg base */}
        <path d="M50,176 C44,130 72,101 90,98 C92,84 108,84 110,98 C128,101 156,130 150,176 C151,182 145,186 138,186 L62,186 C55,186 49,182 50,176 Z" />
        {/* arms resting toward the lap */}
        <path d="M66,116 C54,134 53,158 62,176 C68,178 75,176 78,170 C71,152 74,134 86,124 Z" opacity="0.9" />
        <path d="M134,116 C146,134 147,158 138,176 C132,178 125,176 122,170 C129,152 126,134 114,124 Z" opacity="0.9" />
      </g>

      {/* chakra points along the center line */}
      {[92, 110, 128, 146, 162].map((cy, i) => (
        <circle key={cy} cx="100" cy={cy} r={i === 0 ? 2.8 : 2.4} fill="#FFFFFF" opacity="0.9" />
      ))}
    </svg>
  );
}
