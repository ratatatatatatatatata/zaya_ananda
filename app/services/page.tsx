import { PageHeader } from "@/components/PageHeader";
import { CmsFilterGrid } from "@/components/CmsFilterGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { listCms } from "@/lib/repo";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";
export const metadata = { title: "Үйлчилгээ" };

export default async function ServicesPage() {
  const [items, promos] = await Promise.all([listCms("service"), listCms("promo")]);
  return (
    <>
      <PromoBanner items={promos} />
      <PageHeader title={<T k="nav.services" />} crumb={<T k="nav.services" />} />
      <section className="section"><div className="container-px">
        <CmsFilterGrid items={items} categories={["Оношилгоо", "Эмчилгээ"]} emptyText="Одоохондоо үйлчилгээ нэмэгдээгүй байна." />
      </div></section>
    </>
  );
}
