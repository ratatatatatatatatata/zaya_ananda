import { notFound } from "next/navigation";
import Link from "next/link";
import { courses, courseLessons, testimonials, team } from "@/data/content";
import { GlyphTile } from "@/components/GlyphTile";
import { AddToCart } from "@/components/AddToCart";
import { CourseCard } from "@/components/Cards";
import { LocalizedList } from "@/components/LocalizedList";
import { EnergyWaves } from "@/components/EnergyWaves";
import { Stars } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { T, Tr } from "@/components/T";
import { formatMNT } from "@/lib/format";
import { pick } from "@/lib/i18n-core";

export function generateStaticParams() { return courses.map((c) => ({ slug: c.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = courses.find((x) => x.slug === params.slug);
  return { title: c ? pick(c.title, "mn") : "Сургалт" };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const c = courses.find((x) => x.slug === params.slug);
  if (!c) notFound();
  const related = courses.filter((x) => x.slug !== c.slug).slice(0, 3);
  const lessons = courseLessons[c.slug] ?? [];
  const instructor = team.find((m) => m.name === c.instructor);
  const reqs = ["course.req1", "course.req2", "course.req3"];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line bg-aurora">
        <EnergyWaves />
        <div className="relative z-10 container-px py-12 sm:py-16">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary-700"><T k="nav.home" /></Link><span>/</span>
            <Link href="/courses" className="hover:text-primary-700"><T k="nav.courses" /></Link><span>/</span>
            <span className="font-medium text-ink"><Tr v={c.title} /></span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="chip"><Tr v={c.level} /></span>
              <h1 className="mt-4 text-balance text-4xl font-semibold text-ink sm:text-5xl"><Tr v={c.title} /></h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted"><Tr v={c.short} /></p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-ink/70">
                <span className="rounded-full border border-line bg-[#111B2D] px-4 py-2">📚 {c.lessons} <T k="common.lessons" /></span>
                <span className="rounded-full border border-line bg-[#111B2D] px-4 py-2">🗓 <Tr v={c.duration} /></span>
                {c.instructor && <span className="rounded-full border border-line bg-[#111B2D] px-4 py-2">👤 {c.instructor}</span>}
                {typeof c.students === "number" && <span className="rounded-full border border-line bg-[#111B2D] px-4 py-2">👥 {c.students.toLocaleString()}</span>}
              </div>
            </div>
            {/* intro preview */}
            <Link href={"/learn/" + c.slug} className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-line shadow-card">
              <div className="absolute inset-0 bg-gradient-to-br from-deep-700 via-[#0c5c57] to-primary-600" />
              <div className="relative grid h-16 w-16 place-items-center rounded-full bg-white/20 text-2xl text-white backdrop-blur transition group-hover:scale-110">▶</div>
              <span className="absolute bottom-3 left-4 text-sm font-semibold text-white/90"><T k="course.preview" /></span>
            </Link>
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

            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="course.curriculum" /></h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              {lessons.map((l, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">{i + 1}</span>
                  <span className="flex-1 text-sm font-medium text-ink">{l.title}</span>
                  {l.free && <span className="rounded bg-jade-400/10 px-2 py-0.5 text-[10px] font-semibold text-jade-600"><T k="learn.free" /></span>}
                  <span className="text-xs text-muted">{l.duration}</span>
                </div>
              ))}
            </div>

            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="course.requirements" /></h3>
            <ul className="mt-4 space-y-2">
              {reqs.map((r) => (<li key={r} className="flex items-start gap-3"><span className="mt-0.5 text-primary-600"><Icon name="check" className="h-5 w-5" /></span><span className="text-ink/80"><T k={r} /></span></li>))}
            </ul>

            <h3 className="mt-10 font-display text-xl font-semibold text-ink"><T k="course.feedback" /></h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {testimonials.slice(0, 2).map((t) => (
                <figure key={t.id} className="card p-5">
                  <Stars rating={t.rating} />
                  <blockquote className="mt-3 text-sm leading-relaxed text-ink/80">«<Tr v={t.quote} />»</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-ink">{t.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted"><T k="courseDetail.price" /></span>
                <span className="font-display text-2xl font-semibold text-ink">{formatMNT(c.price)}</span>
              </div>
              <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted"><T k="common.level" /></dt><dd className="font-semibold text-ink"><Tr v={c.level} /></dd></div>
                <div className="flex justify-between"><dt className="text-muted"><T k="common.format" /></dt><dd className="font-semibold text-ink"><Tr v={c.format} /></dd></div>
                <div className="flex justify-between"><dt className="text-muted"><T k="common.startDate" /></dt><dd className="font-semibold text-ink">{c.startDate || <T k="common.selfPaced" />}</dd></div>
                <div className="flex justify-between"><dt className="text-muted"><T k="common.students" /></dt><dd className="font-semibold text-ink">{c.students?.toLocaleString()}</dd></div>
              </dl>
              <div className="mt-6 space-y-2">
                <AddToCart className="btn btn-primary btn-lg w-full" labelKey="course.buy"
                  item={{ kind: "course", slug: c.slug, title: c.title, price: c.price, tone: c.tone, glyph: c.glyph }} />
                <Link href={"/learn/" + c.slug} className="btn btn-outline btn-md w-full"><T k="course.startLearning" /></Link>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display text-base font-semibold text-ink">🏅 <T k="courseDetail.certInfo" /></h3>
              <p className="mt-2 text-sm leading-relaxed text-muted"><T k={c.certificate ? "course.certYes" : "course.certNo"} /></p>
            </div>

            {instructor && (
              <div className="card p-5">
                <h3 className="font-display text-base font-semibold text-ink"><T k="detail.instructorTitle" /></h3>
                <div className="mt-4 flex items-center gap-3">
                  <GlyphTile glyph={instructor.glyph} tone={instructor.tone} size="md" />
                  <div><p className="font-semibold text-ink">{instructor.name}</p><p className="text-sm text-primary-600"><Tr v={instructor.role} /></p></div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="section bg-[#111B2D]">
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
