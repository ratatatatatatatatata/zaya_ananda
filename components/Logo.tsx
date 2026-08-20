export function Logo({ withText = true, className = "", logoSrc }: { withText?: boolean; className?: string; logoSrc?: string }) {
  return (
    <span className={"inline-flex items-center gap-3 " + className}>
      {logoSrc ? (
        <img src={logoSrc} alt="Zaya's Ananda" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
      ) : (
      <svg viewBox="0 0 48 48" className="h-14 w-14 shrink-0" role="img" aria-label="Zaya's Ananda">
        <defs>
          <linearGradient id="logo-t" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2BC8BB" />
            <stop offset="100%" stopColor="#0F9189" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="none" stroke="url(#logo-t)" strokeWidth="2" />
        <circle cx="24" cy="24" r="16.5" fill="none" stroke="#16AFA4" strokeOpacity="0.30" strokeWidth="1" />
        {/* lotus bloom */}
        <g fill="url(#logo-t)">
          <path d="M24,11 C27.5,16.5 27.5,23 24,30 C20.5,23 20.5,16.5 24,11 Z" />
          <path d="M24,30 C19,26.5 15,22.5 14,16.5 C19.5,18 23,23.5 24,30 Z" />
          <path d="M24,30 C29,26.5 33,22.5 34,16.5 C28.5,18 25,23.5 24,30 Z" />
        </g>
        <circle cx="24" cy="31" r="1.7" fill="#B8912F" />
      </svg>
      )}
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
            Төв
          </span>
        </span>
      )}
    </span>
  );
}
