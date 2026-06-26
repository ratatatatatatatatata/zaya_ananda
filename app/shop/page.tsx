import { products } from "@/data/content";
import { ProductCard } from "@/components/Cards";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { T } from "@/components/T";

export const metadata = { title: "Дэлгүүр" };

export default function ShopPage() {
  return (
    <>
      <PageHeader title={<T k="shop.title" />} crumb={<T k="nav.shop" />} desc={<T k="shop.desc" />} />
      <section className="section">
        <div className="container-px grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (<Reveal key={p.id} delay={i * 60}><ProductCard p={p} /></Reveal>))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
