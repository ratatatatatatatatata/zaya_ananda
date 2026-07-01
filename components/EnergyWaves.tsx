function particles(seed: number, n: number) {
  let s = seed >>> 0;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296);
  return Array.from({ length: n }, () => ({
    x: +(r() * 1200).toFixed(1),
    y: +(r() * 600).toFixed(1),
    rad: +(r() * 2.4 + 0.8).toFixed(2),
    o: +(r() * 0.4 + 0.15).toFixed(2),
    gold: r() > 0.7,
  }));
}
const dots = particles(9, 22);

/* Soft light energy waves: concentric ripples, flowing lines and light particles. */
export function EnergyWaves({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={"pointer-events-none absolute inset-0 overflow-hidden " + className}>
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <radialGradient id="ew-teal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#16AFA4" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#16AFA4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ew-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B8912F" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#B8912F" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="120" cy="100" rx="340" ry="320" fill="url(#ew-teal)" />
        <ellipse cx="1090" cy="540" rx="320" ry="300" fill="url(#ew-gold)" />

        {/* concentric energy rings */}
        <g fill="none" stroke="#16AFA4" strokeOpacity="0.10">
          <circle cx="1000" cy="120" r="70" />
          <circle cx="1000" cy="120" r="120" />
          <circle cx="1000" cy="120" r="180" />
          <circle cx="1000" cy="120" r="250" />
        </g>
        <circle cx="1000" cy="120" r="70" fill="none" stroke="#16AFA4" strokeOpacity="0.16" className="origin-center animate-ripple" style={{ transformOrigin: "1000px 120px" }} />

        {/* flowing lines */}
        <path d="M0,430 C300,372 520,478 770,420 C1000,368 1110,438 1200,408" fill="none" stroke="#16AFA4" strokeOpacity="0.14" strokeWidth="1.5" />
        <path d="M0,470 C320,420 540,520 800,460 C1020,410 1120,470 1200,448" fill="none" stroke="#B8912F" strokeOpacity="0.10" strokeWidth="1.2" />

        {/* light particles */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.rad} fill={d.gold ? "#B8912F" : "#16AFA4"} opacity={d.o} />
        ))}
      </svg>
    </div>
  );
}
