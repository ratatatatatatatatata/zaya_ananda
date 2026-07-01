import type { ReactNode } from "react";
import Link from "next/link";
import { T } from "./T";
import { EnergyWaves } from "./EnergyWaves";
import { MeditationFigure } from "./MeditationFigure";

export function PageHeader({ title, desc, crumb }: { title: ReactNode; desc?: ReactNode; crumb?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-aurora">
      <EnergyWaves />
      <MeditationFigure tone="jade" showAura={false} className="pointer-events-none absolute -right-2 bottom-0 hidden w-44 opacity-30 lg:block" />
      <div className="relative z-10 container-px py-16 sm:py-20">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="transition hover:text-primary-700"><T k="nav.home" /></Link>
          <span>/</span>
          <span className="font-medium text-ink">{crumb ?? title}</span>
        </nav>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{desc}</p>}
      </div>
    </section>
  );
}
