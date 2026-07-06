"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { localeMeta } from "@/lib/i18n-core";
import { cx } from "@/lib/format";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = localeMeta.find((m) => m.code === lang) ?? localeMeta[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/10 px-3 py-2 text-sm font-semibold text-ink transition hover:border-primary/30"
        aria-label="Language"
      >
        <span>{current.flag}</span>
        <span className="hidden md:inline">{current.native}</span>
        <span className="text-[10px] text-muted">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-[#1A2742] p-1 shadow-lift">
          {localeMeta.map((m) => (
            <button
              key={m.code}
              onClick={() => {
                setLang(m.code);
                setOpen(false);
              }}
              className={cx(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition",
                m.code === lang ? "bg-primary-50 font-semibold text-primary-700" : "text-ink/80 hover:bg-ink/5"
              )}
            >
              <span className="text-base">{m.flag}</span>
              <span>{m.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
