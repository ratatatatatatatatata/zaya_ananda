import { notFound } from "next/navigation";
import { getPageByIdCached } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";
import { RichBody } from "@/components/RichBody";

export const revalidate = 300;

export default async function CustomPage({ params }: { params: { id: string } }) {
  const page = await getPageByIdCached(params.id);
  if (!page) notFound();

  let videoUrl = "";
  if (page.video) {
    if (/^https?:\/\//.test(page.video)) videoUrl = page.video;
    else { try { videoUrl = await signedDownloadUrl("lesson-videos", page.video); } catch { videoUrl = ""; } }
  }

  return (
    <>
      <PageHeader title={page.title} crumb={page.navLabel || page.title} />
      <section className="section">
        <div className="container-px max-w-4xl">
          {page.image && <img src={page.image} alt="" className="mb-8 max-h-[520px] w-full rounded-3xl object-cover" />}
          {videoUrl && (
            <video controls playsInline className="mb-8 w-full rounded-3xl bg-black" src={videoUrl} />
          )}
          {page.body && <RichBody html={page.body} className="leading-relaxed text-ink/80" />}
        </div>
      </section>
    </>
  );
}
