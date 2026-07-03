"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CmsCard } from "@/components/CmsCard";
import { T } from "@/components/T";
import { MOODS } from "@/data/cms-taxonomy";
import { useI18n } from "@/lib/i18n";
import { cx } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string) => ({ mn, en, ko, ja, zh });
const ASK = Lx("Өнөөдөр таны сэтгэл ямар байна?", "How is your soul feeling today?", "오늘 마음이 어떠신가요?", "今日の心の調子はいかがですか？", "今天你的心情如何？");
const SUB = Lx("Сэтгэл санаагаа сонгоход бид танд тохирсон хичээл, зөвлөгөөг санал болгоно.", "Choose your mood and we'll suggest lessons that resonate with you.", "기분을 선택하면 어울리는 콘텐츠를 추천해 드립니다.", "気分を選ぶと、あなたに合うレッスンをご提案します。", "选择你的心情，我们将为你推荐合适的课程。") ;
const FOR_YOU = Lx("Танд зориулсан", "Recommended for you", "당신을 위한 추천", "あなたへのおすすめ", "为你推荐");
const NONE = Lx("Энэ мэдрэмжид тохирох контент одоогоор алга — гэхдээ доорх бүх хичээл таныг гэрэлтүүлэх болно.", "No content tagged for this mood yet — but all lessons below may light your way.", "이 무드에 맞는 콘텐츠가 아직 없어요 — 아래의 모든 레슨을 살펴보세요.", "このムードに合うコンテンツはまだありません — 以下のレッスンをご覧ください。", "暂无匹配此心情的内容——不妨看看下面的所有课程。");

export default function MoodPage() {
  const { lang, tr } = useI18n();
  const [items, setItems] = useState<CmsItem[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content?kinds=course,resource,free", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const matched = mood ? items.filter((i) => (i.moods || []).includes(mood)) : [];
  const shown = mood ? (matched.length > 0 ? matched : items) : [];

  return (
    <>
      <PageHeader title={<T k="nav.mood" />} crumb={<T k="nav.mood" />} />
      <section className="section"><div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{tr(ASK)}</h2>
          <p className="mt-2 text-muted">{tr(SUB)}</p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          {MOODS.map((m) => (
            <button key={m.key} onClick={() => setMood(m.key)}
              className={cx("rounded-full px-5 py-3 text-[1.02rem] font-semibold transition",
                mood === m.key ? "bg-primary-grad text-white shadow-glow scale-105" : "border border-line bg-white text-ink/75 hover:border-primary-300 hover:shadow-soft")}>
              <span className="mr-1.5 text-xl">{m.emoji}</span>{m.label[lang]}
            </button>
          ))}
        </div>

        {mood && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {MOODS.find((m) => m.key === mood)?.emoji} {tr(FOR_YOU)}
            </h3>
            {loading ? (
              <div className="flex justify-center py-10"><div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-primary-200 border-t-primary-600" /></div>
            ) : (
              <>
                {matched.length === 0 && <p className="mt-3 rounded-2xl bg-primary-50 px-5 py-4 text-muted">{tr(NONE)}</p>}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((i) => <CmsCard key={i.id} item={i} />)}
                </div>
              </>
            )}
          </div>
        )}
      </div></section>
    </>
  );
}
