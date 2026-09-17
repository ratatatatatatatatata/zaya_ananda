"use client";

import Image from "next/image";
import { Logo } from "@/components/Logo";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Pentagon } from "./AboutNavigation";
import styles from "./PremiumAbout.module.css";

type Member = { name: string; image?: string; role?: ReactNode; info?: ReactNode; focus?: number };
type Props = {
  intro: ReactNode; mission: ReactNode; storyIntro: ReactNode;
  logo?: string;
  story: { year: string; text: ReactNode }[]; sample: boolean;
  members: Member[]; sampleMembers: boolean;
  programs: { title: ReactNode; text: ReactNode }[];
  partners: { name: string; logo: string }[];
  media?: ReactNode; extra?: ReactNode;
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
  return <section id="our-team" className={styles.team}>
    <div className={styles.container}>
      <p className={styles.label}>02 / OUR PEOPLE</p>
      <h2 className={styles.teamTitle}>Багш, хамт олон</h2>
      <p className={styles.sectionIntro}>Таны өөрийгөө таних, суралцах аялалд хамт байх хүмүүс.</p>
      {sample && <p className={styles.sample}>Жишиг багийн картууд · Бодит гишүүдийг админаас нэмнэ</p>}
      <div className={styles.teamGrid} aria-label="Багш, хамт олны танилцуулга">
        {members.map((member, i) => <article key={`${member.name}-${i}`} className={styles.memberCard}>
          <div className={styles.memberHeading}>
            <div className={styles.memberAvatar}>
              {member.image ? <Image src={member.image} unoptimized fill sizes="80px" alt={member.name} style={{objectFit:"cover", objectPosition:`50% ${member.focus ?? 50}%`}} />
                : <span aria-hidden="true">{member.name.trim().split(/\s+/).map(part => part[0]).slice(0,2).join("")}</span>}
            </div>
            <div><h3>{member.name}</h3>{member.role && <p className={styles.memberRole}>{member.role}</p>}</div>
          </div>
          {member.info && <div className={styles.memberInfo}>{member.info}</div>}
        </article>)}
      </div>
    </div>
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
      <div className={styles.heroLogo}><Logo withText={false} logoSrc={p.logo} /></div>
    </div><div className={`${styles.container} ${styles.heroFoot}`}><span>ZAYA’S ANANDA</span><span>УХАМСАР / ТЭНЦВЭР / ХӨГЖИЛ</span><span>ULAANBAATAR, MN</span></div></section>
    <section className={`${styles.container} ${styles.mission}`}><p className={styles.label}>БИДНИЙ ЗОРИЛГО</p><div><h2>Дотоод ертөнцтэйгөө<br/><span>дахин холбогдох орон зай.</span></h2><p>{p.mission}</p><p>{p.storyIntro}</p>{p.media}</div></section>
    <Story items={p.story} sample={p.sample}/>
    <div className={styles.dark}><Team members={p.members} sample={p.sampleMembers}/><Programs items={p.programs}/>
      <section id="our-partners" className={`${styles.container} ${styles.partners}`}><p className={styles.label}>04 / CONNECTIONS</p><h2>Хамтын оролцоо.<br/><span>Нэгэн чиглэл.</span></h2><p className={styles.sectionIntro}>Дэмжлэг, хамтын ажиллагааны мэдээлэл.</p><div className={styles.partnerGrid}>{p.partners.length ? p.partners.map((partner,i)=><div className={styles.partnerPanel} key={i}>{partner.logo ? <Image src={partner.logo} alt={partner.name} unoptimized width={200} height={70} style={{objectFit:"contain",maxHeight:70}}/> : <span>{partner.name}</span>}</div>) : [1,2,3].map(i=><div className={styles.partnerPanel} key={i}><SymbolIcon index={i}/><span>ЛОГО БАЙРШУУЛАХ ХЭСЭГ</span><small>Жишиг {String(i).padStart(2,"0")} · Түншлэл зарлаагүй</small></div>)}</div>{p.extra}</section>
    </div>
  </div>;
}
