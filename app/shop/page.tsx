import { Journey3D } from "@/components/three/Journey3D";
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
  const items = await listCmsCached("product");
  return (
    <>
      {/* Тансаг галерей — гялгар шалтай танхимд эрдэнийн чулуу эргэлдэнэ */}
      <Journey3D
        world="gallery"
        eyebrow="The Journey into Ananda · III"
        title={<T k="nav.shop" />}
        desc="Музейн үзмэр шиг тавцан дээр эргэлдэх эрдэнийн чулуу — алтан гэрэл, оюу туяаны дунд танд зориулсан энергийн хамгаалалтууд."
        heightVh={180}
        cta={[{ href: "#shop", label: "Бүтээгдэхүүн үзэх" }]}
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
