import { PageHeader } from "@/components/PageHeader";
import { CmsCoursesFilter } from "@/components/CmsCoursesFilter";
import { listCms } from "@/lib/repo";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";
export const metadata = { title: "Сургалт" };

export default function CoursesPage() {
  const items = listCms("course");
  return (
    <>
      <PageHeader title={<T k="nav.courses" />} crumb={<T k="nav.courses" />} />
      <section className="section"><div className="container-px"><CmsCoursesFilter items={items} /></div></section>
    </>
  );
}
