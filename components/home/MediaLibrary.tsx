"use client";

import { isSectionReel } from "@/lib/section-reels";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { collectPublicMedia, giftCategory, type GiftCategory } from "@/lib/public-media";
import { embedSrc } from "@/lib/video-embed";
import { RichBody } from "@/components/RichBody";
import type { CmsItem } from "@/lib/types";
import styles from "./GiftMedia.module.css";
import wall from "./GiftWall.module.css";

const TABS: { id: GiftCategory; title: string }[] = [
  { id: "podcast", title: "Podcast" },
  { id: "advice", title: "Зөвлөмж" },
  { id: "meditation", title: "Бясалгал дасгал" },
];
type Gift = { id: string; title: string; poster: string; category: GiftCategory; url?: string; summary?: string; article?: CmsItem };

function MediaArtwork({ src, large = false }: { src: string; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const source = failed ? "/video/temple.jpg" : src;
  return <Image src={source} alt="" fill sizes={large ? "(max-width:767px) 100vw, 1000px" : "(max-width:600px) 170px, (max-width:1600px) 16vw, 280px"} unoptimized={!source.startsWith("/")} onError={() => setFailed(true)} />;
}

/** Homepage keeps its three tabs; the Gift page keeps all three category headings. */
export function MediaLibrary({ items, categorized = false }: { items: CmsItem[]; categorized?: boolean }) {
  const publicItems = items.filter(item => !isSectionReel(item) && Number(item.price || 0) <= 0 && (item.kind === "free" || item.kind === "resource"));
  const gifts: Gift[] = [...collectPublicMedia(publicItems), ...publicItems.filter(item => collectPublicMedia([item]).length === 0 && (item.summary?.trim() || item.body?.trim())).map(item => ({
    id: item.id, title: item.title, poster: item.image || item.images?.[0] || "/video/meditation.jpg", category: giftCategory(item), article: item,
  }))];
  const [tab, setTab] = useState(0);
  const [activeGift, setActiveGift] = useState<Gift | null>(null);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const visible = categorized ? gifts.filter(gift => gift.category === TABS[tab].id) : gifts;
  return <div className={styles.library}>
    {categorized && <div className={styles.tabs} role="tablist" aria-label="Гэгээн бэлэг">
      {TABS.map((item,index) => <button key={item.id} ref={element => { buttons.current[index] = element; }} type="button" role="tab" aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} onClick={() => { setActiveGift(null); setTab(index); }} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
        else if (event.key === "ArrowLeft") next = (index + TABS.length - 1) % TABS.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = TABS.length - 1;
        else return;
        event.preventDefault(); setActiveGift(null); setTab(next); buttons.current[next]?.focus();
      }}>{item.title}</button>)}
    </div>}
    {categorized ? TABS.map((item,index) => <div key={item.id} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={tab !== index} tabIndex={0}>
      {tab === index && <GiftShelf key={item.id} gifts={visible} title={item.title} modalOpen={!!activeGift} onOpen={setActiveGift} />}
    </div>) : <div className={styles.sections}>{TABS.map(category => <GiftShelf key={category.id} gifts={gifts.filter(gift => gift.category === category.id)} title={category.title} modalOpen={!!activeGift} onOpen={setActiveGift} />)}</div>}
    {activeGift && <GiftDialog gift={activeGift} onClose={() => setActiveGift(null)} />}
  </div>;
}

