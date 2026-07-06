import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/content";
import { GlyphTile } from "@/components/GlyphTile";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/Cards";
import { EnergyWaves } from "@/components/EnergyWaves";
import { T, Tr } from "@/components/T";
import { formatMNT } from "@/lib/format";
import { pick } from "@/lib/i18n-core";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = products.find((x) => x.slug === params.slug);
  return { title: p ? pick(p.title, "mn") : "Бүтээгдэхүүн" };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const p = products.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const related = products.filter((x) => x.slug !== p.slug).slice(0, 4);

  return (
    <>
      <section className="section">
        <div className="container-px">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary-700"><T k="nav.home" /></Link><span>/</span>
            <Link href="/shop" className="hover:text-primary-700"><T k="nav.shop" /></Link><span>/</span>
            <span className="font-medium text-ink"><Tr v={p.title} /></span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative isolate flex items-center justify-center overflow-hidden rounded-4xl border border-line bg-gradient-to-br from-aqua to-primary-50 p-10">
              <EnergyWaves />
              <GlyphTile glyph={p.glyph} tone={p.tone} size="xl" className="relative z-10 h-52 w-52 text-8xl animate-floaty" />
              {p.badge && (<span className="absolute left-6 top-6 z-10 rounded-full bg-[#16233E]/90 px-3 py-1 text-xs font-bold text-ink"><Tr v={p.badge} /></span>)}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wide text-primary-600"><Tr v={p.category} /></span>
              <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl"><Tr v={p.title} /></h1>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-ink">{formatMNT(p.price)}</span>
                {p.oldPrice && <span className="text-lg text-muted line-through">{formatMNT(p.oldPrice)}</span>}
              </div>
              <p className="mt-5 leading-relaxed text-muted"><Tr v={p.description} /></p>

              <div className="mt-6">
                {p.inStock ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-jade-600">● <T k="productDetail.inStock" /></span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-rose-500">● <T k="common.soldOut" /></span>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <AddToCart className="btn btn-primary btn-lg flex-1" labelKey="common.addToCart" soldOut={!p.inStock}
                  item={{ kind: "product", slug: p.slug, title: p.title, price: p.price, tone: p.tone, glyph: p.glyph }} />
                <Link href="/cart" className="btn btn-outline btn-lg"><T k="cart.title" /></Link>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-muted">
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-[#1A2742] p-4">🔒 <T k="productDetail.secure" /></div>
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-[#1A2742] p-4">↩ <T k="productDetail.returns" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#1A2742]">
        <div className="container-px">
          <h2 className="font-display text-2xl font-semibold text-ink"><T k="productDetail.related" /></h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (<ProductCard key={r.id} p={r} />))}
          </div>
        </div>
      </section>
    </>
  );
}
