import Link from "next/link";
import { listCmsCached, getSettingsCached } from "@/lib/repo";
import { heroMediaFor } from "@/lib/hero-video";
import { CmsCard } from "./CmsCard";
import { Reveal } from "./Reveal";
import { T, Tr } from "./T";
import { PathsHighlight } from "./home/PathsHighlight";
import { DailyHoroscope } from "./home/DailyHoroscope";
import { VideoBand } from "./video/VideoBand";
import { HowItWorks } from "./home/HowItWorks";
import { SectionJump } from "./home/SectionJump";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

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

const OPEN = Lx("Хэсэг рүү орох", "Open this section", "이 섹션 열기", "このセクションへ", "进入此板块");

function SectionHead({ titleKey, desc, href, icon }: { titleKey: string; desc: Record<Locale, string>; href: string; icon: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow-line"><span>{icon}</span></p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"><T k={titleKey} /></h2>
          <p className="mt-3 leading-relaxed text-muted"><Tr v={desc} /></p>
        </div>
        <Link href={href} className="btn btn-primary btn-md shrink-0"><Tr v={OPEN} /> →</Link>
      </div>
      <div aria-hidden className="khas-rule mt-6 opacity-70" />
    </div>
  );
}

/** Нүүр хуудас — хэсэг бүр товч мэдээлэл, шууд орох товчтой. */
export async function HomeSections() {
  const [services, courses, products, free, settings, bandMedia] = await Promise.all([
    listCmsCached("service"), listCmsCached("course"), listCmsCached("product"),
    listCmsCached("free"), getSettingsCached(), heroMediaFor("band"),
  ]);

  const lessonCount = courses.reduce((n, c) => n + (c.lessons?.length ?? (typeof c.videoLessons === "number" ? c.videoLessons : 0)), 0);
  const teacherCount = [
    ...(settings.teachers || []),
    ...(settings.team || []).filter((m) => !(settings.teachers || []).some((t) => t.name === m.name)),
  ].length;

  return (
    <>
      {/* Хурдан шилжих товчнууд */}
      <SectionJump />

      {/* Хоёр гол зам — сургалт ба сүнслэг аялал */}
      <PathsHighlight courseCount={courses.length} lessonCount={lessonCount} teacherCount={teacherCount} />

      {/* Өдрийн зурхай */}
      <div id="zurhai" className="scroll-mt-36"><DailyHoroscope /></div>

      {/* Хэрхэн эхлэх вэ */}
      <HowItWorks />

      {/* Энергийн засал */}
      <section id="services" className="section scroll-mt-36"><div className="container-px">
        <SectionHead titleKey="nav.services" desc={D.services} href="/services" icon="✨" />
        {services.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      {/* Ариусахуйн үйл */}
      <section id="courses" className="section scroll-mt-36 bg-surface-2"><div className="container-px">
        <SectionHead titleKey="nav.courses" desc={D.courses} href="/courses" icon="🧘" />
        {courses.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      <VideoBand
        clip="temple"
        media={bandMedia}
        quote="Ойн гүн дэх сүм шиг — дотоод ертөнц тань чимээгүй байдал, хүндэтгэлээр нээгддэг."
        author="Zaya's Ananda"
        cta={{ href: "/about", label: "Бидний тухай" }}
      />

      {/* Энергийн хамгаалалт */}
      <section id="shop" className="section scroll-mt-36 bg-surface-2"><div className="container-px">
        <SectionHead titleKey="nav.shop" desc={D.shop} href="/shop" icon="🛡" />
        {products.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      {/* Гэгээн бэлэг */}
      <section id="gift" className="section scroll-mt-36"><div className="container-px">
        <SectionHead titleKey="nav.gift" desc={D.gift} href="/gift" icon="🎁" />
        {free.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {free.slice(0, 3).map((i, idx) => <Reveal key={i.id} delay={idx * 70}><CmsCard item={i} /></Reveal>)}
          </div>
        )}
      </div></section>

      {/* Сэтгэлийн туяа — хуудасны хамгийн доод хэсэг */}
      <section id="mood" className="section scroll-mt-36 bg-surface-2"><div className="container-px">
        <div className="relative overflow-hidden rounded-4xl border border-line bg-surface-1 p-8 sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(240,156,188,0.25), transparent 70%)" }} />
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow-line"><span>🌅</span></p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"><T k="nav.mood" /></h2>
            <p className="mt-3 leading-relaxed text-muted"><Tr v={D.mood} /></p>
            <Link href="/mood" className="btn btn-primary btn-lg mt-7"><Tr v={OPEN} /> →</Link>
          </div>
        </div>
      </div></section>
    </>
  );
}
