"use client";

import type { ReactNode } from "react";
import { ShambhalaBg } from "./ShambhalaBg";

/** Нэвтрэх / бүртгүүлэх хуудсуудын нэгдсэн бүрхүүл — Шамбалын дэвсгэртэй. */
export function AuthShell({
  glyph = "✶",
  title,
  subtitle,
  children,
  footer,
}: {
  glyph?: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="night relative isolate overflow-hidden">
      <ShambhalaBg />

      <div className="relative z-10 container-px flex min-h-[86vh] items-center justify-center py-16 sm:py-20">
        <div className="w-full max-w-md">
          <div className="mb-7 text-center">
            <span
              className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-2xl text-[#1B1332] shadow-[0_16px_44px_-16px_rgba(232,183,95,0.75)]"
              style={{ backgroundImage: "linear-gradient(140deg,#FFE7A8,#E8B75F 55%,#C08B33)" }}
            >
              {glyph}
            </span>
            <h1 className="mt-5 font-display text-3xl font-semibold text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] sm:text-4xl">
              {title}
            </h1>
            {subtitle && <p className="mt-2.5 text-white/75">{subtitle}</p>}
          </div>

          {/* Шилэн самбар */}
          <div
            className="rounded-3xl border border-white/15 p-6 shadow-[0_36px_90px_-32px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8"
            style={{ background: "linear-gradient(155deg, rgba(18,32,58,0.78), rgba(24,22,52,0.72))" }}
          >
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-white/75">{footer}</div>}
        </div>
      </div>
    </section>
  );
}
