"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const EYEBROW = Lx("Бидний тухай", "About us", "우리 소개", "私たちについて", "关于我们");
const TITLE = Lx(
  "Тоо, баримтаар",
  "In numbers and facts",
  "숫자와 사실로",
  "数字とファクトで",
  "用数字与事实说话",
);

/** Анхаарал татах жижиг баримтууд */
const FACTS: { value: number; suffix: string; label: Record<Locale, string>; icon: string }[] = [
  { value: 15, suffix: "+", icon: "🧘", label: Lx("жилийн бясалгалын туршлага", "years of meditation practice", "년의 명상 경험", "年の瞑想経験", "年冥想经验") },
  { value: 40, suffix: "+", icon: "🕊", label: Lx("удаа ариун газарт бүлэг удирдсан", "group journeys to sacred sites", "회의 성지 순례 인솔", "回の聖地への引率", "次圣地带团") },
  { value: 108, suffix: "", icon: "🛕", label: Lx("суваргыг нар зөв тойрдог зан үйл", "stupas in the circumambulation ritual", "개의 탑을 도는 의식", "基の仏塔を巡る儀式", "座佛塔的绕行仪式") },
  { value: 5, suffix: "", icon: "🌍", label: Lx("хэлээр үйлчилгээ авах боломж", "languages you can be served in", "개 언어로 이용 가능", "言語で利用可能", "种语言可选") },
];

/** Богино сонирхолтой мэдээллүүд */
const NOTES: { icon: string; text: Record<Locale, string> }[] = [
  {
    icon: "🌌",
    text: Lx(
      "Шамбалын орон дэлхийн энергийн төвүүдийн нэгд тооцогддог — тэнд хүслээ даатгах зан үйл олон зуун жилийн настай.",
      "Shambhala Land counts among the world's energy centres — the wish-entrusting ritual there is centuries old.",
      "샴발라의 땅은 세계 에너지 중심지 중 하나로 꼽히며, 그곳의 소원 의식은 수백 년의 역사를 지닙니다.",
      "シャンバラの地は世界のエネルギーセンターの一つとされ、願いを託す儀式は数百年の歴史があります。",
      "香巴拉之地被视为世界能量中心之一，那里的许愿仪式已有数百年历史。",
    ),
  },
  {
    icon: "⏳",
    text: Lx(
      "Өдөрт ердөө 10 минут бясалгал хийхэд гурван долоо хоногийн дараа нойрны чанар мэдэгдэхүйц сайжирдаг.",
      "Just ten minutes of daily practice noticeably improves sleep quality after about three weeks.",
      "하루 10분의 수련만으로 약 3주 후 수면의 질이 눈에 띄게 좋아집니다.",
      "1日10分の実践で、約3週間後には睡眠の質が目に見えて改善します。",
      "每天仅十分钟的练习，约三周后睡眠质量会明显改善。",
    ),
  },
  {
    icon: "🎧",
    text: Lx(
      "Худалдаж авсан хичээл тань хувийн буланд үлдэх тул хэдэн ч удаа, хүссэн үедээ эргэж үзнэ.",
      "Purchased lessons stay in your personal space — return to them any time, as often as you like.",
      "구매한 강좌는 개인 공간에 남아 언제든 다시 볼 수 있습니다.",
      "購入した講座はマイページに残り、いつでも何度でも視聴できます。",
      "已购课程保存在个人空间，随时可以反复观看。",
    ),
  },
  {
    icon: "👥",
    text: Lx(
      "Аялал бүр цөөн хүнтэй — багшийн анхаарал хүн бүрд хүрэхийн тулд бүлгийг санаатайгаар жижиг байлгадаг.",
      "Every journey is small by design, so the teacher's attention reaches each person.",
      "모든 여정은 의도적으로 소규모입니다 — 선생님의 관심이 한 사람 한 사람에게 닿도록.",
      "旅はすべて意図的に少人数です — 講師の目が一人ひとりに行き届くように。",
      "每次行程都刻意保持小团，让导师能照顾到每一个人。",
    ),
  },
];

/** Тоо 0-оос эхлэн өсөх */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }

    const ob = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || started.current) continue;
        started.current = true;
        const t0 = performance.now();
        const dur = 1100;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    ob.observe(el);
    return () => ob.disconnect();
  }, [to]);

  return <span ref={ref}>{n}{suffix}</span>;
}

/** Нүүр хуудасны «Бидний тухай» — анхаарал татах жижиг баримтууд. */
export function AboutFacts() {
  const { tr, lang } = useI18n();

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow-line justify-center">{tr(EYEBROW)}</p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{tr(TITLE)}</h2>
      </div>

      {/* Тоон баримтууд */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.icon} className="panel p-6 text-center">
            <span className="text-3xl">{f.icon}</span>
            <p className="mt-3 font-display text-4xl font-semibold text-primary-700">
              <Counter to={f.value} suffix={f.suffix} />
            </p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{f.label[lang]}</p>
          </div>
        ))}
      </div>

      {/* Сонирхолтой тэмдэглэлүүд */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {NOTES.map((nt) => (
          <div key={nt.icon} className="flex gap-4 rounded-2xl border border-line bg-surface-1 p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-500/12 text-xl">{nt.icon}</span>
            <p className="text-[0.98rem] leading-relaxed text-ink/85">{nt.text[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
