import { listCmsCached } from "@/lib/repo";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { MediaLibrary } from "@/components/home/MediaLibrary";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Гэгээн бэлэг" };

/** Нээлттэй, үнэгүй хичээлүүд — "Гэгээн бэлэг" */
export default async function GiftPage() {
  const [items, heroMedia] = await Promise.all([listCmsCached("free"), heroMediaFor("gift")]);
  return (
    <>
      <VideoHero
        clip="meditation"
        media={heroMedia}
        height="short"
        align="center"
        eyebrow="Zaya's Ananda"
        title={<T k="nav.gift" />}
        desc="Үнэгүй нээлттэй хичээлүүд — эхлэхэд тань зориулсан бидний бэлэг. Бүртгэлгүйгээр үзнэ."
      />
      <section className="section"><div className="container-px">
        <MediaLibrary items={items} />
      </div></section>
    </>
  );
}
