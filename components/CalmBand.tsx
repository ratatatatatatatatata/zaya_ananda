import Link from "next/link";
import { MeditationFigure } from "./MeditationFigure";
import { Eyebrow } from "./ui";
import { T } from "./T";

export function CalmBand() {
  return (
    <section className="section">
      <div className="container-px">
        <div className="grid items-center gap-8 overflow-hidden rounded-5xl border border-line bg-gradient-to-br from-primary-50 via-white to-accent-50 p-8 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="flex justify-center">
            <MeditationFigure tone="violet" className="w-60 sm:w-72" />
          </div>
          <div>
            <Eyebrow><T k="calm.eyebrow" /></Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold text-ink sm:text-4xl"><T k="calm.title" /></h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted"><T k="calm.text" /></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/courses" className="btn btn-primary btn-md"><T k="nav.courses" /></Link>
              <Link href="/services" className="btn btn-outline btn-md"><T k="hero.ctaServices" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
