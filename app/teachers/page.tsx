import Link from "next/link";
import { getSettings } from "@/lib/repo";
import { PageHeader } from "@/components/PageHeader";
import { T } from "@/components/T";
import { Stagger } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";

// Админ дээр хадгалсан өөрчлөлт ШУУД харагдахын тулд амьд өгөгдлөөр буулгана.
export const dynamic = "force-dynamic";
export const metadata = { title: "Хамт олон" };

const slugOf = (name: string) => encodeURIComponent(name);

export default async function TeachersPage() {
  const settings = await getSettings();
  // «Хамт олон» таб (teachers) + хуучин Тохиргооны жагсаалт (team) — нэгтгэж харуулна
  const teachers = [
    ...(settings.teachers || []),
    ...(settings.team || []).filter((m) => !(settings.teachers || []).some((t) => t.name === m.name)),
  ];
  return (
    <>
      <PageHeader title={<T k="nav.teachers" />} crumb={<T k="nav.teachers" />} />
      <section className="section"><div className="container-px">
        {teachers.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">
            Багш нарын мэдээлэл удахгүй нэмэгдэнэ.
          </p>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" step={110}>
            {teachers.map((t) => (
              <TiltCard key={t.name} className="h-full" max={4}><Link href={"/teachers/" + slugOf(t.name)}
                className="card group relative flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-glow">
                {t.image
                  ? <div className="h-80 w-full overflow-hidden"><img src={t.image} alt={t.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: "50% " + (t.focus ?? 50) + "%" }} /></div>
                  : <div className="grid h-80 w-full place-items-center bg-primary-grad text-6xl text-white">👤</div>}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 pt-14">
                  <h3 className="font-display text-2xl font-semibold text-white">{t.name}</h3>
                  {t.role && <p className="mt-1 text-sm font-medium text-white/85">{t.role}</p>}
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/70 opacity-0 transition group-hover:opacity-100">Хичээлүүдийг үзэх →</p>
                </div>
              </Link></TiltCard>
            ))}
          </Stagger>
        )}
      </div></section>
    </>
  );
}
