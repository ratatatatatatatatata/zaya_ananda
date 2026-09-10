"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const pad = (n: number) => String(n).padStart(2, "0");

/** Аяллын цаг захиалга — энгийн бүртгэл (огноо сонгохгүй, шууд бүртгүүлнэ). */
export function JourneyBooking({ slug, journeyName, prepay: prepayPerPerson = 0 }: { slug: string; journeyName: string; prepay?: number }) {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const [form, setForm] = useState({ name: "", phone: "", email: "", people: "1", note: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  /** Дансны мэдээлэл — админы тохиргооноос */
  const [bank, setBank] = useState<{ bankName?: string; account?: string; holder?: string }>({});
  useEffect(() => {
    if (!prepayPerPerson) return;
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.settings?.bank) setBank(d.settings.bank); })
      .catch(() => {});
  }, [prepayPerPerson]);

  const money = (n: number) => n.toLocaleString("mn-MN") + "₮";
  /** Гүйлгээний утга — админ таних кодтой */
  const payRef = (form.phone || "").replace(/\D/g, "").slice(-8);
  const prepayTotal = prepayPerPerson * (Number(form.people) || 1);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/journey/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, date: todayKey, people: Number(form.people) || 1 }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setDone(true);
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setBusy(false); }
  }

  const inputCls = "focus-ring w-full rounded-2xl border-2 border-line bg-surface-1 px-4 py-3 text-[1rem] text-ink outline-none transition hover:border-primary-400/60 focus:border-primary-500";

  if (!user) {
    return (
      <div className="panel p-8 text-center sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-3xl">🔐</div>
        <p className="mt-4 font-display text-xl font-semibold text-ink">Аялалд бүртгүүлэхийн тулд нэвтэрнэ үү</p>
        <p className="mt-2 leading-relaxed text-muted">Захиалгаа хадгалж, төлөв өөрчлөгдөх бүрд мэдэгдэл авахын тулд эхлээд бүртгэлдээ нэвтэрнэ үү.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="btn btn-primary btn-md">Нэвтрэх</Link>
          <Link href="/register" className="btn btn-outline btn-md">Бүртгүүлэх</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="panel p-8 text-center sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-jade-400/15 text-3xl text-jade-600">✓</div>
        <p className="mt-4 font-display text-xl font-semibold text-ink">Захиалга хүлээж авлаа</p>
        <p className="mt-2 font-display text-lg font-semibold text-ink">«{journeyName}»</p>
        {prepayTotal <= 0 && <p className="mt-3 leading-relaxed text-muted">Админ баталгаажуулсны дараа мэдэгдэл ирнэ.</p>}

        {prepayTotal > 0 && (
          <div className="mt-5 rounded-2xl border-2 border-primary-400/50 bg-primary-50/50 p-5 text-left">
            <p className="text-center font-display text-base font-semibold text-ink">
              Урьдчилгаа <span className="text-primary-700">{money(prepayTotal)}</span>
            </p>
            <p className="mt-1 text-center text-xs leading-relaxed text-muted">
              Доорх данс руу шилжүүлснээр таны захиалга баталгаажна.
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {bank.bankName && (
                <div className="flex justify-between gap-3"><dt className="text-muted">Банк</dt><dd className="font-semibold text-ink">{bank.bankName}</dd></div>
              )}
              {bank.account && (
                <div className="flex justify-between gap-3"><dt className="text-muted">Данс</dt><dd className="font-semibold text-ink">{bank.account}</dd></div>
              )}
              {bank.holder && (
                <div className="flex justify-between gap-3"><dt className="text-muted">Хүлээн авагч</dt><dd className="font-semibold text-ink">{bank.holder}</dd></div>
              )}
              <div className="flex justify-between gap-3 border-t border-line pt-2">
                <dt className="text-muted">Гүйлгээний утга</dt>
                <dd className="font-semibold text-primary-700">{payRef || form.name}</dd>
              </div>
            </dl>
            {!bank.account && (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Дансны мэдээлэл оруулаагүй байна — бид тантай утсаар холбогдож төлбөрийн мэдээллийг өгнө.
              </p>
            )}
          </div>
        )}

        <Link href="/account" className="btn btn-outline btn-md mt-6">Миний булан →</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel mx-auto max-w-2xl p-6 sm:p-8">
      <p className="eyebrow-line">Бүртгүүлэх</p>
      <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{journeyName}</h3>
      {prepayPerPerson > 0 && (
        <div className="mt-3 rounded-xl bg-primary-50 px-4 py-2.5 text-sm leading-relaxed text-ink/85">
          <p>💳 Урьдчилгаа <b className="text-primary-700">{money(prepayPerPerson)}</b> / хүн</p>
          <p>Нийт дүн: <b className="text-primary-700">{money(prepayTotal)}</b></p>
          <p>Захиалга илгээсний дараа дансны мэдээлэл харагдана.</p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="bk-name">Нэр *</label>
          <input id="bk-name" required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="bk-phone">Утас *</label>
          <input id="bk-phone" required className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9900 0000" />
        </div>
        <div>
          <label className="field-label" htmlFor="bk-email">Имэйл</label>
          <input id="bk-email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@email.com" />
        </div>
        <div>
          <label className="field-label" htmlFor="bk-people">Хэдэн хүн</label>
          <select id="bk-people" className={inputCls} value={form.people} onChange={(e) => set("people", e.target.value)}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label" htmlFor="bk-note">Нэмэлт хүсэлт</label>
        <textarea id="bk-note" className="textarea" rows={3} value={form.note} onChange={(e) => set("note", e.target.value)}
          placeholder="Хоолны дэглэм, эрүүл мэндийн онцлог, асуулт…" />
      </div>

      {err && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{err}</p>}

      <button type="submit" disabled={busy} className="btn btn-primary btn-lg mt-6 w-full disabled:opacity-60">
        {busy ? "Илгээж байна…" : "Бүртгүүлэх"}
      </button>
    </form>
  );
}
