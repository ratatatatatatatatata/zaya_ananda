function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296); }
const r = rng(91);
/* Цайвар дэвсгэр дээр харагдах өнгө — цагаан оч байхгүй (үл үзэгдэнэ). */
const particles = Array.from({ length: 26 }, () => {
  const colors = ["#16AFA4", "#8454D8", "#E97BA8", "#B8912F", "#3B6FD4"];
  return {
    left: +(r() * 100).toFixed(2), top: +(r() * 100).toFixed(2),
    size: +(r() * 4 + 2.5).toFixed(1), dur: +(r() * 16 + 16).toFixed(1),
    delay: -+(r() * 30).toFixed(1), color: colors[Math.floor(r() * colors.length)],
    op: +(r() * 0.22 + 0.10).toFixed(2),
  };
});

/* Зөөлөн, тансаг хөдөлгөөнт дэвсгэр (оч + аура + бүдэг градиент). */
export function CosmicBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* soft moving gradient wash */}
      <div className="absolute inset-0 bg-aurora opacity-80" style={{ backgroundSize: "180% 180%" }} />
      {/* aura blobs — бүгд inset сөрөг талдаа, гарчиг бүхий агуулгыг бүрхэхгүй */}
      <div className="absolute -left-24 top-10 h-[34rem] w-[34rem] rounded-full bg-primary-200/35 blur-3xl animate-glowPulse" />
      <div className="absolute -right-24 top-1/3 h-[30rem] w-[30rem] rounded-full bg-lavender-300/35 blur-3xl animate-glowPulse" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-accent-100/45 blur-3xl animate-glowPulse" style={{ animationDelay: "4s" }} />
      {/* floating sparkles rising upward */}
      {particles.map((p, i) => (
        <span key={i} className="absolute rounded-full animate-driftUp"
          style={{ left: p.left + "%", top: p.top + "%", width: p.size, height: p.size, background: p.color, opacity: p.op, boxShadow: "0 0 " + (p.size * 2) + "px " + p.color, animationDuration: p.dur + "s", animationDelay: p.delay + "s" }} />
      ))}
    </div>
  );
}
