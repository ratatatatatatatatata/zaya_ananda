export const DEFAULT_LOGO_SRC = "/brand/zaya-ananda-logo-clean.png";

export function Logo({ withText = true, className = "", logoSrc, priority = false }: { withText?: boolean; className?: string; logoSrc?: string; priority?: boolean }) {
  return (
    <span className={"inline-flex items-center gap-3 " + className}>
      <img
        src={logoSrc || DEFAULT_LOGO_SRC}
        alt="Zaya's Ananda"
        width={56}
        height={56}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
      />
      {withText && (
        <span className="flex flex-col leading-none">
          {/* Нэрний өнгө — логотой ижил оюу градиент */}
          <span
            className="whitespace-nowrap bg-clip-text font-display text-2xl font-semibold text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg,#2BC8BB 0%,#16AFA4 45%,#0F9189 100%)" }}
          >
            Zaya&apos;s Ananda
          </span>
          <span
            className="whitespace-nowrap bg-clip-text text-[11px] font-semibold uppercase tracking-[0.3em] text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg,#2BC8BB 0%,#0F9189 100%)" }}
          >
            Center
          </span>
        </span>
      )}
    </span>
  );
}
