"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const HEAD = Lx("Танд юу хэрэгтэй вэ?", "What are you looking for?", "무엇을 찾고 계신가요?", "何をお探しですか？", "您在寻找什么？");
const SUB = Lx(
  "Доорх хэсгүүдээс өөрт хэрэгтэйгээ сонгоорой — бүгд таны дотоод аялалд зориулагдсан.",
  "Choose from the sections below — each one is part of your inner journey.",
  "아래 섹션에서 필요한 것을 선택하세요.",
  "以下のセクションからお選びください。",
  "从下面的板块中选择您需要的内容。"
);
const MORE = Lx("Дэлгэрэнгүй", "Explore", "자세히", "詳しく", "了解更多");

const SECTIONS: { href: string; icon: string; navKey: string; desc: Record<Locale, string> }[] = [
  { href: "/services", icon: "✨", navKey: "nav.services", desc: Lx(
    "Аура, сканнер оношилгоо, зурхай мэргэ, лаа засал, озонатор зэрэг энергийн засал, эмчилгээнүүд.",
    "Aura and scanner diagnostics, astrology, candle healing, ozone therapy and more energy treatments.",
    "오라 진단, 점성술, 촛불 힐링 등 에너지 치유 서비스.",
    "オーラ診断、占星術、キャンドルヒーリングなどのエナジーケア。",
    "气场诊断、占星、蜡烛疗愈等能量疗法。") },
  { href: "/courses", icon: "🧘", navKey: "nav.courses", desc: Lx(
    "Бясалгалын сургалтууд — гэрээсээ, өөрийн хэмнэлээр видео хичээлээр суралцаарай.",
    "Meditation courses — learn at your own pace with video lessons from home.",
    "명상 강좌 — 집에서 영상으로 자신의 속도에 맞춰 배우세요.",
    "瞑想講座 — 自宅で動画レッスンを自分のペースで。",
    "冥想课程 — 在家通过视频按自己的节奏学习。") },
  { href: "/ayalal", icon: "🕊", navKey: "nav.journey", desc: Lx(
    "Монголын энергийн ариун газрууд руу бясалгал, зан үйлтэй хослуулсан аяллууд.",
    "Guided journeys to Mongolia's sacred energy sites, combined with meditation and rituals.",
    "몽골의 성스러운 에너지 명소로 떠나는 명상 여행.",
    "モンゴルの聖なるエネルギースポットへの瞑想の旅。",
    "前往蒙古神圣能量之地的冥想之旅。") },
  { href: "/shop", icon: "🛡", navKey: "nav.shop", desc: Lx(
    "Энергийн хамгаалалтын бүтээгдэхүүнүүд — өдөр тутмын тэнцвэрт тань дэмжлэг болно.",
    "Energy protection products to support your daily balance.",
    "일상의 균형을 지켜주는 에너지 보호 제품.",
    "日々のバランスを守るエナジープロテクション製品。",
    "守护日常平衡的能量防护产品。") },
  { href: "/resources", icon: "📖", navKey: "nav.resources", desc: Lx(
    "Зөвлөгөө, нийтлэл, видео — гэгээрлийн замд тань гэрэл болох мэдлэгүүд.",
    "Advice, articles and videos — knowledge to light your path.",
    "조언, 글, 영상 — 길을 밝혀줄 지식.",
    "アドバイス・記事・動画 — 道を照らす知恵。",
    "建议、文章与视频 — 照亮前路的知识。") },
  { href: "/teachers", icon: "🤝", navKey: "nav.teachers", desc: Lx(
    "Туршлагатай багш нартайгаа танилцаж, тэдний хөтөлдөг хичээлүүдийг үзээрэй.",
    "Meet our experienced teachers and explore the classes they lead.",
    "경험 많은 선생님들과 그들의 수업을 만나보세요.",
    "経験豊かな講師陣と、その担当レッスンをご紹介。",
    "认识我们经验丰富的老师及其课程。") },
  { href: "/mood", icon: "🌅", navKey: "nav.mood", desc: Lx(
    "Өнөөдрийн сэтгэл санаагаа сонгоход бид танд тохирсон хичээлийг санал болгоно.",
    "Pick today's mood and we'll suggest what fits you best.",
    "오늘의 기분을 고르면 어울리는 콘텐츠를 추천해 드립니다.",
    "今日の気分を選ぶと、ぴったりの内容をご提案します。",
    "选择今天的心情，我们为您推荐合适的内容。") },
  { href: "/gift", icon: "🎁", navKey: "nav.gift", desc: Lx(
    "Үнэгүй нээлттэй хичээлүүд — бидний бэлэг, эхлэхэд тань зориулав.",
    "Free open lessons — our gift to help you begin.",
    "무료 공개 레슨 — 시작을 위한 선물입니다.",
    "無料公開レッスン — はじめの一歩への贈り物。",
    "免费公开课程 — 送给您的入门礼物。") },
];

/** Нүүр хуудсанд доошоо гүйлгэхэд гарч ирэх хэсгүүдийн товч танилцуулга. */
export function HomeSections() {
  const { t, tr, lang } = useI18n();
  return (
    <section className="section">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{tr(HEAD)}</h2>
          <p className="mt-3 text-muted">{tr(SUB)}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.href} delay={i * 60}>
              <Link href={s.href} className="card group flex h-full flex-col p-6 transition-shadow duration-300 hover:shadow-glow">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/15 text-2xl">{s.icon}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink transition group-hover:text-primary-300">
                  {s.navKey === "nav.journey" ? tr(Lx("Сүнслэг аялал", "Spiritual Journey", "영적 여행", "スピリチュアルな旅", "灵性之旅")) : t(s.navKey)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.desc[lang]}</p>
                <span className="mt-4 text-sm font-semibold text-primary-300">{tr(MORE)} →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
