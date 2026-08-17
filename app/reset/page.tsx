"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";

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
    <AuthShell
      glyph="🔑"
      title="Нууц үг сэргээх"
      subtitle={step === "email" ? "Бүртгэлтэй имэйл хаягаа оруулбал баталгаажуулах код илгээнэ." : step === "code" ? "Имэйлээр ирсэн 6 оронтой кодоо оруулаад шинэ нууц үгээ тохируулна уу." : undefined}
      footer={<Link href="/login" className="font-semibold text-accent-300 hover:underline">← Нэвтрэх хуудас руу буцах</Link>}
    >
      {step === "email" && (
        <form onSubmit={requestCode}>
          <label className="field-label" htmlFor="email">Имэйл</label>
          <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
          {error && <p className="mt-4 rounded-xl bg-rose-500/20 px-4 py-3 text-sm text-rose-100">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-gold btn-lg mt-6 w-full">{loading ? "Илгээж байна..." : "Код авах"}</button>
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
          {error && <p className="rounded-xl bg-rose-500/20 px-4 py-3 text-sm text-rose-100">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-gold btn-lg w-full">{loading ? "Шалгаж байна..." : "Нууц үг солих"}</button>
          <button type="button" onClick={() => setStep("email")} className="w-full text-center text-sm text-white/60 hover:text-white">← Имэйл дахин оруулах</button>
        </form>
      )}

      {step === "done" && (
        <div className="py-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-300/20 text-3xl text-accent-300">✓</div>
          <p className="mt-4 font-display text-lg font-semibold text-white">Нууц үг амжилттай солигдлоо!</p>
          <p className="mt-2 text-sm text-white/70">Нэвтрэх хуудас руу шилжиж байна…</p>
        </div>
      )}
    </AuthShell>
  );
}
