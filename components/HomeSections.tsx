import Link from "next/link";
import { listCmsCached, getSettingsCached } from "@/lib/repo";
import { heroMediaFor } from "@/lib/hero-video";
import { GiftCoverflow } from "./home/GiftCoverflow";
import { JourneyStaticGrid } from "./home/JourneyCoverflow";
import { ProductCoverflow } from "./home/ProductCoverflow";
import { StoneReading } from "./StoneReading";
import { T, Tr } from "./T";
import { PathsHighlight } from "./home/PathsHighlight";
import { MergeToorog } from "./MergeToorog";
import { VideoBand } from "./video/VideoBand";
import { SectionZoom } from "./home/SectionZoom";
import { ZurhaiSlider } from "./home/ZurhaiSlider";
import { ServiceCoverflow } from "./home/ServiceCoverflow";
import { InlineDestinyMatrix } from "./matrix/InlineDestinyMatrix";
import { HomeAbout } from "./home/HomeAbout";
import { listJourneysCached } from "@/lib/journeys-db";
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
  gift: Lx(
    "Үнэгүй нээлттэй хичээлүүд — эхлэхэд тань зориулсан бэлэг. Бүртгэлгүйгээр үзнэ.",
    "Free open lessons — a gift to help you begin. No registration needed.",
    "무료 공개 레슨 — 시작을 위한 선물. 가입 없이 시청.",
    "無料公開レッスン — はじめの一歩への贈り物。登録不要。",
    "免费公开课程 — 助你起步的礼物，无需注册。"),
};

/** Нүүр хуудас — хэсэг бүр товч мэдээлэл, шууд орох товчтой. */
export async function HomeSections() {
  const [services, courses, free, products, settings, bandMedia, JOURNEYS] = await Promise.all([
    listCmsCached("service"), listCmsCached("course"),
    listCmsCached("free"), listCmsCached("product"),
    getSettingsCached(), heroMediaFor("band"),
    listJourneysCached().catch(() => []),
  ]);


  return (
    <>
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
        <ZurhaiSlider cards={settings.zurhaiCards} daily={<MergeToorog />} matrix={<InlineDestinyMatrix />} />
      </div></section>

      {/* Энергийн засал */}
      <section id="services" className="section scroll-mt-36"><div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow-line"><span>✨</span></p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"><T k="nav.services" /></h2>
            <p className="mt-3 leading-relaxed text-muted"><Tr v={D.services} /></p>
          </div>
          <Link href="/services" className="btn btn-primary btn-md shrink-0">Бүтэн хуудас →</Link>
        </div>
        <div aria-hidden className="khas-rule mt-6 opacity-70" />

        {/* Хажуу тийш цувдаг, 3D перспектив бүхий жагсаалт */}
        <ServiceCoverflow items={services} />
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
        <JourneyStaticGrid items={JOURNEYS.slice(0, 3)} />
      </div></section>

      {/* Энергийн хамгаалалт — эхлээд бүтээгдэхүүн (Энергийн засалтай адилхан гулддаг), доор нь төрсөн огноогоор чулуу тааруулах хэсэг */}
      <section id="shop" className="section scroll-mt-36 bg-surface-2"><div className="container-px">
        <SectionZoom eyebrow="🛡" title={<T k="nav.shop" />} desc={<Tr v={D.shop} />} href="/shop">
          <ProductCoverflow items={products} />
          <div className="mt-12">
            <StoneReading />
          </div>
        </SectionZoom>
      </div></section>

      {/* Гэгээн бэлэг */}
      <section id="gift" className="section scroll-mt-36"><div className="container-px">
        <SectionZoom eyebrow="🎁" title={<T k="nav.gift" />} desc={<Tr v={D.gift} />} href="/gift">
          <GiftCoverflow items={free} />
        </SectionZoom>
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
