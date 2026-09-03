"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { COURSE_LEVELS } from "@/data/cms-taxonomy";
import { TiltCard } from "@/components/motion/TiltCard";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const EMPTY = Lx(
  "Энэ түвшинд хичээл удахгүй нэмэгдэнэ.",
  "Lessons for this level are coming soon.",
  "이 단계의 강좌는 곧 추가됩니다.",
  "この段階の講座は近日追加されます。",
  "该层级的课程即将上线。",
);
const OPEN = Lx("Үзэх", "Open", "보기", "見る", "查看");

const DESC: Record<string, Record<Locale, string>> = {
  anhan: Lx(
    "Амьсгал, сууц, анхаарлаа барих үндэс. Өдөрт 10 минутаас эхэлнэ.",
    "Breath, posture and holding attention. Start with ten minutes a day.",
    "호흡·자세·집중의 기초. 하루 10분부터.",
    "呼吸・姿勢・集中の基礎。1日10分から。",
    "呼吸、坐姿与专注的基础。每天十分钟起步。",
  ),
  dund: Lx(
    "Тогтмол дадал, сэтгэл хөдлөлөө ажиглах, энергийн цэвэрлэгээний үндсэн арга.",
    "A steady habit, observing emotion, and the basics of energy clearing.",
    "꾸준한 습관, 감정 관찰, 에너지 정화의 기초.",
    "習慣化、感情の観察、エネルギー浄化の基本。",
    "稳定习惯、观察情绪与能量清理基础。",
  ),
  gunzgii: Lx(
    "Гүн бясалгал, зан үйл, өөрийн хэв маягийг таних урт хугацааны ажил.",
    "Deep meditation, ritual, and the long work of seeing your own patterns.",
    "깊은 명상과 의식, 자신의 패턴을 보는 장기 수련.",
    "深い瞑想と儀式、自分のパターンを見る長期の取り組み。",
    "深层冥想、仪式与看清自身模式的长期功课。",
  ),
  master: Lx(
    "Бусдыг чиглүүлэх, зан үйл удирдах, багшийн замд бэлтгэх түвшин.",
    "Guiding others, leading ritual, and preparing for the teacher's path.",
    "타인을 이끌고 의식을 진행하며 스승의 길을 준비하는 단계.",
    "他者を導き、儀式を主宰し、師の道へ備える段階。",
    "引导他人、主持仪式并为成为导师做准备。",
  ),
};

export type LevelCourse = { id: string; title: string; summary: string; image: string; level: string };

/** Дөрвөн түвшин — товч дарахад тухайн түвшний хичээлүүд байрандаа нээгдэнэ. */
export function LevelCourses({ courses }: { courses: LevelCourse[] }) {
  const { tr, lang } = useI18n();
  const [open, setOpen] = useState<string | null>(null);

  const byLevel = useMemo(() => {
    const m: Record<string, LevelCourse[]> = {};
    for (const l of COURSE_LEVELS) m[l.key] = [];
    for (const c of courses) (m[c.level] ||= []).push(c);
    return m;
  }, [courses]);

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {COURSE_LEVELS.map((l, idx) => {
          const active = open === l.key;
          const n = byLevel[l.key]?.length ?? 0;
          return (
            <TiltCard key={l.key} max={8} className="h-full">
            <button
              type="button"
              onClick={() => setOpen(active ? null : l.key)}
              aria-expanded={active}
              style={{ transitionDelay: active ? "0ms" : idx * 40 + "ms" }}
              className={
                "glass-lux group relative flex h-full w-full flex-col p-7 text-left transition-transform duration-500 " +
                (active ? "ring-2 ring-primary-500 -translate-y-1.5" : "hover:-translate-y-1.5")
              }
            >
              <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-70 transition duration-700 group-hover:scale-110"
                style={{ background: "radial-gradient(circle, rgb(var(--c-p400) / 0.2), transparent 70%)", filter: "blur(6px)" }} />
              <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="pebble h-12 w-12 rounded-2xl text-2xl">{l.icon}</span>
                  <span className="font-display text-sm font-bold tracking-[0.2em] text-primary-700">{l.step}</span>
                  {n > 0 && <span className="ml-auto rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700">{n}</span>}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{l.label[lang]}</h3>
                <p className="mt-2.5 flex-1 text-[0.96rem] leading-relaxed text-muted">{DESC[l.key]?.[lang]}</p>
                <span className="mt-4 text-sm font-semibold text-primary-700">
                  {active ? "▲" : "▼"} {l.label[lang]}
                </span>
              </div>
            </button>
            </TiltCard>
          );
        })}
      </div>

      {/* Сонгосон түвшний хичээлүүд */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
        style={{ maxHeight: open ? "200rem" : 0, opacity: open ? 1 : 0 }}
      >
        <div className="origin-top pt-8 transition-transform duration-500" style={{ transform: open ? "scale(1)" : "scale(0.97)" }}>
          {open && (byLevel[open]?.length ?? 0) === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-surface-1 px-5 py-10 text-center text-muted">{tr(EMPTY)}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {open && byLevel[open].map((c) => (
                <TiltCard key={c.id} max={6} className="h-full">
                <Link href={"/item/" + c.id} className="glass-lux group flex h-full flex-col">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-t-[1.75rem] bg-surface-3">
                    {c.image
                      ? <img src={c.image} alt={c.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      : <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h4 className="font-display text-lg font-semibold text-ink">{c.title}</h4>
                    {c.summary && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.summary}</p>}
                    <span className="mt-4 text-sm font-semibold text-primary-700">{tr(OPEN)} →</span>
                  </div>
                </Link>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
