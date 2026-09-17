import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";
import { ProductHoverCard } from "@/components/ProductHoverCard";
import { ShopSplit } from "@/components/ShopSplit";
import { StoneReading } from "@/components/StoneReading";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Дэлгүүр" };

export default async function ShopPage() {
  const heroMedia = await heroMediaFor("shop");
  const all = await listCmsCached("product");
  // Stone products appear in the zodiac section above the main catalogue.
  const items = all.filter((i) => i.category !== "Чулуунууд");
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
              : <div className="adaptive-cards">{items.map((i) => <ProductHoverCard key={i.id} item={i} />)}</div>
          }
          stones={<StoneReading interactiveProducts />}
        />
      </div></section>
    </>
  );
}
