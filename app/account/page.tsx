"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { formatMNT } from "@/lib/format";
import type { JourneyBooking, Order, ServiceBooking } from "@/lib/types";
import { Journey3D } from "@/components/three/Journey3D";

type HeroMedia = { kind: "video" | "image"; url: string };

export default function AccountPage() {
  const { user, loading, logout, updateProfile } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [journeyBookings, setJourneyBookings] = useState<JourneyBooking[]>([]);
  const [heroMedia, setHeroMedia] = useState<HeroMedia | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [saved, setSaved] = useState(false);

  /** Захиалга цуцлах / огноо өөрчлөх */
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reschedId, setReschedId] = useState<string | null>(null);
  const [reschedKind, setReschedKind] = useState<"journey" | "service" | null>(null);
  const [reschedItemId, setReschedItemId] = useState("");
  const [reschedOrig, setReschedOrig] = useState<{ date: string; time: string } | null>(null);
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");
  const [reschedSlots, setReschedSlots] = useState<string[]>([]);
  const [reschedSlotsLoading, setReschedSlotsLoading] = useState(false);
  const [actionErr, setActionErr] = useState<Record<string, string>>({});

  const statusLabel = (s: string) => s === "pending" ? "Хүлээгдэж буй" : s === "confirmed" ? "Баталгаажсан" : s === "done" ? "Дууссан" : "Цуцалсан";
  const miniInputCls = "focus-ring rounded-xl border-2 border-line bg-surface-1 px-3 py-2 text-sm text-ink outline-none transition hover:border-primary-400/60 focus:border-primary-500";
  const todayISO = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`; };

  function openResched(kind: "journey" | "service", id: string, date: string, time?: string, itemId?: string) {
    setReschedId(id); setReschedKind(kind); setReschedItemId(itemId || "");
    setReschedOrig({ date, time: time || "" });
    setReschedDate(date); setReschedTime(""); setReschedSlots([]);
    setActionErr((e) => ({ ...e, [id]: "" }));
  }

  // Тухайн зүйлийн admin тохируулсан ажлын өдөр/цагийг дагаж — зөвхөн бодит сул цагуудыг харуулна
  useEffect(() => {
    if (reschedKind !== "service" || !reschedId || !reschedDate || !reschedItemId) { setReschedSlots([]); return; }
    let alive = true;
    setReschedSlotsLoading(true);
    fetch(`/api/service/booking?itemId=${encodeURIComponent(reschedItemId)}&date=${encodeURIComponent(reschedDate)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { slots: [] }))
      .then((d) => {
        if (!alive) return;
        let slots: string[] = d.slots || [];
        // Хэрэглэгчийн одоогийн захиалсан цаг өөрөө "авсан" тул шүүлтэд орохгүй байж болно — үүнийг буцааж нэмнэ
        if (reschedOrig && reschedDate === reschedOrig.date && reschedOrig.time && !slots.includes(reschedOrig.time)) {
          slots = [...slots, reschedOrig.time].sort();
        }
        setReschedSlots(slots);
      })
      .catch(() => alive && setReschedSlots([]))
      .finally(() => alive && setReschedSlotsLoading(false));
    return () => { alive = false; };
  }, [reschedKind, reschedId, reschedDate, reschedItemId, reschedOrig]);

  async function doCancel(kind: "journey" | "service", id: string) {
    if (!confirm("Захиалгаа цуцлах уу?")) return;
    setBusyId(id); setActionErr((e) => ({ ...e, [id]: "" }));
    try {
      const res = await fetch("/api/account/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, action: "cancel" }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Алдаа гарлаа.");
      if (kind === "service") setServiceBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
      else setJourneyBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    } catch (e) {
      setActionErr((er) => ({ ...er, [id]: e instanceof Error ? e.message : "Алдаа гарлаа." }));
    } finally {
      setBusyId(null);
    }
  }

  async function doResched(kind: "journey" | "service", id: string) {
    if (!reschedDate || (kind === "service" && !reschedTime)) {
      setActionErr((e) => ({ ...e, [id]: kind === "service" ? "Огноо, цагаа сонгоно уу." : "Огноогоо сонгоно уу." }));
      return;
    }
    setBusyId(id); setActionErr((e) => ({ ...e, [id]: "" }));
    try {
      const res = await fetch("/api/account/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, action: "reschedule", date: reschedDate, time: reschedTime }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Алдаа гарлаа.");
      if (kind === "service") setServiceBookings((bs) => bs.map((b) => (b.id === id ? { ...b, date: reschedDate, time: reschedTime, status: "pending" } : b)));
      else setJourneyBookings((bs) => bs.map((b) => (b.id === id ? { ...b, date: reschedDate, status: "pending" } : b)));
      setReschedId(null); setReschedKind(null); setReschedItemId(""); setReschedOrig(null);
    } catch (e) {
      setActionErr((er) => ({ ...er, [id]: e instanceof Error ? e.message : "Алдаа гарлаа." }));
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || "", email: user.email });
  }, [user]);

  useEffect(() => {
    fetch("/api/hero?slot=account", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.media && setHeroMedia(d.media))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/orders", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/account/bookings", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([orderData, bookingData]) => {
        setOrders(orderData.orders || []);
        setServiceBookings(bookingData.services || []);
        setJourneyBookings(bookingData.journeys || []);
      })
      .catch(() => { setOrders([]); setServiceBookings([]); setJourneyBookings([]); })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveErr("");
    try {
      await updateProfile(form);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    if (user) setForm({ name: user.name, phone: user.phone || "", email: user.email });
    setSaveErr("");
    setEditing(false);
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container-px flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-primary-200 border-t-primary-600" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md rounded-4xl border border-line bg-surface-1 p-10 text-center shadow-card">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-50 text-3xl">🔐</div>
            <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t("account.loginRequired")}</h1>
            <p className="mt-3 text-muted">{t("account.loginRequiredSub")}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login" className="btn btn-primary btn-md">{t("auth.login")}</Link>
              <Link href="/register" className="btn btn-outline btn-md">{t("auth.register")}</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    {/* Хувийн мандал — хөнгөн 3D тайз, хэрэглээг дарамтлахгүй богино */}
    <Journey3D
      media={heroMedia ?? undefined}
      world="mandala"
      eyebrow="The Personal Mandala"
      title={user.name}
      desc="Таны хувийн энергийн булан — сургалт, захиалга, аяны ахиц энд цугларна."
      heightVh={130}
    />
    <section className="section">
      <div className="container-px">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-grad text-2xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">{user.name}</h1>
              <p className="text-muted">{user.email}</p>
            </div>
          </div>
          <button onClick={() => logout().then(() => router.push("/"))} className="btn btn-outline btn-md">{t("account.logout")}</button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="card h-fit p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">{editing ? t("account.editTitle") : t("account.profile")}</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-sm font-semibold text-primary-700 transition hover:underline">
                  ✎ {t("account.edit")}
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={onSave} className="mt-4 space-y-3 border-t border-line pt-4">
                <div>
                  <label className="field-label" htmlFor="pname">{t("form.name")}</label>
                  <input id="pname" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="field-label" htmlFor="pphone">{t("form.phone")}</label>
                  <input id="pphone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9900 0000" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pemail">{t("form.email")}</label>
                  <input id="pemail" type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                {saveErr && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{saveErr}</p>}
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={saving} className="btn btn-primary btn-sm flex-1">{saving ? t("account.saving") : t("account.save")}</button>
                  <button type="button" onClick={cancelEdit} className="btn btn-outline btn-sm">{t("account.cancel")}</button>
                </div>
              </form>
            ) : (
              <>
                <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">{t("form.name")}</dt><dd className="font-medium text-ink">{user.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">{t("form.email")}</dt><dd className="font-medium text-ink">{user.email}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">{t("form.phone")}</dt><dd className="font-medium text-ink">{user.phone || "—"}</dd></div>
                </dl>
                {saved && <p className="mt-3 text-sm font-medium text-jade-600">{t("account.saved")}</p>}
              </>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-ink">{t("account.myOrders")}</h2>
            {ordersLoading ? (
              <p className="mt-4 text-muted">{t("account.loading")}</p>
            ) : orders.length === 0 && serviceBookings.length === 0 && journeyBookings.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-cream p-8 text-center">
                <p className="text-muted">{t("account.noOrders")}</p>
                <Link href="/services" className="btn btn-primary btn-sm mt-4">{t("nav.services")}</Link>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {serviceBookings.map((b) => {
                  const editable = b.status !== "cancelled" && b.status !== "done";
                  return (
                    <div key={b.id} className="rounded-2xl border border-line p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-ink">🗓 {b.serviceName}</span>
                        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{statusLabel(b.status)}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted">{b.date} · {b.time}</p>
                      {editable && reschedId !== b.id && (
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                          <button type="button" disabled={busyId === b.id} onClick={() => openResched("service", b.id, b.date, b.time, b.itemId)} className="text-xs font-semibold text-primary-700 transition hover:underline disabled:opacity-50">Огноо/цаг өөрчлөх</button>
                          <button type="button" disabled={busyId === b.id} onClick={() => doCancel("service", b.id)} className="text-xs font-semibold text-rose-600 transition hover:underline disabled:opacity-50">Цуцлах</button>
                        </div>
                      )}
                      {reschedId === b.id && (
                        <div className="mt-3 rounded-xl bg-cream p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <input type="date" min={todayISO()} className={miniInputCls} value={reschedDate} onChange={(e) => setReschedDate(e.target.value)} />
                            <button type="button" disabled={busyId === b.id || !reschedTime} onClick={() => doResched("service", b.id)} className="btn btn-primary btn-sm disabled:opacity-60">{busyId === b.id ? "…" : "Хадгалах"}</button>
                            <button type="button" onClick={() => { setReschedId(null); setReschedKind(null); setReschedItemId(""); setReschedOrig(null); }} className="btn btn-outline btn-sm">Болих</button>
                          </div>
                          <div className="mt-2.5">
                            {reschedSlotsLoading ? (
                              <p className="text-xs text-muted">Сул цаг шалгаж байна…</p>
                            ) : reschedSlots.length === 0 ? (
                              <p className="text-xs text-amber-700">Энэ өдөр сул цаг алга. Өөр өдөр сонгоно уу.</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {reschedSlots.map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setReschedTime(s)}
                                    aria-pressed={reschedTime === s}
                                    className={"focus-ring rounded-full px-3 py-1.5 text-xs font-semibold transition " + (reschedTime === s ? "bg-primary-grad text-white" : "border border-line bg-surface-1 text-ink/75 hover:border-primary-400 hover:text-primary-700")}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {actionErr[b.id] && <p className="mt-2 text-xs text-rose-600">{actionErr[b.id]}</p>}
                    </div>
                  );
                })}
                {journeyBookings.map((b) => {
                  const editable = b.status !== "cancelled" && b.status !== "done";
                  return (
                    <div key={b.id} className="rounded-2xl border border-line p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-ink">🧭 {b.journeyName}</span>
                        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{statusLabel(b.status)}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted">{b.date} · {b.people} хүн</p>
                      {editable && reschedId !== b.id && (
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                          <button type="button" disabled={busyId === b.id} onClick={() => openResched("journey", b.id, b.date)} className="text-xs font-semibold text-primary-700 transition hover:underline disabled:opacity-50">Огноо өөрчлөх</button>
                          <button type="button" disabled={busyId === b.id} onClick={() => doCancel("journey", b.id)} className="text-xs font-semibold text-rose-600 transition hover:underline disabled:opacity-50">Цуцлах</button>
                        </div>
                      )}
                      {reschedId === b.id && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-cream p-3">
                          <input type="date" min={todayISO()} className={miniInputCls} value={reschedDate} onChange={(e) => setReschedDate(e.target.value)} />
                          <button type="button" disabled={busyId === b.id} onClick={() => doResched("journey", b.id)} className="btn btn-primary btn-sm disabled:opacity-60">{busyId === b.id ? "…" : "Хадгалах"}</button>
                          <button type="button" onClick={() => { setReschedId(null); setReschedKind(null); }} className="btn btn-outline btn-sm">Болих</button>
                        </div>
                      )}
                      {actionErr[b.id] && <p className="mt-2 text-xs text-rose-600">{actionErr[b.id]}</p>}
                    </div>
                  );
                })}
                {orders.map((o) => {
                  const daysLeft = o.status === "paid" && o.expiresAt
                    ? Math.ceil((new Date(o.expiresAt).getTime() - Date.now()) / 86400000)
                    : null;
                  return (
                    <div key={o.id} className="rounded-2xl border border-line p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-sm text-primary-700">#{o.id.slice(0, 8).toUpperCase()}</span>
                        <span className="rounded-full bg-jade-400/10 px-3 py-1 text-xs font-semibold text-jade-600">{t("status." + o.status)}</span>
                      </div>
                      <div className="mt-3 space-y-1 border-t border-line pt-3">
                        {o.items.map((it) => (
                          <div key={it.kind + it.slug} className="flex justify-between text-sm">
                            <span className="text-ink/80">{it.title} × {it.qty}</span>
                            <span className="font-medium text-ink">{formatMNT(it.price * it.qty)}</span>
                          </div>
                        ))}
                      </div>
                      {daysLeft !== null && (
                        daysLeft > 0 ? (
                          <p className="mt-3 rounded-xl bg-jade-400/10 px-3 py-2 text-sm text-jade-600">
                            ✓ Идэвхтэй — Үзэх хугацаа дуусахад <span className="font-semibold">{daysLeft} хоног</span> үлдсэн
                          </p>
                        ) : (
                          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">Үзэх хугацаа дууссан байна.</p>
                        )
                      )}
                      <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold text-ink">
                        <span>{t("cart.total")}</span><span>{formatMNT(o.total)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
