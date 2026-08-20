import { CmsFilterGrid } from "@/components/CmsFilterGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { listCmsCached } from "@/lib/repo";
import { SERVICE_GROUPS } from "@/data/cms-taxonomy";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Үйлчилгээ" };

export default async function ServicesPage() {
  const heroMedia = await heroMediaFor("services");
  const [items, promos] = await Promise.all([listCmsCached("service"), listCmsCached("promo")]);
  return (
    <>
      <PromoBanner items={promos} />
      {/* Ойн сүмийн болор — камер болор руу ойртож, гэрлийн бөөмс болон бутарна */}
      <VideoHero
        media={heroMedia}
        clip="temple"
        eyebrow="Эдгэрлийн ой"
        title={<T k="nav.services" />}
        desc="Ойн гүнд нуугдсан сүм шиг — чимээгүй, ариун орон зайд биеийн болон энергийн тэнцвэрээ сэргээх зам."
        cta={[{ href: "#services", label: "Үйлчилгээ үзэх" }, { href: "/about#contact", label: "Цаг захиалах" }]}
      />
      <section id="services" className="section"><div className="container-px">
        <CmsFilterGrid items={items} groups={SERVICE_GROUPS} modeFilter emptyText="Одоохондоо үйлчилгээ нэмэгдээгүй байна." />
      </div></section>
    </>
  );
}
