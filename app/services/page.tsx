import { PageHeader } from "@/components/PageHeader";
import { CmsFilterGrid } from "@/components/CmsFilterGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { listCmsCached } from "@/lib/repo";
import { SERVICE_GROUPS } from "@/data/cms-taxonomy";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Үйлчилгээ" };

export default async function ServicesPage() {
  const [items, promos] = await Promise.all([listCmsCached("service"), listCmsCached("promo")]);
  return (
    <>
      <PromoBanner items={promos} />
      <PageHeader title={<T k="nav.services" />} crumb={<T k="nav.services" />} />
      <section className="section"><div className="container-px">
        <CmsFilterGrid items={items} groups={SERVICE_GROUPS} emptyText="Одоохондоо үйлчилгээ нэмэгдээгүй байна." />
      </div></section>
    </>
  );
}
