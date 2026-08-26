"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
const WD = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();
const pad = (n: number) => String(n).padStart(2, "0");

/** Аяллын цаг захиалга — огноогоо сонгоод бүртгүүлнэ. */
export function JourneyBooking({ slug, journeyName, prepay: prepayPerPerson = 0 }: { slug: string; journeyName: string; prepay?: number }) {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const [calY, setCalY] = useState(today.getFullYear());
  const [calM, setCalM] = useState(today.getMonth() + 1);
  const [picked, setPicked] = useState<string>("");

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

  const grid = useMemo(() => {
    const total = daysIn(calY, calM);
    const lead = (new Date(calY, calM - 1, 1).getDay() + 6) % 7;
    return { total, lead };
  }, [calY, calM]);

  const shift = (d: number) => {
    let m = calM + d, y = calY;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    setCalY(y); setCalM(m);
  };

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked) { setErr("Аялах өдрөө сонгоно уу."); return; }
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/journey/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, date: picked, people: Number(form.people) || 1 }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setDone(true);
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setBusy(false); }
  }

  const inputCls = "focus-ring w-full rounded-2xl border-2 border-line bg-surface-1 px-4 py-3 text-[1rem] text-ink outline-none transition hover:border-primary-400/60 focus:border-primary-500";

  if (done) {
    return (
      <div className="panel p-8 text-center sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-jade-400/15 text-3xl text-jade-600">✓</div>
        <p className="mt-4 font-display text-xl font-semibold text-ink">Захиалга хүлээж авлаа</p>
        <p className="mt-2 leading-relaxed text-muted">
          <b>{picked}</b>-нд «{journeyName}» аялалд бүртгүүллээ.{prepayTotal <= 0 && (user ? " Админ баталгаажуулсны дараа мэдэгдэл ирнэ." : " Бид тантай холбогдоно.")}
        </p>

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

        {user && <Link href="/account" className="btn btn-outline btn-md mt-6">Миний булан →</Link>}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,21rem)_1fr]">
      {/* Хуанли */}
      <div className="panel p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => shift(-1)} aria-label="Өмнөх сар"
            className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line text-ink transition hover:bg-primary-500/10">‹</button>
          <p className="font-display text-base font-semibold text-ink">{calY} · {MONTHS[calM - 1]}</p>
          <button type="button" onClick={() => shift(1)} aria-label="Дараах сар"
            className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line text-ink transition hover:bg-primary-500/10">›</button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {WD.map((w) => <span key={w} className="py-1 text-[0.7rem] font-bold uppercase tracking-wide text-muted">{w}</span>)}
          {Array.from({ length: grid.lead }, (_, i) => <span key={"x" + i} />)}
          {Array.from({ length: grid.total }, (_, i) => i + 1).map((d) => {
            const key = `${calY}-${pad(calM)}-${pad(d)}`;
            const past = key < todayKey;
            const sel = key === picked;
            return (
              <button
                key={d}
                type="button"
                disabled={past}
                onClick={() => { setPicked(key); setErr(""); }}
                aria-pressed={sel}
                className={
                  "focus-ring aspect-square rounded-xl text-sm font-semibold transition " +
                  (sel ? "bg-primary-600 text-white shadow-sm"
                    : past ? "cursor-not-allowed text-muted/35"
                    : "text-ink hover:bg-primary-500/10")
                }
              >
                {d}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          {picked ? <>Сонгосон өдөр: <b className="text-ink">{picked}</b></> : "Аялах өдрөө сонгоно уу."}
        </p>
      </div>

      {/* Бүртгэлийн маягт */}
      <form onSubmit={submit} className="panel p-6 sm:p-8">
        <p className="eyebrow-line">Бүртгүүлэх</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{journeyName}</h3>
        {prepayPerPerson > 0 && (
          <p className="mt-3 rounded-xl bg-primary-50 px-4 py-2.5 text-sm leading-relaxed text-ink/85">
            💳 Хүн тутамд <b className="text-primary-700">{money(prepayPerPerson)}</b> урьдчилгаа шаардана (нийт {money(prepayTotal)}).
            Захиалга илгээсний дараа дансны мэдээлэл харагдана.
          </p>
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
          {busy ? "Илгээж байна…" : picked ? picked + " — бүртгүүлэх" : "Бүртгүүлэх"}
        </button>
        {!user && <p className="mt-3 text-center text-sm text-muted">Нэвтэрсэн бол захиалга «Миний булан»-д хадгалагдаж, мэдэгдэл ирнэ.</p>}
      </form>
    </div>
  );
}
