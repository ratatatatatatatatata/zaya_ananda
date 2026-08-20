import Link from "next/link";
import { Reveal } from "../Reveal";
import { Tr } from "../T";
import type { Locale } from "@/lib/types";

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

/** Ариусахуйн үйлийн дөрвөн түвшин */
const LEVELS: { step: string; icon: string; title: Record<Locale, string>; text: Record<Locale, string> }[] = [
  {
    step: "I",
    icon: "🌱",
    title: Lx("Анхан", "Beginner", "입문", "初級", "入门"),
    text: Lx(
      "Амьсгал, сууц, анхаарлаа барих үндэс. Өдөрт 10 минутаас эхэлнэ.",
      "Breath, posture and holding attention. Start with ten minutes a day.",
      "호흡·자세·집중의 기초. 하루 10분부터 시작합니다.",
      "呼吸・姿勢・集中の基礎。1日10分から始めます。",
      "呼吸、坐姿与专注的基础。每天从十分钟开始。",
    ),
  },
  {
    step: "II",
    icon: "🌿",
    title: Lx("Дунд", "Intermediate", "중급", "中級", "中级"),
    text: Lx(
      "Тогтмол дадал, сэтгэл хөдлөлөө ажиглах, энергийн цэвэрлэгээний үндсэн арга.",
      "A steady habit, observing emotion, and the basics of energy clearing.",
      "꾸준한 습관, 감정 관찰, 에너지 정화의 기초.",
      "習慣化、感情の観察、エネルギー浄化の基本。",
      "稳定的习惯、观察情绪，以及能量清理的基础。",
    ),
  },
  {
    step: "III",
    icon: "🔥",
    title: Lx("Гүнзгий", "Advanced", "심화", "上級", "进阶"),
    text: Lx(
      "Гүн бясалгал, зан үйл, өөрийн хэв маягийг таних урт хугацааны ажил.",
      "Deep meditation, ritual, and the long work of seeing your own patterns.",
      "깊은 명상과 의식, 자신의 패턴을 보는 장기 수련.",
      "深い瞑想と儀式、自分のパターンを見る長期の取り組み。",
      "深层冥想、仪式，以及看清自身模式的长期功课。",
    ),
  },
  {
    step: "IV",
    icon: "✨",
    title: Lx("Мастер", "Master", "마스터", "マスター", "大师"),
    text: Lx(
      "Бусдыг чиглүүлэх, зан үйл удирдах, багшийн замд бэлтгэх түвшин.",
      "Guiding others, leading ritual, and preparing for the teacher's path.",
      "타인을 이끌고 의식을 진행하며 스승의 길을 준비하는 단계.",
      "他者を導き、儀式を主宰し、師の道へ備える段階。",
      "引导他人、主持仪式，并为成为导师做准备。",
    ),
  },
];

/** Нүүрний гол онцлол — Ариусахуйн үйлийн 4 түвшин ба сүнслэг аяллын товч танилцуулга. */
export function PathsHighlight({ courseCount, lessonCount, teacherCount }: {
  courseCount: number; lessonCount: number; teacherCount: number;
}) {
  return (
    <section className="section"><div className="container-px">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow-line justify-center"><Tr v={C.eyebrow} /></p>
          <p className="mt-4 text-lg leading-relaxed text-ink/85 sm:text-xl"><Tr v={C.lead} /></p>
        </div>
      </Reveal>

      {/* Дөрвөн түвшин */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {LEVELS.map((l, i) => (
          <Reveal key={l.step} delay={i * 80}>
            <article className="panel group relative flex h-full flex-col overflow-hidden p-7">
              <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-70 transition duration-700 group-hover:scale-110"
                style={{ background: "radial-gradient(circle, rgb(var(--c-p400) / 0.2), transparent 70%)", filter: "blur(6px)" }} />
              <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/12 text-2xl">{l.icon}</span>
                  <span className="font-display text-sm font-bold tracking-[0.2em] text-primary-700">{l.step}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink"><Tr v={l.title} /></h3>
                <p className="mt-2.5 flex-1 text-[0.96rem] leading-relaxed text-muted"><Tr v={l.text} /></p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {(courseCount > 0 || lessonCount > 0 || teacherCount > 0) && (
        <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3 rounded-2xl bg-primary-500/[0.07] p-4 text-center">
          <div><dt className="text-xs text-muted">Хөтөлбөр</dt><dd className="font-display text-xl font-semibold text-primary-700">{courseCount}</dd></div>
          <div><dt className="text-xs text-muted">Видео хичээл</dt><dd className="font-display text-xl font-semibold text-primary-700">{lessonCount}</dd></div>
          <div><dt className="text-xs text-muted">Багш</dt><dd className="font-display text-xl font-semibold text-primary-700">{teacherCount}</dd></div>
        </dl>
      )}

      <div className="mt-7 text-center">
        <Link href="/courses" className="btn btn-primary btn-md"><Tr v={C.browse} /> →</Link>
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
