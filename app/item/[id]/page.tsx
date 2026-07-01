import { notFound } from "next/navigation";
import Link from "next/link";
import { getCmsById } from "@/lib/repo";
import { formatMNT } from "@/lib/format";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";

const kindNav: Record<string, { href: string; key: string }> = {
  service: { href: "/services", key: "nav.services" },
  course: { href: "/courses", key: "nav.courses" },
  product: { href: "/shop", key: "nav.shop" },
  resource: { href: "/resources", key: "nav.resources" },
};
const modeLabel: Record<string, string> = { online: "Онлайн сургалт", tankhim: "Танхимын сургалт", both: "Онлайн + Танхим" };

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await getCmsById(params.id);
  if (!item) notFound();
  const nav = kindNav[item.kind] || kindNav.service;
  const lines = (item.teacherInfo || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const isCourse = item.kind === "course";

  return (
    <div className="container-px py-10 sm:py-14">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-primary-700"><T k="nav.home" /></Link><span>/</span>
        <Link href={nav.href} className="hover:text-primary-700"><T k={nav.key} /></Link><span>/</span>
        <span className="line-clamp-1 font-medium text-ink">{item.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {item.image && <img src={item.image} alt="" className="mb-6 max-h-[420px] w-full rounded-3xl object-cover" />}
          {item.category && <span className="chip">{item.category}</span>}
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{item.title}</h1>
          {isCourse && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted">
              {typeof item.videoLessons === "number" && <span>🎬 {item.videoLessons} видео хичээл</span>}
              {typeof item.students === "number" && <span>👤 {item.students} суралцагч</span>}
              {typeof item.views === "number" && <span>👁 {item.views.toLocaleString()} үзсэн</span>}
              {item.mode && <span className="font-semibold text-primary-700">{modeLabel[item.mode]}</span>}
            </div>
          )}
          {item.summary && <p className="mt-5 text-lg leading-relaxed text-ink/80">{item.summary}</p>}
          {item.body && (
            <>
              <h2 className="mt-8 font-display text-xl font-semibold text-ink">Дэлгэрэнгүй</h2>
              <div className="mt-3 whitespace-pre-line leading-relaxed text-muted">{item.body}</div>
            </>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 text-center">
            {typeof item.price === "number"
              ? <p className="price text-3xl">{formatMNT(item.price)}</p>
              : <p className="font-display text-lg font-semibold text-ink">{item.title}</p>}
            <Link href="/contact" className="btn btn-primary btn-lg mt-5 w-full">Холбоо барих</Link>
            <p className="mt-3 text-xs leading-relaxed text-muted">Захиалгын дараа бид тантай холбогдож, тохиромжтой цагийг тохирно.</p>
          </div>

          {(item.teacherName || item.teacherImage || lines.length > 0) && (
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink">Заах багш</h3>
              <div className="mt-4 flex flex-col items-center text-center">
                {item.teacherImage
                  ? <img src={item.teacherImage} alt="" className="h-28 w-28 rounded-full object-cover shadow-card" />
                  : <div className="grid h-28 w-28 place-items-center rounded-full bg-primary-50 text-3xl">👤</div>}
                {item.teacherName && <p className="mt-3 font-display text-lg font-semibold text-ink">{item.teacherName}</p>}
              </div>
              {lines.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {lines.map((l, i) => <li key={i} className="flex gap-2 text-[1.02rem] leading-relaxed text-ink/80"><span className="text-primary-500">•</span><span>{l}</span></li>)}
                </ul>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
