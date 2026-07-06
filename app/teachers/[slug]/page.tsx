import { notFound } from "next/navigation";
import Link from "next/link";
import { getSettings, listCmsCached } from "@/lib/repo";
import { TeacherClasses, type TeacherClass } from "@/components/TeacherClasses";
import { T } from "@/components/T";

// Багшийн мэдээлэл шууд шинэчлэгдэж харагдана.
export const dynamic = "force-dynamic";

export default async function TeacherDetailPage({ params }: { params: { slug: string } }) {
  const name = decodeURIComponent(params.slug);
  const settings = await getSettings();
  const all = [...(settings.teachers || []), ...(settings.team || [])];
  const teacher = all.find((t) => t.name === name);
  if (!teacher) notFound();

  const [courses, services] = await Promise.all([listCmsCached("course"), listCmsCached("service")]);
  const classes: TeacherClass[] = [...courses, ...services]
    .filter((i) => (i.teacherName || "").trim() === teacher.name.trim())
    .map((i) => ({
      id: i.id, kind: i.kind, title: i.title, summary: i.summary, image: i.image,
      price: i.price, lessonsCount: i.lessons?.length ?? i.videoLessons, i18n: i.i18n,
    }));
  const lines = (teacher.info || "").split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      {/* Masterclass маягийн танилцуулга */}
      <section className="relative isolate overflow-hidden bg-[#121C33]">
        <div className="container-px grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.3fr] lg:py-20">
          <div className="mx-auto w-full max-w-sm">
            {teacher.image
              ? <img src={teacher.image} alt={teacher.name} className="aspect-[3/4] w-full rounded-3xl object-cover shadow-glow" style={{ objectPosition: "50% " + (teacher.focus ?? 50) + "%" }} />
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
      <section className="section"><div className="container-px max-w-4xl">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{teacher.name} багшийн хөтөлдөг хичээл, үйлчилгээ</h2>
        <p className="mt-2 text-muted">Гарчиг дээр дарж дэлгэрэнгүй мэдээллийг нь харна уу.</p>
        <TeacherClasses classes={classes} />
      </div></section>
    </>
  );
}
