"use client";

import { useI18n } from "@/lib/i18n";
import type { LA } from "@/lib/types";
import { cx } from "@/lib/format";

export function LocalizedList({
  items,
  variant = "check",
  accent = "primary",
}: {
  items: LA;
  variant?: "check" | "cards";
  accent?: "primary" | "jade";
}) {
  const { lang } = useI18n();
  const arr = items[lang] ?? items.mn;
  const badge = accent === "jade" ? "bg-jade-400/10 text-jade-600" : "bg-primary-50 text-primary-700";

  if (variant === "cards") {
    return (
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {arr.map((o) => (
          <li key={o} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
            <span className={cx("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm", badge)}>✓</span>
            <span className="text-sm text-ink/80">{o}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="mt-5 space-y-3">
      {arr.map((h) => (
        <li key={h} className="flex items-start gap-3">
          <span className={cx("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm", badge)}>✓</span>
          <span className="text-ink/80">{h}</span>
        </li>
      ))}
    </ul>
  );
}
