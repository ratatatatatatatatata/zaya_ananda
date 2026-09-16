"use client";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { collectPublicMedia, type PublicEpisode } from "@/lib/public-media";
import { embedSrc } from "@/lib/video-embed";
import type { CmsItem } from "@/lib/types";

const MEDIA_TABS = [
  { id:"podcasts", title:"Podcast", kind:"podcast" },
  { id:"reels", title:"Reel", kind:"reel" },
] as const;

export function MediaLibrary({items}:{items:CmsItem[]}) {
  const episodes=collectPublicMedia(items);
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabId = useId();

  useEffect(() => {
    const fromHash = () => {
      const next = MEDIA_TABS.findIndex(tab => `#${tab.id}` === window.location.hash);
      if (next >= 0) setSelected(next);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return <div className="media-library">
    <div className="mx-auto mb-8 flex w-full max-w-2xl flex-wrap justify-center gap-2" role="tablist" aria-label="Гэгээн бэлгийн бичлэгийн төрөл">
      {MEDIA_TABS.map((tab, index) => <button key={tab.id} type="button" role="tab"
        id={`${tabId}-${tab.id}-tab`} aria-controls={`${tabId}-${tab.id}-panel`} aria-selected={selected === index}
        tabIndex={selected === index ? 0 : -1} ref={el => { tabRefs.current[index] = el; }}
        onClick={() => setSelected(index)} onKeyDown={event => {
          let next = index;
          if(event.key === "ArrowRight" || event.key === "ArrowLeft") next = (index + 1) % MEDIA_TABS.length;
          else if(event.key === "Home") next = 0;
          else if(event.key === "End") next = MEDIA_TABS.length - 1;
          else return;
          event.preventDefault(); setSelected(next); tabRefs.current[next]?.focus();
        }}
        className={`focus-ring inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-2.5 text-[1rem] font-semibold transition ${selected === index ? "bg-primary-grad text-white shadow-glow" : "border border-line bg-surface-1 text-ink/70 hover:border-primary-400 hover:text-primary-700"}`}>
        {tab.title}
      </button>)}
    </div>
    {MEDIA_TABS.map((tab, index) => <div key={tab.id} role="tabpanel" hidden={selected !== index} id={`${tabId}-${tab.id}-panel`} aria-labelledby={`${tabId}-${tab.id}-tab`} tabIndex={0}>
      {selected === index ? <EpisodeShelf title={tab.title} id={tab.id} episodes={episodes.filter(episode => episode.kind === tab.kind)} /> : null}
    </div>)}
  </div>;
}

function MediaArtwork({src,sizes}:{src:string;sizes:string}) {
  const [failed,setFailed]=useState(false);
  const source=failed ? "/video/temple.jpg" : src;
  return <Image src={source} alt="" fill sizes={sizes} unoptimized={!source.startsWith("/")} onError={() => setFailed(true)}/>;
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
        <div className="episode-player">{playing && embed ? embed.type === "iframe" ? <iframe key={episode.id} src={embed.src} title={episode.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video key={episode.id} src={embed.src} controls autoPlay playsInline /> : <button type="button" aria-label={`${episode.title} — тоглуулах`} onClick={() => setPlaying(true)}><MediaArtwork key={episode.poster} src={episode.poster} sizes="(max-width:767px) 100vw, 60vw"/><span className="episode-play" aria-hidden>▶</span></button>}</div>
        <div className="episode-feature-copy"><p className="discovery-kicker">{title} · {String(selected+1).padStart(2,"0")}</p><h4>{episode.title}</h4><button type="button" className="btn btn-primary" onClick={() => setPlaying(!playing)}>{playing ? "Тоглуулагчийг хаах" : "Энд үзэх"}</button><a href={episode.url} target="_blank" rel="noopener noreferrer">Дэлгэрэнгүй →</a></div>
      </div>
      <div ref={rail} className="episode-rail" aria-label={`${title} дугаарууд`}>{episodes.map((e,i) => <button type="button" key={e.id} className="episode-card" aria-pressed={selected===i} onClick={() => select(i)}><div className="episode-thumb"><MediaArtwork key={e.poster} src={e.poster} sizes="260px"/><span aria-hidden>▶</span></div><span className="episode-number">{title} · {String(i+1).padStart(2,"0")}</span><span className="episode-name">{e.title}</span><span className="episode-more">Сонгож үзэх →</span></button>)}</div>
    </>}
  </section>;
}
