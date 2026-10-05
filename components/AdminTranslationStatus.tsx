"use client";
import { useEffect, useState } from "react";
export function AdminTranslationStatus() {
  const [status,setStatus]=useState<{configured:boolean;healthy?:boolean}|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState(false);
  useEffect(()=>{let alive=true;fetch("/api/translations",{cache:"no-store"}).then(r=>r.json()).then(value=>{if(alive)setStatus(value);}).catch(()=>{if(alive)setError(true);});return()=>{alive=false;};},[]);
  async function check() {
    setBusy(true);setError(false);
    try {
      const response=await fetch("/api/admin/translations",{method:"POST"});
      if(!response.ok)throw new Error();
      const value=await response.json();setStatus(value);
      if(value.healthy)window.dispatchEvent(new Event("zaya:translations-retry"));
    } catch {setError(true);} finally {setBusy(false);}
  }
  return <section className="space-y-3 rounded-2xl border border-line bg-primary-50/40 p-4" aria-labelledby="translation-settings-title">
    <h3 id="translation-settings-title" className="font-semibold">Таван хэлний орчуулга</h3>
    <p className="text-sm text-muted">Монгол · English · 한국어 · 日本語 · 中文</p>
    <p role="status" className="text-sm">{error?"Орчуулгын төлөвийг шалгаж чадсангүй.":!status?"Шалгаж байна…":!status.configured?"Автомат орчуулгын үйлчилгээ холбогдоогүй. Бэлэн орчуулгууд ажиллана.":status.healthy===false?"Үйлчилгээ холбогдсон боловч орчуулгын хүсэлт амжилтгүй байна.":status.healthy?"Автомат орчуулгын туршилт амжилттай.":"Автомат орчуулгын тохиргоо бүртгэгдсэн. Холболтыг шалгана уу."}</p>
    {status && (!status.configured || status.healthy===false) && <div className="space-y-2 text-sm text-muted">
      <p>Google Cloud Translation API-г идэвхжүүлсэн түлхүүрийг Vercel төслийн Environment Variables хэсэгт <code translate="no">GOOGLE_TRANSLATE_API_KEY</code> нэрээр Production орчинд хадгалж, дахин нийтэлнэ. Түлхүүрээ олон нийтэд харагдах талбарт оруулахгүй.</p>
      <a className="underline" href="https://docs.cloud.google.com/translate/docs/setup" target="_blank" rel="noopener noreferrer">Google Translation тохируулах заавар ↗</a>
    </div>}
    <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={check}>{busy?"Шалгаж байна…":"Орчуулгын холболт шалгах"}</button>
    <p className="text-xs text-muted">Админаас оруулсан гар орчуулгыг түрүүлж ашиглана. Зураг доторх бичиг болон видео, аудионы ярианд тусдаа орчуулсан зураг, хадмал шаардлагатай.</p>
  </section>;
}
