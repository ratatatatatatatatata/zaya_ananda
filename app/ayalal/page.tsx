import Link from "next/link";
import { Journey3D } from "@/components/three/Journey3D";

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
  { id: "prep", label: "Аялагчдын зөвлөмж" },
  { id: "faq", label: "Асуулт хариулт" },
];

const VALUES = [
  { icon: "🕊", title: "Аялал биш — дотоод аян", text: "Бид зүгээр л газар үзүүлдэггүй. Аялал бүр бясалгал, зан үйл, чимээгүй байдлын дадлагатай хослож, таныг өөртэй тань уулзуулахад чиглэнэ." },
  { icon: "🌿", title: "Байгальд ээлтэй, хүндэтгэлтэй", text: "Ариун газруудад мөр үлдээхгүй зарчмаар аялж, нутгийн соёл, зан үйлийг гүнээ хүндэтгэнэ." },
  { icon: "👥", title: "Цөөн хүнтэй, гүн туршлага", text: "Бүлэг бүр цөөн хүнтэй байдаг тул хүн бүрд багшийн анхаарал хүртээмжтэй, туршлага тань гүн байх болно." },
  { icon: "🧭", title: "Туршлагатай удирдагчид", text: "Бясалгалын багш болон нутаг усаа мэддэг хөтөч нар аяллын турш хамт байж, аюулгүй байдал, утга агуулгыг нэгэн зэрэг хангана." },
];

