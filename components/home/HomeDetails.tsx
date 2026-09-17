"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/lib/i18n";
import { locText } from "@/lib/cms-i18n";
import type { CmsItem } from "@/lib/types";
import type { Journey } from "@/data/journeys";
import styles from "./HomeDetails.module.css";

const DetailContent = dynamic(() => import("./HomeDetailContent"), { loading: () => <p>Ачаалж байна…</p> });
const DetailsContext = createContext<((href: string) => boolean) | null>(null);
const categories: Record<string, { title: string; kind?: CmsItem["kind"] }> = {
  "/services": { title: "Энергийн засал", kind: "service" },
  "/courses": { title: "Ариусахуйн үйл", kind: "course" },
  "/shop": { title: "Энергийн хамгаалалт", kind: "product" },
  "/ayalal": { title: "Сүнслэг аялал" },
};

/** Normal links elsewhere; homepage content opens in the current page. */
export function HomeDetailLink({ href, onClick, ...props }: ComponentProps<"a"> & { href: string }) {
  const open = useContext(DetailsContext);
  return <Link {...props} href={href} onClick={event => {
    onClick?.(event);
    if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0 && open?.(href)) event.preventDefault();
  }} />;
}

export function HomeDetails({ items, journeys, children }: { items: CmsItem[]; journeys: Journey[]; children: ReactNode }) {
  const { lang } = useI18n();
  const [path, setPath] = useState<string | null>(null);
  const item = items.find(value => path === `/item/${value.id}`);
  const journey = journeys.find(value => path === `/ayalal/${encodeURIComponent(value.slug)}`);
  const category = path ? categories[path] : undefined;
  const title = (item ? locText(lang,item.title,item.i18n,"title") : "") || journey?.name || category?.title || "Дэлгэрэнгүй";
  const open = (href: string) => {
    if (categories[href] || items.some(value => href === `/item/${value.id}`) || journeys.some(value => href === `/ayalal/${encodeURIComponent(value.slug)}`)) {
      setPath(href); return true;
    }
    return false;
  };
  return <DetailsContext.Provider value={open}>
    {children}
    {path && <DetailDialog title={title} onClose={() => setPath(null)}>
      {category ? <div className={styles.list}>
        {category.kind ? items.filter(value => value.kind === category.kind).map(value => <button key={value.id} type="button" onClick={() => open(`/item/${value.id}`)}>
          {value.image && <img src={value.image} alt="" />}<span><strong>{locText(lang,value.title,value.i18n,"title")}</strong><span>{locText(lang,value.summary,value.i18n,"summary")}</span></span><span aria-hidden>→</span>
        </button>) : journeys.map(value => <button key={value.id} type="button" onClick={() => open(`/ayalal/${encodeURIComponent(value.slug)}`)}>
          {value.image && <img src={value.image} alt="" />}<span><strong>{value.name}</strong><span>{value.summary}</span></span><span aria-hidden>→</span>
        </button>)}
      </div> : <DetailContent key={path} item={item} journey={journey} />}
    </DetailDialog>}
  </DetailsContext.Provider>;
}

function DetailDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const position = { left: window.scrollX, top: window.scrollY, behavior: "instant" as ScrollBehavior };
    element?.showModal();
    document.body.style.overflow = "hidden";
    window.scrollTo(position);
    return () => { element?.close(); document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }); window.scrollTo(position); };
  }, []);
  useEffect(() => { if (dialog.current) dialog.current.scrollTop = 0; }, [title]);
  return createPortal(<dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className={styles.header}><h2 id={titleId}>{title}</h2><button type="button" autoFocus onClick={onClose} aria-label="Дэлгэрэнгүйг хаах">✕</button></header>
    <div className={styles.body}>{children}</div>
  </dialog>, document.body);
}
