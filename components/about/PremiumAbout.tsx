"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { AboutSphereHero } from "@/components/three/AboutSphereHero";
import { Pentagon } from "./AboutNavigation";
import styles from "./PremiumAbout.module.css";

type Member = { name: string; image?: string; role?: ReactNode; info?: ReactNode; focus?: number };
type Props = {
  intro: ReactNode; mission: ReactNode; storyIntro: ReactNode;
  story: { year: string; text: ReactNode }[]; sample: boolean;
  members: Member[]; sampleMembers: boolean;
  programs: { title: ReactNode; text: ReactNode }[];
  partners: { name: string; logo: string }[];
  phone: string; email: string; address: ReactNode; hours: ReactNode; mapQuery: string;
  media?: ReactNode; extra?: ReactNode; contactForm?: ReactNode;
};

function SymbolIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth=".8" aria-hidden="true">
    {index % 4 === 0 ? <><circle cx="32" cy="32" r="22"/><ellipse cx="32" cy="32" rx="10" ry="22"/><path d="M10 32h44M32 10v44"/></> : index % 4 === 1 ? <><path d="m32 6 23 13v26L32 58 9 45V19ZM9 19l23 13 23-13M32 32v26M32 6v26L9 45m23-13 23 13"/></> : index % 4 === 2 ? <>{[0,60,120].map(a => <ellipse key={a} cx="32" cy="32" rx="25" ry="10" transform={`rotate(${a} 32 32)`}/>)}<circle cx="32" cy="32" r="3"/></> : <>{[14,23,32].map((x,i)=><circle key={x} cx={x+8} cy={32-i*5} r="17"/>)}</>}
  </svg>;
}

// Shared passive scroll listener; lightweight mode never hides any content.
function useScrollScene(ref: React.RefObject<HTMLElement>, count: number) {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const desktop = matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const enabled = desktop.matches && !reduced.matches && (navigator.hardwareConcurrency || 8) > 4;
      setPinned(enabled);
      const box = el.getBoundingClientRect();
      const p = enabled ? Math.max(0, Math.min(1, (90 - box.top) / Math.max(1, box.height - innerHeight + 90))) : 0;
      el.style.setProperty("--progress", String(p));
      const track = el.querySelector<HTMLElement>("[data-track]");
      const viewport = el.querySelector<HTMLElement>("[data-viewport]");
      if (track && viewport) track.style.transform = enabled ? `translate3d(${-p * Math.max(0, track.scrollWidth - viewport.clientWidth)}px,0,0)` : "none";
      setActive(Math.min(count - 1, Math.floor(p * count)));
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule); reduced.addEventListener("change", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); desktop.removeEventListener("change", schedule); reduced.removeEventListener("change", schedule); };
  }, [ref, count]);
  return { active, pinned };
}