function GiftShelf({ gifts, title, modalOpen, onOpen }: { gifts: Gift[]; title: string; modalOpen: boolean; onOpen: (gift: Gift) => void }) {
  const [paused, setPaused] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const rows = gifts.length > 3 ? [gifts.filter((_, i) => i % 2 === 0), gifts.filter((_, i) => i % 2 === 1)] : [gifts];
  return <section aria-label={title} className={wall.shelf}>
    <div className={styles.heading}>
      <div className={wall.headingCopy}><h3>{title}</h3>{gifts.length > 0 && <p>{gifts.length} агуулга · Сонгоод эндээс үзээрэй</p>}</div>
      {gifts.length > 1 && <div className={wall.controls}>
        <button type="button" aria-pressed={browsing} onClick={() => setBrowsing(value => !value)}>{browsing ? "Гүйлгэдэг харагдац" : "Бүгдийг харах"}</button>
        {!browsing && <button type="button" aria-pressed={paused} aria-label={paused ? `${title} — хөдөлгөөн үргэлжлүүлэх` : `${title} — хөдөлгөөн зогсоох`} onClick={() => setPaused(value => !value)}><span aria-hidden>{paused ? "▷" : "Ⅱ"}</span> {paused ? "Үргэлжлүүлэх" : "Түр зогсоох"}</button>}
      </div>}
    </div>
    {!gifts.length ? <p className="media-empty">{title} агуулга удахгүй нэмэгдэнэ.</p> : <div className={wall.wall} data-paused={paused || modalOpen} data-browsing={browsing}>
      {rows.map((row, rowIndex) => {
        const moving = row.length > 1;
        // Repeat a short row enough to cover wide screens; duplicates are not keyboard stops.
        const repetitions = moving ? Math.max(1, Math.ceil(8 / row.length)) : 1;
        const strip = Array.from({ length: repetitions }, () => row).flat();
        return <div key={rowIndex} className={wall.viewport} data-moving={moving}>
          <div className={wall.track} data-reverse={rowIndex === 1} style={{ "--travel-time": `${strip.length * 7}s` } as CSSProperties}>
            {[0, ...(moving ? [1] : [])].map(copy => <div key={copy} className={wall.group} aria-hidden={copy === 1 ? true : undefined} data-copy={copy}>
              {strip.map((item, index) => <GiftCard key={`${item.id}-${index}`} gift={item} duplicate={copy === 1 || index >= row.length} onOpen={onOpen} />)}
            </div>)}
          </div>
        </div>;
      })}
    </div>}
  </section>;
}

function GiftCard({ gift, duplicate, onOpen }: { gift: Gift; duplicate: boolean; onOpen: (gift: Gift) => void }) {
  const episode = gift.title.match(/^Ananda\s+Podcast\s+Season\s*(\d+)[,\s]+Episode\s*(\d+)\s*[:–—-]\s*/i);
  const displayTitle = episode ? gift.title.slice(episode[0].length) || gift.title : gift.title;
  return <button type="button" className={wall.card} data-duplicate={duplicate} aria-hidden={duplicate ? true : undefined} tabIndex={duplicate ? -1 : 0} aria-haspopup="dialog" aria-label={`${gift.title} — ${gift.url ? "тоглуулах" : "унших"}`} onClick={() => onOpen(gift)}>
    <span className={wall.ambience} aria-hidden><MediaArtwork key={gift.poster} src={gift.poster} /></span>
    <span className={wall.artwork}><MediaArtwork key={gift.poster} src={gift.poster} /></span>
    <span className={wall.cardIcon} aria-hidden>{gift.url ? "▶" : "↗"}</span>
    <span className={wall.cardCopy}><span className={wall.category}>{TABS.find(tab => tab.id === gift.category)?.title}{episode ? ` · ${episode[1]}.${episode[2]}` : ""}</span><strong>{displayTitle}</strong><span className={wall.action}>{gift.url ? "Үзэх" : "Унших"} <span aria-hidden>↗</span></span></span>
  </button>;
}

function GiftDialog({ gift, onClose }: { gift: Gift; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [failed, setFailed] = useState(false);
  const embed = gift.url ? embedSrc(gift.url, true) : null;
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<dialog ref={dialog} className={wall.dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className={wall.dialogContent}>
      <header className={wall.dialogHeader}><div><p>{TABS.find(tab => tab.id === gift.category)?.title}</p><h2 id={titleId}>{gift.title}</h2></div><button autoFocus type="button" onClick={onClose} aria-label="Хаах">×</button></header>
      <div className={wall.dialogPlayer}>
        {embed ? embed.type === "iframe" ? <iframe src={embed.src} title={gift.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video src={embed.src} poster={gift.poster} controls autoPlay playsInline aria-label={gift.title} onError={() => setFailed(true)} /> : <MediaArtwork src={gift.poster} large />}
      </div>
      {failed && <p role="alert" className={wall.description}>Бичлэг ачаалагдсангүй. Хаагаад дахин тоглуулж үзнэ үү.</p>}
      {(gift.summary || gift.article?.summary) && <p className={wall.description}>{gift.summary || gift.article?.summary}</p>}
      {gift.article?.body && <div className={wall.description}><RichBody html={gift.article.body} i18n={gift.article.i18n} /></div>}
    </div>
  </dialog>, document.body);
}
