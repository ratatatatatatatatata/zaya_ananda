"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./TeamGallery.module.css";

type Member = { name: string; image?: string; role?: ReactNode; info?: ReactNode; focus?: number };

function MemberCard({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <article className={styles.card} data-open={open}
    onPointerEnter={event => { if (event.pointerType === "mouse") setOpen(true); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); } }}>
    {member.image
      ? <img src={member.image} alt="" loading="lazy" className={styles.photo} style={{ objectPosition: `50% ${member.focus ?? 50}%` }} />
      : <div className={styles.placeholder} aria-hidden="true">{member.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</div>}
    <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={id}
      aria-label={`${member.name} — танилцуулга`}
      onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setOpen(true); }}
      onClick={() => setOpen(value => !value)}>
      <span className={styles.caption}><strong>{member.name}</strong>{member.role && <span>{member.role}</span>}</span>
      <span className={styles.indicator} aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    <div id={id} className={styles.details} hidden={!open}>
      <h4>{member.name}</h4>
      {member.role && <p className={styles.role}>{member.role}</p>}
      {member.info && <div className={styles.bio} tabIndex={0}>{member.info}</div>}
    </div>
  </article>;
}

export function TeamGallery({ members }: { members: Member[] }) {
  return <div className={styles.grid} aria-label="Багш, хамт олны танилцуулга">
    {members.map(member => <MemberCard key={member.name} member={member} />)}
  </div>;
}
