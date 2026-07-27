import { CmsCoursesFilter } from "@/components/CmsCoursesFilter";
import { VideoHero } from "@/components/video/VideoHero";
import { VideoBand } from "@/components/video/VideoBand";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Сургалт" };

export default async function CoursesPage() {
  const items = await listCmsCached("course");
  return (
    <>
      {/* Ухамсрын номын сан — оддын дунд хөвөх номууд, төв гэрлийн багана */}
      <VideoHero
        clip="meditation"
        eyebrow="Дотоод чимээгүй байдал"
        title={<T k="nav.courses" />}
        desc="Урсгал усны хажууд сууж буй хүн шиг — өөрийн хэмнэлээр, гэрээсээ, багшийн хөтлөлтөөр дадлагаа эхлүүлээрэй."
        cta={[{ href: "#courses", label: "Сургалтууд үзэх" }]}
      />
      <section id="courses" className="section"><div className="container-px"><CmsCoursesFilter items={items} /></div></section>

      <VideoBand
        clip="stream"
        quote="Ус чулууг хүчээр биш, тэвчээрээр элээдэг. Бясалгал ч мөн адил — өдөр бүрийн жижиг алхам таныг өөрчилнө."
        author="Zaya's Ananda"
        cta={{ href: "/ayalal", label: "Сүнслэг аялал үзэх" }}
      />
    </>
  );
}
