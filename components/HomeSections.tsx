import Link from "next/link";
import { listCmsCached, getSettingsCached } from "@/lib/repo";
import { heroMediaFor } from "@/lib/hero-video";
import { ReelsSlider } from "./home/ReelsSlider";
import { StoneReading } from "./StoneReading";
import { Reveal } from "./Reveal";
import { T, Tr } from "./T";
import { PathsHighlight } from "./home/PathsHighlight";
import { DailyHoroscope } from "./home/DailyHoroscope";
import { VideoBand } from "./video/VideoBand";
import { SectionJump } from "./home/SectionJump";
import { SectionZoom } from "./home/SectionZoom";
import { ZurhaiSlider } from "./home/ZurhaiSlider";
import { ServiceCard } from "./home/ServiceCard";
import { HomeAbout } from "./home/HomeAbout";
import { MoodPicker } from "./home/MoodPicker";
import { JourneyImage } from "./journey/SceneArt";
import { JOURNEYS } from "@/data/journeys";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const JOURNEY_EYEBROW = Lx("Сүнслэг аялал", "Spiritual journeys", "영적 여행", "聖地の旅", "心灵之旅");
const JOURNEY_DESC = Lx(
  "Одоо бүртгэл нээлттэй аяллууд. Аялал сонгоод дарвал өдөр өдрийн хөтөлбөр, хамт явах баг бүрэн харагдана.",
  "Journeys currently open for registration. Pick one to see the day-by-day plan and the team travelling with you.",
  "현재 신청 가능한 여행입니다. 선택하면 일자별 일정과 동행 팀을 볼 수 있습니다.",
  "現在申し込み受付中の旅です。選ぶと日ごとの行程と同行チームが表示されます。",
  "目前开放报名的行程。点选后可查看逐日安排与随行团队。",
);

/** Хэсэг бүрийн товч, ойлгомжтой танилцуулга */
const D = {
  services: Lx(
    "Аура оношилгоо, зурхай, лаа засал, озонатор — энергийн тэнцвэрээ сэргээх заслууд.",
    "Aura diagnostics, astrology, candle healing and ozone therapy to restore your energy balance.",
    "오라 진단, 점성술, 촛불 힐링, 오존 테라피 — 에너지 균형 회복.",
    "オーラ診断・占星術・キャンドルヒーリング・オゾン療法でエネルギーの調和を。",
    "气场诊断、占星、蜡烛疗愈、臭氧疗法 — 恢复能量平衡。"),
  courses: Lx(
    "Бясалгалын видео хичээлүүд. Худалдаж авсан хичээл тань хувийн буланд нээгдэнэ.",
    "Meditation video lessons. Purchased courses open in your personal space.",
    "명상 영상 강좌. 구매한 강좌는 내 공간에서 열립니다.",
    "瞑想の動画講座。購入した講座はマイページで視聴できます。",
    "冥想视频课程。已购课程在个人空间中开启。"),
  shop: Lx(
    "Төрсөн огноогоо оруулаад өөрийн эрдэнийн чулуу, түүнд тохирсон бүтээгдэхүүнээ олоорой.",
    "Enter your birth date to find your gemstone and the products that match it.",
    "생년월일을 입력해 나의 탄생석과 맞는 제품을 찾아보세요.",
    "生年月日から守護石と相性の良い製品を見つけましょう。",
    "输入出生日期，找到你的宝石与匹配产品。"),
  mood: Lx(
    "Өнөөдөр сэтгэл тань ямар байна? Мэдрэмжээ сонгоход яг танд хэрэгтэйг санал болгоно.",
    "How do you feel today? Pick a mood and we'll suggest exactly what you need.",
    "오늘 기분은 어떠신가요? 기분을 고르면 꼭 맞는 것을 추천합니다.",
    "今日の気分は？選ぶとぴったりの内容をご提案します。",
    "今天心情如何？选择心情，为你推荐最合适的内容。"),
  gift: Lx(
    "Үнэгүй нээлттэй хичээлүүд — эхлэхэд тань зориулсан бэлэг. Бүртгэлгүйгээр үзнэ.",
    "Free open lessons — a gift to help you begin. No registration needed.",
    "무료 공개 레슨 — 시작을 위한 선물. 가입 없이 시청.",
    "無料公開レッスン — はじめの一歩への贈り物。登録不要。",
    "免费公开课程 — 助你起步的礼物，无需注册。"),
};

