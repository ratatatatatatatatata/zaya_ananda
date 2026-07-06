"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { formatMNT } from "@/lib/format";

const DEFAULT_BANK = { name: "Хаан банк", account: "5304611250", holder: "Заяа Бат-Эрдэнэ" };
const fnv = (s: string) => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
type Access = { status: "none" | "pending" | "active" | "expired"; daysLeft?: number | null; expiresAt?: string | null };

export function PurchaseBox({ id, price }: { id: string; title: string; price?: number }) {
  const { user } = useAuth();
  const [step, setStep] = useState<"idle" | "choose" | "qpay" | "bank" | "done">("idle");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const [access, setAccess] = useState<Access | null>(null);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [bank, setBank] = useState(DEFAULT_BANK);
  const amount = typeof price === "number" ? price : 0;
  const ref = user?.email || user?.phone || "";

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => {
      const b = d?.settings?.bank;
      if (b && (b.bankName || b.account || b.holder))
        setBank({ name: b.bankName || DEFAULT_BANK.name, account: b.account || DEFAULT_BANK.account, holder: b.holder || DEFAULT_BANK.holder });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) { setLoadingAccess(false); return; }
    setLoadingAccess(true);
    fetch("/api/access?itemId=" + encodeURIComponent(id), { cache: "no-store" })
      .then((r) => r.json()).then((d) => setAccess(d)).catch(() => setAccess({ status: "none" })).finally(() => setLoadingAccess(false));
  }, [user, id]);

  const copy = (text: string, key: string) => { navigator.clipboard?.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(""), 1500); }).catch(() => {}); };
  const CopyBtn = ({ text, k }: { text: string; k: string }) => (
    <button type="button" onClick={() => copy(text, k)} className="shrink-0 rounded-md border border-line bg-white/10 px-2 py-0.5 text-xs font-medium text-primary-300 hover:bg-primary-50">{copied === k ? "Хууллаа ✓" : "Хуулах"}</button>
  );

  async function notify(method: "qpay" | "bank") {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/pay/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId: id, method }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setStep("done"); setAccess({ status: "pending" });
    } catch (e) { setErr(e instanceof Error ? e.message : "Алдаа гарлаа."); } finally { setBusy(false); }
  }

  const st = access?.status;

  return (
    <div className="card p-6">
      {typeof price === "number" && <p className="price mb-4 text-center text-3xl">{formatMNT(price)}</p>}

      {step === "idle" && (
        <>
          {loadingAccess ? (
            <div className="flex justify-center py-4"><div className="h-8 w-8 animate-spinSlow rounded-full border-2 border-primary-200 border-t-primary-600" /></div>
          ) : st === "active" ? (
            <div className="rounded-2xl bg-jade-400/15 p-5 text-center">
              <p className="font-display text-lg font-semibold text-jade-600">✓ Танд энэ эрх идэвхтэй байна</p>
              {typeof access?.daysLeft === "number" && <p className="mt-1.5 text-sm text-ink/70">Үзэх хугацаа дуусахад: <span className="font-semibold text-ink">{access.daysLeft} хоног</span> үлдсэн</p>}
            </div>
          ) : st === "pending" ? (
            <div className="rounded-2xl bg-amber-100 p-5 text-center text-amber-700">
              <p className="font-semibold">Захиалга баталгаажихыг хүлээж байна</p>
              <p className="mt-1 text-sm">Төлбөрийг шалгасны дараа админ баталгаажуулна.</p>
            </div>
          ) : (
            <>
              {st === "expired" && (
                <div className="mb-4 rounded-2xl bg-rose-50 p-4 text-center text-rose-600">
                  <p className="font-semibold">Таны үзэх хугацаа дууссан байна</p>
                  <p className="mt-1 text-sm">Дахин худалдаж аваад үргэлжлүүлнэ үү.</p>
                </div>
              )}
              <button onClick={() => (user ? setStep("choose") : setErr("Эхлээд нэвтэрнэ үү."))} className="btn btn-primary btn-lg w-full">Худалдаж авах</button>
              {!user && <p className="mt-3 text-center text-sm text-muted">Худалдан авахын тулд <Link href="/login" className="font-semibold text-primary-700 hover:underline">нэвтэрнэ</Link> үү.</p>}
              {err && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2 text-center text-sm text-rose-600">{err}</p>}
            </>
          )}
        </>
      )}

      {step === "choose" && (
        <div className="space-y-3">
          <p className="text-center font-semibold text-ink">Төлбөрийн хэлбэрээ сонгоно уу</p>
          <button onClick={() => setStep("qpay")} className="btn btn-primary btn-md w-full">QPay-ээр төлөх</button>
          <button onClick={() => setStep("bank")} className="btn btn-outline btn-md w-full">Банкны аппликейшнээр төлөх</button>
          <button onClick={() => setStep("idle")} className="w-full text-center text-sm text-muted hover:text-ink">← Буцах</button>
        </div>
      )}

      {step === "qpay" && (
        <div className="space-y-3 text-center">
          <p className="font-semibold text-ink">QPay-ээр төлөх</p>
          <p className="text-2xl font-bold text-primary-700">{formatMNT(amount)}</p>
          <div className="mx-auto grid h-40 w-40 grid-cols-9 gap-0.5 rounded-2xl border border-line bg-[#121D33] p-2">
            {Array.from({ length: 81 }).map((_, i) => <div key={i} className={fnv(id + "qr" + i) % 10 < 5 ? "bg-primary-200" : "bg-[#121D33]"} />)}
          </div>
          <p className="text-sm text-muted">QR-ийг уншуулж төлөөд доорх товчийг дарна уу.</p>
          {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
          <button onClick={() => notify("qpay")} disabled={busy} className="btn btn-primary btn-md w-full">{busy ? "..." : "Төлсөн гэж баталгаажуулах"}</button>
          <button onClick={() => setStep("choose")} className="w-full text-center text-sm text-muted hover:text-ink">← Буцах</button>
        </div>
      )}

      {step === "bank" && (
        <div className="space-y-3">
          <p className="text-center font-semibold text-ink">Банкны шилжүүлэг</p>
          <div className="divide-y divide-line rounded-2xl border border-line bg-white/5 px-4">
            <div className="flex items-center justify-between gap-3 py-2.5"><span className="text-sm text-muted">Банк</span><span className="font-semibold text-ink">{bank.name}</span></div>
            <div className="flex items-center justify-between gap-3 py-2.5"><span className="text-sm text-muted">Дансны дугаар</span><span className="flex items-center gap-2 font-semibold text-ink">{bank.account}<CopyBtn text={bank.account} k="acc" /></span></div>
            <div className="flex items-center justify-between gap-3 py-2.5"><span className="text-sm text-muted">Хүлээн авагч</span><span className="font-semibold text-ink">{bank.holder}</span></div>
            <div className="flex items-center justify-between gap-3 py-2.5"><span className="text-sm text-muted">Дүн</span><span className="flex items-center gap-2 font-semibold text-ink">{amount.toLocaleString()}₮<CopyBtn text={String(amount)} k="amt" /></span></div>
          </div>
          <div className="rounded-2xl bg-primary-50 p-3">
            <p className="text-sm font-semibold text-primary-700">Гүйлгээний утга дээр өөрийн бүртгэлтэй имэйл эсвэл утсаа бичнэ үү:</p>
            <div className="mt-1.5 flex items-center justify-between gap-2"><span className="truncate font-semibold text-ink">{ref || "—"}</span>{ref && <CopyBtn text={ref} k="ref" />}</div>
          </div>
          {err && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{err}</p>}
          <button onClick={() => notify("bank")} disabled={busy} className="btn btn-primary btn-md w-full">{busy ? "..." : "Гүйлгээ хийсэн, баталгаажуулах"}</button>
          <button onClick={() => setStep("choose")} className="w-full text-center text-sm text-muted hover:text-ink">← Буцах</button>
        </div>
      )}

      {step === "done" && (
        <div className="space-y-3 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-jade-400/15 text-3xl text-jade-600">✓</div>
          <p className="font-display text-lg font-semibold text-ink">Хүсэлт хүлээн авлаа!</p>
          <p className="text-sm leading-relaxed text-muted">Таны төлбөрийг шалгаад админ баталгаажуулна. Дараа нь энэ хичээл нээгдэнэ.</p>
        </div>
      )}
    </div>
  );
}
