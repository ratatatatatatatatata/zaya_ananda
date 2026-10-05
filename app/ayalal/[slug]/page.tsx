import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNEY_FAQ, JOURNEY_PREP } from "@/data/journeys";
import { getJourneyBySlugCached, getJourneyBySlug } from "@/lib/journeys-db";
import { JourneyImage } from "@/components/journey/SceneArt";
import { CrewRow, Avatar } from "@/components/journey/PersonCard";
import { JourneyItinerary } from "@/components/journey/JourneyItinerary";
import { DestinationGallery } from "@/components/journey/DestinationGallery";
import { JourneyGallery } from "@/components/journey/JourneyGallery";
import { JourneyBooking } from "@/components/journey/JourneyBooking";
import { JourneyReviews } from "@/components/journey/JourneyReviews";

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
          <p className="mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-white/85">{j.summary}</p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
            <span>🗓 {j.days}</span><span>👥 {j.groupSize}</span><span>🚌 {j.transport}</span><span>⛺ {j.stay}</span>
          </div>
        </div>
      </section>

      {/* Товч мэдээлэл */}
      <section className="section"><div className="container-px">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <article className="panel relative min-w-0 overflow-hidden p-6 sm:p-8">
            <div aria-hidden className="absolute -right-16 -top-20 size-48 rounded-full bg-primary-100/60 blur-3xl" />
            <div className="relative">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-50 text-xl text-primary-700">✦</span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-700">Хэнд тохирох вэ</p>
              <p className="mt-3 whitespace-pre-line break-words text-lg leading-8 text-ink/80">{j.audience}</p>
            </div>
          </article>

          <aside className="panel flex min-w-0 flex-col overflow-hidden bg-[#0b3d35] p-6 text-white sm:p-8">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Аяллыг хэн хариуцах вэ</h2>
              {j.lead?.name && (
                <div className="mt-6">
                  <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-white/10 [&>img]:absolute [&>img]:inset-0 [&>img]:object-top">
                    <Avatar person={j.lead} size="lg" />
                  </div>
                  <p className="mt-4 break-words text-base font-semibold text-white">{j.lead.name}</p>
                  {j.lead.role && <p className="mt-1 text-sm text-white/70">{j.lead.role}</p>}
                  {j.lead.info && <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/85">{j.lead.info}</p>}
                </div>
              )}
            </div>
          </aside>

        </div>
      </div></section>

      {/* Өдөр өдрийн хөтөлбөр — зүүн талд зураг, баруун талд мэдээлэл */}
      <section id="hutulbur" className="section scroll-mt-32 bg-surface-2"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Өдөр өдрийн хөтөлбөр</h2>
        <p className="mt-2 max-w-2xl text-muted">Өдрөө сонгоод сургалт, лекц болон аяллын дэлгэрэнгүй хөтөлбөртэй танилцаарай.</p>

        <JourneyItinerary days={j.itinerary || []} />
      </div></section>

      {/* Очих газрын тухай мэдээлэл — тусдаа том гарчигтай хэсэг, олон газар байж болно */}
      {j.destination && j.destination.length > 0 && (
        <section id="gazar" className="section scroll-mt-32"><div className="container-px">
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Очих газрууд</h2>
          <p className="mt-2 max-w-2xl text-muted">Зураг дээр курсороо аваачих эсвэл дарж дэлгэрэнгүй мэдээллийг томоор үзээрэй.</p>
          <DestinationGallery places={j.destination} scene={j.scene} circular />
        </div></section>
      )}

      {!!j.crew?.length && <section id="baga" className="section"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink">Хамт явах баг</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {j.crew.map((person) => <CrewRow key={person.name} person={person} />)}
        </div>
      </div></section>}

      {j.gallery?.some(photo => photo.image?.trim()) && <section className="section"><div className="container-px">
        <JourneyGallery journey={j} layout="wide" />
      </div></section>}

      <section id="zahialga" className="section scroll-mt-32 bg-surface-2"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Аялалд бүртгүүлэх</h2>
        <p className="mt-3 text-muted">Багцын үнэ, багтсан үйлчилгээ болон төлбөрийн нөхцөлтэй танилцаад бүртгүүлээрэй.</p>
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
          <article className="panel bg-[#0b3d35] p-6 text-white sm:p-8">
            <h3 className="text-sm font-semibold text-white/75">Нийт төлбөр</h3>
            <p className="mt-3 font-display text-3xl font-semibold">{formatJourneyPrice(j.price)}</p>
            <p className="mt-2 text-sm text-white/75">Нэг хүний багц үнэ</p>
            {!!j.prepay && <p className="mt-5 border-t border-white/20 pt-5 text-sm leading-7 text-white/85">Урьдчилгаа: {formatJourneyPrice(String(j.prepay))} / хүн</p>}
          </article>
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
        <div className="mx-auto mt-8 max-w-3xl">
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

      <section className="section"><div className="container-px"><JourneyReviews slug={j.slug} /></div></section>

      {/* Түгээмэл асуултууд */}
      <section id="faq" className="section scroll-mt-32 bg-surface-2"><div className="container-px">
        <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">Түгээмэл асуултууд</h2>
        <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
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
    </>
  );
}
