"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { DEFAULT_BOOKING_DAYS, DEFAULT_START_HOUR, DEFAULT_END_HOUR } from "@/lib/booking-slots";

const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
const WD = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
/** Хуанлийн долоо хоногийн эгнээ (Даа=1..Ня=0) → энгийн долоо хоногийн индекс рүү хөрвүүлнэ */
const WD_INDEX = [1, 2, 3, 4, 5, 6, 0];
const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();
const pad = (n: number) => String(n).padStart(2, "0");

/** Энергийн заслын цаг захиалга — тухайн заслын админаас тохируулсан хуваарийг дагана. */
export function ServiceBooking({
  itemId, serviceName,
  workDays = DEFAULT_BOOKING_DAYS, startHour = DEFAULT_START_HOUR, endHour = DEFAULT_END_HOUR,
}: {
  itemId: string; serviceName: string;
  /** Зөвшөөрөгдсөн өдрүүд — JS Date.getDay() индекс (0=Ням..6=Бямба) */
  workDays?: number[]; startHour?: number; endHour?: number;
}) {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const [calY, setCalY] = useState(today.getFullYear());
  const [calM, setCalM] = useState(today.getMonth() + 1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  /** Урьдчилгаа төлбөр ба дансны мэдээлэл — админы тохиргооноос */
  const [prepay, setPrepay] = useState(0);
  const [bank, setBank] = useState<{ bankName?: string; account?: string; holder?: string }>({});
  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.settings) return;
        setPrepay(Number(d.settings.servicePrepay) || 0);
        if (d.settings.bank) setBank(d.settings.bank);
      })
      .catch(() => {});
  }, []);

  const money = (n: number) => n.toLocaleString("mn-MN") + "₮";
  /** Гүйлгээний утга — админ таних кодтой */
  const payRef = (form.phone || "").replace(/\D/g, "").slice(-8);

  const grid = useMemo(() => ({
    total: daysIn(calY, calM),
    lead: (new Date(calY, calM - 1, 1).getDay() + 6) % 7,
  }), [calY, calM]);

  // Сонгосон өдрийн сул цагууд
  useEffect(() => {
    if (!date) { setSlots([]); return; }
    setLoadingSlots(true); setTime("");
    fetch(`/api/service/booking?itemId=${encodeURIComponent(itemId)}&date=${date}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { slots: [] }))
      .then((d) => setSlots(d.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date, itemId]);

  const shift = (d: number) => {
    let m = calM + d, y = calY;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    setCalY(y); setCalM(m); setDate(""); setTime("");
  };

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) { setErr("Өдөр, цагаа сонгоно уу."); return; }
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/service/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, itemId, date, time }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setDone(true);
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); } finally { setBusy(false); }
  }

  const inputCls = "focus-ring w-full rounded-2xl border-2 border-line bg-surface-1 px-4 py-3 text-[1rem] text-ink outline-none transition hover:border-primary-400/60 focus:border-primary-500";
  const yearOptions = useMemo(() => Array.from({ length: 3 }, (_, i) => today.getFullYear() + i), [today]);

  if (!user) {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl">🔐</div>
        <p className="mt-3 font-display text-lg font-semibold text-ink">Цаг захиалахын тулд нэвтэрнэ үү</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">Захиалгаа хадгалж, төлөв өөрчлөгдөх бүрд мэдэгдэл авахын тулд эхлээд бүртгэлдээ нэвтэрнэ үү.</p>
        <div className="mt-5 flex justify-center gap-2">
          <Link href="/login" className="btn btn-primary btn-sm">Нэвтрэх</Link>
          <Link href="/register" className="btn btn-outline btn-sm">Бүртгүүлэх</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-jade-400/15 text-2xl text-jade-600">✓</div>
        <p className="mt-3 font-display text-lg font-semibold text-ink">Цаг захиаллаа</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          <b>{date}</b> {time} — «{serviceName}».
        </p>

        {prepay > 0 ? (
          <div className="mt-5 rounded-2xl border-2 border-primary-400/50 bg-primary-50/50 p-5 text-left">
            <p className="text-center font-display text-base font-semibold text-ink">
              Урьдчилгаа <span className="text-primary-700">{money(prepay)}</span>
            </p>
            <p className="mt-1 text-center text-xs leading-relaxed text-muted">
              Доорх данс руу шилжүүлснээр таны цаг баталгаажна.
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
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Админ баталгаажуулсны дараа мэдэгдэл ирнэ.
          </p>
        )}

        <Link href="/account" className="btn btn-outline btn-sm mt-4">Миний булан →</Link>
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      <p className="eyebrow-line">Цаг захиалах</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {WD_INDEX.filter((d) => workDays.includes(d)).length === 7
          ? "Өдөр бүр"
          : WD.filter((_, i) => workDays.includes(WD_INDEX[i])).join(", ")}{" "}
        <b className="text-ink">{pad(startHour)}:00–{pad(endHour)}:00</b> цагийн хооронд хүлээн авна.
      </p>
      {prepay > 0 && (
        <div className="mt-3 rounded-xl bg-primary-50 px-4 py-2.5 text-sm leading-relaxed text-ink/85">
          <p>💳 Урьдчилгаа <b className="text-primary-700">{money(prepay)}</b></p>
          <p>Захиалга илгээсний дараа дансны мэдээлэл харагдана.</p>
        </div>
      )}

      {/* Хуанли */}
      <div className="mt-5 rounded-2xl border border-line p-4">
        <div className="flex items-center justify-between gap-1.5">
          <button type="button" onClick={() => shift(-1)} aria-label="Өмнөх сар"
            className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-ink transition hover:bg-primary-500/10">‹</button>
          <div className="flex min-w-0 items-center gap-1">
            <select value={calM} onChange={(e) => { setCalM(Number(e.target.value)); setDate(""); setTime(""); }} aria-label="Сар сонгох"
              className="focus-ring min-w-0 rounded-lg border border-line bg-surface-1 px-1.5 py-1 text-sm font-semibold text-ink">
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <select value={calY} onChange={(e) => { setCalY(Number(e.target.value)); setDate(""); setTime(""); }} aria-label="Жил сонгох"
              className="focus-ring rounded-lg border border-line bg-surface-1 px-1.5 py-1 text-sm font-semibold text-ink">
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => shift(1)} aria-label="Дараах сар"
            className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-ink transition hover:bg-primary-500/10">›</button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
          {WD.map((w) => <span key={w} className="py-1 text-[0.65rem] font-bold uppercase tracking-wide text-muted">{w}</span>)}
          {Array.from({ length: grid.lead }, (_, i) => <span key={"x" + i} />)}
          {Array.from({ length: grid.total }, (_, i) => i + 1).map((d) => {
            const key = `${calY}-${pad(calM)}-${pad(d)}`;
            const dow = new Date(calY, calM - 1, d).getDay();
            const notWorkday = !workDays.includes(dow);
            const past = key < todayKey;
            const off = notWorkday || past;
            const sel = key === date;
            return (
              <button
                key={d}
                type="button"
                disabled={off}
                onClick={() => { setDate(key); setErr(""); }}
                aria-pressed={sel}
                className={
                  "focus-ring aspect-square rounded-lg text-sm font-semibold transition " +
                  (sel ? "bg-primary-600 text-white"
                    : off ? "cursor-not-allowed text-muted/30"
                    : "text-ink hover:bg-primary-500/10")
                }
              >
                {d}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[0.7rem] text-muted">Саарал өдрүүдэд захиалга авахгүй.</p>
      </div>

      {/* Цагийн сонголт */}
      {date && (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{date} — сул цаг</p>
          {loadingSlots ? (
            <div className="flex justify-center py-5">
              <div className="h-7 w-7 animate-spinSlow rounded-full border-2 border-primary-200 border-t-primary-600" />
            </div>
          ) : slots.length === 0 ? (
            <p className="mt-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700">Энэ өдөр сул цаг алга. Өөр өдөр сонгоно уу.</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setTime(s); setErr(""); }}
                  aria-pressed={time === s}
                  className={
                    "focus-ring rounded-full px-4 py-2 text-sm font-semibold transition " +
                    (time === s ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-surface-1 text-ink/75 hover:border-primary-400 hover:text-primary-700")
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Мэдээлэл */}
      <form onSubmit={submit} className="mt-5 space-y-3">
        <div>
          <label className="field-label" htmlFor="sb-name">Нэр *</label>
          <input id="sb-name" required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="sb-phone">Утас *</label>
          <input id="sb-phone" required className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9900 0000" />
        </div>
        <div>
          <label className="field-label" htmlFor="sb-email">Имэйл</label>
          <input id="sb-email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@email.com" />
        </div>
        <div>
          <label className="field-label" htmlFor="sb-note">Нэмэлт мэдээлэл</label>
          <textarea id="sb-note" className="textarea" rows={3} value={form.note} onChange={(e) => set("note", e.target.value)}
            placeholder="Юуг сонирхож байгаа, эрүүл мэндийн онцлог…" />
        </div>

        {err && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{err}</p>}

        <button type="submit" disabled={busy || !date || !time} className="btn btn-primary btn-lg w-full disabled:opacity-60">
          {busy ? "Илгээж байна…" : date && time ? `${date} ${time} — захиалах` : "Өдөр, цагаа сонгоно уу"}
        </button>
      </form>
    </div>
  );
}
