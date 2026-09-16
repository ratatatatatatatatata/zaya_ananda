"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { collectPublicMedia, type PublicEpisode } from "@/lib/public-media";
import { embedSrc } from "@/lib/video-embed";
import type { CmsItem } from "@/lib/types";

export function MediaLibrary({items}:{items:CmsItem[]}) {
  const episodes=collectPublicMedia(items);
  return <div className="media-library">
    <EpisodeShelf title="Reel" id="reels" episodes={episodes.filter(e => e.kind === "reel")} />
    <EpisodeShelf title="Podcast" id="podcasts" episodes={episodes.filter(e => e.kind === "podcast")} />
  </div>;
}
function EpisodeShelf({title,id,episodes}:{title:string;id:string;episodes:PublicEpisode[]}) {
  const [selected,setSelected]=useState(0);
  const [playing,setPlaying]=useState(false);
  const rail=useRef<HTMLDivElement>(null);
  const episode=episodes[selected];
  const select=(i:number) => {setSelected(i);setPlaying(false);};
  const move=(step:number) => { const next=(selected+step+episodes.length)%episodes.length; select(next); rail.current?.children[next]?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"nearest",inline:"nearest"}); };
  const embed=episode?embedSrc(episode.url,true):null;
  return <section className={`episode-shelf ${id}`} id={id} aria-labelledby={`${id}-title`}>
    <div className="episode-heading"><div><p className="discovery-kicker">{id === "podcasts" ? "ЯРИЛЦЛАГА, ШИНЭ ӨНЦӨГ" : "ӨДӨР ТУТМЫН УРАМ"}</p><h3 id={`${id}-title`}>{title}</h3></div>{episodes.length>0 && <div className="experience-arrows"><button type="button" onClick={() => move(-1)} disabled={episodes.length<2} aria-label={`Өмнөх ${title}`}>←</button><span>{selected+1} / {episodes.length}</span><button type="button" onClick={() => move(1)} disabled={episodes.length<2} aria-label={`Дараах ${title}`}>→</button></div>}</div>
    {!episode ? <p className="media-empty">{title} бичлэг удахгүй нэмэгдэнэ.</p> : <>
      <div className="episode-feature">
        <div className="episode-player">{playing && embed ? embed.type === "iframe" ? <iframe key={episode.id} src={embed.src} title={episode.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video key={episode.id} src={embed.src} controls autoPlay playsInline /> : <button type="button" aria-label={`${episode.title} — тоглуулах`} onClick={() => setPlaying(true)}><Image src={episode.poster} alt="" fill sizes="(max-width:767px) 100vw, 60vw" unoptimized={!episode.poster.startsWith("/")} /><span className="episode-play" aria-hidden>▶</span></button>}</div>
        <div className="episode-feature-copy"><p className="discovery-kicker">{title} · {String(selected+1).padStart(2,"0")}</p><h4>{episode.title}</h4><button type="button" className="btn btn-primary" onClick={() => setPlaying(!playing)}>{playing ? "Тоглуулагчийг хаах" : "Энд үзэх"}</button><a href={episode.url} target="_blank" rel="noopener noreferrer">Дэлгэрэнгүй →</a></div>
      </div>
      <div ref={rail} className="episode-rail" aria-label={`${title} дугаарууд`}>{episodes.map((e,i) => <button type="button" key={e.id} className="episode-card" aria-pressed={selected===i} onClick={() => select(i)}><div className="episode-thumb"><Image src={e.poster} alt="" fill sizes="260px" unoptimized={!e.poster.startsWith("/")} /><span aria-hidden>▶</span></div><span className="episode-number">{title} · {String(i+1).padStart(2,"0")}</span><span className="episode-name">{e.title}</span><span className="episode-more">Сонгож үзэх →</span></button>)}</div>
    </>}
  </section>;
}
