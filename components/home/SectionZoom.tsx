"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const OPEN = Lx("Энд нээж үзэх", "Open here", "여기서 열기", "ここで開く", "在此展开");
const CLOSE = Lx("Хураах", "Collapse", "접기", "閉じる", "收起");
const FULL = Lx("Бүтэн хуудас", "Full page", "전체 페이지", "全ページ", "完整页面");

/** Нүүр хуудасны хэсэг — өөр хуудас руу шилжихгүй, байрандаа томорч нээгдэнэ. */
export function SectionZoom({
  eyebrow,
  title,
  desc,
  href,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  desc: ReactNode;
  href: string;
  children: ReactNode;
}) {
  const { tr } = useI18n();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    // Хаахад хэсгийн эхлэл рүү зөөлөн буцаана — хуудас үсрэхгүй
    if (!next) requestAnimationFrame(() => box.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div ref={box}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow-line"><span>{eyebrow}</span></p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
          <p className="mt-3 leading-relaxed text-muted">{desc}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className={open ? "btn btn-outline btn-md" : "btn btn-primary btn-md"}
          >
            {open ? tr(CLOSE) : tr(OPEN)}
            <span aria-hidden className={"ml-1.5 inline-block transition-transform " + (open ? "rotate-180" : "")}>⌄</span>
          </button>
          <Link href={href} className="text-sm font-semibold text-primary-700 hover:underline">{tr(FULL)} →</Link>
        </div>
      </div>

      <div aria-hidden className="khas-rule mt-6 opacity-70" />

      {/* Байрандаа томрох хэсэг */}
      <div
        className="relative overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
        style={{ maxHeight: open ? "460rem" : 0, opacity: open ? 1 : 0 }}
      >
        <div
          className="origin-top pt-8 transition-transform duration-500 ease-out"
          style={{ transform: open ? "scale(1)" : "scale(0.97)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
