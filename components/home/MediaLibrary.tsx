"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { collectPublicMedia, giftCategory, type GiftCategory } from "@/lib/public-media";
import { embedSrc } from "@/lib/video-embed";
import { RichBody } from "@/components/RichBody";
import type { CmsItem } from "@/lib/types";
import styles from "./GiftMedia.module.css";

const TABS: { id: GiftCategory; title: string }[] = [
  { id: "podcast", title: "Podcast" },
  { id: "meditation", title: "Бясалгал дасгал" },
  { id: "advice", title: "Зөвлөмж" },
];
type Gift = { id: string; title: string; poster: string; category: GiftCategory; url?: string; article?: CmsItem };

function MediaArtwork({ src, large = false }: { src: string; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const source = failed ? "/video/temple.jpg" : src;
  return <Image src={source} alt="" fill sizes={large ? "(max-width:767px) 100vw, 65vw" : "260px"} unoptimized={!source.startsWith("/")} onError={() => setFailed(true)} />;
}

/** Homepage has three tabs; the Gift menu shows the complete public library. */
export function MediaLibrary({ items, categorized = false }: { items: CmsItem[]; categorized?: boolean }) {
  const publicItems = items.filter(item => item.kind === "free" || item.kind === "resource");
  const gifts: Gift[] = [...collectPublicMedia(publicItems), ...publicItems.filter(item => collectPublicMedia([item]).length === 0 && (item.summary?.trim() || item.body?.trim())).map(item => ({
    id: item.id, title: item.title, poster: item.image || item.images?.[0] || "/video/meditation.jpg", category: giftCategory(item), article: item,
  }))];
  const [tab, setTab] = useState(0);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const visible = categorized ? gifts.filter(gift => gift.category === TABS[tab].id) : gifts;
  return <div className={styles.library}>
    {categorized && <div className={styles.tabs} role="tablist" aria-label="Гэгээн бэлэг">
      {TABS.map((item,index) => <button key={item.id} ref={element => { buttons.current[index] = element; }} type="button" role="tab" aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} onClick={() => setTab(index)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
        else if (event.key === "ArrowLeft") next = (index + TABS.length - 1) % TABS.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = TABS.length - 1;
        else return;
        event.preventDefault(); setTab(next); buttons.current[next]?.focus();
      }}>{item.title}</button>)}
    </div>}
    {categorized ? TABS.map((item,index) => <div key={item.id} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={tab !== index} tabIndex={0}>
      {tab === index && <GiftShelf key={item.id} gifts={visible} title={item.title} />}
    </div>) : <GiftShelf gifts={visible} title="Бүх агуулга" />}
  </div>;
}

function GiftShelf({ gifts, title }: { gifts: Gift[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const gift = gifts[selected] || gifts[0];
  const select = (index: number) => { setSelected(index); setPlaying(false); };
  const move = (step: number) => {
    const next = (selected + step + gifts.length) % gifts.length;
    select(next);
    const card = rail.current?.children[next] as HTMLElement | undefined;
    if (rail.current && card) rail.current.scrollTo({ left: card.offsetLeft - rail.current.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const embed = gift?.url ? embedSrc(gift.url,true) : null;
  return <section aria-label={title}>
    <div className={styles.heading}><h3>{title}</h3>{gifts.length > 0 && <div className={styles.arrows}>
      <button type="button" disabled={gifts.length < 2} onClick={() => move(-1)} aria-label="Өмнөх агуулга">←</button><span>{selected + 1} / {gifts.length}</span><button type="button" disabled={gifts.length < 2} onClick={() => move(1)} aria-label="Дараах агуулга">→</button>
    </div>}</div>
    {!gift ? <p className="media-empty">{title} агуулга удахгүй нэмэгдэнэ.</p> : <>
      <div className={styles.feature}>
        <div className={styles.player}>
          {playing && embed ? embed.type === "iframe" ? <iframe key={gift.id} src={embed.src} title={gift.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video key={gift.id} src={embed.src} controls autoPlay playsInline aria-label={gift.title} />
            : gift.url ? <button type="button" className={styles.poster} aria-label={`${gift.title} — тоглуулах`} onClick={() => setPlaying(true)}><MediaArtwork key={gift.poster} src={gift.poster} large /><span className={styles.play} aria-hidden>▶</span></button>
            : <MediaArtwork key={gift.poster} src={gift.poster} large />}
        </div>
        <div className={styles.featureCopy}><p>{gift.url ? "ОДОО ҮЗЭХ" : "УНШИХ"} · {String(selected + 1).padStart(2,"0")}</p><h4>{gift.title}</h4>
          {gift.url ? <button type="button" onClick={() => setPlaying(value => !value)}>{playing ? "Тоглуулагчийг хаах" : "Энд үзэх ▶"}</button> : <p>{gift.article?.summary}</p>}
        </div>
      </div>
      {gift.article?.body && <div className={styles.article}><RichBody html={gift.article.body} i18n={gift.article.i18n} /></div>}
      <div ref={rail} className={styles.rail} aria-label={`${title} — сонгох агуулгууд`}>
        {gifts.map((item,index) => <button key={item.id} type="button" className={styles.railCard} aria-pressed={selected === index} onClick={() => select(index)}>
          <span className={styles.thumb}><MediaArtwork key={item.poster} src={item.poster} />{item.url && <span aria-hidden>▶</span>}</span>
          <span className={styles.number}>{String(index + 1).padStart(2,"0")} · {TABS.find(tab => tab.id === item.category)?.title}</span><span className={styles.name}>{item.title}</span><span className={styles.more}>Сонгож үзэх →</span>
        </button>)}
      </div>
    </>}
  </section>;
}
