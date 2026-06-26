import type { ReactNode } from "react";
import { cx } from "@/lib/format";

export function Stars({ rating = 5, className }: { rating?: number; className?: string }) {
  return (
    <div className={cx("inline-flex gap-0.5 text-accent-500", className)} aria-label={rating + " / 5"}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="h-px w-6 bg-primary-400" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  center = false,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cx(center && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-balance text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
      {desc && <p className="mt-4 leading-relaxed text-muted">{desc}</p>}
    </div>
  );
}
