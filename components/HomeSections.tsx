import { listCmsCached, getSettingsCached } from "@/lib/repo";
import { heroMediaFor } from "@/lib/hero-video";
import { GiftOverview } from "./home/GiftOverview";
import { CategoryExperience } from "./home/CategoryExperience";
import { T, Tr } from "./T";
import { PathsHighlight } from "./home/PathsHighlight";
import { MergeToorog } from "./MergeToorog";
import { VideoBand } from "./video/VideoBand";
import { SectionZoom } from "./home/SectionZoom";
import { ZurhaiSlider } from "./home/ZurhaiSlider";
import { InlineDestinyMatrix } from "./matrix/InlineDestinyMatrix";
import { HomeAbout } from "./home/HomeAbout";
import { listJourneysCached } from "@/lib/journeys-db";
import type { Locale } from "@/lib/types";
import { SectionBackdrop } from "./home/SectionBackdrop";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

/** Хэсэг бүрийн товч, ойлгомжтой танилцуулга */
const D = {
  gift: Lx(
    "Үнэгүй нээлттэй хичээлүүд — эхлэхэд тань зориулсан бэлэг. Бүртгэлгүйгээр үзнэ.",
    "Free open lessons — a gift to help you begin. No registration needed.",
    "무료 공개 레슨 — 시작을 위한 선물. 가입 없이 시청.",
    "無料公開レッスン — はじめの一歩への贈り物。登録不要。",
    "免费公开课程 — 助你起步的礼物，无需注册。"),
};

/** Нүүр хуудас — хэсэг бүр товч мэдээлэл, шууд орох товчтой. */
export async function HomeSections() {
  const [services, courses, products, settings, bandMedia, JOURNEYS] = await Promise.all([
    listCmsCached("service"), listCmsCached("course"),
    listCmsCached("product"),
    getSettingsCached(), heroMediaFor("band"),
    listJourneysCached().catch(() => []),
  ]);


  return (
    <div className="home-catalog">
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
      <section id="zurhai" className="section activity-section scroll-mt-36">
        <SectionBackdrop src="/poster_night.jpg" centered position="center 35%" />
        <div className="container-px">
        <ZurhaiSlider cards={settings.zurhaiCards} daily={<MergeToorog />} matrix={<InlineDestinyMatrix />} />
      </div></section>

      <CategoryExperience services={services} courses={courses} products={products} journeys={JOURNEYS} />

      {/* Гэгээн бэлэг */}
      <section id="gift" className="section activity-section scroll-mt-36">
        <SectionBackdrop src="/video/meditation.jpg" position="center 60%" />
        <div className="container-px">
        <SectionZoom eyebrow="04 / НЭЭЛТТЭЙ ХИЧЭЭЛ" title={<T k="nav.gift" />} desc={<Tr v={D.gift} />} href="/gift">
          <GiftOverview />
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

    </div>
  );
}
