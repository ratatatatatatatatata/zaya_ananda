"use client";

import { useCallback, useEffect, useState } from "react";
import type { JourneyBooking, JourneyReview, Order, ServiceBooking } from "@/lib/types";
import type { CmsItem } from "@/lib/types";
import { slotsOf } from "@/lib/booking-slots";

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
export function AdminJourney({ courseOrders = [], productOrders = [], onOrderStatus, onDeleteOrder }: {
  courseOrders?: Order[];
  productOrders?: Order[];
  onOrderStatus?: (id: string, status: string, days?: string) => void;
  onDeleteOrder?: (id: string) => void;
}) {
  const [bookings, setBookings] = useState<JourneyBooking[]>([]);
  const [reviews, setReviews] = useState<JourneyReview[]>([]);
  const [services, setServices] = useState<ServiceBooking[]>([]);
  const [tab, setTab] = useState<"bookings" | "services" | "courses" | "products" | "reviews">("bookings");
  const [reviewFilter, setReviewFilter] = useState<"all" | "journey" | "home" | "course">("all");
  const [err, setErr] = useState("");
  const [serviceItems, setServiceItems] = useState<CmsItem[]>([]);
  const [manual, setManual] = useState({ itemId: "", date: "", time: "", name: "", phone: "", note: "" });

  const load = useCallback(() => {
    fetch("/api/admin/journey", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { bookings: [], reviews: [], services: [] }))
      .then((d) => { setBookings(d.bookings || []); setReviews(d.reviews || []); setServices(d.services || []); })
      .catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" }).then((r) => r.json())
      .then((d) => setServiceItems((d.items || []).filter((i: CmsItem) => i.kind === "service"))).catch(() => {});
  }, []);

  async function blockSlot(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const item = serviceItems.find((i) => i.id === manual.itemId);
    const res = await fetch("/api/admin/journey", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...manual, serviceName: item?.title || "" }),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || "Алдаа гарлаа."); return; }
    setManual({ itemId: "", date: "", time: "", name: "", phone: "", note: "" });
    load();
  }

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
  const kindOf = (slug: string): "home" | "course" | "journey" =>
    slug === "home" ? "home" : slug.startsWith("item-") ? "course" : "journey";
  const filteredReviews = reviews.filter((r) => reviewFilter === "all" || kindOf(r.slug) === reviewFilter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {([["bookings", "Аяллын захиалга"], ["services", "Заслын цаг"], ["courses", "Сургалтын захиалга"], ["products", "Бүтээгдэхүүний захиалга"], ["reviews", "Аяллын сэтгэгдэл"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={"rounded-full px-5 py-2 text-sm font-semibold transition " + (tab === k ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-surface-1 text-ink/70 hover:border-primary-300")}>
            {l} ({k === "bookings" ? bookings.length : k === "services" ? services.length : k === "courses" ? courseOrders.length : k === "products" ? productOrders.length : reviews.length})
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

      {tab === "services" && (
        <div className="space-y-4">
          <form onSubmit={blockSlot} className="card grid gap-3 p-4 md:grid-cols-3">
            <div className="md:col-span-3"><h3 className="font-display font-semibold text-ink">Админаас цаг захиалгатай болгох</h3><p className="mt-1 text-sm text-muted">Утсаар авсан захиалга эсвэл хаах шаардлагатай цагийг энд бүртгэнэ.</p></div>
            <select required className="input" value={manual.itemId} onChange={(e) => setManual({ ...manual, itemId: e.target.value })}>
              <option value="">Үйлчилгээ сонгох</option>{serviceItems.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
            </select>
            <input required type="date" className="input" value={manual.date} onChange={(e) => setManual({ ...manual, date: e.target.value })} />
            <select required className="input" value={manual.time} onChange={(e) => setManual({ ...manual, time: e.target.value })}>
              <option value="">Цаг сонгох</option>
              {slotsOf(serviceItems.find((i) => i.id === manual.itemId)).map((s) => <option key={s}>{s}</option>)}
            </select>
            <input className="input" placeholder="Захиалагчийн нэр (заавал биш)" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} />
            <input className="input" placeholder="Утас (заавал биш)" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} />
            <button className="btn btn-primary btn-sm" type="submit">Захиалгатай болгох</button>
          </form>
          <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-line bg-aqua">
              <tr>
                {["Огноо", "Цаг", "Үйлчилгээ", "Нэр", "Утас", "Төлөв", "Үйлдэл"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-sm font-semibold text-ink">{b.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-700">{b.time}</td>
                  <td className="px-4 py-3 text-sm text-ink/80">{b.serviceName}</td>
                  <td className="px-4 py-3 text-sm text-ink/80">{b.name}</td>
                  <td className="px-4 py-3 text-sm text-ink/80">{b.phone}</td>
                  <td className="px-4 py-3">
                    <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + STATUS_CLASS[b.status]}>{STATUS_LABEL[b.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {b.status !== "confirmed" && (
                        <button onClick={() => patch({ serviceBookingId: b.id, status: "confirmed" })} className="rounded-md bg-jade-400/15 px-2 py-1 text-xs font-semibold text-jade-600 hover:bg-jade-400/25">Баталгаажуулах</button>
                      )}
                      {b.status !== "done" && (
                        <button onClick={() => patch({ serviceBookingId: b.id, status: "done" })} className="rounded-md bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-200">Дууссан</button>
                      )}
                      {b.status !== "cancelled" && (
                        <button onClick={() => patch({ serviceBookingId: b.id, status: "cancelled" })} className="rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-200">Цуцлах</button>
                      )}
                      <button onClick={() => remove("serviceBookingId=" + b.id)} className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-ink/60 hover:bg-line/40">Устгах</button>
                    </div>
                    {b.note && <p className="mt-1.5 text-xs text-muted">📝 {b.note}</p>}
                  </td>
                </tr>
              ))}
              {services.length === 0 && <tr><td className="px-4 py-6 text-sm text-muted" colSpan={7}>Цаг захиалга алга.</td></tr>}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-line bg-aqua"><tr>{["Огноо", "Сургалт", "Нэр", "Утас", "Дүн", "Төлөв", "Үйлдэл"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">{h}</th>)}</tr></thead>
            <tbody>
              {courseOrders.map((o) => <tr key={o.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-sm text-ink/80">{o.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-ink">{o.items.filter((i) => i.kind === "course").map((i) => i.title).join(", ")}</td>
                <td className="px-4 py-3 text-sm text-ink/80">{o.customer.name}</td><td className="px-4 py-3 text-sm text-ink/80">{o.customer.phone || "—"}</td>
                <td className="px-4 py-3 text-sm font-semibold text-ink">{o.total.toLocaleString("mn-MN")}₮</td>
                <td className="px-4 py-3"><span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">{o.status === "pending" ? "Хүлээгдэж буй" : o.status === "paid" ? "Баталгаажсан" : "Цуцалсан"}</span></td>
                <td className="px-4 py-3"><div className="flex flex-wrap gap-2">{o.status === "pending" && <button onClick={() => onOrderStatus?.(o.id, "paid", "30")} className="rounded-md bg-jade-400/15 px-2 py-1 text-xs font-semibold text-jade-600">Баталгаажуулах</button>}{o.status !== "cancelled" && <button onClick={() => onOrderStatus?.(o.id, "cancelled")} className="rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-500">Цуцлах</button>}<button onClick={() => onDeleteOrder?.(o.id)} className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-ink/60">Устгах</button></div></td>
              </tr>)}
              {courseOrders.length === 0 && <tr><td colSpan={7} className="px-4 py-6 text-sm text-muted">Сургалтын захиалга алга.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-3">
          {productOrders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold text-ink">{o.customer.name} <span className="font-mono text-xs font-normal text-muted">#{o.id.slice(0, 6).toUpperCase()}</span></p>
                  <p className="mt-0.5 text-sm text-muted">{o.customer.phone || "—"} · {o.customer.email || "—"}</p>
                  <p className="mt-0.5 text-xs text-muted">{o.createdAt.slice(0, 10)}</p>
                </div>
                <span className={
                  "rounded-full px-2.5 py-1 text-xs font-semibold " +
                  (o.status === "paid" ? "bg-jade-400/15 text-jade-600" : o.status === "cancelled" ? "bg-rose-100 text-rose-500" : "bg-amber-100 text-amber-700")
                }>
                  {o.status === "pending" ? "Хүлээгдэж буй" : o.status === "paid" ? "Баталгаажсан" : "Цуцалсан"}
                </span>
              </div>

              {/* Захиалсан бүтээгдэхүүн бүрийн дэлгэрэнгүй */}
              <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[520px]">
                  <thead className="border-b border-line bg-aqua">
                    <tr>
                      {["Бүтээгдэхүүн", "Тоо ширхэг", "Нэгжийн үнэ", "Дүн"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {o.items.filter((i) => i.kind === "product").map((i, idx) => (
                      <tr key={idx} className="border-b border-line last:border-0">
                        <td className="px-3 py-2 text-sm font-medium text-ink">{i.title}</td>
                        <td className="px-3 py-2 text-sm text-ink/80">{i.qty}</td>
                        <td className="px-3 py-2 text-sm text-ink/80">{i.price.toLocaleString("mn-MN")}₮</td>
                        <td className="px-3 py-2 text-sm font-semibold text-ink">{(i.price * i.qty).toLocaleString("mn-MN")}₮</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">{o.customer.note && <>📝 {o.customer.note}</>}</p>
                <p className="font-display text-lg font-semibold text-primary-700">Нийт: {o.total.toLocaleString("mn-MN")}₮</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {o.status === "pending" && <button onClick={() => onOrderStatus?.(o.id, "paid")} className="rounded-md bg-jade-400/15 px-3 py-1.5 text-xs font-semibold text-jade-600 hover:bg-jade-400/25">Баталгаажуулах</button>}
                {o.status !== "cancelled" && <button onClick={() => onOrderStatus?.(o.id, "cancelled")} className="rounded-md bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-200">Цуцлах</button>}
                <button onClick={() => onDeleteOrder?.(o.id)} className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink/60 hover:bg-line/40">Устгах</button>
              </div>
            </div>
          ))}
          {productOrders.length === 0 && <p className="card p-6 text-sm text-muted">Бүтээгдэхүүний захиалга алга.</p>}
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-3">
          <p className="rounded-xl bg-aqua px-4 py-2.5 text-sm text-muted">
            ℹ️ Төрөл (аялал / нүүр хуудас / хичээл) тус бүрд <b>дээд тал нь 3</b> сэтгэгдлийг сонгож нийтэд харуулна — Аяллын
            хуудсанд, нүүр хуудсанд, эсвэл тухайн хичээлийн хуудсанд харагдана. Доор шүүлтүүрээр төрлөөр нь ялгаж үзээрэй.
          </p>
          <div className="flex flex-wrap gap-2">
            {([
              ["all", "Бүгд"],
              ["journey", "🧭 Аяллын сэтгэгдэл"],
              ["home", "🏠 Нүүр хуудас"],
              ["course", "💬 Хичээлийн сэтгэгдэл"],
            ] as const).map(([k, l]) => (
              <button key={k} onClick={() => setReviewFilter(k)}
                className={"rounded-full px-4 py-1.5 text-xs font-semibold transition " + (reviewFilter === k ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-surface-1 text-ink/70 hover:border-primary-300")}>
                {l} ({k === "all" ? reviews.length : reviews.filter((r) => kindOf(r.slug) === k).length})
              </button>
            ))}
          </div>
          {filteredReviews.map((r) => (
            <div key={r.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display font-semibold text-ink">{r.name}</span>
                  <span className="text-accent-300">{"★".repeat(r.rating)}</span>
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted">
                    {r.slug === "home" ? "🏠 Нүүр хуудас" : r.slug.startsWith("item-") ? "💬 Хичээлийн сэтгэгдэл" : "🧭 " + r.slug}
                  </span>
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
          {filteredReviews.length === 0 && <p className="card p-6 text-sm text-muted">Энэ төрлөөр сэтгэгдэл алга.</p>}
        </div>
      )}
    </div>
  );
}