/** Нүүр хуудас — хэсэг бүр товч мэдээлэл, шууд орох товчтой. */
export async function HomeSections() {
  const [services, courses, free, settings, bandMedia] = await Promise.all([
    listCmsCached("service"), listCmsCached("course"),
    listCmsCached("free"), getSettingsCached(), heroMediaFor("band"),
  ]);


  return (
    <>
      {/* Хурдан шилжих товчнууд */}
      <SectionJump />

      {/* Хоёр гол зам — сургалт ба сүнслэг аялал */}
      <PathsHighlight
        courses={courses.map((c) => ({
          id: c.id,
          title: c.title,
          summary: c.summary || "",
          image: c.image || c.images?.[0] || "",
          level: c.level || "anhan",
        }))}
      />

      {/* Зурхай — слайдер. Сонгож дарахад доор нь тухайн тайлал нээгдэнэ. */}
      <section id="zurhai" className="section scroll-mt-36"><div className="container-px">
        <ZurhaiSlider cards={settings.zurhaiCards} daily={<DailyHoroscope />} />
      </div></section>

      {/* Энергийн засал */}
      <section id="services" className="section scroll-mt-36"><div className="container-px">
        <SectionZoom eyebrow="✨" title={<T k="nav.services" />} desc={<Tr v={D.services} />} href="/services">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((i, idx) => <Reveal key={i.id} delay={idx * 60}><ServiceCard item={i} /></Reveal>)}
          </div>
        </SectionZoom>
      </div></section>

      {/* Сүнслэг аялал — бүртгэлтэй аяллууд */}
      <section id="ayalal" className="section scroll-mt-36"><div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow-line"><span>🕊</span></p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"><Tr v={JOURNEY_EYEBROW} /></h2>
            <p className="mt-3 leading-relaxed text-muted"><Tr v={JOURNEY_DESC} /></p>
          </div>
          <Link href="/ayalal" className="btn btn-outline btn-md shrink-0">Бүх аялал →</Link>
        </div>
        <div aria-hidden className="khas-rule mt-6 opacity-70" />
        <div className="mt-8 grid gap-7 lg:grid-cols-2">
          {JOURNEYS.map((j, idx) => (
            <Reveal key={j.slug} delay={idx * 80}>
              <Link href={`/ayalal/${j.slug}`} className="card group block h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-glow">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <JourneyImage src={j.image} scene={j.scene} alt={j.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                  <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,20,17,0.88) 0%, rgba(8,20,17,0.15) 55%, transparent 100%)" }} />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-300">{j.tagline}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white">{j.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                    <span>🗓 {j.days}</span><span>👥 {j.group}</span><span>⛺ {j.stay}</span>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted">{j.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div></section>

      {/* Энергийн хамгаалалт */}
      <section id="shop" className="section scroll-mt-36 bg-surface-2"><div className="container-px">
        <SectionZoom eyebrow="🛡" title={<T k="nav.shop" />} desc={<Tr v={D.shop} />} href="/shop">
          <StoneReading />
        </SectionZoom>
      </div></section>

      {/* Гэгээн бэлэг */}
      <section id="gift" className="section scroll-mt-36"><div className="container-px">
        <SectionZoom eyebrow="🎁" title={<T k="nav.gift" />} desc={<Tr v={D.gift} />} href="/gift">
          <ReelsSlider items={free} />
        </SectionZoom>
      </div></section>

      {/* Сэтгэлийн туяа — мэдрэмжүүд шууд харагдана */}
      <section id="mood" className="section scroll-mt-36 bg-surface-2"><div className="container-px">
        <div className="relative overflow-hidden rounded-4xl border border-line bg-surface-1 p-8 sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(240,156,188,0.25), transparent 70%)" }} />
          <div className="relative z-10">
            <div className="max-w-2xl">
              <p className="eyebrow-line"><span>🌅</span></p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"><T k="nav.mood" /></h2>
              <p className="mt-3 leading-relaxed text-muted"><Tr v={D.mood} /></p>
            </div>
            <div className="mt-8">
              <MoodPicker />
            </div>
          </div>
        </div>
      </div></section>

      <VideoBand
        clip="temple"
        media={bandMedia}
        quote="Ойн гүн дэх сүм шиг — дотоод ертөнц тань чимээгүй байдал, хүндэтгэлээр нээгддэг."
        author="Zaya's Ananda"
        cta={{ href: "/about", label: "Бидний тухай" }}
      />

      {/* Бидний тухай — ишлэлийн зурвасын дараа, бүх мэдээллээрээ */}
      <section id="about" className="section scroll-mt-36"><div className="container-px">
        <HomeAbout />
      </div></section>

    </>
  );
}
