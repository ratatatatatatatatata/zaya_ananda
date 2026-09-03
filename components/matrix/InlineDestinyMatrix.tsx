"use client";

import { useMemo, useState } from "react";
import { ARCANA } from "@/data/matrix-data";
import { calculateDestinyMatrix } from "@/lib/matrix-calculation";
import { DestinyMatrixDiagram } from "./DestinyMatrixDiagram";

export function InlineDestinyMatrix() {
  const [date, setDate] = useState("");
  const matrix = useMemo(() => {
    if (!date) return null;
    const value = new Date(`${date}T00:00:00`);
    if (Number.isNaN(value.getTime())) return null;
    return calculateDestinyMatrix(value.getDate(), value.getMonth() + 1, value.getFullYear());
  }, [date]);

  const energies = matrix ? [
    ["Хувь хүний үндсэн эрчим", matrix.points.a],
    ["Сүнслэг авьяасын эрчим", matrix.points.b],
    ["Нийгэм, удам угсааны эрчим", matrix.points.c],
    ["Үйлийн үрийн үндсэн эрчим", matrix.points.d],
    ["Матрицын төв эрчим", matrix.points.e],
  ] as const : [];

  return (
    <div className="rounded-[1.75rem] border border-line bg-surface-1 p-5 shadow-soft sm:p-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-line justify-center">Хувь тавилангийн матриц</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">Төрсөн огноогоо оруулна уу</h3>
        <p className="mt-2 text-muted">Он, сар, өдрөө сонгоход матрицын мэдээлэл доор автоматаар гарна.</p>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="input mx-auto mt-5 max-w-64"
          aria-label="Төрсөн он сар өдөр"
        />
      </div>

      {matrix && (
        <div className="mt-9">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]">
            <DestinyMatrixDiagram matrix={matrix} />
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <Result title="Үйлийн үрийн сүүл" value={matrix.karmicTail.join(" – ")} />
              <Result title="Зорилгын шугам" value={`${matrix.purposes.personal} · ${matrix.purposes.social} · ${matrix.purposes.spiritual}`} />
              <Result title="Авьяасын гурвал" value={matrix.talents.spiritual.join(" · ")} />
            </div>
          </div>

          <h4 className="mt-9 font-display text-2xl font-semibold text-ink">Таны матрицын гол эрчмүүд</h4>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {energies.map(([label, number]) => (
              <article key={label} className="rounded-3xl border border-line bg-surface-2 p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-grad font-display text-xl font-bold text-white">{number}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-primary-500">{label}</p>
                    <h5 className="mt-1 font-display text-lg font-semibold text-ink">{ARCANA[number]?.name}</h5>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{ARCANA[number]?.short}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Result({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-line bg-surface-2 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-primary-500">{title}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
