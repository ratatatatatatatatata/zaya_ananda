import { PromoBanner } from "@/components/PromoBanner";
import { VideoHero } from "@/components/video/VideoHero";
import { ServiceCard } from "@/components/home/ServiceCard";
import { heroMediaFor } from "@/lib/hero-video";
import { listCmsCached } from "@/lib/repo";
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
        cta={[{ href: "#services", label: "Үйлчилгээ үзэх" }]}
      />
      <section id="services" className="section"><div className="container-px">
        {items.length === 0
          ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">Одоохондоо үйлчилгээ нэмэгдээгүй байна.</p>
          : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((i) => <ServiceCard key={i.id} item={i} />)}</div>}
      </div></section>
    </>
  );
}
