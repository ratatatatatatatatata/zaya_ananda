"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { formatMNT } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function AccountPage() {
  const { user, loading, logout, updateProfile } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || "", email: user.email });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]))
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
          <div className="mx-auto max-w-md rounded-4xl border border-line bg-white p-10 text-center shadow-card">
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
            ) : orders.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-cream p-8 text-center">
                <p className="text-muted">{t("account.noOrders")}</p>
                <Link href="/services" className="btn btn-primary btn-sm mt-4">{t("nav.services")}</Link>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {orders.map((o) => (
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
                    <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold text-ink">
                      <span>{t("cart.total")}</span><span>{formatMNT(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
