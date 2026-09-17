"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type CSSProperties } from "react";
import styles from "./TeamGallery.module.css";

type Member = { name: string; image?: string; role?: ReactNode; info?: ReactNode; focus?: number };

function MemberCard({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const card = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<CSSProperties>({});
  const show = () => {
    const rect = card.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(640, window.innerWidth - 32);
    const height = Math.min(member.info ? 480 : Math.max(280, rect.height + 64), window.innerHeight - 120);
    setPosition({ width, height, left: Math.max(16, Math.min(rect.left - (width - rect.width) / 2, window.innerWidth - width - 16)), top: Math.max(88, Math.min(rect.top - 32, window.innerHeight - height - 16)) });
    setOpen(true);
  };
  const dismiss = () => {
    setOpen(false);
    card.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);
  const portrait = member.image
    ? <img src={member.image} alt="" loading="lazy" className={styles.photo} style={{ objectPosition: `50% ${member.focus ?? 50}%` }} />
    : <span className={styles.placeholder} aria-hidden="true">{member.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</span>;
  return <article ref={card} className={styles.card} data-open={open}
    onPointerEnter={event => { if (event.pointerType === "mouse") show(); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); dismiss(); } }}>
    <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={id}
      aria-label={`${member.name} — танилцуулга`}
      onClick={() => open ? setOpen(false) : show()}>
      {portrait}
      <span className={styles.caption}><strong>{member.name}</strong>{member.role && <span>{member.role}</span>}</span>
      <span className={styles.indicator} aria-hidden="true">+</span>
    </button>
    <div id={id} className={styles.details} hidden={!open} style={open ? position : undefined}>
      <div className={styles.heading}>
        {portrait}
        <div><h4>{member.name}</h4>{member.role && <p className={styles.role}>{member.role}</p>}</div>
        <button type="button" className={styles.close} onClick={dismiss} aria-label="Танилцуулгыг хаах">×</button>
      </div>
      {member.info && <div className={styles.bio} tabIndex={0}>{member.info}</div>}
    </div>
  </article>;
}

export function TeamGallery({ members }: { members: Member[] }) {
  return <div className={styles.grid} aria-label="Багш, хамт олны танилцуулга">
    {members.map(member => <MemberCard key={member.name} member={member} />)}
  </div>;
}
