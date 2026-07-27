import Link from "next/link";
import { Reveal } from "../Reveal";
import { Tr } from "../T";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const C = {
  eyebrow: Lx("Хоёр гол зам", "Two main paths", "두 가지 길", "二つの道", "两条主路"),
  lead: Lx(
    "Zaya's Ananda-д таныг угтах хоёр том систем бий — гэрээсээ суралцах йог, бясалгалын сургалт, мөн Монголын ариун газруудаар хийх сүнслэг аялал.",
    "Two systems welcome you at Zaya's Ananda — yoga and meditation training you can follow from home, and spiritual journeys to Mongolia's sacred sites.",
    "자야스 아난다에는 두 가지 시스템이 있습니다 — 집에서 배우는 요가·명상 교육, 그리고 몽골 성지 순례 여행.",
    "Zaya's Anandaには2つの柱があります — 自宅で学べるヨガ・瞑想講座と、モンゴルの聖地を巡る旅。",
    "Zaya's Ananda 有两大体系 — 在家学习的瑜伽与冥想课程，以及蒙古圣地的心灵之旅。"),

  yogaTitle: Lx("Йог ба бясалгалын сургалт", "Yoga & meditation training", "요가·명상 교육", "ヨガと瞑想の講座", "瑜伽与冥想课程"),
  yogaText: Lx(
    "Биеэ сунгах йогийн дасгалаас эхлээд гүн бясалгал хүртэл — видео хичээлээр, өөрийн хэмнэлээр, гэрээсээ. Худалдан авсан хичээл тань хувийн буланд үүрд нээлттэй.",
    "From body-opening yoga to deep meditation — video lessons at your own pace, from home. Purchased courses stay open in your personal space.",
    "요가 동작부터 깊은 명상까지 — 영상 강의로, 집에서 내 속도로. 구매한 강좌는 개인 공간에 계속 열려 있습니다.",
    "ヨガの動きから深い瞑想まで — 動画講座で自分のペースで、自宅から。購入した講座はマイページにいつでも。",
    "从舒展身体的瑜伽到深层冥想 — 视频课程，在家按自己的节奏学习。已购课程永久保存在个人空间。"),
  yogaCta: Lx("Сургалтууд үзэх", "Browse training", "강좌 보기", "講座を見る", "查看课程"),

  travelTitle: Lx("Сүнслэг аялал", "Spiritual journey", "영적 여행", "スピリチュアルの旅", "心灵之旅"),
  travelText: Lx(
    "Шамбалын орон, Отгонтэнгэр, Амарбаясгалант — энергийн ариун газрууд руу бясалгал, зан үйлтэй хослуулсан цөөн хүнтэй аян. Багш, хөтөч тань турш нь хамт.",
    "Shambhala Land, Otgontenger, Amarbayasgalant — small-group journeys to sacred energy sites, woven with meditation and ritual, guided by our teachers.",
    "샴발라의 땅, 오트곤텡게르, 아마르바야스갈란트 — 명상과 의식이 함께하는 소규모 성지 순례.",
    "シャンバラの地、オトゴンテンゲル、アマルバヤスガラント — 瞑想と儀式を織り込んだ少人数の聖地の旅。",
    "香巴拉之地、鄂特冈腾格里、阿玛尔巴雅斯格朗 — 融合冥想与仪式的小团圣地之旅。"),
  travelCta: Lx("Аяллын хөтөлбөр", "Journey programs", "여행 일정", "旅程を見る", "行程安排"),
};

const YOGA_POINTS = [
  Lx("Онлайн видео хичээл", "Online video lessons", "온라인 영상 강의", "オンライン動画講座", "在线视频课程"),
  Lx("Танхимын дасгал", "In-studio practice", "오프라인 수련", "スタジオ実践", "线下练习"),
  Lx("Багш нарын хөтөлбөр", "Teacher-led programs", "강사 프로그램", "講師によるプログラム", "导师课程"),
  Lx("Хувийн буланд хадгалагдана", "Saved in your space", "개인 공간에 저장", "マイページに保存", "保存在个人空间"),
];
const TRAVEL_POINTS = [
  Lx("Шамбалын орон · Хамарын хийд", "Shambhala Land · Khamar", "샴발라의 땅", "シャンバラの地", "香巴拉之地"),
  Lx("Отгонтэнгэр хайрхан", "Otgontenger", "오트곤텡게르", "オトゴンテンゲル", "鄂特冈腾格里"),
  Lx("Амарбаясгалант хийд", "Amarbayasgalant", "아마르바야스갈란트", "アマルバヤスガラント", "阿玛尔巴雅斯格朗"),
  Lx("Арьяабал — бясалгалын зам", "Aryapala meditation path", "아리아발 명상길", "アリアバル瞑想の道", "阿雅巴拉冥想之路"),
];

