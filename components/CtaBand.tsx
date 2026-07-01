import Link from "next/link";
import { T } from "./T";

export function CtaBand() {
  return (
    <section className="section">
      <div className="container-px">
        <div className="relative isolate overflow-hidden rounded-5xl bg-primary-grad px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-accent-400/20" />
          <p className="relative text-sm font-bold uppercase tracking-[0.25em] text-white/70"><T k="cta.eyebrow" /></p>
          <h2 className="relative mt-3 font-display text-3xl font-semibold text-white sm:text-4xl"><T k="cta.title" /></h2>
          <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-white/80"><T k="cta.sub" /></p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/services" className="btn btn-gold btn-lg"><T k="hero.ctaServices" /></Link>
            <Link href="/contact" className="btn btn-lg border border-white/30 text-white hover:bg-white/10"><T k="cta.contact" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
