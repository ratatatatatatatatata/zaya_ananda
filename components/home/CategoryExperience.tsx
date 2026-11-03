"use client";

import { serviceImage } from "@/lib/service-image";
import { itemTeachers } from "@/lib/item-teachers";
import Image from "next/image";
import { HomeDetailLink as Link } from "@/components/home/HomeDetails";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { StoneReading } from "../StoneReading";
import { locText } from "@/lib/cms-i18n";
import { useI18n } from "@/lib/i18n";
import { formatMNT } from "@/lib/format";
import type { CmsItem } from "@/lib/types";
import type { Journey } from "@/data/journeys";

const categories = [
  { id: "ayalal", key: "nav.journey", image: "/video/temple.jpg", href: "/ayalal", desc: "Одоо бүртгэл нээлттэй аяллууд. Аялал сонгоод дарвал өдөр өдрийн хөтөлбөр, хамт явах баг бүрэн харагдана." },
  { id: "services", key: "nav.services", image: "/video/stream.jpg", href: "/services", desc: "Аура оношилгоо, зурхай, лаа засал, озонатор — энергийн тэнцвэрээ сэргээх заслууд." },
  { id: "shop", key: "nav.shop", image: "/video/stones.jpg", href: "/shop", desc: "Төрсөн огноогоо оруулаад өөрийн эрдэнийн чулуу, түүнд тохирсон бүтээгдэхүүнээ олоорой." },
] as const;

type Slide = { id: string; title: string; desc: string; image: string; tags: string[]; href: string; item?: CmsItem; journey?: Journey };

export function CategoryExperience({ services, products, journeys }: { services: CmsItem[]; products: CmsItem[]; journeys: Journey[] }) {
  const { t, lang } = useI18n();
  const lists = { services, shop: products.filter(p => p.category !== "Чулуунууд") };
  return <div id="discover" className="experience-collection">
    {categories.map((category, categoryIndex) => {
      const slides: Slide[] = category.id === "ayalal"
        ? journeys.map(j => ({ id:j.id, title:j.name, desc:j.summary, image:j.image || category.image, tags:[j.days,j.groupSize,j.tagline].filter(Boolean), href:`/ayalal/${encodeURIComponent(j.slug)}`, journey:j }))
        : lists[category.id].map(item => ({ id:item.id, title:locText(lang,item.title,item.i18n,"title"), desc:locText(lang,item.summary,item.i18n,"summary") || category.desc, image:category.id === "services" ? serviceImage(item, services) : item.image || item.images?.[0] || category.image, tags:[item.category,...itemTeachers(item).map(teacher => teacher.name),typeof item.price === "number" ? formatMNT(item.price) : ""].filter((v): v is string => !!v), href:`/item/${item.id}`, item }));
      return <section key={category.id} id={category.id} className="experience-section" aria-labelledby={`experience-${category.id}`}>
        <div className="experience-heading">
          <p className="discovery-kicker">ZAYA’S ANANDA · {String(categoryIndex+5).padStart(2,"0")}</p>
          <h2 id={`experience-${category.id}`}>{t(category.key)}</h2>
          <p className="experience-intro">{category.desc}</p>
        </div>
        <CategoryTabs slides={slides} category={category} title={t(category.key)} />
        {category.id === "shop" && <div className="experience-stones"><StoneReading /></div>}
      </section>;
    })}
  </div>;
}

function CategoryTabs({ slides, category, title }: { slides: Slide[]; category: typeof categories[number]; title: string }) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const list: Slide[] = slides.length ? slides : [{ id:category.id, title, desc:category.desc, image:category.id === "services" ? "" : category.image, tags:[], href:category.href }];
  const index = Math.min(selected, list.length - 1);
  const journey = category.id === "ayalal";
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % list.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + list.length) % list.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = list.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus({ preventScroll: true });
    tabs.current[next]?.scrollIntoView({ block:"nearest", inline:"nearest", behavior:"instant" as ScrollBehavior });
  };
  const panel = (slide: Slide, i: number) => <motion.div key={slide.id} className="editorial-panel" initial={reduced ? false : {opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
    <div className="editorial-panel-image">
      {slide.image && <Image src={slide.image} alt={slide.title} fill sizes="(max-width:767px) 100vw, 48vw" unoptimized={!slide.image.startsWith("/")} />}
      <span>{String(i + 1).padStart(2,"0")} / {String(list.length).padStart(2,"0")}</span>
    </div>
    <div className="editorial-panel-copy">
      <p className="discovery-kicker">{title}</p>
      <h3>{slide.title}</h3><p>{slide.desc}</p>
      <div className="experience-tags">{slide.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <Link href={slide.href} className="btn btn-primary">Дэлгэрэнгүй үзэх</Link>
    </div>
  </motion.div>;
  return <div className="editorial-catalog">
    {journey ? <div className="editorial-journeys">{list.map(panel)}</div> : <>
      <div role="tablist" aria-label={title} className="editorial-tabs">
        {list.map((slide,i) => <button key={slide.id} ref={node=>{tabs.current[i]=node;}} type="button" role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel`} aria-selected={i === index} tabIndex={i === index ? 0 : -1} onClick={()=>setSelected(i)} onKeyDown={e=>onKey(e,i)}><span>{String(i+1).padStart(2,"0")}</span>{slide.title}</button>)}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${index}`} tabIndex={0}>{panel(list[index],index)}</div>
    </>}
    <div className="editorial-browse"><span>{title} · {slides.length}</span><Link href={category.href}>Бүгдийг үзэх</Link></div>
  </div>;
}
