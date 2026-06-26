import Link from "next/link";
import { services, courses, products, testimonials, aboutContent, homeFeatures } from "@/data/content";
import { ServiceCard, CourseCard, ProductCard } from "@/components/Cards";
import { SectionHeading, Stars, Eyebrow } from "@/components/ui";
import { GlyphTile } from "@/components/GlyphTile";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { T, Tr } from "@/components/T";

export default function HomePage() {
  const fServices = services.filter((s) => s.featured);
  const fCourses = courses.filter((c) => c.featured);
  const fProducts = products.filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-aurora">
        <div className="container-px grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fadeUp">
            <span className="chip border-primary-200 bg-white/70 text-primary-700"><T k="hero.badge" /></span>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              <span className="text-gradient"><T k="hero.titleAccent" /></span><T k="hero.titleRest" />
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted"><T k="hero.sub" /></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn btn-primary btn-lg"><T k="hero.ctaServices" /></Link>
              <Link href="/courses" className="btn btn-outline btn-lg"><T k="hero.ctaCourses" /></Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {aboutContent.stats.slice(0, 3).map((s) => (
                <div key={s.value}>
                  <div className="font-display text-2xl font-semibold text-ink">{s.value}</div>
                  <div className="text-sm text-muted"><Tr v={s.label} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden h-[460px] w-full max-w-md lg:block">
            <div className="absolute inset-0 grid place-items-center"><div className="h-80 w-80 rounded-full border border-primary-200" /></div>
            <div className="absolute inset-0 grid place-items-center"><div className="h-[420px] w-[420px] animate-spinSlow rounded-full border border-dashed border-accent-300/60" /></div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid h-44 w-44 place-items-center rounded-full bg-primary-grad text-6xl text-white shadow-glow">✶</div>
            </div>
            <GlyphTile glyph="☾" tone="sky" size="lg" className="absolute left-2 top-10 animate-floaty" />
            <GlyphTile glyph="✷" tone="jade" size="md" className="absolute right-4 top-24 animate-floaty" />
            <GlyphTile glyph="❂" tone="gold" size="lg" className="absolute bottom-12 right-8 animate-floaty" />
            <GlyphTile glyph="✿" tone="rose" size="md" className="absolute bottom-20 left-6 animate-floaty" />
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y border-line bg-white">
        <div className="container-px grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {homeFeatures.map((f) => (
            <div key={f.title.mn} className="flex items-start gap-4">
              <GlyphTile glyph={f.glyph} tone={f.tone} size="sm" />
              <div>
                <h3 className="font-display text-base font-semibold text-ink"><Tr v={f.title} /></h3>
                <p className="mt-1 text-sm leading-relaxed text-muted"><Tr v={f.text} /></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="section">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={<T k="home.servicesEyebrow" />} title={<T k="home.servicesTitle" />} desc={<T k="home.servicesDesc" />} />
            <Link href="/services" className="btn btn-outline btn-md"><T k="common.allServices" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fServices.map((s, i) => (<Reveal key={s.id} delay={i * 80}><ServiceCard s={s} /></Reveal>))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="section bg-white">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={<T k="home.coursesEyebrow" />} title={<T k="home.coursesTitle" />} desc={<T k="home.coursesDesc" />} />
            <Link href="/courses" className="btn btn-outline btn-md"><T k="common.allCourses" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fCourses.map((c, i) => (<Reveal key={c.id} delay={i * 80}><CourseCard c={c} /></Reveal>))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow><T k="home.aboutEyebrow" /></Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold text-ink sm:text-4xl"><T k="home.aboutTitle" /></h2>
            <p className="mt-4 leading-relaxed text-muted"><Tr v={aboutContent.mission} /></p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {aboutContent.values.map((v) => (
                <div key={v.title.mn} className="card p-4">
                  <div className="text-2xl">{v.glyph}</div>
                  <h3 className="mt-2 font-display text-base font-semibold text-ink"><Tr v={v.title} /></h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted"><Tr v={v.text} /></p>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn btn-primary btn-md mt-8"><T k="home.readMore" /></Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 rounded-4xl border border-line bg-white p-6 shadow-card">
              <div className="grid grid-cols-2 gap-4">
                {aboutContent.stats.map((s) => (
                  <div key={s.value} className="rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 p-6 text-center">
                    <div className="font-display text-3xl font-semibold text-primary-700">{s.value}</div>
                    <div className="mt-1 text-sm text-muted"><Tr v={s.label} /></div>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl bg-primary-grad p-6 text-white">
                <p className="font-display text-lg leading-relaxed"><T k="home.quote" /></p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="section bg-white">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={<T k="home.productsEyebrow" />} title={<T k="home.productsTitle" />} desc={<T k="home.productsDesc" />} />
            <Link href="/shop" className="btn btn-outline btn-md"><T k="common.allProducts" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fProducts.map((p, i) => (<Reveal key={p.id} delay={i * 80}><ProductCard p={p} /></Reveal>))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container-px">
          <SectionHeading center eyebrow={<T k="home.testimonialsEyebrow" />} title={<T k="home.testimonialsTitle" />} desc={<T k="home.testimonialsDesc" />} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <figure className="card flex h-full flex-col p-6">
                  <Stars rating={t.rating} />
                  <blockquote className="mt-4 flex-1 leading-relaxed text-ink/80">«<Tr v={t.quote} />»</blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4">
                    <div className="font-semibold text-ink">{t.name}</div>
                    <div className="text-sm text-muted"><Tr v={t.role} /></div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