function Story({ items, sample }: { items: Props["story"]; sample: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { active, pinned } = useScrollScene(ref, items.length);
  const select = (i: number) => {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + scrollY;
    const distance = ref.current.offsetHeight - innerHeight + 90;
    window.scrollTo({ top: top - 90 + distance * ((i + .1) / items.length), behavior: "auto" });
  };
  return <section id="our-story" ref={ref} className={`${styles.story} ${pinned ? styles.storyPinned : ""}`} style={{ "--steps": items.length } as CSSProperties}>
    <div className={styles.storyStage}>
      <div className={styles.storyHeading}><p className={styles.label}>01 / OUR STORY</p><h2>Манай түүх.</h2>{sample && <p className={styles.sample}>Жишиг он дараалал · Бодит мэдээллээр шинэчилнэ</p>}</div>
      {pinned ? <div className={styles.timeline}>
        <div className={styles.yearWindow}><div className={styles.yearTrack} style={{ transform: `translateY(${120 - active * 140}px)` }}>{items.map((m,i)=><button key={`${m.year}-${i}`} onClick={() => select(i)} aria-label={`${m.year} оны түүх`} aria-current={i === active ? "step" : undefined} className={i === active ? styles.activeYear : ""}>{m.year}</button>)}</div></div>
        <div className={styles.storyText} key={active}><span className={styles.label}>ZAYA’S ANANDA / {items[active]?.year}</span><p>{items[active]?.text}</p><small>{String(active + 1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</small></div>
      </div> : <div className={styles.storyList}>{items.map((m,i)=><article key={i}><strong>{m.year}</strong><p>{m.text}</p></article>)}</div>}
    </div>
  </section>;
}

function Team({ members, sample }: { members: Member[]; sample: boolean }) {
  const [selected, setSelected] = useState<Member | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return <section id="our-team" className={styles.team}>
    <div className={styles.container}><p className={styles.label}>02 / OUR PEOPLE</p><h2 className={styles.statement}>Хүн бүрийн дотор<br/>нээх ертөнц бий.<br/><span>Хамтдаа нээцгээе.</span></h2><p className={styles.sectionIntro}>Таны өөрийгөө таних, суралцах аялалд хамт байх хүмүүс.</p>{sample && <p className={styles.sample}>Жишиг багийн картууд · Бодит гишүүдийг админаас нэмнэ</p>}
      <div className={styles.teamTrack} aria-label="Хамт олон">{members.map((m,i)=><button key={`${m.name}-${i}`} className={styles.teamCard} aria-haspopup="dialog" onClick={e => { trigger.current = e.currentTarget; setSelected(m); dialog.current?.showModal(); }}>
        <div className={styles.portrait} style={{ "--portrait-hue": `${190+i*28}` } as CSSProperties}>{m.image ? <Image src={m.image} unoptimized fill sizes="(max-width: 768px) 76vw, 300px" alt={m.name} style={{objectFit:"cover",objectPosition:`50% ${m.focus ?? 50}%`}}/> : <><svg viewBox="0 0 300 400" aria-hidden="true"><circle cx={150+(i%2?10:-10)} cy="145" r="52"/><path d="M40 400v-48c0-87 42-139 110-139s110 52 110 139v48"/></svg><span>ЗУРАГ НЭМЭГДЭНЭ</span></>}<span className={styles.cardArrow}>↗</span></div><h3>{m.name}</h3><p>{m.role}</p>
      </button>)}</div>
    </div>
    <dialog ref={dialog} className={styles.bioDialog} aria-labelledby="about-bio-name" onClose={() => trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
      <button autoFocus className={styles.close} aria-label="Намтар хаах" onClick={()=>dialog.current?.close()}>✕</button>
      {selected && <div className={styles.bioBody}><p className={styles.label}>OUR PEOPLE / ХАМТ ОЛОН</p><h2 id="about-bio-name">{selected.name}</h2><p className={styles.bioRole}>{selected.role}</p><div className={styles.bioInfo}>{selected.info || "Дэлгэрэнгүй танилцуулга удахгүй нэмэгдэнэ."}</div></div>}
    </dialog>
  </section>;
}

function Programs({ items }: { items: Props["programs"] }) {
  const ref = useRef<HTMLElement>(null);
  const { pinned } = useScrollScene(ref, items.length);
  return <section id="our-program" ref={ref} className={`${styles.program} ${pinned ? styles.programPinned : ""}`} style={{"--steps": items.length} as CSSProperties}><div className={styles.programStage}>
    <div className={styles.container}><p className={styles.label}>03 / OUR APPROACH</p><h2>Өөрөөсөө эхлэх<br/><span>өөрчлөлтийн зам.</span></h2></div>
    <div data-viewport className={styles.programViewport}><div data-track className={styles.programTrack}>{items.map((m,i)=><article key={i} className={styles.programCard}><span className={styles.programNumber}>{String(i+1).padStart(2,"0")}</span><SymbolIcon index={i}/><h3>{m.title}</h3><p>{m.text}</p></article>)}</div></div>
    <div className={styles.container}><div className={styles.progress}><span/></div><div className={styles.progressCaption}><span>ӨӨРИЙН ХЭМНЭЛЭЭР</span><span>ХАМТДАА УРАГШ</span></div></div>
  </div></section>;
}

export function PremiumAbout(p: Props) {
  return <div className={styles.page} data-premium-about>
    <section className={styles.hero} aria-labelledby="about-title"><div className={`${styles.container} ${styles.heroGrid}`}>
      <div className={styles.heroCopy}><p className={styles.label}><span className={styles.smallDot}/> A SPACE TO RECONNECT</p><h1 id="about-title">Бидний<br/>тухай<span className={styles.titleDot}>.</span></h1><div className={styles.heroIntro}>{p.intro}</div><a className={styles.scrollLink} href="#our-story" aria-label="Манай түүх рүү гүйлгэх"><Pentagon arrow/><span>БИДНИЙГ ТАНИАРАЙ</span></a></div>
      <div className={styles.sculpture} aria-hidden="true"><AboutSphereHero/><span className={styles.sculptureNote}>BALANCE, FROM WITHIN.</span></div>
    </div><div className={`${styles.container} ${styles.heroFoot}`}><span>ZAYA’S ANANDA</span><span>УХАМСАР / ТЭНЦВЭР / ХӨГЖИЛ</span><span>ULAANBAATAR, MN</span></div></section>
    <section className={`${styles.container} ${styles.mission}`}><p className={styles.label}>БИДНИЙ ЗОРИЛГО</p><div><h2>Дотоод ертөнцтэйгөө<br/><span>дахин холбогдох орон зай.</span></h2><p>{p.mission}</p><p>{p.storyIntro}</p>{p.media}</div></section>
    <Story items={p.story} sample={p.sample}/>
    <div className={styles.dark}><Team members={p.members} sample={p.sampleMembers}/><Programs items={p.programs}/>
      <section id="our-partners" className={`${styles.container} ${styles.partners}`}><p className={styles.label}>04 / CONNECTIONS</p><h2>Хамтын оролцоо.<br/><span>Нэгэн чиглэл.</span></h2><p className={styles.sectionIntro}>Дэмжлэг, хамтын ажиллагааны мэдээлэл.</p><div className={styles.partnerGrid}>{p.partners.length ? p.partners.map((partner,i)=><div className={styles.partnerPanel} key={i}>{partner.logo ? <Image src={partner.logo} alt={partner.name} unoptimized width={200} height={70} style={{objectFit:"contain",maxHeight:70}}/> : <span>{partner.name}</span>}</div>) : [1,2,3].map(i=><div className={styles.partnerPanel} key={i}><SymbolIcon index={i}/><span>ЛОГО БАЙРШУУЛАХ ХЭСЭГ</span><small>Жишиг {String(i).padStart(2,"0")} · Түншлэл зарлаагүй</small></div>)}</div>{p.extra}</section>
      <footer id="contact" className={`${styles.container} ${styles.contact}`}><p className={styles.label}>05 / LET’S CONNECT</p><div className={styles.contactHeading}><h2>Ярилцъя<span>.</span></h2><a className={styles.contactArrow} href={`mailto:${p.email}`} aria-label="Имэйл илгээх">↗</a></div><div className={styles.contactGrid}><a href={`mailto:${p.email}`}>{p.email}</a><a href={`tel:${p.phone.replace(/[^+\d]/g,"")}`}>{p.phone}</a><a href={`https://www.google.com/maps?q=${encodeURIComponent(p.mapQuery)}`} target="_blank" rel="noreferrer">{p.address} ↗</a><p>{p.hours}</p></div>{p.contactForm}<div className={styles.footerLine}><span>Zaya’s Ananda</span><span>ӨӨРИЙГӨӨ ТАНИХ АЯЛАЛ</span><a href="#about-title">Дээш буцах ↑</a></div></footer>
    </div>
  </div>;
}
