"use client";

import Image from "next/image";
import { HomeDetailLink as Link } from "@/components/home/HomeDetails";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
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
        <CategoryScrollStory slides={slides} category={category} title={t(category.key)} />
        {category.id === "shop" && <div className="experience-stones"><StoneReading /></div>}
      </section>;
    })}
  </div>;
}

function CategoryScrollStory({ slides, category, title }: { slides: Slide[]; category: typeof categories[number]; title:string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [scrollMode, setScrollMode] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const list: Slide[] = slides.length ? slides : [{ id:category.id, title, desc:category.desc, image:category.image, tags:[], href:category.href }];

  useEffect(() => {
    // Short / zoomed viewports and reduced motion use a fully readable list.
    const screen = window.matchMedia("(min-height: 700px)");
    const update = () => setScrollMode(screen.matches && !reduced && list.length > 1);
    update();
    screen.addEventListener("change", update);
    return () => screen.removeEventListener("change", update);
  }, [reduced, list.length]);

  useEffect(() => {
    if (!scrollMode) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!track.current || !stage.current) return;
      const top = parseFloat(getComputedStyle(stage.current).top) || 0;
      const distance = track.current.offsetHeight - stage.current.offsetHeight;
      const value = Math.min(1, Math.max(0, (top - track.current.getBoundingClientRect().top) / Math.max(1, distance)));
      progress.set(value);
      setIndex(Math.min(list.length - 1, Math.floor(value * list.length)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(track.current!);
    observer.observe(stage.current!);
    window.addEventListener("scroll", schedule, { passive:true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [scrollMode, list.length, progress]);

  return <div className="category-carousel category-scroll-story" aria-label={title} data-scroll-mode={scrollMode}>
    <div ref={track} className="experience-scroll-track" style={{ "--experience-steps":list.length } as CSSProperties}>
      <div ref={stage} className="experience-scroll-stage">
        {scrollMode && <div className="experience-scroll-meta"><span>{title}</span><span>Доош гүйлгэж танилцаарай ↓</span></div>}
        <div className="experience-window">
          {list.map((slide, i) => {
            const active = !scrollMode || i === index;
            const direction = i < index ? -1 : 1;
            return <motion.article key={slide.id} className="experience-slide" aria-label={`${i+1} / ${list.length}`} aria-hidden={!active} data-active={active}
              initial={false} animate={{ opacity:active ? 1 : 0, y:scrollMode && !active ? direction*36 : 0 }}
              transition={{ duration:reduced ? 0 : .55, ease:[.22,1,.36,1] }} style={{ pointerEvents:active ? "auto" : "none", zIndex:active ? 1 : 0 }}>
              <div className="experience-image">
                <motion.div className="experience-image-motion" initial={false} animate={{scale:active ? 1 : 1.07}} transition={{duration:reduced ? 0 : .9, ease:[.22,1,.36,1]}}>
                  <Image src={slide.image} alt={slide.title} fill sizes="(max-width:767px) 100vw, 55vw" unoptimized={!slide.image.startsWith("/")} />
                </motion.div>
                <span>{title}</span>
              </div>
              <motion.div className="experience-copy" initial={false} animate={{y:scrollMode && !active ? direction*22 : 0}} transition={{duration:reduced ? 0 : .65, ease:[.22,1,.36,1]}}>
                <p className="discovery-kicker">ZAYA’S ANANDA · {String(i+1).padStart(2,"0")}</p>
                <h3>{slide.title}</h3><p className="experience-description">{slide.desc}</p>
                <div className="experience-tags">{slide.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <Link href={slide.href} tabIndex={active ? undefined : -1} className="btn btn-primary">Дэлгэрэнгүй үзэх <span aria-hidden>↗</span></Link>
              </motion.div>
            </motion.article>;
          })}
        </div>
        {scrollMode && <div className="experience-scroll-controls">
          <span className="experience-scroll-count">{String(index+1).padStart(2,"0")} / {String(list.length).padStart(2,"0")}</span>
          <div className="experience-scroll-progress" aria-hidden="true"><motion.div style={{scaleX:progress}} /></div>
          <Link href={category.href}>Бүгдийг үзэх ↗</Link>
        </div>}
      </div>
    </div>
    <div className="experience-browse"><Link href={category.href}>Бүгдийг үзэх <span aria-hidden>→</span></Link></div>
  </div>;
}
