"use client";

import { useEffect, useState } from "react";

const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function uploadFile(file: File, onProgress: (p: number) => void): Promise<string> {
  const r = await fetch("/api/admin/video-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name }),
  });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || "Байршуулах URL авахад алдаа гарлаа.");
  const { uploadUrl, path } = (await r.json()) as { uploadUrl: string; path: string };
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    if (SB_ANON) { xhr.setRequestHeader("apikey", SB_ANON); xhr.setRequestHeader("authorization", "Bearer " + SB_ANON); }
    xhr.setRequestHeader("x-upsert", "true");
    if (file.type) xhr.setRequestHeader("content-type", file.type);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Байршуулалт амжилтгүй (" + xhr.status + ")")));
    xhr.onerror = () => reject(new Error("Сүлжээний алдаа. Дахин оролдоно уу."));
    xhr.send(file);
  });
  return path;
}

type Media = { kind: "video" | "image"; src: string };

/** Нэг хуудасны толгойн дэвсгэрийг засах мөр. */
export function HeroMediaEditor({ slot, label, href }: { slot: string; label: string; href?: string }) {
  const [media, setMedia] = useState<Media | null>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const s = d?.settings;
        if (!s) return;
        const m = s.heroMedia?.[slot];
        if (m?.src) return setMedia({ kind: m.kind === "image" ? "image" : "video", src: m.src });
        const legacy = s.heroVideos?.[slot];
        if (legacy) setMedia({ kind: "video", src: legacy });
      })
      .catch(() => {});
  }, [slot]);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setErr(""); setMsg(""); setPct(0);
    const isImage = file.type.startsWith("image/");
    try {
      const path = await uploadFile(file, setPct);
      setMedia({ kind: isImage ? "image" : "video", src: path });
      setDirty(true);
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Байршуулахад алдаа."); }
    finally { setPct(null); e.target.value = ""; }
  }

  async function save() {
    setSaving(true); setErr(""); setMsg("");
    try {
      const cur = await fetch("/api/settings", { cache: "no-store" }).then((r) => r.json()).catch(() => ({}));
      const all: Record<string, Media> = { ...(cur?.settings?.heroMedia || {}) };
      all[slot] = media ?? { kind: "video", src: "" };
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroMedia: all }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Алдаа гарлаа."); }
      setMsg("Хадгаллаа ✓"); setDirty(false);
      setTimeout(() => setMsg(""), 2500);
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Алдаа гарлаа."); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-ink">{label}</p>
          {href && <p className="text-xs text-muted">{href}</p>}
        </div>
        {media?.src && (
          <span className="rounded-full bg-jade-400/15 px-2.5 py-0.5 text-xs font-bold text-jade-600">
            {media.kind === "image" ? "🖼 Зураг" : "🎬 Видео"}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {pct !== null ? (
          <span className="flex flex-1 items-center gap-3">
            <span className="text-sm font-medium text-primary-700">{pct}%</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <span className="block h-full bg-primary-500 transition-all" style={{ width: pct + "%" }} />
            </span>
          </span>
        ) : media?.src ? (
          <>
            <label className="btn btn-outline btn-sm cursor-pointer">
              Солих<input type="file" accept="video/*,image/*" className="hidden" onChange={pick} />
            </label>
            <button type="button" onClick={() => { setMedia(null); setDirty(true); }} className="text-xs font-semibold text-rose-500 hover:underline">
              Устгах
            </button>
          </>
        ) : (
          <input type="file" accept="video/*,image/*" onChange={pick} className="flex-1 text-sm" />
        )}

        {dirty && (
          <button type="button" onClick={save} disabled={saving} className="btn btn-primary btn-sm ml-auto">
            {saving ? "Хадгалж байна…" : "Хадгалах"}
          </button>
        )}
      </div>

      {!media?.src && pct === null && (
        <p className="mt-2 text-xs text-muted">Байршуулаагүй тул өгөгдмөл бичлэг харагдана.</p>
      )}
      {msg && <p className="mt-2 text-xs font-semibold text-jade-600">{msg}</p>}
      {err && <p className="mt-2 rounded-lg bg-rose-50 px-3 py-1.5 text-xs text-rose-600">{err}</p>}
    </div>
  );
}
