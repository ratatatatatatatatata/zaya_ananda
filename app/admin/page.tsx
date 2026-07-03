"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { testimonials } from "@/data/content";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { formatMNT, cx } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { AdminContentManager } from "@/components/AdminContentManager";
import { AdminSettings } from "@/components/AdminSettings";
import { AdminPages } from "@/components/AdminPages";
import type { Order, PublicUser, ContactMessage } from "@/lib/types";

const nav: { id: string; k: string; label?: string; icon: string }[] = [
  { id: "overview", k: "admin.overview", icon: "sparkles" },
  { id: "users", k: "admin.users", icon: "user" },
  { id: "orders", k: "admin.orders", icon: "calendar" },
  { id: "services", k: "admin.servicesM", icon: "star" },
  { id: "courses", k: "admin.coursesM", icon: "award" },
  { id: "products", k: "admin.productsM", icon: "laptop" },
  { id: "events", k: "admin.eventsM", label: "Зөвлөгөө", icon: "calendar" },
  { id: "promos", k: "admin.promosM", label: "Сурталчилгаа", icon: "star" },
  { id: "gift", k: "admin.giftM", label: "Гэгээн бэлэг", icon: "award" },
  { id: "reviews", k: "admin.reviews", icon: "star" },
  { id: "messages", k: "nav.contact", icon: "user" },
  { id: "pages", k: "admin.pagesM", label: "Ерөнхий тохиргоо (Цэс)", icon: "laptop" },
  { id: "settings", k: "admin.settingsM", label: "Тохиргоо", icon: "sparkles" },
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { t, tr, lang } = useI18n();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState<{ stats: any; users: PublicUser[]; orders: Order[]; messages: ContactMessage[] } | null>(null);
  const [denied, setDenied] = useState(false);
  const [cmsCount, setCmsCount] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmDays, setConfirmDays] = useState("30");

  useEffect(() => {
    if (!user) return;
    fetch("/api/admin/overview", { cache: "no-store" })
      .then((r) => { if (r.status === 403) { setDenied(true); return null; } return r.json(); })
      .then((d) => d && setData(d))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/admin/content", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setCmsCount((d.items || []).length))
      .catch(() => {});
  }, [user]);

  const reloadData = async () => { const r = await fetch("/api/admin/overview", { cache: "no-store" }); if (r.ok) setData(await r.json()); };
  async function setOrderStatus(id: string, status: string, days?: string) {
    const payload: Record<string, unknown> = { id, status };
    if (days !== undefined && days !== "") payload.days = Number(days);
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    reloadData();
  }
  async function deleteOrder(id: string) {
    if (!confirm("Энэ захиалгыг устгах уу?")) return;
    await fetch("/api/admin/orders?id=" + id, { method: "DELETE" }); reloadData();
  }
  async function deleteMessage(id: string) {
    if (!confirm("Энэ зурвасыг устгах уу?")) return;
    await fetch("/api/admin/messages?id=" + id, { method: "DELETE" }); reloadData();
  }
  async function resetUserPassword(id: string, name: string) {
    const pw = prompt(`"${name}" хэрэглэгчийн шинэ нууц үгийг оруулна уу (6+ тэмдэгт):`);
    if (!pw) return;
    if (pw.length < 6) { alert("Нууц үг 6-аас дээш тэмдэгт байх ёстой."); return; }
    const r = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, password: pw }) });
    if (r.ok) alert("Нууц үг шинэчлэгдлээ. Хэрэглэгчид шинэ нууц үгийг нь мэдэгдээрэй.");
    else alert(((await r.json().catch(() => ({}))) as { error?: string }).error || "Алдаа гарлаа.");
  }

  if (loading) return <div className="section"><div className="container-px flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-primary-200 border-t-primary-600" /></div></div>;
  if (!user) {
    return <div className="section"><div className="container-px"><div className="mx-auto max-w-md rounded-4xl border border-line bg-white p-10 text-center shadow-card">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-50 text-3xl">🔐</div>
      <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t("admin.loginReq")}</h1>
      <Link href="/login" className="btn btn-primary btn-md mt-6">{t("auth.login")}</Link></div></div></div>;
  }

  const stat = (label: string, value: string, icon: string) => (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-50 text-primary-600"><Icon name={icon} /></span>
      <div><div className="font-display text-2xl font-semibold text-ink">{value}</div><div className="text-sm text-muted">{label}</div></div>
    </div>
  );
  const Th = ({ children }: { children: React.ReactNode }) => <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">{children}</th>;
  const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => <td className={cx("px-4 py-3 text-sm text-ink/80", className)}>{children}</td>;

  return (
    <div className="bg-[#f3f8f7]">
      <div className="container-px py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">⚙ {t("admin.title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("admin.demoNote")}</p>
          </div>
          <Link href="/" className="btn btn-outline btn-sm">{t("admin.backSite")}</Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[230px_1fr]">
          <aside className="h-fit rounded-3xl border border-line bg-white p-2 lg:sticky lg:top-24">
            {nav.map((n) => (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={cx("flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition", tab === n.id ? "bg-primary-50 text-primary-700" : "text-ink/70 hover:bg-primary-50/60")}>
                <Icon name={n.icon} className="h-4 w-4" /> {n.label ?? t(n.k)}
              </button>
            ))}
          </aside>

          <main className="min-w-0">
            {denied && <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">403 — Forbidden (ADMIN_EMAIL).</p>}

            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {stat(t("admin.totalUsers"), String(data?.stats.users ?? "—"), "user")}
                  {stat(t("admin.totalOrders"), String(data?.stats.orders ?? "—"), "calendar")}
                  {stat(t("admin.revenue"), data ? formatMNT(data.stats.revenue) : "—", "award")}
                  {stat(t("admin.catalog"), String(cmsCount), "laptop")}
                </div>
                <div className="card overflow-hidden">
                  <h2 className="px-5 pt-5 font-display text-lg font-semibold text-ink">{t("admin.recent")}</h2>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="border-y border-line bg-aqua"><tr><Th>#</Th><Th>{t("admin.colName")}</Th><Th>{t("admin.colDate")}</Th><Th>{t("admin.colItems")}</Th><Th>{t("admin.colAmount")}</Th><Th>{t("admin.colStatus")}</Th></tr></thead>
                      <tbody>
                        {(data?.orders ?? []).slice(0, 8).map((o) => (
                          <tr key={o.id} className="border-b border-line last:border-0">
                            <Td className="font-mono text-xs text-primary-700">{o.id.slice(0, 6).toUpperCase()}</Td>
                            <Td>{o.customer.name}</Td><Td>{o.createdAt.slice(0, 10)}</Td><Td>{o.items.length}</Td>
                            <Td className="font-semibold text-ink">{formatMNT(o.total)}</Td>
                            <Td><span className="rounded-full bg-jade-400/10 px-2.5 py-1 text-xs font-semibold text-jade-600">{t("status." + o.status)}</span></Td>
                          </tr>
                        ))}
                        {(!data || data.orders.length === 0) && <tr><Td className="text-muted">{t("admin.empty")}</Td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {tab === "users" && (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="border-b border-line bg-aqua"><tr><Th>{t("admin.colName")}</Th><Th>{t("admin.colEmail")}</Th><Th>{t("form.phone")}</Th><Th>{t("admin.colDate")}</Th><Th>Үйлдэл</Th></tr></thead>
                  <tbody>
                    {(data?.users ?? []).map((u) => (
                      <tr key={u.id} className="border-b border-line last:border-0"><Td className="font-medium text-ink">{u.name}</Td><Td>{u.email}</Td><Td>{u.phone || "—"}</Td><Td>{u.createdAt.slice(0, 10)}</Td><Td><button onClick={() => resetUserPassword(u.id, u.name)} className="text-sm font-semibold text-primary-700 hover:underline">Нууц үг солих</button></Td></tr>
                    ))}
                    {(!data || data.users.length === 0) && <tr><Td className="text-muted">{t("admin.empty")}</Td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "orders" && (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="border-b border-line bg-aqua"><tr><Th>#</Th><Th>{t("admin.colName")}</Th><Th>{t("admin.colEmail")}</Th><Th>{t("form.phone")}</Th><Th>{t("admin.colItems")}</Th><Th>{t("admin.colAmount")}</Th><Th>{t("admin.colStatus")}</Th></tr></thead>
                  <tbody>
                    {(data?.orders ?? []).map((o) => (
                      <tr key={o.id} className="border-b border-line last:border-0"><Td className="font-mono text-xs text-primary-700">{o.id.slice(0, 6).toUpperCase()}</Td><Td>{o.customer.name}</Td><Td>{o.customer.email}</Td><Td>{o.customer.phone || "—"}</Td><Td>{o.items.map((i) => i.title).join(", ")}</Td><Td className="font-semibold text-ink">{formatMNT(o.total)}</Td><Td><div className="flex flex-col gap-1.5">
                    <span className={cx("w-fit rounded-full px-2.5 py-1 text-xs font-semibold", o.status === "paid" ? "bg-jade-400/15 text-jade-600" : o.status === "cancelled" ? "bg-rose-100 text-rose-500" : "bg-amber-100 text-amber-600")}>{t("status." + o.status)}</span>
                    {o.status === "paid" && o.expiresAt && (Math.ceil((new Date(o.expiresAt).getTime() - Date.now()) / 86400000) > 0
                      ? <span className="w-fit text-xs font-semibold text-primary-700">⏳ {Math.ceil((new Date(o.expiresAt).getTime() - Date.now()) / 86400000)} хоног үлдсэн</span>
                      : <span className="w-fit rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-500">Эрх дууслаа</span>)}
                    {confirmId === o.id ? (
                      <div className="flex items-center gap-1.5"><input type="number" value={confirmDays} onChange={(e) => setConfirmDays(e.target.value)} className="w-16 rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-primary-400" /><span className="text-xs text-muted">хоног</span><button onClick={() => { setOrderStatus(o.id, "paid", confirmDays); setConfirmId(null); }} className="rounded-md bg-jade-400/15 px-2 py-1 text-xs font-semibold text-jade-600 hover:bg-jade-400/25">Батлах</button><button onClick={() => setConfirmId(null)} className="text-xs text-muted hover:text-ink">Болих</button></div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">{o.status === "pending" && <button onClick={() => { setConfirmId(o.id); setConfirmDays("30"); }} className="rounded-md bg-jade-400/15 px-2 py-1 text-xs font-semibold text-jade-600 hover:bg-jade-400/25">Баталгаажуулах</button>}{o.status !== "cancelled" && <button onClick={() => setOrderStatus(o.id, "cancelled")} className="rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-200">Цуцлах</button>}<button onClick={() => deleteOrder(o.id)} className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-ink/60 hover:bg-line/40">Устгах</button></div>
                    )}
                  </div></Td></tr>
                    ))}
                    {(!data || data.orders.length === 0) && <tr><Td className="text-muted">{t("admin.empty")}</Td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "services" && <AdminContentManager kind="service" />}
            {tab === "courses" && <AdminContentManager kind="course" />}
            {tab === "products" && <AdminContentManager kind="product" />}
            {tab === "events" && <AdminContentManager kind="resource" />}
            {tab === "promos" && <AdminContentManager kind="promo" />}
            {tab === "gift" && <AdminContentManager kind="free" />}
            {tab === "pages" && <AdminPages />}
            {tab === "settings" && <AdminSettings />}
            {tab === "messages" && (
              <div className="card overflow-x-auto"><table className="w-full min-w-[680px]">
                <thead className="border-b border-line bg-aqua"><tr><Th>{t("admin.colName")}</Th><Th>{t("admin.colEmail")}</Th><Th>{t("form.phone")}</Th><Th>{t("contact.subject")}</Th><Th>{t("contact.message")}</Th><Th>{t("admin.colDate")}</Th><Th>Үйлдэл</Th></tr></thead>
                <tbody>{(data?.messages ?? []).map((m) => (<tr key={m.id} className="border-b border-line last:border-0"><Td className="font-medium text-ink">{m.name}</Td><Td>{m.email || "—"}</Td><Td>{m.phone || "—"}</Td><Td>{m.subject}</Td><Td className="max-w-md truncate">{m.message}</Td><Td>{m.createdAt.slice(0, 10)}</Td><Td className="text-right"><button onClick={() => deleteMessage(m.id)} className="text-sm font-semibold text-rose-500 hover:underline">Устгах</button></Td></tr>))}
                {(!data || data.messages.length === 0) && <tr><Td className="text-muted">{t("admin.empty")}</Td></tr>}</tbody>
              </table></div>
            )}
            {tab === "reviews" && (
              <div className="card overflow-x-auto"><table className="w-full min-w-[480px]">
                <thead className="border-b border-line bg-aqua"><tr><Th>{t("admin.colName")}</Th><Th>★</Th><Th>{t("admin.reviews")}</Th></tr></thead>
                <tbody>{testimonials.map((r) => (<tr key={r.id} className="border-b border-line last:border-0"><Td className="font-medium text-ink">{r.name}</Td><Td className="text-accent-500">{"★".repeat(r.rating)}</Td><Td className="max-w-md truncate">{tr(r.quote)}</Td></tr>))}</tbody>
              </table></div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
