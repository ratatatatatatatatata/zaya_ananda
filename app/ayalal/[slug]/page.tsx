import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNEYS, journeyBySlug, JOURNEY_FAQ, JOURNEY_PREP } from "@/data/journeys";
import { JourneyImage } from "@/components/journey/SceneArt";
import { LeadCard, CrewRow } from "@/components/journey/PersonCard";
import { JourneyBooking } from "@/components/journey/JourneyBooking";
import { JourneyReviews } from "@/components/journey/JourneyReviews";
import { ContactSection } from "@/components/ContactSection";

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

      {/* Дотоод цэс — гүйлгэхэд толгойн доор наалдаж, хамт хөдөлнө */}
      <nav className="night sticky top-16 z-30 border-y border-white/10 bg-[#0B1714]/90 backdrop-blur lg:top-[72px]">
        <div className="container-px flex gap-x-7 gap-y-2 overflow-x-auto py-3.5 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {[
            { id: "hutulbur", label: "Өдөр өдрийн хөтөлбөр" },
            { id: "baga", label: "Хариуцах баг" },
            { id: "zahialga", label: "Цаг захиалах" },
            { id: "zuvlumj", label: "Аялагчдын зөвлөмж" },
            { id: "faq", label: "Асуулт хариулт" },
          ].map((n) => (
            <a key={n.id} href={"#" + n.id} className="shrink-0 whitespace-nowrap text-sm font-semibold text-white/70 transition hover:text-primary-300">{n.label}</a>
          ))}
        </div>
      </nav>

      {/* Товч мэдээлэл */}
      <section className="section"><div className="container-px">
        <div className="grid gap-5 lg:grid-cols-4">
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
          <div className="panel p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-300">Үнэ</p>
            <p className="mt-2 leading-relaxed text-ink/85">{j.price}</p>
          </div>
        </div>
      </div></section>

      {/* Өдөр өдрийн хөтөлбөр — зүүн талд зураг, баруун талд мэдээлэл */}
      <section id="hutulbur" className="section scroll-mt-32 bg-surface-2"><div className="container-px">
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
      <section id="baga" className="section scroll-mt-32"><div className="container-px">
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

        {/* Аялсан хүмүүсийн сэтгэгдэл */}
        <JourneyReviews slug={j.slug} />
      </div></section>

      {/* Цаг захиалга */}
      <section id="zahialga" className="section scroll-mt-32 bg-surface-2"><div className="container-px">
        <div className="max-w-2xl">
          <p className="eyebrow-line"><span>🗓</span></p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Аялах өдрөө сонгож захиалах</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Хуанлиас өдрөө сонгоод бүртгүүлээрэй. Админ баталгаажуулсны дараа танд мэдэгдэл ирнэ.
          </p>
        </div>
        <div className="mt-8">
          <JourneyBooking slug={j.slug} journeyName={j.name} />
        </div>
      </div></section>

      {/* Аялагчдын зөвлөмж */}
      <section id="zuvlumj" className="section scroll-mt-32"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Аялагчдын зөвлөмж</h2>
        <p className="mt-2 max-w-2xl text-muted">Аяллын өмнө бэлдэхэд туслах зөвлөмжүүд.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-ink">🙏 Соёлын дүрэм</h3>
            <ul className="mt-4 space-y-2.5">
              {JOURNEY_PREP.etiquette.map((e, i) => <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">•</span><span>{e}</span></li>)}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-ink">🎒 Цүнхэндээ юу авах вэ</h3>
            <ul className="mt-4 space-y-2.5">
              {JOURNEY_PREP.packing.map((e, i) => <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">•</span><span>{e}</span></li>)}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink">🧘 Сэтгэлзүйн бэлтгэл</h3>
              <ul className="mt-4 space-y-2.5">
                {JOURNEY_PREP.mind.map((e, i) => <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">•</span><span>{e}</span></li>)}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink">🥗 Хоол</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{JOURNEY_PREP.food}</p>
            </div>
          </div>
        </div>
      </div></section>

      {/* Түгээмэл асуултууд */}
      <section id="faq" className="section scroll-mt-32 bg-surface-2"><div className="container-px max-w-3xl">
        <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">Түгээмэл асуултууд</h2>
        <div className="mt-8 space-y-3">
          {JOURNEY_FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-surface-1 p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between gap-4 font-semibold text-ink marker:content-['']">
                {f.q}
                <span aria-hidden className="text-primary-400 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div></section>
      <ContactSection />
    </>
  );
}
