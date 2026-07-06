import type { ReactNode } from "react";
import Link from "next/link";
import { T } from "./T";
import { MeditationFigure } from "./MeditationFigure";

/** Хуудасны толгой — нүүр хуудасны кино маягийн гүн өнгөтэй уялдсан. */
export function PageHeader({ title, desc, crumb }: { title: ReactNode; desc?: ReactNode; crumb?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#121C33]">
      {/* Нүүрийн аура туяа */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[440px] w-[760px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(120,230,210,0.40), rgba(120,230,210,0) 70%)", filter: "blur(12px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(11,16,32,0) 35%, rgba(18,64,72,0.35) 100%)" }}
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
