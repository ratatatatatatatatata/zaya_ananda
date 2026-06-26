import { courses } from "@/data/content";
import { CourseCard } from "@/components/Cards";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { T } from "@/components/T";

export const metadata = { title: "Онлайн сургалт" };

export default function CoursesPage() {
  return (
    <>
      <PageHeader title={<T k="courses.title" />} crumb={<T k="nav.courses" />} desc={<T k="courses.desc" />} />
      <section className="section">
        <div className="container-px grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (<Reveal key={c.id} delay={i * 60}><CourseCard c={c} /></Reveal>))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
