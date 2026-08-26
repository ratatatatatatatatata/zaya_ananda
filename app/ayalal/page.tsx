import Link from "next/link";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { JOURNEY_FAQ } from "@/data/journeys";
import { listJourneysCached } from "@/lib/journeys-db";
import { JourneyImage } from "@/components/journey/SceneArt";
import { ContactSection } from "@/components/ContactSection";

export const metadata = {
  title: "Сүнслэг аялал — Spiritual Journey Mongolia",
  description:
    "Монголын энергийн ариун газрууд руу бясалгал, зан үйлтэй хослуулсан сүнслэг аяллууд. Mongolia spiritual retreat, Gobi energy center, sacred sites tours, meditation journey Mongolia.",
  keywords: [
    "сүнслэг аялал", "энергийн газрууд", "Шамбалын орон", "бясалгалын аялал",
    "Mongolia spiritual retreat", "Gobi energy center", "sacred Mongolia tour", "meditation journey Mongolia", "shamanic Mongolia",
  ],
};

const NAV = [
  { id: "tours", label: "Аяллын хөтөлбөрүүд" },
  { id: "places", label: "Энергийн газрууд" },
  { id: "guides", label: "Багш, хөтөч нар" },
  { id: "faq", label: "Асуулт хариулт" },
];

const VALUES = [
  { icon: "🕊", title: "Аялал биш — дотоод аян", text: "Бид зүгээр л газар үзүүлдэггүй. Аялал бүр бясалгал, зан үйл, чимээгүй байдлын дадлагатай хослож, таныг өөртэй тань уулзуулахад чиглэнэ." },
  { icon: "🌿", title: "Байгальд ээлтэй, хүндэтгэлтэй", text: "Ариун газруудад мөр үлдээхгүй зарчмаар аялж, нутгийн соёл, зан үйлийг гүнээ хүндэтгэнэ." },
  { icon: "👥", title: "Цөөн хүнтэй, гүн туршлага", text: "Бүлэг бүр цөөн хүнтэй байдаг тул хүн бүрд багшийн анхаарал хүртээмжтэй, туршлага тань гүн байх болно." },
  { icon: "🧭", title: "Туршлагатай удирдагчид", text: "Бясалгалын багш болон нутаг усаа мэддэг хөтөч нар аяллын турш хамт байж, аюулгүй байдал, утга агуулгыг нэгэн зэрэг хангана." },
];

const PLACES = [
  {
    name: "Шамбалын орон — Хамарын хийд",
    where: "Дорноговь аймаг",
    story: "Догшин ноён хутагт Данзанравжаагийн байгуулсан, дэлхийн энергийн төвүүдийн нэгд тооцогддог газар. Энд газрын энерги онцгой хүчтэй гэж үздэг бөгөөд хүсэл мөрөөдлөө даатгахаар олон мянган хүн ирдэг.",
    ritual: "108 суваргыг нар зөв тойрч, хүслээ бичиж үлдээн, тусгай цэгт сууж нарны энерги хуримтлуулна. Ирэхийн өмнө сэтгэлээ цэвэрлэж, цагаан хувцас өмсөхийг зөвлөдөг.",
  },
  {
    name: "Отгонтэнгэр уул",
    where: "Завхан аймаг",
    story: "Очирваань бурханы орших ариун уул хэмээн шүтэгддэг, төрийн тахилгатай Монголын хамгийн ариун уулсын нэг. Цаст оргил нь хүч чадал, тэвчээрийн бэлгэдэл.",
    ritual: "Уулын өвөрт овоо тахиж, цагаан идээний дээжээ өргөнө. Эмэгтэйчүүд оргилд гардаггүй уламжлалтай — энэ хориог хүндэтгэнэ.",
  },
  {
    name: "Амарбаясгалант хийд",
    where: "Сэлэнгэ аймаг",
    story: "XVIII зууны архитектурын гайхамшиг, Занабазарын өвтэй холбоотой Монголын хамгийн том сүм хийдийн нэг. Хөндий нь амар амгалангийн энергитэй гэж тооцогддог.",
    ritual: "Хийдийн гол дуганд мөргөж, ард уулын Жалханз овоог тойрно. Ном айлдварын цагаар чимээгүй суух нь дотоод амгалангийн эхлэл болдог.",
  },
  {
    name: "Арьяабал бясалгалын төв",
    where: "Горхи-Тэрэлж",
    story: "Заан хадан дунд орших бясалгалын сүм — 108 гишгүүртэй гүүрээр өгсөж хүрдэг. Зам нь өөрөө бясалгал: гишгүүр бүрд нэгэн сургаал бичээстэй.",
    ritual: "Гүүрний эхэнд санаагаа тодорхойлж, гишгүүр бүрийн сургаалыг уншиж өгсөнө. Дээр гараад хотын чимээнээс ангид 10 минутын чимээгүй бясалгал хийнэ.",
  },
];

