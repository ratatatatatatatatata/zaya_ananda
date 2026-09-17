"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { collectPublicMedia } from "@/lib/public-media";
import { embedSrc } from "@/lib/video-embed";
import type { CmsItem } from "@/lib/types";
import styles from "./GiftMedia.module.css";

function MediaArtwork({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const source = failed ? "/video/temple.jpg" : src;
  return <Image src={source} alt="" fill sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw" unoptimized={!source.startsWith("/")} onError={() => setFailed(true)} />;
}

/** All public gifts, with no category filter. Only one player is mounted at a time. */
export function MediaLibrary({ items }: { items: CmsItem[] }) {
  const publicItems = items.filter(item => item.kind === "free" || item.kind === "resource");
  const episodes = collectPublicMedia(publicItems);
  const articles = publicItems.filter(item => collectPublicMedia([item]).length === 0);
  const [playing, setPlaying] = useState<string | null>(null);
  const count = episodes.length + articles.length;

  return <div>
    <div className={styles.heading}><h2>Бүх агуулга</h2><p>{count} агуулга</p></div>
    {count === 0 ? <p className="media-empty">Агуулга удахгүй нэмэгдэнэ.</p> : <div className={styles.grid}>
      {episodes.map(episode => {
        const active = playing === episode.id;
        const embed = embedSrc(episode.url, true);
        return <article key={episode.id} className={styles.card}>
          <div className={styles.player}>
            {active ? embed.type === "iframe"
              ? <iframe src={embed.src} title={episode.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              : <video src={embed.src} aria-label={episode.title} controls autoPlay playsInline />
              : <button type="button" className={`${styles.poster} focus-ring`} aria-label={`${episode.title} — тоглуулах`} onClick={() => setPlaying(episode.id)}>
                  <MediaArtwork key={episode.poster} src={episode.poster} />
                  <span className={styles.play} aria-hidden="true">▶</span>
                </button>}
          </div>
          <div className={styles.copy}>
            <h3>{episode.title}</h3>
            <div className={styles.actions}>
              <button type="button" className="focus-ring" aria-label={`${episode.title} — ${active ? "тоглуулагчийг хаах" : "энд үзэх"}`} onClick={() => setPlaying(active ? null : episode.id)}>{active ? "Тоглуулагчийг хаах" : "Энд үзэх"}</button>
              <a className="focus-ring" href={episode.url} target="_blank" rel="noopener noreferrer">Эх сурвалж ↗</a>
            </div>
          </div>
        </article>;
      })}
      {articles.map(item => <article key={item.id} className={styles.card}>
        {(item.image || item.images?.[0]) && <div className={styles.player}><MediaArtwork src={item.image || item.images![0]} /></div>}
        <div className={styles.copy}>
          <h3>{item.title}</h3>
          {item.summary && <p>{item.summary}</p>}
          <div className={styles.actions}><Link className="focus-ring" href={`/item/${item.id}`}>Дэлгэрэнгүй →</Link></div>
        </div>
      </article>)}
    </div>}
  </div>;
}
