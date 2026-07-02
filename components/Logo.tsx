export function Logo({ withText = true, className = "", logoSrc }: { withText?: boolean; className?: string; logoSrc?: string }) {
  return (
    <span className={"inline-flex items-center gap-2.5 " + className}>
      {logoSrc ? (
        <img src={logoSrc} alt="Zaya's Ananda" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
      ) : (
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" role="img" aria-label="Zaya's Ananda">
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
          <span className="font-display text-lg font-semibold text-ink">Zaya&apos;s Ananda</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-600">Ananda Center</span>
        </span>
      )}
    </span>
  );
}