export default async function AyalalPage() {
  const [heroMedia, JOURNEYS] = await Promise.all([heroMediaFor("ayalal"), listJourneysCached().catch(() => [])]);
  return (
    <>
      {/* Ариун хөндий — гэрлийн зам дагуу камер урагшилж, алсын нар мандалт руу аялна */}
      <VideoHero
        media={heroMedia}
        clip="stream"
        eyebrow="Spiritual Journey Mongolia"
        title="Сүнслэг аялал"
        desc="Монголын энергийн ариун газрууд руу хийх энэ аян бол зүгээр нэг зам биш — таны дотоод амар амгалан руу хийх аялал юм."
      />
      {/* Дотоод цэс — гүйлгэхэд толгойн доор наалдаж, хамт хөдөлнө */}
      <nav className="night sticky top-16 z-30 border-y border-white/10 bg-[#0B1714]/90 backdrop-blur lg:top-[72px]">
        <div className="container-px flex gap-x-7 gap-y-2 overflow-x-auto py-3.5 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {NAV.map((n) => (
            <a key={n.id} href={"#" + n.id} className="shrink-0 whitespace-nowrap text-sm font-semibold text-white/70 transition hover:text-primary-300">{n.label}</a>
          ))}
        </div>
      </nav>

      {/* Үнэт зүйлс */}
      <section className="section"><div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-ink">Энгийн жуулчлалаас юугаараа өөр вэ?</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="card h-full p-6">
              <div className="text-3xl">{v.icon}</div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* Аяллын хөтөлбөрүүд — зурган карт */}
      <section id="tours" className="section scroll-mt-32 bg-surface-2"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink">Аяллын хөтөлбөрүүд</h2>
        <p className="mt-2 max-w-2xl text-muted">Аялал сонгоод дарвал өдөр өдрийн хөтөлбөр, хариуцах багш, хамт явах баг зэрэг бүх мэдээлэл дэлгэрэнгүй нээгдэнэ.</p>
        {JOURNEYS.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">Одоохондоо аялал нэмэгдээгүй байна.</p>
        )}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {JOURNEYS.map((j) => (
            <Link key={j.slug} href={`/ayalal/${j.slug}`} className="card group block overflow-hidden transition hover:-translate-y-1 hover:shadow-glow">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <JourneyImage src={j.image} scene={j.scene} alt={j.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,20,17,0.86) 0%, rgba(8,20,17,0.15) 55%, transparent 100%)" }} />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-300">{j.tagline}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">{j.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                  <span>🗓 {j.days}</span><span>👥 {j.groupSize}</span><span>⛺ {j.stay}</span>
                </div>
                <p className="mt-3 leading-relaxed text-muted">{j.summary}</p>
                <span className="btn btn-primary btn-sm mt-5">Дэлгэрэнгүй үзэх →</span>
              </div>
            </Link>
          ))}
        </div>
      </div></section>

      {/* Энергийн газрууд */}
      <section id="places" className="section scroll-mt-32"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink">Энергийн газрууд</h2>
        <p className="mt-2 max-w-2xl text-muted">Монгол орны өндөр энергит, ариун дагшин нутгууд — түүх, соёлын учир холбогдол, тэнд хийх зан үйлийн хамт.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {PLACES.map((pl) => (
            <div key={pl.name} className="card p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">{pl.name}</h3>
                <span className="shrink-0 text-xs font-semibold text-muted">📍 {pl.where}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{pl.story}</p>
              <div className="mt-4 rounded-xl bg-primary-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Зан үйлийн зааварчилгаа</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{pl.ritual}</p>
              </div>
            </div>
          ))}
        </div>
      </div></section>

      {/* Багш, хөтөч нар */}
      <section id="guides" className="section scroll-mt-32 bg-surface-2"><div className="container-px text-center">
        <h2 className="font-display text-3xl font-semibold text-ink">Багш, хөтөч нар</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Аялал бүрийг бясалгалын туршлагатай багш болон нутаг усаа мэддэг хөтөч нар хамтран удирдана.
          Тухайн аяллыг хэн хариуцаж, хэн хамт явахыг аяллын дэлгэрэнгүй хуудаснаас харна уу.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {JOURNEYS.map((j) => (
            <Link key={j.slug} href={`/ayalal/${j.slug}#baga`} className="btn btn-outline btn-md">{j.name} →</Link>
          ))}
        </div>
      </div></section>

      {/* FAQ */}
      <section id="faq" className="section bg-surface-2 scroll-mt-32"><div className="container-px max-w-3xl">
        <h2 className="text-center font-display text-3xl font-semibold text-ink">Түгээмэл асуултууд</h2>
        <div className="mt-8 space-y-3">
          {JOURNEY_FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-surface-1 p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-ink marker:content-['']">
                {f.q}
                <span className="text-primary-400 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div></section>

      {/* Холбоо барих — аяллын тухай асуухад бэлэн */}
      <ContactSection />
    </>
  );
}
