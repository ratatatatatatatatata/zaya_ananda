"use client";

import Link from "next/link";
import { useRef } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { aboutLinks } from "@/data/about-editorial";
import styles from "./PremiumAbout.module.css";

export function Pentagon({ arrow = false }: { arrow?: boolean }) {
  return <svg viewBox="0 0 56 56" fill="none" aria-hidden="true"><path d="M28 3 52 21 43 50H13L4 21Z" stroke="currentColor" />{arrow ? <path d="M28 17v22m-7-7 7 7 7-7" stroke="currentColor" /> : [20,28,36].flatMap(x => [20,28,36].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="currentColor" />))}</svg>;
}

export function AboutNavigation({ logo }: { logo?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => dialog.current?.close();
  return <>
    <header className={styles.navigation}>
      <Link href="/" aria-label="Zaya's Ananda — Нүүр хуудас" className={styles.brand}><Logo logoSrc={logo} withText={false} /><span>Zaya’s Ananda<small>CENTER FOR SELF-DISCOVERY</small></span></Link>
      <button ref={trigger} type="button" aria-haspopup="dialog" aria-label="Цэс нээх" onClick={() => dialog.current?.showModal()} className={styles.menuTrigger}><span>Menu</span><Pentagon /></button>
    </header>
    <dialog ref={dialog} className={styles.menuDialog} aria-labelledby="about-menu-title" onClose={() => trigger.current?.focus()} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className={styles.menuInner}>
        <div className={styles.menuTop}><p id="about-menu-title" className={styles.label}>ZAYA’S ANANDA / ЦЭС</p><button autoFocus type="button" onClick={close} aria-label="Цэс хаах" className={styles.close}>✕</button></div>
        <nav aria-label="Бидний тухай хэсгүүд">{aboutLinks.map((link, i) => <a key={link.id} href={`#${link.id}`} onClick={close}><small>0{i + 1}</small>{link.label}<span>↗</span></a>)}</nav>
        <div className={styles.menuBottom}><Link href="/" onClick={close}>Нүүр хуудас ↗</Link><Link href="/courses" onClick={close}>Сургалтууд ↗</Link><Link href="/account" onClick={close}>Хувийн булан ↗</Link><LanguageSwitcher /></div>
      </div>
    </dialog>
  </>;
}
