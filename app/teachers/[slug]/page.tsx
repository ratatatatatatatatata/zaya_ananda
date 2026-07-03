import { notFound } from "next/navigation";
import Link from "next/link";
import { getSettingsCached, listCmsCached } from "@/lib/repo";
import { CmsCard } from "@/components/CmsCard";
import { T } from "@/components/T";

export const revalidate = 300;

export default async function TeacherDetailPage({ params }: { params: { slug: string } }) {
  const name = decodeURIComponent(params.slug);
  const settings = await getSettingsCached();
  const teacher = (settings.teachers || []).find((t) => t.name === name);
  if (!teacher) notFound();

  const [courses, services] = await Promise.all([listCmsCached("course"), listCmsCached("service")]);
  const classes = [...courses, ...services].filter((i) => (i.teacherName || "").trim() === teacher.name.trim());
  const lines = (teacher.info || "").split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      {/* Masterclass маягийн танилцуулга */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="container-px grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.3fr] lg:py-20">
          <div className="mx-auto w-full max-w-sm">
            {teacher.image
              ? <img src={teacher.image} alt={teacher.name} className="aspect-[3/4] w-full rounded-3xl object-cover shadow-glow" />
              : <div className="grid aspect-[3/4] w-full place-items-center rounded-3xl bg-primary-grad text-7xl text-white">👤</div>}
          </div>
          <div>
            <nav className="mb-5 flex items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white"><T k="nav.home" /></Link><span>/</span>
              <Link href="/teachers" className="hover:text-white"><T k="nav.teachers" /></Link>
            </nav>
            <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">{teacher.name}</h1>
            {teacher.role && <p className="mt-3 text-lg font-medium text-primary-300">{teacher.role}</p>}
            {lines.length > 0 && (
              <ul className="mt-6 space-y-2">
                {lines.map((l, i) => (
                  <li key={i} className="flex gap-2.5 leading-relaxed text-white/85"><span className="text-primary-300">✦</span><span>{l}</span></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Багшийн заадаг хичээл, үйлчилгээ */}
      <section className="section"><div className="container-px">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{teacher.name} багшийн хөтөлдөг хичээл, үйлчилгээ</h2>
        {classes.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-line bg-white/60 px-5 py-12 text-center text-muted">Одоогоор бүртгэгдсэн хичээл алга. Удахгүй нэмэгдэнэ.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => <CmsCard key={c.id} item={c} />)}
          </div>
        )}
      </div></section>
    </>
  );
}
