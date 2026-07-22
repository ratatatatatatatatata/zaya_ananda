import { CmsFilterGrid } from "@/components/CmsFilterGrid";
import { Journey3D } from "@/components/three/Journey3D";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Зөвлөгөө, мэдээлэл" };

export default async function ResourcesPage() {
  const items = await listCmsCached("resource");
  return (
    <>
      {/* Мэргэдийн архив — гэрлийн багана дундуур хөвөх чулуун хавтангууд */}
      <Journey3D
        world="archive"
        eyebrow="The Oracle Archive"
        title={<T k="nav.resources" />}
        desc="Мэргэдийн архивын манантай танхимаар камер урагшлан аялж, гэрлийн багана дунд хөвөх мэдлэгийн хавтангууд нээгдэнэ."
        heightVh={190}
        cta={[{ href: "#resources", label: "Зөвлөгөө унших" }]}
      />
      <section id="resources" className="section"><div className="container-px">
        <CmsFilterGrid items={items} categories={["Зөвлөгөө", "Видео зөвлөгөө"]} emptyText="Одоохондоо зөвлөгөө, мэдээлэл нэмэгдээгүй байна." />
      </div></section>
    </>
  );
}
