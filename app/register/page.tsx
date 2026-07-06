"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { EnergyWaves } from "@/components/EnergyWaves";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string) => ({ mn, en, ko, ja, zh });
const FB_LABEL = Lx("Facebook-ээр үргэлжлүүлэх", "Continue with Facebook", "페이스북으로 계속", "Facebookで続行", "使用 Facebook 继续");
const OR = Lx("эсвэл", "or", "또는", "または", "或");
const OPT = Lx("заавал биш", "optional", "선택", "任意", "可选");
const NEED_ID = Lx("Имэйл эсвэл утасны дугаараа оруулна уу.", "Enter your email or phone number.", "이메일 또는 전화번호를 입력하세요.", "メールまたは電話番号を入力してください。", "请输入邮箱或电话号码。");

export default function RegisterPage() {
  const { register, social } = useAuth();
  const { t, tr } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email && !form.phone) {
      setError(tr(NEED_ID));
      return;
    }
    if (form.password.length < 6) {
      setError(t("auth.pwMin"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(form);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  async function onFacebook() {
    setLoading(true);
    setError("");
    try {
      await social("facebook");
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  return (
    <section className="relative isolate overflow-hidden bg-aurora">
      <EnergyWaves />
      <div className="relative z-10 container-px flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-grad text-2xl text-white shadow-glow">✶</span>
            <h1 className="mt-5 font-display text-3xl font-semibold text-ink">{t("auth.registerTitle")}</h1>
            <p className="mt-2 text-muted">{t("auth.registerSub")}</p>
          </div>
          <form onSubmit={onSubmit} className="card p-6 sm:p-8">
            <button type="button" onClick={onFacebook} disabled={loading} className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#1877F2] px-5 py-3.5 text-[1.05rem] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#1A2742] text-sm font-bold text-[#1877F2]">f</span>{tr(FB_LABEL)}</button>
            <div className="my-5 flex items-center gap-3 text-sm text-muted"><span className="h-px flex-1 bg-line" />{tr(OR)}<span className="h-px flex-1 bg-line" /></div>
            <div>
              <label className="field-label" htmlFor="name">{t("form.name")}</label>
              <input id="name" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="email">{t("form.email")} <span className="font-normal text-muted">({tr(OPT)})</span></label>
                <input id="email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@email.com" />
              </div>
              <div>
                <label className="field-label" htmlFor="phone">{t("form.phone")}</label>
                <input id="phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9900 0000" />
              </div>
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="password">{t("auth.password")}</label>
              <input id="password" type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t("auth.pwPlaceholder")} />
            </div>
            {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg mt-6 w-full">{loading ? t("auth.registering") : t("auth.register")}</button>
          </form>
          <p className="mt-6 text-center text-muted">{t("auth.haveAccount")} <Link href="/login" className="font-semibold text-primary-700 hover:underline">{t("auth.login")}</Link></p>
        </div>
      </div>
    </section>
  );
}
