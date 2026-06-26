import { notFound } from "next/navigation";
import Link from "next/link";
import { courses } from "@/data/content";
import { GlyphTile } from "@/components/GlyphTile";
import { AddToCart } from "@/components/AddToCart";
import { CourseCard } from "@/components/Cards";
import { LocalizedList } from "@/components/LocalizedList";
import { T, Tr } from "@/components/T";
import { formatMNT } from "@/lib/format";
import { pick } from "@/lib/i18n-core";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = courses.find((x) => x.slug === params.slug);
  return { title: c ? pick(c.title, "mn") : "Сургалт" };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const c = courses.find((x) => x.slug === params.slug);
  if (!c) notFound();
  const related = courses.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-aurora">
        <div className="container-px py-12 sm:py-16">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary-700"><T k="nav.home" /></Link><span>/</span>
            <Link href="/courses" className="hover:text-primary-700"><T k="nav.courses" /></Link><span>/</span>
            <span className="font-medium text-ink"><Tr v={c.title} /></span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="chip bg-white/70"><Tr v={c.level} /></span>
              <h1 className="mt-4 text-balance text-4xl font-semibold text-ink sm:text-5xl"><Tr v={c.title} /></h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted"><Tr v={c.short} /></p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-ink/70">
                <span className="rounded-full bg-white/70 px-4 py-2">📚 {c.lessons} <T k="common.lessons" /></span>
                <span className="rounded-full bg-white/70 px-4 py-2">🗓 <Tr v={c.duration} /></span>
                <span className="rounded-full bg-white/70 px-4 py-2">▶ <Tr v={c.format} /></span>
              </div>
            </div>
            <div className="flex justify-center">
              <GlyphTile glyph={c.glyph} tone={c.tone} size="xl" className="h-48 w-48 animate-floaty text-7xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink"><T k="courseDetail.about" /></h2>
            <p className="mt-4 leading-relaxed text-muted"><Tr v={c.description} /></p>
            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="courseDetail.learn" /></h3>
            <LocalizedList items={c.outcomes} variant="cards" accent="jade" />
            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="courseDetail.includes" /></h3>
            <LocalizedList items={c.highlights} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted"><T k="courseDetail.price" /></span>
                <span className="font-display text-2xl font-semibold text-ink">{formatMNT(c.price)}</span>
              </div>
              <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
                <div className="flex items-center justify-between"><dt className="text-muted"><T k="common.level" /></dt><dd className="font-semibold text-ink"><Tr v={c.level} /></dd></div>
                <div className="flex items-center justify-between"><dt className="text-muted"><T k="common.lessons" /></dt><dd className="font-semibold text-ink">{c.lessons}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-muted"><T k="common.duration" /></dt><dd className="font-semibold text-ink"><Tr v={c.duration} /></dd></div>
                <div className="flex items-center justify-between"><dt className="text-muted"><T k="common.format" /></dt><dd className="font-semibold text-ink"><Tr v={c.format} /></dd></div>
              </dl>
              <div className="mt-6 space-y-2">
                <AddToCart className="btn btn-primary btn-lg w-full" labelKey="common.enroll"
                  item={{ kind: "course", slug: c.slug, title: c.title, price: c.price, tone: c.tone, glyph: c.glyph }} />
                <Link href="/contact" className="btn btn-outline btn-md w-full"><T k="common.ask" /></Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-px">
          <h2 className="font-display text-2xl font-semibold text-ink"><T k="courseDetail.related" /></h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (<CourseCard key={r.id} c={r} />))}
          </div>
        </div>
      </section>
    </>
  );
}
