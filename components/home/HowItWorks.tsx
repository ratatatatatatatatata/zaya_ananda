import Link from "next/link";
import { Reveal } from "../Reveal";
import { Tr } from "../T";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const T_ = {
  eyebrow: Lx("Хэрхэн эхлэх вэ", "How it works", "시작하는 방법", "はじめ方", "如何开始"),
  title: Lx("Гурван алхмаар дадлагаа эхлүүлнэ", "Begin your practice in three steps", "세 단계로 시작하기", "3ステップで実践を始める", "三步开始你的练习"),
  cta: Lx("Хөтөлбөрөө сонгох", "Choose a program", "프로그램 선택", "プログラムを選ぶ", "选择课程"),
};

const STEPS = [
  {
    n: "01", icon: "🧭",
    title: Lx("Замаа сонгох", "Choose your path", "길을 선택", "道を選ぶ", "选择路径"),
    text: Lx(
      "Бясалгалын хөтөлбөр эсвэл ариун газрын аялал — өөрт тохирохоо сонгоно. Сэтгэлийн туяа хэсэг танд зөвлөнө.",
      "A meditation program or a sacred-site journey — pick what fits. Our mood guide can suggest one.",
      "요가, 명상 프로그램, 성지 여행 중 나에게 맞는 것을 선택하세요.",
      "ヨガ、瞑想プログラム、聖地の旅 — 自分に合うものを選びます。",
      "瑜伽、冥想课程或圣地之旅 — 选择适合你的方式。"),
  },
  {
    n: "02", icon: "🎟",
    title: Lx("Бүртгүүлэх", "Enrol", "등록", "申し込む", "报名"),
    text: Lx(
      "Хичээлээ онлайнаар худалдан авах эсвэл аяллын бүлэгт урьдчилан бүртгүүлнэ. Төлбөрөө сайт дээрээсээ хийнэ.",
      "Buy the course online or reserve a seat in a journey group. Payment happens right on the site.",
      "온라인으로 강좌를 구매하거나 여행 그룹에 예약하세요.",
      "オンラインで講座を購入、または旅のグループに予約します。",
      "在线购买课程或预订旅程名额，网站内即可付款。"),
  },
  {
    n: "03", icon: "🌱",
    title: Lx("Дадлагаа эхлүүлэх", "Start practising", "수련 시작", "実践を始める", "开始练习"),
    text: Lx(
      "Худалдан авсан хичээл тань «Миний булан»-д нээгдэж, хүссэн үедээ дахин үзнэ. Аялалдаа багш нар тань хамт явна.",
      "Your lessons open in “My space” and can be replayed anytime. On journeys, our teachers travel with you.",
      "구매한 강좌는 마이페이지에서 언제든 다시 볼 수 있습니다.",
      "購入した講座はマイページでいつでも視聴できます。",
      "已购课程在“我的空间”随时重看，旅程中导师全程陪伴。"),
  },
];

/** Йог/сургалт болон аяллын урсгалыг тайлбарлах 3 алхам. */
export function HowItWorks() {
  return (
    <section className="section bg-surface-2"><div className="container-px">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-line justify-center"><Tr v={T_.eyebrow} /></p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl"><Tr v={T_.title} /></h2>
        </div>
      </Reveal>

      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <li className="panel relative h-full p-7">
              <span aria-hidden className="absolute right-6 top-5 font-display text-4xl font-semibold text-primary-500/15">{s.n}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/12 text-2xl">{s.icon}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink"><Tr v={s.title} /></h3>
              <p className="mt-2 leading-relaxed text-muted"><Tr v={s.text} /></p>
            </li>
          </Reveal>
        ))}
      </ol>

      <div className="mt-9 text-center">
        <Link href="/courses" className="btn btn-primary btn-lg"><Tr v={T_.cta} /> →</Link>
      </div>
    </div></section>
  );
}
