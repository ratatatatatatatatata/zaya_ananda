"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { courses, courseLessons } from "@/data/content";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { AddToCart } from "@/components/AddToCart";
import { cx } from "@/lib/format";
import { pick } from "@/lib/i18n-core";

function secs(d: string) {
  const [m, s] = d.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}
function mmss(t: number) {
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

export default function LearnPage({ params }: { params: { slug: string } }) {
  const course = courses.find((c) => c.slug === params.slug);
  const lessons = courseLessons[params.slug] ?? [];
  const { user, loading } = useAuth();
  const { t, lang } = useI18n();

  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [wmPos, setWmPos] = useState(0);
  const [devices, setDevices] = useState([
    { id: 1, name: "Энэ төхөөрөмж · Chrome, Windows", current: true },
    { id: 2, name: "iPhone · Safari", current: false },
    { id: 3, name: "Samsung · Chrome", current: false },
  ]);
  const [ask, setAsk] = useState("");
  const [asked, setAsked] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const pkey = "zaya_progress_" + params.slug;
  const nkey = "zaya_notes_" + params.slug;

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(pkey) || "[]");
      if (Array.isArray(d)) setDone(d);
      const n = JSON.parse(localStorage.getItem(nkey) || "{}");
      setNotes(n);
      const firstIncomplete = lessons.findIndex((_, i) => !d.includes(i));
      setActive(firstIncomplete < 0 ? 0 : firstIncomplete);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) { setEnrolled(false); return; }
    fetch("/api/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setEnrolled((d.orders || []).some((o: any) => (o.items || []).some((it: any) => it.kind === "course" && it.slug === params.slug))))
      .catch(() => setEnrolled(false));
  }, [user, params.slug]);

  useEffect(() => { const id = setInterval(() => setWmPos((p) => (p + 1) % 4), 3500); return () => clearInterval(id); }, []);

  const total = lessons[active] ? secs(lessons[active].duration) : 0;
  const canPlay = (i: number) => lessons[i]?.free || enrolled;

  function play() {
    if (!canPlay(active)) return;
    setPlaying(true);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= total) { stop(); markDone(active); return total; }
        return e + 1;
      });
    }, 200);
  }
  function stop() { setPlaying(false); if (timer.current) clearInterval(timer.current); }
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function select(i: number) { stop(); setActive(i); setElapsed(0); }
  function markDone(i: number) {
    setDone((prev) => { const next = prev.includes(i) ? prev : [...prev, i]; try { localStorage.setItem(pkey, JSON.stringify(next)); } catch {} return next; });
  }
  function saveNote(v: string) {
    setNotes((prev) => { const next = { ...prev, [active]: v }; try { localStorage.setItem(nkey, JSON.stringify(next)); } catch {} return next; });
  }

  const progressPct = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;
  const wmClass = ["left-4 top-4", "right-4 top-4", "right-4 bottom-16", "left-4 bottom-16"][wmPos];

  if (!course) return <div className="container-px section">—</div>;

  if (loading) {
    return <div className="section"><div className="container-px flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-primary-200 border-t-primary-600" /></div></div>;
  }
  if (!user) {
    return (
      <div className="section"><div className="container-px">
        <div className="mx-auto max-w-md rounded-4xl border border-line bg-[#111B2D] p-10 text-center shadow-card">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-50 text-3xl">🔐</div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t("account.loginRequired")}</h1>
          <p className="mt-3 text-muted">{t("learn.lockedSub")}</p>
          <Link href="/login" className="btn btn-primary btn-md mt-6">{t("auth.login")}</Link>
        </div>
      </div></div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* learning top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-[#101B2E]/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/account" className="grid h-9 w-9 place-items-center rounded-full text-ink/70 hover:bg-primary-50"><Icon name="arrow" className="h-5 w-5 rotate-180" /></Link>
          <Logo withText={false} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{pick(course.title, lang)}</p>
            <p className="text-xs text-muted">{t("learn.progress")}: {progressPct}% · {done.length}/{lessons.length}</p>
          </div>
        </div>
        <Link href={"/courses/" + course.slug} className="hidden text-sm font-semibold text-primary-700 hover:underline sm:block">{t("common.details")}</Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* main */}
        <div className="order-2 p-4 sm:p-6 lg:order-1">
          {/* player */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0c2b29] shadow-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-deep-700 via-[#0c5c57] to-primary-700 opacity-90" />
            {/* dynamic watermark */}
            <div className={cx("pointer-events-none absolute z-20 select-none rounded bg-black/10 px-2 py-1 text-[11px] font-medium text-white/55 transition-all duration-700", wmClass)}>
              {user.email} · {new Date().toLocaleDateString()}
            </div>
            <div className="absolute inset-0 grid place-items-center text-center text-white">
              {canPlay(active) ? (
                <button onClick={() => (playing ? stop() : play())} className="grid h-20 w-20 place-items-center rounded-full bg-white/20 text-3xl backdrop-blur transition hover:bg-white/30">
                  {playing ? "❚❚" : "▶"}
                </button>
              ) : (
                <div className="px-6">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15 text-2xl">🔒</div>
                  <p className="mt-4 font-display text-lg font-semibold">{t("learn.locked")}</p>
                  <p className="mt-1 text-sm text-white/70">{t("learn.lockedSub")}</p>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
              <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-[#111B2D]" style={{ width: (total ? (elapsed / total) * 100 : 0) + "%" }} />
              </div>
              <div className="flex items-center justify-between text-xs text-white/80">
                <span>{mmss(elapsed)} / {lessons[active]?.duration}</span>
                <span className="flex items-center gap-3"><span>⚙</span><span>⛶</span></span>
              </div>
            </div>
          </div>

          {/* lesson title + actions */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{t("learn.lessons")} {active + 1}/{lessons.length}</p>
              <h1 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">{lessons[active]?.title}</h1>
            </div>
            <div className="flex gap-2">
              <button disabled={active === 0} onClick={() => select(active - 1)} className="btn btn-outline btn-sm">{t("learn.prev")}</button>
              {!done.includes(active) && canPlay(active) && <button onClick={() => markDone(active)} className="btn btn-outline btn-sm">✓ {t("learn.markDone")}</button>}
              <button disabled={active >= lessons.length - 1} onClick={() => select(active + 1)} className="btn btn-primary btn-sm">{t("learn.next")}</button>
            </div>
          </div>

          {/* notes */}
          <div className="mt-6 card p-5">
            <h3 className="font-display text-base font-semibold text-ink">📝 {t("learn.notes")}</h3>
            <textarea value={notes[active] || ""} onChange={(e) => saveNote(e.target.value)} placeholder={t("learn.notesPh")} className="textarea mt-3" />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* materials */}
            <div className="card p-5">
              <h3 className="font-display text-base font-semibold text-ink">📄 {t("learn.materials")}</h3>
              <ul className="mt-3 space-y-2">
                {["Хичээлийн тэмдэглэл.pdf", "Дасгалын хуудас.pdf"].map((f) => (
                  <li key={f}><button className="flex w-full items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm text-ink/80 transition hover:border-primary-300 hover:text-primary-700"><span>{f}</span><span>⬇</span></button></li>
                ))}
              </ul>
            </div>
            {/* support */}
            <div className="card p-5">
              <h3 className="font-display text-base font-semibold text-ink">💬 {t("learn.support")}</h3>
              {asked ? (
                <p className="mt-3 rounded-xl bg-jade-400/10 px-3 py-2 text-sm text-jade-600">✓ {t("contact.doneSub")}</p>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder={t("learn.askPlaceholder")} className="input" />
                  <button onClick={() => { if (ask.trim()) { setAsked(true); setAsk(""); } }} className="btn btn-primary btn-sm shrink-0">{t("learn.send")}</button>
                </div>
              )}
            </div>
          </div>

          {/* devices */}
          <div className="mt-6 card p-5">
            <h3 className="font-display text-base font-semibold text-ink">💻 {t("learn.devices")}</h3>
            <ul className="mt-3 space-y-2">
              {devices.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm">
                  <span className="text-ink/80">{d.name} {d.current && <span className="ml-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">{t("learn.thisDevice")}</span>}</span>
                  {!d.current && <button onClick={() => setDevices((v) => v.filter((x) => x.id !== d.id))} className="text-xs font-semibold text-rose-500 hover:underline">{t("account.logout")}</button>}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 p-4 text-xs leading-relaxed text-muted">🔒 {t("learn.security")}</p>
        </div>

        {/* sidebar */}
        <aside className="order-1 border-b border-line bg-[#111B2D] p-4 lg:order-2 lg:border-b-0 lg:border-l">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">{t("learn.lessons")}</h2>
            <span className="text-sm text-muted">{progressPct}%</span>
          </div>
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-primary-50">
            <div className="h-full rounded-full bg-primary-grad transition-all" style={{ width: progressPct + "%" }} />
          </div>
          {!enrolled && (
            <div className="mb-4 rounded-2xl border border-accent-200 bg-accent-50 p-3 text-xs text-accent-700">
              {t("learn.lockedSub")}
              <AddToCart className="btn btn-gold btn-sm mt-2 w-full" labelKey="course.buy"
                item={{ kind: "course", slug: course.slug, title: course.title, price: course.price, tone: course.tone, glyph: course.glyph }} />
            </div>
          )}
          <ul className="space-y-1.5">
            {lessons.map((l, i) => {
              const accessible = canPlay(i);
              return (
                <li key={i}>
                  <button onClick={() => accessible && select(i)} disabled={!accessible}
                    className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition", i === active ? "bg-primary-50" : "hover:bg-primary-50/50", !accessible && "opacity-60")}>
                    <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", done.includes(i) ? "bg-jade-500 text-white" : i === active ? "bg-primary-grad text-white" : "bg-primary-50 text-primary-700")}>
                      {done.includes(i) ? "✓" : accessible ? i + 1 : "🔒"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">{l.title}</span>
                      <span className="text-xs text-muted">{l.duration}{l.free && <span className="ml-2 rounded bg-jade-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-jade-600">{t("learn.free")}</span>}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
