import type { ReactNode } from "react";
import Link from "next/link";
import { T } from "./T";
import { MeditationFigure } from "./MeditationFigure";

/** Хуудасны толгой — нүүр хуудасны кино маягийн гүн өнгөтэй уялдсан. */
export function PageHeader({ title, desc, crumb }: { title: ReactNode; desc?: ReactNode; crumb?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#131D3B]">
      {/* Аура туяанууд — ногоон, ягаан, цэнхэр */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-[440px] w-[700px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(43,200,187,0.42), rgba(43,200,187,0) 70%)", filter: "blur(12px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[360px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(155,110,240,0.30), rgba(155,110,240,0) 70%)", filter: "blur(14px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(17,27,54,0) 30%, rgba(16,54,65,0.45) 70%, rgba(36,30,78,0.4) 100%)" }}
      />
      <MeditationFigure tone="jade" showAura={false} className="pointer-events-none absolute -right-2 bottom-0 hidden w-44 opacity-25 lg:block" />
      <div className="relative z-10 container-px py-16 sm:py-20">
        <nav className="mb-4 flex items-center gap-2 text-sm text-white/55">
          <Link href="/" className="transition hover:text-white"><T k="nav.home" /></Link>
          <span>/</span>
          <span className="font-medium text-white/90">{crumb ?? title}</span>
        </nav>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">{desc}</p>}
      </div>
    </section>
  );
}
