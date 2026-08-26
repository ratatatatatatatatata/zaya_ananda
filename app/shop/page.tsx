import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { CmsCard } from "@/components/CmsCard";
import { ShopSplit } from "@/components/ShopSplit";
import { Stagger } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { StoneReading } from "@/components/StoneReading";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Дэлгүүр" };

export default async function ShopPage() {
  const heroMedia = await heroMediaFor("shop");
  const items = await listCmsCached("product");
  return (
    <>
      {/* Тансаг галерей — гялгар шалтай танхимд эрдэнийн чулуу эргэлдэнэ */}
      <VideoHero
        media={heroMedia}
        clip="stones"
        eyebrow="Чулууны тэнцвэр"
        title={<T k="nav.shop" />}
        desc="Урсгалын хажууд өрсөн чулуу шиг — таны энергийг тогтвортой байлгах эрдэнэ, сахиус, хамгаалалтууд."
        height="mid"
      />
      <section id="shop" className="section"><div className="container-px">
        <ShopSplit
          products={
            items.length === 0
              ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">Одоохондоо бүтээгдэхүүн нэмэгдээгүй байна.</p>
              : <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((i) => <TiltCard key={i.id} className="h-full"><CmsCard item={i} /></TiltCard>)}</Stagger>
          }
          stones={<StoneReading />}
        />
      </div></section>
    </>
  );
}
