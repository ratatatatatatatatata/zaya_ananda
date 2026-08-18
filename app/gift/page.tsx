import { listCmsCached } from "@/lib/repo";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { CmsCard } from "@/components/CmsCard";
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
        {items.length === 0
          ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">Бэлэг болгон өргөх хичээлүүд удахгүй нэмэгдэнэ. 🎁</p>
          : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((i) => <CmsCard key={i.id} item={i} />)}</div>}
      </div></section>
    </>
  );
}
