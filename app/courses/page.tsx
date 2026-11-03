import { CmsCoursesFilter } from "@/components/CmsCoursesFilter";
import { MoodPicker } from "@/components/home/MoodPicker";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { VideoBand } from "@/components/video/VideoBand";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Сургалт" };

export default async function CoursesPage() {
  const [heroMedia, bandMedia] = await Promise.all([heroMediaFor("courses"), heroMediaFor("band")]);
  const items = await listCmsCached("course");
  return (
    <>
      {/* Ухамсрын номын сан — оддын дунд хөвөх номууд, төв гэрлийн багана */}
      <VideoHero
        media={heroMedia}
        clip="meditation"
        eyebrow="Дотоод чимээгүй байдал"
        title={<T k="nav.courses" />}
        desc="Урсгал усны хажууд сууж буй хүн шиг — өөрийн хэмнэлээр, гэрээсээ, багшийн хөтлөлтөөр дадлагаа эхлүүлээрэй."
        cta={[{ href: "#courses", label: "Сургалтууд үзэх" }]}
      />
      <section id="courses" className="section"><div className="container-px"><CmsCoursesFilter items={items} /></div></section>

      {/* Сэтгэлийн туяа — хичээлүүдийн доор */}
      <section id="mood" className="section scroll-mt-36 bg-surface-2"><div className="container-px">
        <div className="relative overflow-hidden rounded-4xl border border-line bg-surface-1 p-8 sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(240,156,188,0.25), transparent 70%)" }} />
          <div className="relative z-10">
            <div className="max-w-2xl">
              <p className="eyebrow-line"><span>🌅</span></p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"><T k="nav.mood" /></h2>
              <p className="mt-3 leading-relaxed text-muted">
                Өнөөдөр сэтгэл тань ямар байна? Мэдрэмжээ сонгоход яг танд хэрэгтэй хичээлийг санал болгоно.
              </p>
            </div>
            <div className="mt-8"><MoodPicker /></div>
          </div>
        </div>
      </div></section>

      <VideoBand
        media={bandMedia}
        clip="stream"
        quote="Ус чулууг хүчээр биш, тэвчээрээр элээдэг. Бясалгал ч мөн адил — өдөр бүрийн жижиг алхам таныг өөрчилнө."
        author="Zaya's Ananda"
        cta={{ href: "/ayalal", label: "Сүнслэг аялал үзэх" }}
      />
    </>
  );
}
