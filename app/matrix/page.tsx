"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ARCANA, SOUL_LEVELS, ZON, ZON_TITLES, AGE_DUTIES } from "@/data/matrix-data";

/** 22-оос их тоог цифрүүдийн нийлбэрээр бууруулна (Хувь тавилангийн матриксын дүрэм). */
function reduce22(n: number): number {
  while (n > 22) n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return n;
}
function reduce9(n: number): number {
  while (n > 9) n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return n;
}
function digitSum(s: string): number {
  return s.split("").filter((c) => /\d/.test(c)).reduce((a, c) => a + Number(c), 0);
}

export default function MatrixPage() {
  const [date, setDate] = useState("");

  const r = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    const day = d.getDate(), month = d.getMonth() + 1, year = d.getFullYear();
    const A = reduce22(day);
    const B = month;
    const C = reduce22(digitSum(String(year)));
    const D = reduce22(A + B + C);
    const E = reduce22(A + B + C + D);
    const total = digitSum(String(day).padStart(2, "0") + String(month).padStart(2, "0") + String(year));
    const soul = SOUL_LEVELS.find((l) => total >= l.from && total <= l.to) || null;
    const zon = reduce9(total);
    return { day, month, year, A, B, C, D, E, total, soul, zon };
  }, [date]);

  const points = r
    ? [
        { k: "A", n: r.A, label: "Таны үндсэн эрчим (төрсөн өдөр)", hint: "Таны зан чанар, энэ насны гол хөдөлгөгч хүч" },
        { k: "B", n: r.B, label: "Сэтгэлийн эрчим (төрсөн сар)", hint: "Сэтгэл хөдлөл, авьяас билгийн урсгал" },
        { k: "C", n: r.C, label: "Удам угсааны эрчим (төрсөн он)", hint: "Өвөг дээдсээс уламжилсан хүч, өв" },
        { k: "D", n: r.D, label: "Хувь тавилангийн эрчим", hint: "Энэ насандаа гүйцэлдүүлэх үүрэг даалгавар" },
        { k: "E", n: r.E, label: "Төв — сүнсний тайвшралын бүс", hint: "Таны дотоод тэнцвэрийн гол эх үүсвэр" },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Тоон зурхайн матрикс"
        crumb="Тоон зурхайн матрикс"
        desc="Төрсөн он, сар, өдрөөрөө хувь тавилангийн матриксаа тайлж, өөрийн эрчим энерги, сүнсний түвшин, далд чадамжаа нээгээрэй."
      />
      <section className="section"><div className="container-px max-w-5xl">
        <div className="card p-7 sm:p-9">
          <h2 className="font-display text-2xl font-semibold text-ink">Төрсөн огноогоо оруулна уу</h2>
          <p className="mt-2 text-muted">Матрикс таны төрсөн он, сар, өдрийн тоон эрчмээс бүрддэг.</p>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input mt-5 max-w-56" aria-label="Төрсөн огноо" />
        </div>

        {r && (
          <>
            {/* Матриксын гол цэгүүд */}
            <h2 className="mt-12 font-display text-2xl font-semibold text-ink sm:text-3xl">Таны матриксын гол эрчмүүд</h2>
            <div className="mt-6 space-y-5">
              {points.map((p) => {
                const a = ARCANA[p.n];
                return (
                  <div key={p.k} className="card overflow-hidden">
                    <div className="flex flex-wrap items-center gap-4 border-b border-line bg-[#1F2E4F] px-6 py-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-grad font-display text-2xl font-bold text-white">{p.n}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-primary-300">{p.label}</p>
                        <p className="font-display text-lg font-semibold text-ink">{a?.name}</p>
                      </div>
                    </div>
                    <div className="px-6 py-5">
                      <p className="leading-relaxed text-ink/80">{a?.short}</p>
                      <p className="mt-2 text-sm italic text-muted">{p.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Сүнсний түвшин */}
            {r.soul && (
              <div className="mt-12 card p-7">
                <p className="text-xs font-bold uppercase tracking-wide text-accent-400">Сүнсний түвшин · нийлбэр тоо {r.total}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{r.soul.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/80">{r.soul.text}</p>
              </div>
            )}

            {/* Зөн билэг, далд чадамж */}
            {ZON[r.zon] && (
              <div className="mt-6 card p-7">
                <p className="text-xs font-bold uppercase tracking-wide text-grape-400">Зөн билэг, далд чадамж · тоо {r.zon}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{ZON_TITLES[r.zon]}</h3>
                <p className="mt-3 leading-relaxed text-ink/80">{ZON[r.zon]}</p>
              </div>
            )}

            {/* Насны үечлэл */}
            {AGE_DUTIES.length > 0 && (
              <div className="mt-6 card p-7">
                <h3 className="font-display text-2xl font-semibold text-ink">Энэ насны амьдралын үүрэг</h3>
                <ul className="mt-4 space-y-3">
                  {AGE_DUTIES.map((a, i) => (
                    <li key={i} className="flex gap-2.5 leading-relaxed text-ink/80"><span className="mt-0.5 text-primary-400">✦</span><span>{a}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 rounded-4xl border border-primary-500/30 bg-[#14303A] p-7 text-center sm:p-9">
              <h3 className="font-display text-2xl font-semibold text-ink">Бүрэн хувийн тайлал авмаар байна уу?</h3>
              <p className="mx-auto mt-3 max-w-2xl text-muted">
                Энд гарсан нь таны матриксын үндсэн тойм. Харилцаа, мэргэжил, үйлийн үр, авьяас чадварын гүнзгий тайллыг манай багш нар хувьчлан хийж өгнө.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/services" className="btn btn-primary btn-md">Тоон зурхайн үйлчилгээ үзэх</Link>
                <Link href="/about#contact" className="btn btn-outline btn-md">Цаг захиалах</Link>
              </div>
            </div>
          </>
        )}
      </div></section>
    </>
  );
}
