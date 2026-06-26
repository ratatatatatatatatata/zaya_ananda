import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/data/content";
import { GlyphTile } from "@/components/GlyphTile";
import { AddToCart } from "@/components/AddToCart";
import { ServiceCard } from "@/components/Cards";
import { LocalizedList } from "@/components/LocalizedList";
import { T, Tr } from "@/components/T";
import { formatMNT } from "@/lib/format";
import { pick } from "@/lib/i18n-core";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  return { title: s ? pick(s.title, "mn") : "Үйлчилгээ" };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  if (!s) notFound();
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-aurora">
        <div className="container-px py-12 sm:py-16">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary-700"><T k="nav.home" /></Link><span>/</span>
            <Link href="/services" className="hover:text-primary-700"><T k="nav.services" /></Link><span>/</span>
            <span className="font-medium text-ink"><Tr v={s.title} /></span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="chip bg-white/70"><Tr v={s.category} /></span>
              <h1 className="mt-4 text-balance text-4xl font-semibold text-ink sm:text-5xl"><Tr v={s.title} /></h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted"><Tr v={s.short} /></p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium text-ink/70">
                <span className="rounded-full bg-white/70 px-4 py-2">⏱ <Tr v={s.duration} /></span>
                <span className="rounded-full bg-white/70 px-4 py-2">💎 {formatMNT(s.price)}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <GlyphTile glyph={s.glyph} tone={s.tone} size="xl" className="h-48 w-48 animate-floaty text-7xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink"><T k="detail.description" /></h2>
            <p className="mt-4 leading-relaxed text-muted"><Tr v={s.description} /></p>
            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="detail.includes" /></h3>
            <LocalizedList items={s.highlights} />
            <div className="mt-10 rounded-3xl border border-line bg-cream p-6 text-sm leading-relaxed text-muted">
              <T k="detail.note" />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted"><T k="courseDetail.price" /></span>
                <span className="font-display text-2xl font-semibold text-ink">{formatMNT(s.price)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span className="text-muted"><T k="common.duration" /></span>
                <span className="font-semibold text-ink"><Tr v={s.duration} /></span>
              </div>
              <div className="mt-6 space-y-2">
                <AddToCart className="btn btn-primary btn-lg w-full" labelKey="common.addToCart"
                  item={{ kind: "service", slug: s.slug, title: s.title, price: s.price, tone: s.tone, glyph: s.glyph }} />
                <Link href="/contact" className="btn btn-outline btn-md w-full"><T k="common.ask" /></Link>
              </div>
              <p className="mt-4 text-center text-xs text-muted"><T k="detail.bookNote" /></p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-px">
          <h2 className="font-display text-2xl font-semibold text-ink"><T k="detail.related" /></h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (<ServiceCard key={r.id} s={r} />))}
          </div>
        </div>
      </section>
    </>
  );
}
