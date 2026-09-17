import { ContactForm } from "@/components/ContactForm";
import { T, Tr } from "@/components/T";
import { siteConfig } from "@/data/content";
import type { L } from "@/lib/types";
import styles from "./FaqContact.module.css";

export function FaqContact({ questions, mapQuery }: { questions: { q: string | L; a: string | L }[]; mapQuery?: string }) {
  const mapUrl = "https://www.google.com/maps?q=" + encodeURIComponent(mapQuery?.trim() || siteConfig.mapQuery);
  const text = (value: string | L) => typeof value === "string" ? value : <Tr v={value} />;
  return <div className={styles.layout}>
    <section className={styles.faq} aria-label="Түгээмэл асуултууд">
      <p className="eyebrow-line"><T k="about.faqEyebrow" /></p>
      <h3 className={styles.heading}><T k="about.faqTitle" /></h3>
      <div className={styles.questions}>
        {questions.map((question, index) => <details key={index}>
          <summary>{text(question.q)}<span aria-hidden="true">＋</span></summary>
          <p>{text(question.a)}</p>
        </details>)}
      </div>
    </section>
    <section className={styles.contact} aria-label="Зурвас илгээх">
      <iframe title="Zaya’s Ananda — байршил" src={mapUrl + "&z=17&output=embed"} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      <div className={styles.form}>
        <h3 className={styles.heading}>Зурвас илгээх</h3>
        <ContactForm />
      </div>
      <a className={styles.mapLink} href={mapUrl} target="_blank" rel="noreferrer">Газрын зураг дээр нээх ↗</a>
    </section>
  </div>;
}
