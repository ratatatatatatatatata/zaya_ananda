import { PageHeader } from "@/components/PageHeader";
import { CmsCoursesFilter } from "@/components/CmsCoursesFilter";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Сургалт" };

export default async function CoursesPage() {
  const items = await listCmsCached("course");
  return (
    <>
      <PageHeader title={<T k="nav.courses" />} crumb={<T k="nav.courses" />} />
      <section className="section"><div className="container-px"><CmsCoursesFilter items={items} /></div></section>
    </>
  );
}
