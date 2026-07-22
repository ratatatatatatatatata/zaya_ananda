import { PageHeader } from "@/components/PageHeader";
import { CmsCard } from "@/components/CmsCard";
import { ShopSplit } from "@/components/ShopSplit";
import { StoneReading } from "@/components/StoneReading";
import { listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";

export const revalidate = 300;
export const metadata = { title: "Дэлгүүр" };

export default async function ShopPage() {
  const items = await listCmsCached("product");
  return (
    <>
      <PageHeader title={<T k="nav.shop" />} crumb={<T k="nav.shop" />} />
      <section className="section"><div className="container-px">
        <ShopSplit
          products={
            items.length === 0
              ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">Одоохондоо бүтээгдэхүүн нэмэгдээгүй байна.</p>
              : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((i) => <CmsCard key={i.id} item={i} />)}</div>
          }
          stones={<StoneReading />}
        />
      </div></section>
    </>
  );
}
