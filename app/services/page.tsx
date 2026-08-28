import { VideoHero } from "@/components/video/VideoHero";
import { ServiceList } from "@/components/home/ServiceList";
import { heroMediaFor } from "@/lib/hero-video";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Үйлчилгээ" };

export default async function ServicesPage() {
  const heroMedia = await heroMediaFor("services");
  const items = await listCmsCached("service");
  return (
    <>
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
        <ServiceList items={items} />
      </div></section>
    </>
  );
}
