"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import { CmsCard } from "../CmsCard";
import { JourneyCard } from "./JourneyCoverflow";
import { StoneReading } from "../StoneReading";
import { useI18n } from "@/lib/i18n";
import { formatMNT } from "@/lib/format";
import type { CmsItem } from "@/lib/types";
import type { Journey } from "@/data/journeys";

const categories = [
  { id: "services", key: "nav.services", image: "/video/stream.jpg", href: "/services", desc: "Аура оношилгоо, зурхай, лаа засал, озонатор — энергийн тэнцвэрээ сэргээх заслууд." },
  { id: "courses", key: "nav.courses", image: "/video/meditation.jpg", href: "/courses", desc: "Өөрийн хэмнэлээр суралцаж, дотоод ертөнцөө таних хичээлүүд. Худалдаж авсан сургалт тань хувийн буланд нээгдэнэ." },
  { id: "ayalal", key: "nav.journey", image: "/video/temple.jpg", href: "/ayalal", desc: "Одоо бүртгэл нээлттэй аяллууд. Аялал сонгоод дарвал өдөр өдрийн хөтөлбөр, хамт явах баг бүрэн харагдана." },
  { id: "shop", key: "nav.shop", image: "/video/stones.jpg", href: "/shop", desc: "Төрсөн огноогоо оруулаад өөрийн эрдэнийн чулуу, түүнд тохирсон бүтээгдэхүүнээ олоорой." },
] as const;

type Slide = { id: string; title: string; desc: string; image: string; tags: string[]; href: string; item?: CmsItem; journey?: Journey };

export function CategoryExperience({ services, courses, products, journeys }: { services: CmsItem[]; courses: CmsItem[]; products: CmsItem[]; journeys: Journey[] }) {
  const { t } = useI18n();
  const lists = [services, courses, [], products.filter(p => p.category !== "Чулуунууд")];
  return <div id="discover" className="experience-collection">
    {categories.map((category, categoryIndex) => {
      const slides: Slide[] = category.id === "ayalal"
        ? journeys.map(j => ({ id:j.id, title:j.name, desc:j.summary, image:j.image || category.image, tags:[j.days,j.groupSize,j.tagline].filter(Boolean), href:`/ayalal/${encodeURIComponent(j.slug)}`, journey:j }))
        : lists[categoryIndex].map(item => ({ id:item.id, title:item.title, desc:item.summary || category.desc, image:item.image || item.images?.[0] || category.image, tags:[item.category,item.teacherName,typeof item.price === "number" ? formatMNT(item.price) : ""].filter((v): v is string => !!v), href:`/item/${item.id}`, item }));
      return <section key={category.id} id={category.id} className="experience-section" aria-labelledby={`experience-${category.id}`}>
        {category.id === "courses" && <span id="capabilities" className="experience-anchor" aria-hidden="true"/>}
        <div className="experience-heading">
          <p className="discovery-kicker">ZAYA’S ANANDA · {String(categoryIndex+1).padStart(2,"0")}</p>
          <h2 id={`experience-${category.id}`}>{t(category.key)}</h2>
          <p className="experience-intro">{category.desc}</p>
        </div>
        <CategoryCarousel slides={slides} category={category} title={t(category.key)} />
        {category.id === "shop" && <div className="experience-stones"><StoneReading /></div>}
      </section>;
    })}
  </div>;
}

function CategoryCarousel({ slides, category, title }: { slides: Slide[]; category: typeof categories[number]; title:string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const touch = useRef<{x:number;y:number} | null>(null);
  const list = slides.length ? slides : [{ id:category.id, title, desc:category.desc, image:category.image, tags:[], href:category.href }];
  const current = list[index % list.length];
  const advance = (step:number) => setIndex(v => (v+step+list.length)%list.length);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold:.2});
    if(root.current) observer.observe(root.current);
    const visibility = () => setPageVisible(!document.hidden);
    visibility(); document.addEventListener("visibilitychange",visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange",visibility); };
  }, []);
  useEffect(() => {
    if(list.length < 2 || reduced || hovered || focused || paused || overlayOpen || !visible || !pageVisible) return;
    const timer = window.setInterval(() => setIndex(v => (v+1)%list.length),4500);
    return () => window.clearInterval(timer);
  }, [list.length,reduced,hovered,focused,paused,overlayOpen,visible,pageVisible]);
  const related = Array.from({length:Math.min(3,slides.length)},(_,i) => slides[(index+i)%slides.length]);
  return <div ref={root} className="category-carousel" aria-roledescription="carousel" aria-label={title} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if(!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}>
    <div className="experience-window" onTouchStart={e => {touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e => { if(!touch.current) return; const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y; if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.3) advance(dx<0?1:-1); touch.current=null; }}>
      <article key={current.id} className="experience-slide" aria-roledescription="slide" aria-label={`${index+1} / ${list.length}`}>
        <div className="experience-image"><Image src={current.image} alt={current.title} fill sizes="(max-width:767px) 100vw, 55vw" unoptimized={!current.image.startsWith("/")} /><span>{title}</span></div>
        <div className="experience-copy"><p className="discovery-kicker">ZAYA’S ANANDA · {String(index+1).padStart(2,"0")}</p><h3>{current.title}</h3><p className="experience-description">{current.desc}</p><div className="experience-tags">{current.tags.map(tag => <span key={tag}>{tag}</span>)}</div><Link href={current.href} className="btn btn-primary">Дэлгэрэнгүй үзэх <span aria-hidden>↗</span></Link></div>
      </article>
    </div>
    <div className="experience-controls"><div className="experience-arrows"><button type="button" onClick={() => advance(-1)} disabled={list.length<2} aria-label="Өмнөх мэдээлэл">←</button><span>{String(index+1).padStart(2,"0")} / {String(list.length).padStart(2,"0")}</span><button type="button" onClick={() => advance(1)} disabled={list.length<2} aria-label="Дараах мэдээлэл">→</button></div><div className="experience-dots" aria-label="Мэдээлэл сонгох">{list.map((slide,i) => <button key={slide.id} type="button" aria-label={`${i+1}. ${slide.title}`} aria-pressed={i===index} onClick={() => setIndex(i)} />)}</div>{list.length>1 && !reduced && <button type="button" className="experience-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Автоматаар үргэлжлүүлэх" : "Түр зогсоох"}</button>}</div>
    {related.length>0 && <div className="experience-related">{related.map(slide => <div key={slide.id}>{slide.journey ? <JourneyCard j={slide.journey}/> : slide.item?.kind === "service" ? <ServiceCard item={slide.item} onOpenChange={setOverlayOpen}/> : slide.item ? <CmsCard item={slide.item}/> : null}</div>)}</div>}
    <div className="experience-browse"><Link href={category.href}>Бүгдийг үзэх <span aria-hidden>→</span></Link></div>
  </div>;
}