const TOURS = [
  {
    name: "Шамбалын орон — Говийн энергийн аялал",
    tagline: "Дорноговь, Хамарын хийд · Данзанравжаагийн өв",
    days: "2 өдөр, 1 шөнө",
    group: "Дээд тал нь 15 хүн",
    transport: "Тохилог автобус",
    stay: "Жуулчны бааз (гэр)",
    audience: "Анхлан суралцагчид болон дотоод амар амгалангаа сэргээхийг хүссэн хэн бүхэнд",
    itinerary: [
      "1-р өдөр, өглөө — УБ-аас хөдөлж, замдаа зориулгын тайлбар, амьсгалын дасгал",
      "1-р өдөр, үдээс хойш — Хамарын хийд, Шамбалын орны зан үйл: хүслээ даатгах, 108 суварга тойрох",
      "1-р өдөр, орой — Говийн нар жаргалт дунд чимээгүй бясалгал, галын зан үйл",
      "2-р өдөр, үүрээр — Нар угтах ёслол, хамтын бясалгал",
      "2-р өдөр, өдөр — Хийдийн музей, агуйн бясалгалын газрууд, буцах зам",
    ],
    included: "Унаа, хоол (цагаан хоолны сонголттой), байр, хөтөч, бясалгалын хөтөлбөр",
    excluded: "Хувийн зардал, даатгал, нэмэлт үйлчилгээ",
    price: "Үнэ тодорхойлогдож байна — урьдчилан бүртгүүлээрэй",
  },
  {
    name: "Хангайн ариун нутгийн аялал",
    tagline: "Амарбаясгалант хийд · уул усны тахилга",
    days: "3 өдөр, 2 шөнө",
    group: "Дээд тал нь 12 хүн",
    transport: "Жийп болон микро автобус",
    stay: "Гэр бааз, нутгийн айл",
    audience: "Байгальд гүн холбогдож, уламжлалт зан үйлтэй танилцахыг хүсэгчдэд",
    itinerary: [
      "1-р өдөр — Амарбаясгалант хийд: түүх, ном айлдвар, оройн бясалгал",
      "2-р өдөр — Уулын тахилга, овоо тойрох ёс, голын эрэг дээрх дуут бясалгал",
      "2-р өдөр, орой — Гал тахих зан үйл, одтой тэнгэр дор чимээгүй цаг",
      "3-р өдөр — Үүрийн бясалгал, талархлын ёслол, буцах зам",
    ],
    included: "Унаа, хоол, байр, хөтөч, бясалгалын хөтөлбөр, зан үйлийн хэрэглэл",
    excluded: "Хувийн зардал, даатгал",
    price: "Үнэ тодорхойлогдож байна — урьдчилан бүртгүүлээрэй",
  },
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

const PREP = {
  etiquette: [
    "Ариун газарт чанга ярихгүй, хог хаяхгүй, юу ч авч явахгүй (чулуу, мод ч мөн адил)",
    "Суварга, овоог нар зөв (цагийн зүүний дагуу) тойрно",
    "Сүм дугана орохдоо малгайгаа авч, босгон дээр гишгэхгүй",
    "Зан үйлийн үеэр зураг авахын өмнө хөтөчөөс зөвшөөрөл асууна",
    "Нутгийн иргэд, лам хуврагуудтай хүндэтгэлтэй харилцана",
  ],
  packing: [
    "Даавуун, сул хувцас (цагаан өнгө зан үйлд тохиромжтой), дулаан давхарга",
    "Иогийн дэвсгэр эсвэл суух жижиг дэвсгэр",
    "Усны сав, нарны малгай, тос",
    "Хувийн эм, гарын ариутгагч",
    "Тэмдэглэлийн дэвтэр, үзэг — сэтгэгдлээ буулгахад",
  ],
  mind: [
    "Аяллын турш утсаа аль болох унтраах буюу нисэх горимд байлгах (дижитал детокс)",
    "Чимээгүй цагуудыг эвгүйрхэлгүй хүлээж авах — энэ бол аяллын гол бэлэг",
    "Хүлээлт багатай, нээлттэй сэтгэлээр ирэх",
  ],
  food: "Аяллын хоол нь голдуу цагаан (вегетариан) чиглэлтэй, өдөрт 3 удаа, нутгийн цэвэр түүхий эдээр бэлтгэгдэнэ. Махан хоолны сонголт урьдчилан мэдэгдсэн тохиолдолд боломжтой.",
};

const FAQ = [
  { q: "Анхлан суралцагч оролцож болох уу?", a: "Тийм. Хөтөлбөрүүд маань туршлага шаарддаггүй — багш нар алхам бүрийг зааж, хүн бүрийн хэмнэлд тохируулна." },
  { q: "Цаг агаар таагүй бол яах вэ?", a: "Хөтөлбөрийг аюулгүй байдлыг нэн тэргүүнд тавьж зохицуулна. Шаардлагатай бол өдрийн дараалал солигдох буюу дотор өрөөнд зан үйл, бясалгал үргэлжилнэ." },
  { q: "Төлбөр хэрхэн төлөх вэ, аюулгүй юу?", a: "Сайтын худалдан авалтын системээр QPay эсвэл банкны шилжүүлгээр төлнө. Захиалга бүрийг админ гараар баталгаажуулдаг тул андуурал гарахгүй." },
  { q: "Цуцлах нөхцөл ямар байдаг вэ?", a: "Аялал эхлэхээс 7-оос дээш хоногийн өмнө бол бүрэн буцаан олгоно. Долоо хоногийн дотор бол дараагийн аялалд шилжүүлэх боломжтой." },
  { q: "Гадаад зочид оролцож болох уу?", a: "Болно. Хөтөлбөрүүд англи хэлний орчуулгатай явагдах боломжтой — урьдчилан мэдэгдээрэй." },
];

export default function AyalalPage() {
  return (
    <>
      {/* Ариун хөндий — гэрлийн зам дагуу камер урагшилж, алсын нар мандалт руу аялна */}
      <Journey3D
        world="sanctuary"
        eyebrow="Spiritual Journey Mongolia"
        title="Сүнслэг аялал"
        desc="Монголын энергийн ариун газрууд руу хийх энэ аян бол зүгээр нэг зам биш — таны дотоод амар амгалан руу хийх аялал юм. Гэрлийн зам дагуу урагшлаарай."
        heightVh={200}
        cta={[{ href: "#tours", label: "Хөтөлбөр үзэх" }, { href: "/about#contact", label: "Урьдчилан бүртгүүлэх" }]}
      />
      <section className="relative isolate overflow-hidden bg-[#131D3B]">
        {/* Дотоод цэс */}
        <nav className="relative z-10 border-t border-white/10 bg-[#0F1728]/70 backdrop-blur">
          <div className="container-px flex flex-wrap justify-center gap-x-7 gap-y-2 py-3.5">
            {NAV.map((n) => (
              <a key={n.id} href={"#" + n.id} className="text-sm font-semibold text-white/65 transition hover:text-primary-300">{n.label}</a>
            ))}
          </div>
        </nav>
      </section>

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

      {/* Аяллын хөтөлбөрүүд */}
      <section id="tours" className="section bg-[#141F36] scroll-mt-20"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink">Аяллын хөтөлбөрүүд</h2>
        <p className="mt-2 max-w-2xl text-muted">Хөтөлбөрүүд улирал бүр шинэчлэгдэнэ. Огноо, үнийн мэдээллийг урьдчилан бүртгүүлсэн зочдод хамгийн түрүүнд хүргэнэ.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {TOURS.map((t) => (
            <div key={t.name} className="card flex h-full flex-col overflow-hidden">
              <div className="border-b border-line bg-[#1F2E4F] p-6">
                <h3 className="font-display text-2xl font-semibold text-ink">{t.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary-300">{t.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                  <span>🗓 {t.days}</span><span>👥 {t.group}</span><span>🚌 {t.transport}</span><span>⛺ {t.stay}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm italic leading-relaxed text-muted">Хэнд тохирох вэ: {t.audience}</p>
                <h4 className="mt-5 font-display text-base font-semibold text-ink">Өдөр өдрийн хөтөлбөр</h4>
                <ul className="mt-3 space-y-2">
                  {t.itinerary.map((d, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">✦</span><span>{d}</span></li>
                  ))}
                </ul>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-jade-400/10 p-3.5"><p className="text-xs font-bold uppercase tracking-wide text-jade-400">Багтсан</p><p className="mt-1 text-sm text-ink/80">{t.included}</p></div>
                  <div className="rounded-xl bg-rose-500/10 p-3.5"><p className="text-xs font-bold uppercase tracking-wide text-rose-300">Багтаагүй</p><p className="mt-1 text-sm text-ink/80">{t.excluded}</p></div>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                  <span className="text-sm font-semibold text-accent-400">{t.price}</span>
                  <Link href="/about#contact" className="btn btn-primary btn-sm">Бүртгүүлэх</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div></section>

      {/* Энергийн газрууд */}
      <section id="places" className="section scroll-mt-20"><div className="container-px">
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
                <p className="text-xs font-bold uppercase tracking-wide text-primary-300">Зан үйлийн зааварчилгаа</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{pl.ritual}</p>
              </div>
            </div>
          ))}
        </div>
      </div></section>

      {/* Багш, хөтөч нар */}
      <section id="guides" className="section bg-[#141F36] scroll-mt-20"><div className="container-px text-center">
        <h2 className="font-display text-3xl font-semibold text-ink">Багш, хөтөч нар</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Аялал бүрийг бясалгалын туршлагатай багш нар болон нутаг усаа гарын алга шиг мэддэг хөтөч нар хамтран удирдана.
          Багш нарынхаа намтар, баримталдаг зарчимтай «Хамт олон» хуудаснаас дэлгэрэнгүй танилцаарай.
        </p>
        <Link href="/teachers" className="btn btn-primary btn-md mt-7">Хамт олонтой танилцах →</Link>
      </div></section>

      {/* Аялагчдын зөвлөмж */}
      <section id="prep" className="section scroll-mt-20"><div className="container-px">
        <h2 className="font-display text-3xl font-semibold text-ink">Аялагчдын зөвлөмж</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-ink">🙏 Соёлын дүрэм</h3>
            <ul className="mt-4 space-y-2.5">
              {PREP.etiquette.map((e, i) => <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">•</span><span>{e}</span></li>)}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-ink">🎒 Цүнхэндээ юу авах вэ</h3>
            <ul className="mt-4 space-y-2.5">
              {PREP.packing.map((e, i) => <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">•</span><span>{e}</span></li>)}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink">🧘 Сэтгэлзүйн бэлтгэл</h3>
              <ul className="mt-4 space-y-2.5">
                {PREP.mind.map((e, i) => <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">•</span><span>{e}</span></li>)}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink">🥗 Хоол</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{PREP.food}</p>
            </div>
          </div>
        </div>
      </div></section>

      {/* FAQ */}
      <section id="faq" className="section bg-[#141F36] scroll-mt-20"><div className="container-px max-w-3xl">
        <h2 className="text-center font-display text-3xl font-semibold text-ink">Түгээмэл асуултууд</h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-[#1A2742] p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-ink marker:content-['']">
                {f.q}
                <span className="text-primary-400 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-muted">Өөр асуулт байна уу?</p>
          <Link href="/about#contact" className="btn btn-outline btn-md mt-4">Бидэнтэй холбогдох</Link>
        </div>
      </div></section>
    </>
  );
}
