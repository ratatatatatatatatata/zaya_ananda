import Link from "next/link";
import { Reveal } from "../Reveal";
import { Tr } from "../T";
import type { Locale } from "@/lib/types";
import { LevelCourses, type LevelCourse } from "./LevelCourses";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const C = {
  eyebrow: Lx("Ариусахуйн үйл", "The path of purification", "정화의 길", "浄化の道", "净化之道"),
  lead: Lx(
    "Сургалт маань дөрвөн түвшинтэй. Хаанаас ч эхэлж болно — түвшин бүр дараагийнхаа суурийг тавьж өгнө.",
    "Our training has four levels. You can start anywhere — each level lays the ground for the next.",
    "저희 교육은 네 단계로 이루어집니다. 어디서든 시작할 수 있으며, 각 단계가 다음 단계의 토대가 됩니다.",
    "講座は4つの段階に分かれています。どこからでも始められ、各段階が次の土台になります。",
    "我们的课程分为四个层级。你可以从任何一层开始——每一层都是下一层的基础。",
  ),

  travelTitle: Lx("Сүнслэг аялал", "Spiritual journey", "영적 여행", "スピリチュアルの旅", "心灵之旅"),
  travelText: Lx(
    "Монголын энергийн ариун газрууд руу бясалгал, зан үйлтэй хослуулсан цөөн хүнтэй аян. Багш, хөтөч аяллын турш тантай хамт.",
    "Small-group journeys to Mongolia's sacred energy sites, woven with meditation and ritual, with a teacher and guide alongside you.",
    "명상과 의식이 함께하는 소규모 몽골 성지 순례. 선생님과 가이드가 동행합니다.",
    "瞑想と儀式を織り込んだ少人数のモンゴル聖地の旅。講師とガイドが同行します。",
    "融合冥想与仪式的小团蒙古圣地之旅，导师与向导全程同行。",
  ),
  travelCta: Lx("Аяллын хөтөлбөр", "Journey programs", "여행 일정", "旅程を見る", "行程安排"),
  browse: Lx("Сургалтууд үзэх", "Browse training", "강좌 보기", "講座を見る", "查看课程"),
};

/** Нүүрний гол онцлол — Ариусахуйн үйлийн 4 түвшин ба сүнслэг аяллын товч танилцуулга. */
export function PathsHighlight({ courses }: { courses: LevelCourse[] }) {
  return (
    <section className="section"><div className="container-px">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow-line justify-center"><Tr v={C.eyebrow} /></p>
          <p className="mt-4 text-lg leading-relaxed text-ink/85 sm:text-xl"><Tr v={C.lead} /></p>
        </div>
      </Reveal>

      {/* Дөрвөн түвшин — дарахад хичээлүүд нээгдэнэ */}
      <div className="mt-12">
        <LevelCourses courses={courses} />
      </div>

      {/* Сүнслэг аяллын товч танилцуулга */}
      <Reveal delay={120}>
        <div className="night relative mt-14 overflow-hidden rounded-[1.75rem] border border-accent-300/25 p-8 sm:p-10"
          style={{ backgroundImage: "linear-gradient(160deg,#0F2B26 0%,#123029 52%,#1B2E22 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(232,183,95,0.3), transparent 70%)", filter: "blur(10px)" }} />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-7">
            <div className="max-w-2xl">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-3xl">🕊</span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-white sm:text-3xl"><Tr v={C.travelTitle} /></h2>
              <p className="mt-3 leading-relaxed text-white/75"><Tr v={C.travelText} /></p>
            </div>
            <Link href="/ayalal" className="btn btn-lg shrink-0 text-white transition hover:-translate-y-0.5 hover:brightness-110"
              style={{ backgroundImage: "linear-gradient(120deg,#C4802A,#0F7A66)" }}>
              <Tr v={C.travelCta} /> →
            </Link>
          </div>
        </div>
      </Reveal>
    </div></section>
  );
}
