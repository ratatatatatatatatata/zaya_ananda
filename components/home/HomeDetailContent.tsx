"use client";

import type { CmsItem } from "@/lib/types";
import { JOURNEY_FAQ, JOURNEY_PREP, type Journey } from "@/data/journeys";
import { ItemVideos } from "@/components/ItemVideos";
import { RichBody } from "@/components/RichBody";
import { ServiceBooking } from "@/components/ServiceBooking";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { PurchaseBox } from "@/components/PurchaseBox";
import { CourseLessons } from "@/components/CourseLessons";
import { JourneyBooking } from "@/components/journey/JourneyBooking";
import styles from "./HomeDetails.module.css";

export default function HomeDetailContent({ item, journey: j }: { item?: CmsItem; journey?: Journey }) {
  if (item) {
    const images = Array.from(new Set([item.image, ...(item.images || [])].filter((value): value is string => !!value)));
    return <div className={styles.detail}>
      {images.length > 0 && <div className={styles.gallery} aria-label="Зургийн цомог">{images.map(src => <img key={src} src={src} alt={item.title} />)}</div>}
      {item.summary && <p>{item.summary}</p>}
      {item.body && <RichBody html={item.body} i18n={item.i18n} />}
      {item.kind !== "course" && item.link && <ItemVideos videos={[{ title: item.title, url: item.link }]} />}
      {item.teacherName && <div className={styles.teacher}>{item.teacherImage && <img src={item.teacherImage} alt="" />}<div><h3>{item.teacherName}</h3><p>{item.teacherInfo}</p></div></div>}
      {item.kind === "service" && <ServiceBooking itemId={item.id} serviceName={item.title} workDays={item.bookingDays} startHour={item.bookingStartHour} endHour={item.bookingEndHour} />}
      {item.kind === "product" && <ProductBuyBox id={item.id} title={item.title} price={item.price} />}
      {item.kind === "course" && <><PurchaseBox id={item.id} title={item.title} price={item.price} /><CourseLessons id={item.id} nextNote={item.nextNote} /></>}
    </div>;
  }
  if (!j) return null;
  return <div className={styles.detail}>
    {j.image && <div className={styles.gallery}><img src={j.image} alt={j.name} /></div>}
    <p>{j.tagline}</p><p>{j.summary}</p>
    <dl className="grid gap-4 sm:grid-cols-2">{[["Хугацаа",j.days],["Бүлэг",j.groupSize],["Тээвэр",j.transport],["Байр",j.stay],["Хэнд зориулсан",j.audience],["Үнэ",j.price],["Үнэд багтсан",j.included],["Үнэд багтаагүй",j.excluded]].filter(([,value]) => value).map(([label,value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="mt-1 whitespace-pre-line">{value}</dd></div>)}</dl>
    <section className={styles.program}><h3>Аяллын хөтөлбөр</h3>{j.itinerary.map((day,index) => <article key={index}><p>{day.label}</p><h3>{day.title}</h3><p>{day.text}</p>{day.bullets && <ul className="mt-3 list-disc pl-5">{day.bullets.map((text,i) => <li key={i}>{text}</li>)}</ul>}{day.image && <img src={day.image} alt={day.title} />}</article>)}</section>
    {!!j.destination?.length && <section className={styles.program}><h3>Очих газрууд</h3>{j.destination.map((place,i) => <article key={i}><h3>{place.title}</h3><p>{place.desc}</p>{place.image && <img src={place.image} alt={place.title} />}</article>)}</section>}
    <section className={styles.program}><h3>Хамт явах баг</h3>{[j.lead,...j.crew].filter(person => person?.name).map((person,i) => <div className={styles.teacher} key={i}>{person.image && <img src={person.image} alt="" />}<div><h3>{person.name}</h3><p>{person.role}</p><p>{person.info}</p></div></div>)}</section>
    <JourneyBooking slug={j.slug} journeyName={j.name} prepay={j.prepay} />
    <section><h3>Аяллын бэлтгэл</h3><ul className="list-disc space-y-2 pl-5">{[...JOURNEY_PREP.packing,...JOURNEY_PREP.mind,...JOURNEY_PREP.etiquette].map(text => <li key={text}>{text}</li>)}</ul><p className="mt-4">{JOURNEY_PREP.food}</p></section>
    <section><h3>Түгээмэл асуултууд</h3>{JOURNEY_FAQ.map(faq => <details key={faq.q} className="border-b border-line py-4"><summary className="cursor-pointer font-semibold">{faq.q}</summary><p className="mt-3">{faq.a}</p></details>)}</section>
  </div>;
}
