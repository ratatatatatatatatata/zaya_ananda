"use client";

import { useEffect, useState } from "react";
import { MOODS } from "@/data/cms-taxonomy";
import type { Locale } from "@/lib/types";

export type MoodOption = { key: string; emoji: string; label: Record<Locale, string> };

/** Өгөгдмөл мэдрэмжүүд дээр админаас нэмсэн мэдрэмжүүдийг нийлүүлнэ. */
export function useMoods(): MoodOption[] {
  const [extra, setExtra] = useState<MoodOption[]>([]);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const list = d?.settings?.customMoods;
        if (!Array.isArray(list)) return;
        setExtra(
          list
            .filter((m: { key?: string; label?: string }) => m?.key && m?.label)
            .map((m: { key: string; emoji?: string; label: string }) => ({
              key: m.key,
              emoji: m.emoji || "✨",
              label: { mn: m.label, en: m.label, ko: m.label, ja: m.label, zh: m.label },
            })),
        );
      })
      .catch(() => {});
  }, []);

  return [...MOODS, ...extra.filter((e) => !MOODS.some((m) => m.key === e.key))];
}
