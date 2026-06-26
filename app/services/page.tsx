import { services } from "@/data/content";
import { ServiceCard } from "@/components/Cards";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { T } from "@/components/T";

export const metadata = { title: "Үйлчилгээ" };

export default function ServicesPage() {
  return (
    <>
      <PageHeader title={<T k="services.title" />} crumb={<T k="nav.services" />} desc={<T k="services.desc" />} />
      <section className="section">
        <div className="container-px grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (<Reveal key={s.id} delay={i * 60}><ServiceCard s={s} /></Reveal>))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
