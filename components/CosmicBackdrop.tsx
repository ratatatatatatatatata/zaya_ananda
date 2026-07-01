function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296); }
const r = rng(91);
const particles = Array.from({ length: 30 }, () => {
  const colors = ["#16AFA4", "#9B6EF0", "#F09CBC", "#DFBC5E", "#5E8DE0", "#ffffff"];
  return {
    left: +(r() * 100).toFixed(2), top: +(r() * 100).toFixed(2),
    size: +(r() * 5 + 3).toFixed(1), dur: +(r() * 16 + 16).toFixed(1),
    delay: -+(r() * 30).toFixed(1), color: colors[Math.floor(r() * colors.length)],
    op: +(r() * 0.35 + 0.18).toFixed(2),
  };
});

/* Light, elegant animated cosmic backdrop (sparkles + aura + soft gradient). */
export function CosmicBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* soft moving gradient wash */}
      <div className="absolute inset-0 bg-aurora opacity-60" style={{ backgroundSize: "180% 180%" }} />
      {/* aura blobs */}
      <div className="absolute -left-24 top-10 h-[34rem] w-[34rem] rounded-full bg-primary-200/40 blur-3xl animate-glowPulse" />
      <div className="absolute right-[-6rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-grape-300/35 blur-3xl animate-glowPulse" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[-8rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-blush-300/30 blur-3xl animate-glowPulse" style={{ animationDelay: "4s" }} />
      {/* floating sparkles rising upward */}
      {particles.map((p, i) => (
        <span key={i} className="absolute rounded-full animate-driftUp"
          style={{ left: p.left + "%", top: p.top + "%", width: p.size, height: p.size, background: p.color, opacity: p.op, boxShadow: "0 0 " + (p.size * 2) + "px " + p.color, animationDuration: p.dur + "s", animationDelay: p.delay + "s" }} />
      ))}
    </div>
  );
}
