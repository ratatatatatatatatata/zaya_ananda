import { CmsCoursesFilter } from "@/components/CmsCoursesFilter";
import { Journey3D } from "@/components/three/Journey3D";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Сургалт" };

export default async function CoursesPage() {
  const items = await listCmsCached("course");
  return (
    <>
      {/* Ухамсрын номын сан — оддын дунд хөвөх номууд, төв гэрлийн багана */}
      <Journey3D
        world="library"
        eyebrow="The Journey into Ananda · II"
        title={<T k="nav.courses" />}
        desc="Огторгуйд хөвөх ухамсрын номын сан — ном бүр нэг сургалт. Камер гэрлийн багана руу дээшлэх тусам мэдлэгийн одод таны эргэн тойронд цугларна."
        heightVh={200}
        cta={[{ href: "#courses", label: "Сургалтууд үзэх" }]}
      />
      <section id="courses" className="section"><div className="container-px"><CmsCoursesFilter items={items} /></div></section>
    </>
  );
}
