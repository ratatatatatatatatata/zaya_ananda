import { notFound } from "next/navigation";
import Link from "next/link";
import { services, products, team, faqs } from "@/data/content";
import { GlyphTile } from "@/components/GlyphTile";
import { ServiceCard, ProductCard } from "@/components/Cards";
import { LocalizedList } from "@/components/LocalizedList";
import { EnergyWaves } from "@/components/EnergyWaves";
import { AddToCart } from "@/components/AddToCart";
import { T, Tr } from "@/components/T";
import { formatMNT } from "@/lib/format";
import { pick } from "@/lib/i18n-core";

export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  return { title: s ? pick(s.title, "mn") : "Үйлчилгээ" };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  if (!s) notFound();
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const relProducts = products.slice(0, 3);
  const instructor = team.find((m) => m.name === s.instructor);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line bg-aurora">
        <EnergyWaves />
        <div className="relative z-10 container-px py-12 sm:py-16">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary-700"><T k="nav.home" /></Link><span>/</span>
            <Link href="/services" className="hover:text-primary-700"><T k="nav.services" /></Link><span>/</span>
            <span className="font-medium text-ink"><Tr v={s.title} /></span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="chip"><Tr v={s.category} /></span>
              <h1 className="mt-4 text-balance text-4xl font-semibold text-ink sm:text-5xl"><Tr v={s.title} /></h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted"><Tr v={s.short} /></p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-ink/70">
                <span className="rounded-full border border-line bg-white px-4 py-2">⏱ <Tr v={s.duration} /></span>
                {s.deliveryType && <span className="rounded-full border border-line bg-white px-4 py-2">📍 <Tr v={s.deliveryType} /></span>}
                {s.instructor && <span className="rounded-full border border-line bg-white px-4 py-2">👤 {s.instructor}</span>}
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

            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="detail.suitable" /></h3>
            <p className="mt-3 leading-relaxed text-muted">Амьдралын чиг баримжаагаа олох, стресс тайлах, дотоод тэнцвэрээ сэргээхийг хүссэн хэн бүхэнд тохиромжтой. Урьдчилсан мэдлэг, бэлтгэл шаардлагагүй.</p>

            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="detail.process" /></h3>
            <p className="mt-3 leading-relaxed text-muted">Эхлээд богино ярилцлагаар таны өнөөгийн төлөв байдлыг тодорхойлно. Дараа нь үндсэн сесси явагдаж, төгсгөлд нь хувийн зөвлөмж болон гэртээ хийх дасгал өгнө.</p>

            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="detail.includes" /></h3>
            <LocalizedList items={s.highlights} />

            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="detail.preparation" /></h3>
            <p className="mt-3 leading-relaxed text-muted">Сесси эхлэхээс өмнө хүнд хоол идэхээс зайлсхийж, тав тухтай хувцас өмсөж, 5–10 минутын өмнө ирэхийг зөвлөж байна.</p>

            <div className="mt-10 rounded-3xl border border-line bg-cream p-6 text-sm leading-relaxed text-muted">⚠ <T k="detail.note" /></div>

            <h3 className="mt-12 font-display text-2xl font-semibold text-ink"><T k="detail.faqTitle" /></h3>
            <div className="mt-5 space-y-3">
              {faqs.slice(0, 4).map((f) => (
                <details key={f.q.mn} className="group rounded-2xl border border-line bg-white p-5 [&_summary]:cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-ink marker:content-['']"><Tr v={f.q} /><span className="text-primary-600 transition group-open:rotate-45">＋</span></summary>
                  <p className="mt-3 leading-relaxed text-muted"><Tr v={f.a} /></p>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <p className="price text-2xl">{formatMNT(s.price)}</p>
              <AddToCart className="btn btn-primary btn-md mt-4 w-full" labelKey="common.addToCart"
                item={{ kind: "service", slug: s.slug, title: s.title, price: s.price, tone: s.tone, glyph: s.glyph }} />
              <Link href="/contact" className="btn btn-outline btn-md mt-2 w-full"><T k="nav.contact" /></Link>
              <p className="mt-3 text-xs leading-relaxed text-muted">Захиалгын дараа бид тантай холбогдож, тохиромжтой цагийг тохирно.</p>
            </div>
            {instructor && (
              <div className="card p-5">
                <h3 className="font-display text-base font-semibold text-ink"><T k="detail.instructorTitle" /></h3>
                <div className="mt-4 flex items-center gap-3">
                  <GlyphTile glyph={instructor.glyph} tone={instructor.tone} size="md" />
                  <div>
                    <p className="font-semibold text-ink">{instructor.name}</p>
                    <p className="text-sm text-primary-600"><Tr v={instructor.role} /></p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted"><Tr v={instructor.bio} /></p>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-px">
          <h2 className="font-display text-2xl font-semibold text-ink"><T k="detail.relatedProducts" /></h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relProducts.map((r) => (<ProductCard key={r.id} p={r} />))}
          </div>
        </div>
      </section>

      <section className="section">
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
