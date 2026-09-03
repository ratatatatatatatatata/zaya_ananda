import { Reveal } from "../Reveal";
import { Tr } from "../T";
import type { Locale } from "@/lib/types";
import { LevelCourses, type LevelCourse } from "./LevelCourses";
import { FloatingGlyphs } from "./FloatingGlyphs";

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

  browse: Lx("Сургалтууд үзэх", "Browse training", "강좌 보기", "講座を見る", "查看课程"),
};

/** Нүүрний гол онцлол — Ариусахуйн үйлийн 4 түвшин ба сүнслэг аяллын товч танилцуулга. */
export function PathsHighlight({ courses }: { courses: LevelCourse[] }) {
  return (
    <section className="section relative"><div className="container-px relative">
      <FloatingGlyphs
        tokens={[
          { glyph: "lotus", from: "#2BC8BB", to: "#7CDCD2", top: "4%", left: "3%", size: 64, delay: 0 },
          { glyph: "mountain", from: "#F0B27A", to: "#5FCFC4", top: "10%", right: "5%", size: 56, delay: 1.4, slow: true },
          { glyph: "scroll", from: "#E3BE62", to: "#9BC7F0", top: "68%", left: "8%", size: 48, delay: 0.8, rev: true },
        ]}
      />
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

    </div></section>
  );
}
