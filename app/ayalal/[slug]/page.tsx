import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNEY_FAQ, JOURNEY_PREP } from "@/data/journeys";
import { getJourneyBySlugCached, getJourneyBySlug } from "@/lib/journeys-db";
import { JourneyImage } from "@/components/journey/SceneArt";
import { LeadCard, CrewRow } from "@/components/journey/PersonCard";
import { JourneyBooking } from "@/components/journey/JourneyBooking";
import { JourneyReviews } from "@/components/journey/JourneyReviews";
import { ContactSection } from "@/components/ContactSection";

// Админ шинэ аялал нэмэнгүүт (эсвэл slug өөрчлөгдөнгүүт) шууд нээгдэж харагдахын тулд
// статик param урьдчилан үүсгэхийг больж, хүсэлт болгонд шинэчлэн уншина (доод давхаргад unstable_cache 5 минут кэшилнэ).
export const dynamic = "force-dynamic";

// Кэшлэгдсэн уншилт "олдсонгүй" гэж буцаавал (шинэ аялал саяхан нэмэгдсэн ч кэш
// хараахан шинэчлэгдээгүй байх магадлалтай тул) шууд DB-ээс дахин нэг шалгана —
// ингэснээр саяхан нэмсэн аялал дэлгэрэнгүй хуудсан дээрээ 404 үзүүлэхгүй.
async function findJourney(slug: string) {
  const cached = await getJourneyBySlugCached(slug).catch(() => null);
  if (cached) return cached;
  return getJourneyBySlug(slug).catch(() => null);
}

function splitJourneyDetails(value?: string | null) {
  const text = (value || "").trim();
  if (!text) return [];

  const numbered = text
    .split(/\s+(?=\d+[.)]\s*)/g)
    .map((item) => item.replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);

  if (numbered.length > 1) return numbered;

  return text
    .split(/\r?\n|[•·]\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function DetailList({ value, tone = "jade" }: { value?: string | null; tone?: "jade" | "rose" }) {
  const items = splitJourneyDetails(value);

  if (!items.length) return <p className="mt-5 text-sm text-muted">Мэдээлэл оруулаагүй байна.</p>;

  return (
    <ul className="mt-5 space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-[0.95rem] leading-6 text-ink/80">
          <span
            aria-hidden
            className={`mt-1.5 grid size-5 shrink-0 place-items-center rounded-full text-[0.68rem] font-bold ${
              tone === "rose" ? "bg-rose-50 text-rose-700" : "bg-primary-50 text-primary-700"
            }`}
          >
            {tone === "rose" ? "–" : "✓"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function formatJourneyPrice(value?: string | null) {
  const text = (value || "").trim();
  const numeric = Number(text.replace(/[^0-9]/g, ""));
  return numeric ? `${new Intl.NumberFormat("mn-MN").format(numeric)} ₮` : text || "Үнэ тохирно";
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const j = await findJourney(params.slug);
  if (!j) return { title: "Аялал олдсонгүй" };
  return { title: `${j.name} — Сүнслэг аялал`, description: j.summary };
}

export default async function JourneyPage({ params }: { params: { slug: string } }) {
  const j = await findJourney(params.slug);
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
            <span>🗓 {j.days}</span><span>👥 {j.groupSize}</span><span>🚌 {j.transport}</span><span>⛺ {j.stay}</span>
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
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
          <article className="panel relative overflow-hidden p-6 sm:p-8">
            <div aria-hidden className="absolute -right-16 -top-20 size-48 rounded-full bg-primary-100/60 blur-3xl" />
            <div className="relative">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-50 text-xl text-primary-700">✦</span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-700">Хэнд тохирох вэ</p>
              <p className="mt-3 max-w-3xl text-[1.02rem] leading-8 text-ink/80">{j.audience}</p>
            </div>
          </article>

          <aside className="panel flex flex-col justify-between overflow-hidden bg-[#0b3d35] p-6 text-white sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Аяллын үнэ</p>
              <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {formatJourneyPrice(j.price)}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">Нэг хүний багц үнэ</p>
            </div>
            <a href="#zahialga" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary-800 transition hover:-translate-y-0.5 hover:shadow-lg">
              Өдрөө сонгох <span aria-hidden>→</span>
            </a>
          </aside>

          <article className="panel p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-line pb-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-50 font-bold text-primary-700">✓</span>
              <div>
                <p className="font-display text-xl font-semibold text-ink">Үнэд багтсан</p>
                <p className="mt-0.5 text-sm text-muted">Аяллын багцад багтах үйлчилгээ</p>
              </div>
            </div>
            <DetailList value={j.included} />
          </article>

          <article className="panel p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-line pb-5">
              <span className="grid size-10 place-items-center rounded-xl bg-rose-50 font-bold text-rose-700">–</span>
              <div>
                <p className="font-display text-xl font-semibold text-ink">Үнэд багтаагүй</p>
                <p className="mt-0.5 text-sm text-muted">Тусад нь тооцогдох зардал</p>
              </div>
            </div>
            <DetailList value={j.excluded} tone="rose" />
          </article>
        </div>
      </div></section>

      {/* Өдөр өдрийн хөтөлбөр — зүүн талд зураг, баруун талд мэдээлэл */}
      <section id="hutulbur" className="section scroll-mt-32 bg-surface-2"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Өдөр өдрийн хөтөлбөр</h2>
        <p className="mt-2 max-w-2xl text-muted">Өдөр бүрийн урсгал, юу үзэж, юу хийхийг дарааллаар нь харуулав.</p>

        <div className="mt-10 space-y-8">
          {(j.itinerary || []).map((d, i) => (
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
          <LeadCard person={j.lead || { name: "", role: "", info: "" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Хамт явах баг</p>
            <div className="mt-4 space-y-4">
              {(j.crew || []).map((c) => <CrewRow key={c.name} person={c} />)}
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
          <JourneyBooking slug={j.slug} journeyName={j.name} prepay={j.prepay} />
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
