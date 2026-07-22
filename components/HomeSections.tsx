import Link from "next/link";
import { listCmsCached, getSettingsCached } from "@/lib/repo";
import { CmsCard } from "./CmsCard";
import { Reveal } from "./Reveal";
import { T, Tr } from "./T";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const D = {
  services: Lx(
    "Аура ба сканнер оношилгоо, зурхай мэргэ, лаа засал, озонатор эмчилгээ — биеийн болон энергийн тэнцвэрийг тань сэргээх үйлчилгээнүүд.",
    "Aura and scanner diagnostics, astrology, candle healing and ozone therapy — services to restore your energy balance.",
    "오라·스캐너 진단, 점성술, 촛불 힐링, 오존 테라피 — 에너지 균형을 회복하는 서비스.",
    "オーラ・スキャナー診断、占星術、キャンドルヒーリング、オゾン治療 — エネルギーの調和を取り戻すサービス。",
    "气场与扫描诊断、占星、蜡烛疗愈、臭氧治疗 — 恢复能量平衡的服务。"),
  courses: Lx(
    "Бясалгалын сургалтуудыг видео хичээлээр, өөрийн хэмнэлээр, гэрээсээ суралцаарай. Худалдан авсан хичээл тань таны хувийн буланд нээгдэнэ.",
    "Learn meditation through video lessons at your own pace, from home. Purchased courses open in your personal space.",
    "명상 강좌를 영상으로, 집에서 자신의 속도로 배우세요.",
    "瞑想講座を動画で、自宅で自分のペースで学べます。",
    "通过视频课程在家按自己的节奏学习冥想。"),
  journey: Lx(
    "Шамбалын орон, Отгонтэнгэр, Амарбаясгалант зэрэг Монголын энергийн ариун газрууд руу бясалгал, зан үйлтэй хослуулсан аяллууд. Аялал биш — дотоод аян.",
    "Journeys to Mongolia's sacred energy sites — Shambhala Land, Otgontenger, Amarbayasgalant — combined with meditation and rituals.",
    "샴발라의 땅, 오트곤텡게르 등 몽골의 성스러운 에너지 명소로 떠나는 명상 여행.",
    "シャンバラの地、オトゴンテンゲルなど、モンゴルの聖地への瞑想の旅。",
    "前往香巴拉之地、鄂特冈腾格里等蒙古神圣能量之地的冥想之旅。"),
  shop: Lx(
    "Энергийн хамгаалалтын бүтээгдэхүүнүүд. Төрсөн огноогоо оруулаад ордоо тохирох эрдэнийн чулуугаа олж, түүнд тохирсон бүтээгдэхүүнээ сонгоорой.",
    "Energy protection products. Enter your birth date to discover your zodiac stone and matching products.",
    "에너지 보호 제품. 생년월일로 나의 탄생석과 어울리는 제품을 찾아보세요.",
    "エナジープロテクション製品。生年月日からあなたの守護石と製品を見つけましょう。",
    "能量守护产品。输入生日，找到您的星座宝石与匹配产品。"),
  resources: Lx(
    "Зөвлөгөө, нийтлэл, нээлттэй видеонууд — өдөр тутмын амьдралд тань гэрэл нэмэх мэдлэгүүд.",
    "Advice, articles and open videos — knowledge to light your everyday life.",
    "조언, 글, 공개 영상 — 일상을 밝혀줄 지식.",
    "アドバイス・記事・公開動画 — 日々を照らす知恵。",
    "建议、文章与公开视频 — 照亮日常的知识。"),
  teachers: Lx(
    "Туршлагатай багш нар маань таныг аялалд тань дагалдана. Багш тус бүрийн намтар, хөтөлдөг хичээлүүдтэй нь танилцаарай.",
    "Our experienced teachers walk beside you. Meet each teacher and explore the classes they lead.",
    "경험 많은 선생님들이 함께합니다.",
    "経験豊かな講師陣がそばにいます。",
    "经验丰富的老师伴您同行。"),
  mood: Lx(
    "Өнөөдөр сэтгэл тань ямар байна? Мэдрэмжээ сонгоход бид яг танд хэрэгтэй хичээлийг санал болгоно.",
    "How is your soul today? Pick a mood and we'll suggest exactly what you need.",
    "오늘 마음은 어떠신가요? 기분을 고르면 꼭 맞는 것을 추천해 드립니다.",
    "今日の心はいかがですか？気分を選ぶとぴったりの内容をご提案。",
    "今天心情如何？选择心情，我们推荐最适合您的内容。"),
  gift: Lx(
    "Үнэгүй нээлттэй хичээлүүд — эхлэхэд тань зориулсан бидний бэлэг. Бүртгэлгүйгээр үзээрэй.",
    "Free open lessons — our gift to help you begin. No registration needed.",
    "무료 공개 레슨 — 시작을 위한 선물. 가입 없이 시청하세요.",
    "無料公開レッスン — はじめの一歩への贈り物。登録不要。",
    "免费公开课程 — 助您起步的礼物，无需注册。"),
};
const ALLBTN = Lx("Бүгдийг үзэх", "View all", "전체 보기", "すべて見る", "查看全部");

