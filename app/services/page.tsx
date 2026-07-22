import { CmsFilterGrid } from "@/components/CmsFilterGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { Journey3D } from "@/components/three/Journey3D";
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
      {/* Ойн сүмийн болор — камер болор руу ойртож, гэрлийн бөөмс болон бутарна */}
      <Journey3D
        world="crystal"
        eyebrow="The Journey into Ananda · I"
        title={<T k="nav.services" />}
        desc="Ойн гүн дэх болор таныг угтана — гүйлгэх бүрд камер ойртож, болор гэрлийн мянган бөөмс болон задарч, эдгэрлийн ертөнцүүд нээгдэнэ."
        heightVh={200}
        cta={[{ href: "#services", label: "Үйлчилгээ үзэх" }, { href: "/about#contact", label: "Цаг захиалах" }]}
      />
      <section id="services" className="section"><div className="container-px">
        <CmsFilterGrid items={items} groups={SERVICE_GROUPS} emptyText="Одоохондоо үйлчилгээ нэмэгдээгүй байна." />
      </div></section>
    </>
  );
}
