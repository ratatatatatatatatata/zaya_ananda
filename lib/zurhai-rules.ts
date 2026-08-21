"use client";

import { useEffect, useState } from "react";

export type ZurhaiRule = { key: string; text: string };

const ELEMENT_KEY: Record<string, string> = {
  "Гал": "fire", "Шороо": "earth", "Агаар": "air", "Ус": "water",
};
const WEEKDAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Админаас бичсэн тайллын дүрмүүд */
export function useZurhaiRules(): Map<string, string> {
  const [map, setMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const list: ZurhaiRule[] = d?.settings?.zurhaiRules;
        if (!Array.isArray(list)) return;
        const m = new Map<string, string>();
        for (const r of list) if (r?.key && r?.text) m.set(r.key.trim().toLowerCase(), r.text);
        setMap(m);
      })
      .catch(() => {});
  }, []);

  return map;
}

/** Тухайн тайлалд тохирох гар бичвэрийг олно (эрэмбэ: орд → махбод → амьдралын зам → аркан → гараг). */
export function matchRule(
  rules: Map<string, string>,
  ctx: { zodiacKey?: string; element?: string; lifePath?: number; arcana?: number; date?: Date },
): string | null {
  if (rules.size === 0) return null;
  const tries: string[] = [];
  if (ctx.zodiacKey) tries.push("zodiac:" + ctx.zodiacKey);
  if (ctx.element) tries.push("element:" + (ELEMENT_KEY[ctx.element] || ctx.element.toLowerCase()));
  if (typeof ctx.lifePath === "number") tries.push("life:" + ctx.lifePath);
  if (typeof ctx.arcana === "number") tries.push("arcana:" + ctx.arcana);
  if (ctx.date) tries.push("day:" + WEEKDAY[ctx.date.getDay()]);

  for (const k of tries) {
    const hit = rules.get(k.toLowerCase());
    if (hit) return hit;
  }
  return null;
}