function SectionHead({ titleKey, desc, href, icon }: { titleKey: string; desc: Record<Locale, string>; href: string; icon: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          <span className="mr-2">{icon}</span><T k={titleKey} />
        </h2>
        <p className="mt-2 leading-relaxed text-muted"><Tr v={desc} /></p>
      </div>
      <Link href={href} className="btn btn-outline btn-sm shrink-0"><Tr v={ALLBTN} /> →</Link>
    </div>
  );
}

/** Нүүр хуудас — хэсэг бүр өөрийн мэдээлэлтэйгээр доошоо дараалан байрлана. */
export async function HomeSections() {
  const [services, courses, products, resources, free, settings] = await Promise.all([
    listCmsCached("service"), listCmsCached("course"), listCmsCached("product"),
    listCmsCached("resource"), listCmsCached("free"), getSettingsCached(),
  ]);
  const teachers = [
    ...(settings.teachers || []),
    ...(settings.team || []).filter((m) => !(settings.teachers || []).some((t) => t.name === m.name)),
  ].slice(0, 3);

  return (
    <>
      {/* Энергийн засал */}
      <section className="section"><div className="container-px">
        <SectionHead titleKey="nav.services" desc={D.services} href="/services" icon="✨" />
        {services.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      {/* Ариусахуйн үйл */}
      <section className="section bg-[#141F36]"><div className="container-px">
        <SectionHead titleKey="nav.courses" desc={D.courses} href="/courses" icon="🧘" />
        {courses.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      {/* Сүнслэг аялал — онцлох баннер */}
      <section className="section"><div className="container-px">
        <div className="relative overflow-hidden rounded-4xl border border-grape-500/30 bg-[#1B1B44] p-8 sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(155,110,240,0.35), transparent 70%)", filter: "blur(10px)" }} />
          <div aria-hidden className="pointer-events-none absolute -bottom-28 left-1/4 h-80 w-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(43,200,187,0.22), transparent 70%)", filter: "blur(12px)" }} />
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-grape-400">Spiritual Journey</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">🕊 Сүнслэг аялал</h2>
            <p className="mt-4 leading-relaxed text-white/75"><Tr v={D.journey} /></p>
            <Link href="/ayalal" className="btn btn-lg mt-7 text-white shadow-glow-grape hover:brightness-110 hover:-translate-y-0.5" style={{ backgroundImage: "linear-gradient(120deg,#9B6EF0,#5E8DE0)" }}>
              Аяллын хөтөлбөр үзэх →
            </Link>
          </div>
        </div>
      </div></section>

      {/* Энергийн хамгаалалт */}
      <section className="section bg-[#141F36]"><div className="container-px">
        <SectionHead titleKey="nav.shop" desc={D.shop} href="/shop" icon="🛡" />
        {products.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      {/* Гэгээрлийн зам */}
      <section className="section"><div className="container-px">
        <SectionHead titleKey="nav.resources" desc={D.resources} href="/resources" icon="📖" />
        {resources.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.slice(0, 3).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      {/* Хамт олон */}
      {teachers.length > 0 && (
        <section className="section bg-[#141F36]"><div className="container-px">
          <SectionHead titleKey="nav.teachers" desc={D.teachers} href="/teachers" icon="🤝" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t, idx) => (
              <Reveal key={t.name} delay={idx * 70}>
                <Link href={"/teachers/" + encodeURIComponent(t.name)} className="card group relative block overflow-hidden transition-shadow hover:shadow-glow">
                  {t.image
                    ? <div className="h-72 w-full overflow-hidden"><img src={t.image} alt={t.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: "50% " + (t.focus ?? 50) + "%" }} /></div>
                    : <div className="grid h-72 w-full place-items-center bg-primary-grad text-5xl text-white">👤</div>}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-12">
                    <h3 className="font-display text-xl font-semibold text-white">{t.name}</h3>
                    {t.role && <p className="mt-0.5 text-sm text-white/80">{t.role}</p>}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div></section>
      )}

      {/* Сэтгэлийн туяа + Гэгээн бэлэг */}
      <section className="section"><div className="container-px grid gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-4xl border border-line bg-[#1A2742] p-8">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(240,156,188,0.25), transparent 70%)" }} />
          <h2 className="font-display text-2xl font-semibold text-ink">🌅 <T k="nav.mood" /></h2>
          <p className="mt-3 leading-relaxed text-muted"><Tr v={D.mood} /></p>
          <Link href="/mood" className="btn btn-primary btn-md mt-6"><T k="nav.mood" /> →</Link>
        </div>
        <div className="relative overflow-hidden rounded-4xl border border-line bg-[#1A2742] p-8">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(227,190,98,0.22), transparent 70%)" }} />
          <h2 className="font-display text-2xl font-semibold text-ink">🎁 <T k="nav.gift" /></h2>
          <p className="mt-3 leading-relaxed text-muted"><Tr v={D.gift} /></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/gift" className="btn btn-gold btn-md"><T k="nav.gift" /> →</Link>
            {free.length > 0 && <span className="self-center text-sm text-muted">{free.length} хичээл нээлттэй байна</span>}
          </div>
        </div>
      </div></section>
    </>
  );
}
