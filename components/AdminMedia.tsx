"use client";

import { useEffect, useState } from "react";

const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

type MediaItem = {
  id: string;
  filename: string;
  path: string;
  kind: "image" | "video" | "other";
  mime?: string;
  size?: number;
  createdAt: string;
  url?: string;
};

function fmtSize(n?: number) {
  if (!n) return "";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / (1024 * 1024)).toFixed(1) + " MB";
}

/** Supabase Storage руу файл байршуулаад дотоод замыг нь буцаана — код push шаардахгүй, шууд хадгална. */
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

/** Зураг, бичлэгийн сан — админ хэдийд ч файл байршуулж, жагсаалтаас нь дахин татаж авах боломжтой. */
export function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pct, setPct] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/media", { cache: "no-store" });
      const d = await r.json().catch(() => ({}));
      setItems(Array.isArray(d?.items) ? d.items : []);
    } catch { /* offline — жагсаалт хоосон үлдэнэ */ }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setErr("");
    for (const file of files) {
      setPct(0);
      try {
        const path = await uploadFile(file, setPct);
        await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, path, mime: file.type, size: file.size }),
        });
      } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Байршуулахад алдаа гарлаа."); }
    }
    setPct(null);
    load();
  }

  async function remove(item: MediaItem) {
    if (!confirm(`«${item.filename}» файлыг устгах уу?`)) return;
    setBusyId(item.id);
    try {
      await fetch(`/api/admin/media?id=${encodeURIComponent(item.id)}&path=${encodeURIComponent(item.path)}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    } catch { /* ignore */ }
    finally { setBusyId(null); }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="font-display text-lg font-semibold text-ink">Зураг, бичлэг байршуулах</p>
        <p className="mt-1 text-sm text-muted">
          Энд байршуулсан файлууд Supabase Storage-д хадгалагдана — код push хийх шаардлагагүй, доороос шууд байршуулаад дахин татаж авах боломжтой.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {pct !== null ? (
            <span className="flex flex-1 items-center gap-3">
              <span className="text-sm font-medium text-primary-700">{pct}%</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <span className="block h-full bg-primary-500 transition-all" style={{ width: pct + "%" }} />
              </span>
            </span>
          ) : (
            <label className="btn btn-primary btn-sm cursor-pointer">
              + Файл сонгох
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={pick} />
            </label>
          )}
        </div>
        {err && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{err}</p>}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-ink">Байршуулсан файлууд ({items.length})</p>
          {loading && <span className="text-xs text-muted">Ачааллаж байна…</span>}
        </div>
        {!loading && items.length === 0 && <p className="mt-4 text-sm text-muted">Одоогоор файл байршуулаагүй байна.</p>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="overflow-hidden rounded-2xl border border-line bg-surface-1">
              <div className="aspect-square w-full bg-surface-2">
                {it.kind === "image" && it.url ? (
                  <img src={it.url} alt={it.filename} className="h-full w-full object-cover" />
                ) : it.kind === "video" && it.url ? (
                  <video src={it.url} className="h-full w-full object-cover" muted />
                ) : (
                  <div className="grid h-full w-full place-items-center text-3xl text-muted">📄</div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-ink" title={it.filename}>{it.filename}</p>
                <p className="mt-0.5 text-xs text-muted">{fmtSize(it.size)}{it.size ? " · " : ""}{(it.createdAt || "").slice(0, 10)}</p>
                <div className="mt-2.5 flex items-center gap-3">
                  {it.url && (
                    <a href={it.url} download={it.filename} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary-700 hover:underline">
                      Татах
                    </a>
                  )}
                  <button type="button" onClick={() => remove(it)} disabled={busyId === it.id} className="text-xs font-semibold text-rose-500 hover:underline disabled:opacity-60">
                    {busyId === it.id ? "Устгаж байна…" : "Устгах"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
