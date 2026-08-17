import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNEYS, journeyBySlug } from "@/data/journeys";
import { JourneyImage } from "@/components/journey/SceneArt";
import { LeadCard, CrewRow } from "@/components/journey/PersonCard";

export const revalidate = 600;

export function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const j = journeyBySlug(params.slug);
  if (!j) return { title: "Аялал олдсонгүй" };
  return { title: `${j.name} — Сүнслэг аялал`, description: j.summary };
}

export default function JourneyPage({ params }: { params: { slug: string } }) {
  const j = journeyBySlug(params.slug);
  if (!j) notFound();

  return (
    <>
      {/* Толгой — зураг дээр гарчиг */}
      <section className="night relative isolate flex min-h-[64svh] items-end overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <JourneyImage src={j.image} scene={j.scene} alt={j.name} className="h-full w-full object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(to top, rgba(8,20,17,0.94) 0%, rgba(8,20,17,0.45) 42%, rgba(8,20,17,0.2) 100%)" }} />
        <div className="container-px w-full pb-14 pt-32">
          <Link href="/ayalal" className="text-sm font-semibold text-accent-300 hover:underline">← Бүх аялал</Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-accent-300">{j.tagline}</p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">{j.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{j.summary}</p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
            <span>🗓 {j.days}</span><span>👥 {j.group}</span><span>🚌 {j.transport}</span><span>⛺ {j.stay}</span>
          </div>
        </div>
      </section>

      {/* Товч мэдээлэл */}
      <section className="section"><div className="container-px">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="panel p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Хэнд тохирох вэ</p>
            <p className="mt-2 leading-relaxed text-ink/85">{j.audience}</p>
          </div>
          <div className="panel p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-jade-600">Багтсан</p>
            <p className="mt-2 leading-relaxed text-ink/85">{j.included}</p>
          </div>
          <div className="panel p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Багтаагүй</p>
            <p className="mt-2 leading-relaxed text-ink/85">{j.excluded}</p>
          </div>
        </div>
      </div></section>

      {/* Өдөр өдрийн хөтөлбөр — зүүн талд зураг, баруун талд мэдээлэл */}
      <section id="hutulbur" className="section scroll-mt-24 bg-surface-2"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Өдөр өдрийн хөтөлбөр</h2>
        <p className="mt-2 max-w-2xl text-muted">Өдөр бүрийн урсгал, юу үзэж, юу хийхийг дарааллаар нь харуулав.</p>

        <div className="mt-10 space-y-8">
          {j.itinerary.map((d, i) => (
            <article key={i} className="card grid gap-0 overflow-hidden lg:grid-cols-[minmax(0,22rem)_1fr]">
              {/* Урд тал — зураг */}
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full">
                <JourneyImage src={d.image} scene={d.scene} alt={d.title} className="h-full w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1714]/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-300 backdrop-blur">
                  {d.label}
                </span>
              </div>

              {/* Ард тал — товч гарчиг, мэдээлэл, үзэх зүйлс */}
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-ink">{d.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{d.text}</p>
                {d.bullets && d.bullets.length > 0 && (
                  <>
                    <p className="mt-6 text-xs font-bold uppercase tracking-wide text-primary-700">Үзэх, хийх зүйлс</p>
                    <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {d.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-[0.98rem] leading-relaxed text-ink/85">
                          <span aria-hidden className="mt-0.5 text-accent-300">✦</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div></section>

      {/* Хариуцах хүн ба баг */}
      <section id="baga" className="section scroll-mt-24"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Аяллыг хэн хариуцах вэ</h2>
        <p className="mt-2 max-w-2xl text-muted">Аяллын турш тантай хамт явж, хөтөлбөрийг удирдах хүмүүс.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
          <LeadCard person={j.lead} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Хамт явах баг</p>
            <div className="mt-4 space-y-4">
              {j.crew.map((c) => <CrewRow key={c.name} person={c} />)}
            </div>
          </div>
        </div>
      </div></section>

      {/* Бүртгэл */}
      <section className="section bg-surface-2"><div className="container-px">
        <div className="night relative overflow-hidden rounded-4xl p-8 sm:p-12"
          style={{ backgroundImage: "linear-gradient(150deg,#0F2B26 0%,#12302A 55%,#1E2A1C 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(232,183,95,0.26), transparent 70%)", filter: "blur(10px)" }} />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Энэ аялалд нэгдэх үү?</h2>
              <p className="mt-2.5 leading-relaxed text-white/80">{j.price}</p>
            </div>
            <Link href="/about#contact" className="btn btn-gold btn-lg shrink-0">Урьдчилан бүртгүүлэх</Link>
          </div>
        </div>
      </div></section>
    </>
  );
}
