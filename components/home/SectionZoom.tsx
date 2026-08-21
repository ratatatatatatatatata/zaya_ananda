import Link from "next/link";
import type { ReactNode } from "react";

/** Нүүр хуудасны хэсгийн толгой — агуулга нь доор шууд харагдана (задардаггүй). */
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
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow-line"><span>{eyebrow}</span></p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
          <p className="mt-3 leading-relaxed text-muted">{desc}</p>
        </div>
        <Link href={href} className="btn btn-primary btn-md shrink-0">Бүтэн хуудас →</Link>
      </div>

      <div aria-hidden className="khas-rule mt-6 opacity-70" />

      <div className="mt-8">{children}</div>
    </div>
  );
}
