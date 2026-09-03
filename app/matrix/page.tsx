"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ARCANA, SOUL_LEVELS, ZON, ZON_TITLES, AGE_DUTIES } from "@/data/matrix-data";
import { DestinyMatrixDiagram } from "@/components/matrix/DestinyMatrixDiagram";
import { calculateDestinyMatrix } from "@/lib/matrix-calculation";

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
    const matrix = calculateDestinyMatrix(day, month, year);
    const total = digitSum(String(day).padStart(2, "0") + String(month).padStart(2, "0") + String(year));
    const soul = SOUL_LEVELS.find((l) => total >= l.from && total <= l.to) || null;
    const zon = reduce9(total);
    return { matrix, total, soul, zon };
  }, [date]);

  const points = r
    ? [
        { k: "A", n: r.matrix.points.a, label: "Хувь хүний үндсэн эрчим", hint: "Төрсөн өдрийн тоо — зан чанар, ертөнцөд өөрийгөө илэрхийлэх байдал" },
        { k: "B", n: r.matrix.points.b, label: "Сүнслэг авьяасын эрчим", hint: "Төрсөн сарын тоо — дээд авьяас, зөн совингийн урсгал" },
        { k: "C", n: r.matrix.points.c, label: "Нийгэм, удам угсааны эрчим", hint: "Төрсөн оны цифрийн нийлбэр — нийгэм болон удмын орон зай дахь илрэл" },
        { k: "D", n: r.matrix.points.d, label: "Үйлийн үрийн үндсэн эрчим", hint: "Энэ насандаа ухамсарлаж, тэнцвэржүүлэх гол даалгавар" },
        { k: "E", n: r.matrix.points.e, label: "Матрицын төв эрчим", hint: "Дотоод тав тух, хүчээ сэргээх болон шийдвэр гаргах суурь төлөв" },
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
            <div className="mt-12 grid items-start gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
              <DestinyMatrixDiagram matrix={r.matrix} />
              <div className="space-y-4">
                <div className="card p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-400">Үйлийн үрийн сүүл</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-ink">{r.matrix.karmicTail.join(" – ")}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">Өнгөрсөн туршлагаас авч ирсэн давтагдах сургамж, энэ насанд хөгжүүлэх чиглэлийг илэрхийлнэ.</p>
                </div>
                <div className="card p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-grape-400">Зорилгын шугам</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Хувийн", r.matrix.purposes.personal],
                      ["Нийгмийн", r.matrix.purposes.social],
                      ["Сүнслэг", r.matrix.purposes.spiritual],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-2xl bg-surface-4 px-2 py-3">
                        <strong className="block font-display text-2xl text-ink">{value}</strong>
                        <span className="text-[11px] text-muted">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent-500">Авьяасын гурвал</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-muted">Дээд авьяас</dt><dd className="font-semibold text-ink">{r.matrix.talents.spiritual.join(" · ")}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-muted">Эхийн удмын авьяас</dt><dd className="font-semibold text-ink">{r.matrix.talents.maternal.join(" · ")}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-muted">Эцгийн удмын авьяас</dt><dd className="font-semibold text-ink">{r.matrix.talents.paternal.join(" · ")}</dd></div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Матриксын гол цэгүүд */}
            <h2 className="mt-12 font-display text-2xl font-semibold text-ink sm:text-3xl">Таны матриксын гол эрчмүүд</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {points.map((p) => {
                const a = ARCANA[p.n];
                return (
                  <div key={p.k} className="card overflow-hidden">
                    <div className="flex flex-wrap items-center gap-4 border-b border-line bg-surface-4 px-6 py-4">
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
            <div className="mt-10 rounded-4xl border border-primary-500/30 bg-primary-50 p-7 text-center sm:p-9">
              <h3 className="font-display text-2xl font-semibold text-ink">Бүрэн хувийн тайлал авмаар байна уу?</h3>
              <p className="mx-auto mt-3 max-w-2xl text-muted">
                Энд гарсан нь таны матриксын үндсэн тойм. Харилцаа, мэргэжил, үйлийн үр, авьяас чадварын гүнзгий тайллыг манай багш нар хувьчлан хийж өгнө.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/services" className="btn btn-primary btn-md">Тоон зурхайн үйлчилгээ үзэх</Link>
                <Link href="/about#contact" className="btn btn-outline btn-md">Цаг захиалах</Link>
              </div>
            </div>
            <p className="mt-5 text-center text-xs leading-relaxed text-muted">Энэхүү матриц нь 22 арканын бэлгэдэлт өөрийгөө танин мэдэх аргачлал бөгөөд шинжлэх ухааны онош, баталгаатай таамаглал биш юм.</p>
          </>
        )}
      </div></section>
    </>
  );
}
