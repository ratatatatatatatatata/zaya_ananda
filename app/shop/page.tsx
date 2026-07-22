import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CmsCard } from "@/components/CmsCard";
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
        {/* Ордуудын ээлтэй чулуу — дарж ордог нэмэлт цонх */}
        <Link href="/stones" className="group relative mb-10 block overflow-hidden rounded-4xl border border-accent-300/40 bg-[#1B2038] p-6 transition hover:border-accent-400 hover:shadow-[0_0_50px_-12px_rgba(227,190,98,0.4)] sm:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full transition group-hover:scale-110" style={{ background: "radial-gradient(circle, rgba(227,190,98,0.25), transparent 70%)", filter: "blur(8px)" }} />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-accent-400/40 bg-accent-300/10 text-3xl">💎</span>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">Ордуудын ээлтэй чулуу</h2>
                <p className="mt-1 text-sm text-muted">Төрсөн ордоороо чулуугаа тайлаад, тохирох бүтээгдэхүүнээ олоорой</p>
              </div>
            </div>
            <span className="btn btn-gold btn-md shrink-0">Тайлал үзэх →</span>
          </div>
        </Link>
        {items.length === 0
          ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">Одоохондоо бүтээгдэхүүн нэмэгдээгүй байна.</p>
          : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((i) => <CmsCard key={i.id} item={i} />)}</div>}
      </div></section>
    </>
  );
}
