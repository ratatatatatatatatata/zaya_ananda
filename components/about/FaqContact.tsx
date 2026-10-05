import { ContactForm } from "@/components/ContactForm";
import { T, Tr } from "@/components/T";
import type { L } from "@/lib/types";
import styles from "./FaqContact.module.css";

export function FaqContact({ questions }: { questions: { q: string | L; a: string | L }[] }) {
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
      <div className={styles.form}>
        <h3 className={styles.heading}>Зурвас илгээх</h3>
        <ContactForm />
      </div>
    </section>

  </div>;
}
