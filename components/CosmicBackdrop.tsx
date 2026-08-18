/* Зөөлөн, тансаг дэвсгэр — бүдэг градиент ба аура. Хөдөлгөөнт цэгүүдийг хассан. */
export function CosmicBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* soft moving gradient wash */}
      <div className="absolute inset-0 bg-aurora opacity-80" style={{ backgroundSize: "180% 180%" }} />
      {/* aura blobs — бүгд inset сөрөг талдаа, гарчиг бүхий агуулгыг бүрхэхгүй */}
      <div className="absolute -left-24 top-10 h-[34rem] w-[34rem] rounded-full bg-primary-200/35 blur-3xl animate-glowPulse" />
      <div className="absolute -right-24 top-1/3 h-[30rem] w-[30rem] rounded-full bg-lavender-300/35 blur-3xl animate-glowPulse" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-accent-100/45 blur-3xl animate-glowPulse" style={{ animationDelay: "4s" }} />
    </div>
  );
}
