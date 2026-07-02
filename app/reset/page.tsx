"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EnergyWaves } from "@/components/EnergyWaves";

export default function ResetPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "request", email }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setStep("code");
    } catch (err) { setError(err instanceof Error ? err.message : "Алдаа гарлаа."); } finally { setLoading(false); }
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) { setError("Нууц үг хоорондоо таарахгүй байна."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "confirm", email, code, password }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setStep("done");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) { setError(err instanceof Error ? err.message : "Алдаа гарлаа."); } finally { setLoading(false); }
  }

  return (
    <section className="relative isolate overflow-hidden bg-aurora">
      <EnergyWaves />
      <div className="relative z-10 container-px flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-grad text-2xl text-white shadow-glow">🔑</span>
            <h1 className="mt-5 font-display text-3xl font-semibold text-ink">Нууц үг сэргээх</h1>
            <p className="mt-2 text-muted">{step === "email" ? "Бүртгэлтэй имэйл хаягаа оруулбал баталгаажуулах код илгээнэ." : step === "code" ? "Имэйлээр ирсэн 6 оронтой кодоо оруулаад шинэ нууц үгээ тохируулна уу." : ""}</p>
          </div>

          <div className="card p-6 sm:p-8">
            {step === "email" && (
              <form onSubmit={requestCode}>
                <label className="field-label" htmlFor="email">Имэйл</label>
                <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
                {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg mt-6 w-full">{loading ? "Илгээж байна..." : "Код авах"}</button>
              </form>
            )}

            {step === "code" && (
              <form onSubmit={confirm} className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="code">Баталгаажуулах код</label>
                  <input id="code" required className="input text-center text-xl tracking-[0.4em]" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pw1">Шинэ нууц үг</label>
                  <input id="pw1" type="password" required minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pw2">Шинэ нууц үг (давтах)</label>
                  <input id="pw2" type="password" required minLength={6} className="input" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="••••••••" />
                </div>
                {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">{loading ? "Шалгаж байна..." : "Нууц үг солих"}</button>
                <button type="button" onClick={() => setStep("email")} className="w-full text-center text-sm text-muted hover:text-ink">← Имэйл дахин оруулах</button>
              </form>
            )}

            {step === "done" && (
              <div className="py-6 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-jade-400/15 text-3xl text-jade-600">✓</div>
                <p className="mt-4 font-display text-lg font-semibold text-ink">Нууц үг амжилттай солигдлоо!</p>
                <p className="mt-2 text-sm text-muted">Нэвтрэх хуудас руу шилжиж байна…</p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-muted"><Link href="/login" className="font-semibold text-primary-700 hover:underline">← Нэвтрэх хуудас руу буцах</Link></p>
        </div>
      </div>
    </section>
  );
}
