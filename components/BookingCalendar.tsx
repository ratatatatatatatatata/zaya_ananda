"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { AddToCart } from "./AddToCart";
import { cx, formatMNT } from "@/lib/format";
import type { Service } from "@/lib/types";

const times = ["10:00", "11:30", "14:00", "16:00", "18:00"];
const wd = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];

export function BookingCalendar({ service }: { service: Service }) {
  const { t } = useI18n();
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const ready = !!date && !!time;

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg font-semibold text-ink">📅 {t("booking.title")}</h3>
      <p className="field-label mt-4">{t("booking.pickDate")}</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => {
          const v = fmt(d);
          return (
            <button key={v} onClick={() => setDate(v)}
              className={cx("shrink-0 rounded-2xl border px-3 py-2 text-center transition", date === v ? "border-primary-400 bg-primary-50 text-primary-700" : "border-line text-ink/70 hover:border-primary-300")}>
              <span className="block text-[11px]">{wd[d.getDay()]}</span>
              <span className="block text-base font-semibold leading-tight">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
      <p className="field-label mt-4">{t("booking.pickTime")}</p>
      <div className="flex flex-wrap gap-2">
        {times.map((tm) => (
          <button key={tm} onClick={() => setTime(tm)}
            className={cx("rounded-full border px-4 py-2 text-sm transition", time === tm ? "border-primary-400 bg-primary-50 text-primary-700" : "border-line text-ink/70 hover:border-primary-300")}>
            {tm}
          </button>
        ))}
      </div>
      {ready && <p className="mt-4 rounded-xl bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700">{t("booking.chosen")}: {date} · {time}</p>}
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="font-display text-xl font-semibold text-ink">{formatMNT(service.price)}</span>
        <AddToCart className={cx("btn btn-primary btn-md", !ready && "pointer-events-none opacity-50")} labelKey="booking.add"
          item={{ kind: "service", slug: service.slug, title: service.title, price: service.price, tone: service.tone, glyph: service.glyph }} />
      </div>
      <p className="mt-2 text-xs text-muted">{t("booking.note")}</p>
    </div>
  );
}
