import { notFound } from "next/navigation";
import Link from "next/link";
import { getCmsByIdCached, listCmsCached } from "@/lib/repo";
import { T } from "@/components/T";
import { PurchaseBox } from "@/components/PurchaseBox";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { CourseLessons } from "@/components/CourseLessons";
import { ItemVideos } from "@/components/ItemVideos";
import { ImageGallery } from "@/components/ImageGallery";
import { RichBody } from "@/components/RichBody";
import { CmsText, CatLabel } from "@/components/CmsText";
import { CmsCard } from "@/components/CmsCard";
import { signedDownloadUrl } from "@/lib/supabase";
import { Journey3D } from "@/components/three/Journey3D";
import type { WorldKind } from "@/components/three/Worlds";

export const revalidate = 300;

/** Төрөл бүр өөрийн realm-тай: үйлчилгээ → дотоод өргөө, сургалт → мэдлэгийн зам,
 *  бүтээгдэхүүн → зорилгын эрдэнэ, зөвлөгөө → архив, бэлэг → номын сан */
const kindWorld: Record<string, { world: WorldKind; eyebrow: string }> = {
  service: { world: "chamber", eyebrow: "The Inner Chamber" },
  course: { world: "path", eyebrow: "The Path of Knowledge" },
  product: { world: "pedestal", eyebrow: "The Object of Intention" },
  resource: { world: "archive", eyebrow: "The Oracle Archive" },
  free: { world: "library", eyebrow: "The Library of Consciousness" },
};

const kindNav: Record<string, { href: string; key: string }> = {
  service: { href: "/services", key: "nav.services" },
  course: { href: "/courses", key: "nav.courses" },
  product: { href: "/shop", key: "nav.shop" },
  resource: { href: "/resources", key: "nav.resources" },
  free: { href: "/gift", key: "nav.gift" },
};
const modeLabel: Record<string, string> = { online: "Онлайн сургалт", tankhim: "Танхимын сургалт", both: "Онлайн + Танхим" };

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await getCmsByIdCached(params.id);
  if (!item) notFound();
  const nav = kindNav[item.kind] || kindNav.service;
  const lines = (item.teacherInfo || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const isCourse = item.kind === "course";
  const isProduct = item.kind === "product";
  const isFree = item.kind === "free";
  const gallery = item.images && item.images.length ? item.images : item.image ? [item.image] : [];
  const publicVideos = !isCourse && item.lessons?.length
    ? await Promise.all(item.lessons.map(async (l) => {
        let url = "";
        if (l.path) { try { url = await signedDownloadUrl("lesson-videos", l.path); } catch { url = ""; } }
        else if (l.url) url = l.url;
        return { title: l.title, url, quality: l.quality || "", subtitles: l.subtitles || "" };
      }))
    : [];
  const related = isProduct
    ? (await listCmsCached("product")).filter((p) => p.id !== item.id).slice(0, 4)
    : [];

  const kw = kindWorld[item.kind] || kindWorld.service;

  return (
    <>
    <Journey3D
      world={kw.world}
      eyebrow={kw.eyebrow}
      title={<CmsText mn={item.title} i18n={item.i18n} field="title" />}
      heightVh={150}
      cta={[{ href: "#detail", label: "Дэлгэрэнгүй үзэх" }]}
    />
    <div id="detail" className="container-px py-10 sm:py-14">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-primary-700"><T k="nav.home" /></Link><span>/</span>
        <Link href={nav.href} className="hover:text-primary-700"><T k={nav.key} /></Link><span>/</span>
        <span className="line-clamp-1 font-medium text-ink"><CmsText mn={item.title} i18n={item.i18n} field="title" /></span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <ImageGallery images={gallery} alt={item.title} />
          {item.category && <span className="chip"><CatLabel cat={item.category} /></span>}
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"><CmsText mn={item.title} i18n={item.i18n} field="title" /></h1>
          {isCourse && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted">
              {((item.lessons?.length ?? 0) > 0 || typeof item.videoLessons === "number") && <span>🎬 {item.lessons?.length ?? item.videoLessons} видео хичээл</span>}
              {typeof item.students === "number" && <span>👤 {item.students} суралцагч</span>}
              {typeof item.views === "number" && <span>👁 {item.views.toLocaleString()} үзсэн</span>}
              {item.mode && <span className="font-semibold text-primary-700">{modeLabel[item.mode]}</span>}
            </div>
          )}
          {item.summary && <p className="mt-5 text-lg leading-relaxed text-ink/80"><CmsText mn={item.summary} i18n={item.i18n} field="summary" /></p>}
          {item.body && (
            <>
              <h2 className="mt-8 font-display text-xl font-semibold text-ink">Дэлгэрэнгүй</h2>
              <RichBody html={item.body} i18n={item.i18n} className="mt-3 leading-relaxed text-muted" />
            </>
          )}
          {isCourse && <CourseLessons id={item.id} />}
          {!isCourse && publicVideos.length > 0 && <ItemVideos videos={publicVideos} />}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {isProduct
            ? <ProductBuyBox id={item.id} title={item.title} price={item.price} />
            : isFree
            ? <div className="card p-6 text-center"><p className="text-3xl">🎁</p><p className="mt-2 font-display text-lg font-semibold text-jade-600">Нээлттэй хичээл</p><p className="mt-1 text-sm text-muted">Энэ хичээл танд бэлэг — чөлөөтэй үзээрэй.</p></div>
            : <PurchaseBox id={item.id} title={item.title} price={item.price} />}

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

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink">Санал болгох бүтээгдэхүүн</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <CmsCard key={p.id} item={p} />)}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
