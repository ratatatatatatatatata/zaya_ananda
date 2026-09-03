"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/auth/AuthShell";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string) => ({ mn, en, ko, ja, zh });
const FB_LABEL = Lx("Facebook-ээр үргэлжлүүлэх", "Continue with Facebook", "페이스북으로 계속", "Facebookで続行", "使用 Facebook 继续");
const OR = Lx("эсвэл", "or", "또는", "または", "或");
const FORGOT = Lx("Нууц үг мартсан?", "Forgot password?", "비밀번호를 잊으셨나요?", "パスワードをお忘れですか？", "忘记密码？");
const IDENT_LABEL = Lx("Имэйл эсвэл утас", "Email or phone", "이메일 또는 전화", "メールまたは電話", "邮箱或电话");
const SHOW_PASSWORD = Lx("Нууц үг харах", "Show password", "비밀번호 표시", "パスワードを表示", "显示密码");
const HIDE_PASSWORD = Lx("Нууц үг нуух", "Hide password", "비밀번호 숨기기", "パスワードを隠す", "隐藏密码");

export default function LoginPage() {
  const { login, social } = useAuth();
  const { t, tr } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
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
    <AuthShell
      title={t("auth.welcome")}
      subtitle={t("auth.loginSub")}
      footer={<>{t("auth.noAccount")} <Link href="/register" className="font-semibold text-accent-300 hover:underline">{t("auth.register")}</Link></>}
    >
      <form onSubmit={onSubmit}>
        <button type="button" onClick={onFacebook} disabled={loading} className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#1567D3] px-5 py-3.5 text-[1.05rem] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"><span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-bold text-[#1877F2]">f</span>{tr(FB_LABEL)}</button>
        <div className="my-5 flex items-center gap-3 text-sm text-white/60"><span className="h-px flex-1 bg-white/15" />{tr(OR)}<span className="h-px flex-1 bg-white/15" /></div>
        <div>
          <label className="field-label" htmlFor="email">{tr(IDENT_LABEL)}</label>
          <input id="email" type="text" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com / 9900 0000" />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="password">{t("auth.password")}</label>
            <Link href="/reset" className="text-sm font-semibold text-accent-300 hover:underline">{tr(FORGOT)}</Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              className="input pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-white/60 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent-300"
              aria-label={tr(showPassword ? HIDE_PASSWORD : SHOW_PASSWORD)}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3 3 18 18" />
                  <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                  <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.5 0 9 5.5 9 5.5a15.5 15.5 0 0 1-2.4 2.9" />
                  <path d="M6.6 6.6C4.3 8.1 3 10 3 10s3.5 5.5 9 5.5c1 0 1.9-.2 2.7-.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && <p className="mt-4 rounded-xl bg-rose-500/20 px-4 py-3 text-sm text-rose-100">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-gold btn-lg mt-6 w-full">{loading ? t("auth.loggingIn") : t("auth.login")}</button>
      </form>
    </AuthShell>
  );
}
