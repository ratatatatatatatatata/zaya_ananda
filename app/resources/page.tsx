import { CmsFilterGrid } from "@/components/CmsFilterGrid";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Зөвлөгөө, мэдээлэл" };

export default async function ResourcesPage() {
  const heroMedia = await heroMediaFor("resources");
  const items = await listCmsCached("resource");
  return (
    <>
      {/* Мэргэдийн архив — гэрлийн багана дундуур хөвөх чулуун хавтангууд */}
      <VideoHero
        media={heroMedia}
        clip="stream"
        eyebrow="Мэдлэгийн урсгал"
        title={<T k="nav.resources" />}
        desc="Уулын горхи шиг тасралтгүй — өдөр тутмын амьдралд тань гэрэл нэмэх зөвлөгөө, нийтлэл, нээлттэй видеонууд."
        height="mid"
        cta={[{ href: "#resources", label: "Зөвлөгөө унших" }]}
      />
      <section id="resources" className="section"><div className="container-px">
        <CmsFilterGrid items={items} categories={["Зөвлөгөө", "Видео зөвлөгөө"]} emptyText="Одоохондоо зөвлөгөө, мэдээлэл нэмэгдээгүй байна." />
      </div></section>
    </>
  );
}
