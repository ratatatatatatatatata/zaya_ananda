import { PageHeader } from "@/components/PageHeader";
import { CmsFilterGrid } from "@/components/CmsFilterGrid";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Зөвлөгөө, мэдээлэл" };

export default async function ResourcesPage() {
  const items = await listCmsCached("resource");
  return (
    <>
      <PageHeader title={<T k="nav.resources" />} crumb={<T k="nav.resources" />} />
      <section className="section"><div className="container-px">
        <CmsFilterGrid items={items} categories={["Зөвлөгөө", "Видео зөвлөгөө"]} emptyText="Одоохондоо зөвлөгөө, мэдээлэл нэмэгдээгүй байна." />
      </div></section>
    </>
  );
}
