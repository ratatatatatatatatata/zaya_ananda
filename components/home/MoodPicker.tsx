"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CmsCard } from "@/components/CmsCard";
import { useMoods } from "@/lib/moods";
import { useI18n } from "@/lib/i18n";
import { cx } from "@/lib/format";
import type { CmsItem, Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const FOR_YOU = Lx("Танд зориулсан", "Recommended for you", "당신을 위한 추천", "あなたへのおすすめ", "为你推荐");
const NONE = Lx(
  "Энэ мэдрэмжид тохирох контент одоогоор алга — доорх хичээлүүд ч танд тус болно.",
  "Nothing tagged for this mood yet — the lessons below may still help.",
  "이 기분에 맞는 콘텐츠는 아직 없어요 — 아래 강좌도 도움이 될 수 있습니다.",
  "この気分に合う内容はまだありません — 下の講座も役立つはずです。",
  "暂无匹配此心情的内容——下面的课程或许同样有帮助。",
);
const ALL = Lx("Бүх зөвлөмж үзэх", "See all suggestions", "모든 추천 보기", "すべての提案を見る", "查看全部推荐");

/** Нүүр хуудасны сэтгэлийн туяа — мэдрэмжүүд шууд харагдаж, сонгоход доор нь зөвлөмж гарна. */
export function MoodPicker() {
  const { lang, tr } = useI18n();
  const MOODS = useMoods();
  const [items, setItems] = useState<CmsItem[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mood || items.length > 0) return;
    setLoading(true);
    fetch("/api/content?kinds=course,resource,free", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mood, items.length]);

  const matched = mood ? items.filter((i) => (i.moods || []).includes(mood)) : [];
  const shown = mood ? (matched.length > 0 ? matched : items).slice(0, 6) : [];
  const active = MOODS.find((m) => m.key === mood);

  return (
    <div>
      {/* Мэдрэмжүүд — шууд харагдана */}
      <div className="flex flex-wrap gap-2.5">
        {MOODS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMood((v) => (v === m.key ? null : m.key))}
            aria-pressed={mood === m.key}
            className={cx(
              "focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.98rem] font-semibold transition",
              mood === m.key
                ? "scale-[1.03] bg-primary-grad text-white shadow-glow"
                : "border border-line bg-surface-1 text-ink/75 hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-700",
            )}
          >
            <span aria-hidden className="text-lg">{m.emoji}</span>
            {m.label[lang]}
          </button>
        ))}
      </div>

      {/* Сонголтын үр дүн */}
      {mood && (
        <div className="mt-8 animate-fade-rise">
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            {active?.emoji} {tr(FOR_YOU)}
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-primary-200 border-t-primary-600" />
            </div>
          ) : (
            <>
              {matched.length === 0 && items.length > 0 && (
                <p className="mt-3 rounded-2xl bg-primary-50 px-5 py-4 text-muted">{tr(NONE)}</p>
              )}
              {shown.length > 0 && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((i) => <CmsCard key={i.id} item={i} />)}
                </div>
              )}
              <div className="mt-7">
                <Link href="/mood" className="btn btn-outline btn-md">{tr(ALL)} →</Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
