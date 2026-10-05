"use client";
import { useState } from "react";
import { embedSrc } from "@/lib/video-embed";
import type { PublicEpisode } from "@/lib/public-media";
import styles from "./home/GiftMedia.module.css";

export function SectionReelPlayer({ reels }: { reels: PublicEpisode[] }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reel = reels[selected] || reels[0];
  if (!reel) return null;
  const choose = (index: number) => { setPlaying(false); setFailed(false); setSelected(index); };
  const embed = embedSrc(reel.url, true);
  return <div className="mt-6 min-w-0" aria-label="Reel бичлэгүүд">
    <div className={styles.heading}><p className="text-sm text-muted">{selected + 1} / {reels.length}</p><div className={styles.arrows}>
      <button type="button" disabled={reels.length < 2} onClick={() => choose((selected - 1 + reels.length) % reels.length)} aria-label="Өмнөх Reel">←</button>
      <button type="button" disabled={reels.length < 2} onClick={() => choose((selected + 1) % reels.length)} aria-label="Дараах Reel">→</button>
    </div></div>
    <div className={styles.feature}>
      <div className={styles.player}>
        {playing && reel.url ? embed.type === "iframe" ? <iframe key={reel.id} src={embed.src} title={reel.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          : <video key={reel.id} src={embed.src} poster={reel.poster} className="object-contain" controls autoPlay playsInline onError={() => setFailed(true)} aria-label={reel.title} />
          : reel.mediaType === "image" ? <img src={reel.poster} alt={reel.title} className="absolute inset-0 h-full w-full object-contain" />
          : <button type="button" className={styles.poster} aria-label={`${reel.title} — тоглуулах`} onClick={() => setPlaying(true)}>
            <img src={reel.poster} alt="" className="h-full w-full object-contain" loading="lazy" /><span className={styles.play} aria-hidden>▶</span>
          </button>}
      </div>
      <div className={styles.featureCopy}><p>{reel.mediaType === "image" ? "ЗУРАГ" : "ОДОО ҮЗЭХ"}</p><h4>{reel.title}</h4>
        {reel.summary && <p>{reel.summary}</p>}
        {reel.url && <button type="button" onClick={() => { setFailed(false); setPlaying(!playing); }}>{playing ? "Тоглуулагчийг хаах" : "Энд үзэх ▶"}</button>}
        {failed && <p role="alert">Бичлэг ачаалагдсангүй. Дахин тоглуулж үзнэ үү.</p>}
      </div>
    </div>
    {reels.length > 1 && <div className={styles.rail} aria-label="Reel сонгох">{reels.map((item, index) => <button key={item.id} type="button" className={styles.railCard} aria-pressed={index === selected} onClick={() => choose(index)}>
      <span className={styles.thumb}><img src={item.poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />{item.url && <span aria-hidden>▶</span>}</span><span className={styles.name}>{item.title}</span>
    </button>)}</div>}
  </div>;
}