/** Нүүрний гол онцлол — Йог/сургалт ба Сүнслэг аяллын хоёр систем. */
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

      <div className="mt-12 grid gap-7 lg:grid-cols-2">
        {/* Йог ба сургалт */}
        <Reveal>
          <article className="panel group relative flex h-full flex-col p-8 sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-70 transition duration-700 group-hover:scale-110"
              style={{ background: "radial-gradient(circle, rgb(var(--c-p400) / 0.22), transparent 70%)", filter: "blur(8px)" }} />
            <div className="relative z-10 flex flex-1 flex-col">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-500/12 text-3xl">🧘</span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl"><Tr v={C.yogaTitle} /></h2>
              <p className="mt-3 leading-relaxed text-muted"><Tr v={C.yogaText} /></p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {YOGA_POINTS.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-[0.98rem] text-ink/80">
                    <span aria-hidden className="mt-1 text-primary-500">✦</span><Tr v={p} />
                  </li>
                ))}
              </ul>

              {(courseCount > 0 || lessonCount > 0 || teacherCount > 0) && (
                <dl className="mt-7 grid grid-cols-3 gap-3 rounded-2xl bg-primary-500/[0.07] p-4 text-center">
                  <div><dt className="text-xs text-muted">Хөтөлбөр</dt><dd className="font-display text-xl font-semibold text-primary-700">{courseCount}</dd></div>
                  <div><dt className="text-xs text-muted">Видео хичээл</dt><dd className="font-display text-xl font-semibold text-primary-700">{lessonCount}</dd></div>
                  <div><dt className="text-xs text-muted">Багш</dt><dd className="font-display text-xl font-semibold text-primary-700">{teacherCount}</dd></div>
                </dl>
              )}

              <div className="mt-auto pt-7">
                <Link href="/courses" className="btn btn-primary btn-md"><Tr v={C.yogaCta} /> →</Link>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Сүнслэг аялал */}
        <Reveal delay={110}>
          <article className="night group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-accent-300/25 p-8 sm:p-10"
            style={{ backgroundImage: "linear-gradient(160deg,#0F2B26 0%,#123029 52%,#1B2E22 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full transition duration-700 group-hover:scale-110"
              style={{ background: "radial-gradient(circle, rgba(232,183,95,0.3), transparent 70%)", filter: "blur(10px)" }} />
            <div aria-hidden className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(43,200,187,0.22), transparent 70%)", filter: "blur(12px)" }} />
            <div className="relative z-10 flex flex-1 flex-col">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-3xl">🕊</span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-white sm:text-3xl"><Tr v={C.travelTitle} /></h2>
              <p className="mt-3 leading-relaxed text-white/75"><Tr v={C.travelText} /></p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {TRAVEL_POINTS.map((p, i) => (
                  <li key={i} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85">
                    <Tr v={p} />
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl bg-white/[0.06] p-4 text-center">
                <div><p className="text-xs text-white/55">Бүлэг</p><p className="font-display text-lg font-semibold text-white">Цөөн хүн</p></div>
                <div><p className="text-xs text-white/55">Хугацаа</p><p className="font-display text-lg font-semibold text-white">2–4 өдөр</p></div>
                <div><p className="text-xs text-white/55">Хөтөч</p><p className="font-display text-lg font-semibold text-white">Багштай</p></div>
              </div>

              <div className="mt-auto pt-7">
                <Link href="/ayalal" className="btn btn-lg text-white shadow-glow-grape transition hover:-translate-y-0.5 hover:brightness-110"
                  style={{ backgroundImage: "linear-gradient(120deg,#C4802A,#0F7A66)" }}>
                  <Tr v={C.travelCta} /> →
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </div></section>
  );
}
