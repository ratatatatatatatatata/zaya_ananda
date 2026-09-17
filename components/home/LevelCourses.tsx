"use client";

import { useId, useMemo, useRef, useState } from "react";
import { HomeDetailLink as Link } from "@/components/home/HomeDetails";
import { useI18n } from "@/lib/i18n";
import { COURSE_LEVELS } from "@/data/cms-taxonomy";
import { locText } from "@/lib/cms-i18n";
import { formatMNT } from "@/lib/format";
import styles from "./LevelCourses.module.css";
import type { CmsItem, Locale, TeacherPreset } from "@/lib/types";

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

export type LevelCourse = { id: string; title: string; summary: string; image: string; level: string; price?: number; teachers?: TeacherPreset[]; i18n?: CmsItem["i18n"] };

/** Дөрвөн түвшин — товч дарахад тухайн түвшний хичээлүүд байрандаа нээгдэнэ. */
export function LevelCourses({ courses }: { courses: LevelCourse[] }) {
  const { tr, tl, lang } = useI18n();
  const [open, setOpen] = useState<string | null>(null);
  const panelId = useId();
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  const byLevel = useMemo(() => {
    const m: Record<string, LevelCourse[]> = {};
    for (const l of COURSE_LEVELS) m[l.key] = [];
    for (const c of courses) (m[c.level] ||= []).push(c);
    return m;
  }, [courses]);

  const selected = COURSE_LEVELS.find(level => level.key === open);
  const selectedCourses = open ? byLevel[open] || [] : [];
  return <div>
    <div className={styles.levels}>
      {COURSE_LEVELS.map((level, index) => <button key={level.key} type="button"
        ref={element => { buttons.current[level.key] = element; }}
        className={styles.level} aria-expanded={open === level.key} aria-controls={panelId}
        onClick={() => setOpen(current => current === level.key ? null : level.key)}>
        <span className={styles.levelTop}><span>0{index + 1}</span><span className={styles.count}>{byLevel[level.key]?.length || 0}</span></span>
        <span className={styles.levelTitle}>{level.label[lang]}</span>
        <span className={styles.levelDesc}>{DESC[level.key]?.[lang]}</span>
        <span className={styles.levelAction}>{tr(OPEN)}<span aria-hidden>{open === level.key ? "−" : "+"}</span></span>
      </button>)}
    </div>
    <div id={panelId} hidden={!selected}>
      {selected && <section className={styles.panel} aria-label={selected.label[lang]}>
        <div className={styles.panelHeader}>
          <h3>{selected.label[lang]} <span className={styles.count}>{selectedCourses.length}</span></h3>
          <button type="button" className={styles.close} aria-label={tl("Дэлгэрэнгүйг хаах")} onClick={() => {
            buttons.current[selected.key]?.focus({ preventScroll: true }); setOpen(null);
          }}>✕</button>
        </div>
        {selectedCourses.length === 0 ? <p className={styles.empty}>{tr(EMPTY)}</p> : <div className={styles.courses}>
          {selectedCourses.map(course => <article key={course.id} className={styles.course}>
            <Link href={"/item/" + course.id} className={styles.courseLink}>
              <div className={styles.photo}>
                {course.image ? <img src={course.image} alt="" loading="lazy" /> : <span aria-hidden>✦</span>}
              </div>
              <div className={styles.courseInfo}>
                <h4>{locText(lang,course.title,course.i18n,"title")}</h4>
                {course.summary && <p className={styles.summary}>{locText(lang,course.summary,course.i18n,"summary")}</p>}
                {!!course.teachers?.length && <ul className={styles.teachers}>
                  {course.teachers.map(teacher => <li key={teacher.name}>
                    {teacher.image && <img src={teacher.image} alt="" loading="lazy" />}
                    <span>{teacher.name}</span>
                  </li>)}
                </ul>}
                <div className={styles.courseFooter}>
                  {typeof course.price === "number" && <strong>{formatMNT(course.price)}</strong>}
                  <span>{tl("Дэлгэрэнгүй үзэх")} <span aria-hidden>↗</span></span>
                </div>
              </div>
            </Link>
          </article>)}
        </div>}
      </section>}
    </div>
  </div>;
}
