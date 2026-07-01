import { PageHeader } from "@/components/PageHeader";
import { CmsCard } from "@/components/CmsCard";
import { listCms } from "@/lib/repo";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";
export const metadata = { title: "Үйлчилгээ" };

export default function ServicesPage() {
  const items = listCms("service");
  return (
    <>
      <PageHeader title={<T k="nav.services" />} crumb={<T k="nav.services" />} />
      <section className="section"><div className="container-px">
        {items.length === 0
          ? <p className="rounded-2xl border border-dashed border-line bg-white/60 px-5 py-14 text-center text-muted">Одоохондоо үйлчилгээ нэмэгдээгүй байна.</p>
          : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((i) => <CmsCard key={i.id} item={i} />)}</div>}
      </div></section>
    </>
  );
}
