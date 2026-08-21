"use client";

import { useCallback, useEffect, useState } from "react";
import type { JourneyBooking, JourneyReview } from "@/lib/types";

const STATUS_LABEL: Record<JourneyBooking["status"], string> = {
  pending: "Хүлээгдэж буй",
  confirmed: "Баталгаажсан",
  done: "Дууссан",
  cancelled: "Цуцалсан",
};
const STATUS_CLASS: Record<JourneyBooking["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-jade-400/15 text-jade-600",
  done: "bg-primary-100 text-primary-700",
  cancelled: "bg-rose-100 text-rose-500",
};

/** Аяллын захиалга ба сэтгэгдлийн удирдлага. */
export function AdminJourney() {
  const [bookings, setBookings] = useState<JourneyBooking[]>([]);
  const [reviews, setReviews] = useState<JourneyReview[]>([]);
  const [tab, setTab] = useState<"bookings" | "reviews">("bookings");
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/journey", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { bookings: [], reviews: [] }))
      .then((d) => { setBookings(d.bookings || []); setReviews(d.reviews || []); })
      .catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  async function patch(body: Record<string, unknown>) {
    setErr("");
    const res = await fetch("/api/admin/journey", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || "Алдаа гарлаа."); return; }
    load();
  }
  async function remove(q: string) {
    if (!confirm("Устгах уу?")) return;
    await fetch("/api/admin/journey?" + q, { method: "DELETE" });
    load();
  }

  const featuredCount = (slug: string) => reviews.filter((r) => r.slug === slug && r.featured).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {([["bookings", "Захиалга"], ["reviews", "Сэтгэгдэл"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={"rounded-full px-5 py-2 text-sm font-semibold transition " + (tab === k ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-surface-1 text-ink/70 hover:border-primary-300")}>
            {l} ({k === "bookings" ? bookings.length : reviews.length})
          </button>
        ))}
      </div>

      {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}

      {tab === "bookings" && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-line bg-aqua">
              <tr>
                {["Огноо", "Аялал", "Нэр", "Утас", "Хүн", "Төлөв", "Үйлдэл"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-sm font-semibold text-ink">{b.date}</td>
                  <td className="px-4 py-3 text-sm text-ink/80">{b.journeyName}</td>
                  <td className="px-4 py-3 text-sm text-ink/80">{b.name}</td>
                  <td className="px-4 py-3 text-sm text-ink/80">{b.phone}</td>
                  <td className="px-4 py-3 text-sm text-ink/80">{b.people}</td>
                  <td className="px-4 py-3">
                    <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + STATUS_CLASS[b.status]}>{STATUS_LABEL[b.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {b.status !== "confirmed" && (
                        <button onClick={() => patch({ bookingId: b.id, status: "confirmed" })} className="rounded-md bg-jade-400/15 px-2 py-1 text-xs font-semibold text-jade-600 hover:bg-jade-400/25">Баталгаажуулах</button>
                      )}
                      {b.status !== "done" && (
                        <button onClick={() => patch({ bookingId: b.id, status: "done" })} className="rounded-md bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-200">Дууссан</button>
                      )}
                      {b.status !== "cancelled" && (
                        <button onClick={() => patch({ bookingId: b.id, status: "cancelled" })} className="rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-200">Цуцлах</button>
                      )}
                      <button onClick={() => remove("bookingId=" + b.id)} className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-ink/60 hover:bg-line/40">Устгах</button>
                    </div>
                    {b.note && <p className="mt-1.5 text-xs text-muted">📝 {b.note}</p>}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td className="px-4 py-6 text-sm text-muted" colSpan={7}>Захиалга алга.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-3">
          <p className="rounded-xl bg-aqua px-4 py-2.5 text-sm text-muted">
            ℹ️ Аялал тус бүрд <b>дээд тал нь 3</b> сэтгэгдлийг сонгож нийтэд харуулна. Сонгосон сэтгэгдэл аяллын хуудсанд, хариуцах багийн доор гарна.
          </p>
          {reviews.map((r) => (
            <div key={r.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display font-semibold text-ink">{r.name}</span>
                  <span className="text-accent-300">{"★".repeat(r.rating)}</span>
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted">{r.slug}</span>
                  <span className="text-xs text-muted">{r.createdAt.slice(0, 10)}</span>
                </div>
                <p className="mt-2 leading-relaxed text-ink/85">{r.text}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  onClick={() => patch({ reviewId: r.id, featured: !r.featured, slug: r.slug })}
                  className={"rounded-md px-3 py-1.5 text-xs font-bold transition " + (r.featured ? "bg-jade-400/15 text-jade-600 hover:bg-jade-400/25" : "border border-line text-ink/70 hover:border-primary-400 hover:text-primary-700")}
                >
                  {r.featured ? "✓ Нийтэд харагдаж байна" : "Нийтэд харуулах"}
                </button>
                <span className="text-[0.7rem] text-muted">{featuredCount(r.slug)}/3 сонгосон</span>
                <button onClick={() => remove("reviewId=" + r.id)} className="text-xs font-semibold text-rose-500 hover:underline">Устгах</button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="card p-6 text-sm text-muted">Сэтгэгдэл алга.</p>}
        </div>
      )}
    </div>
  );
}
