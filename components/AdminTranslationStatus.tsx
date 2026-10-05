"use client";
import { useEffect, useState } from "react";
export function AdminTranslationStatus() {
  const [status,setStatus]=useState<{configured:boolean;healthy?:boolean;issue?:string}|null>(null);
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
    <p className="text-sm text-muted">Microsoft Azure Translator · Үнэгүй ашиглахын тулд Azure дээр F0 багцыг сонгоно.</p>
    <p role="status" className="text-sm">{error?"Орчуулгын төлөвийг шалгаж чадсангүй.":!status?"Шалгаж байна…":!status.configured?"Автомат орчуулгын үйлчилгээ холбогдоогүй. Бэлэн орчуулгууд ажиллана.":status.healthy===false?"Үйлчилгээ холбогдсон боловч орчуулгын хүсэлт амжилтгүй байна.":status.healthy?"Автомат орчуулгын туршилт амжилттай.":"Автомат орчуулгын тохиргоо бүртгэгдсэн. Холболтыг шалгана уу."}</p>
    {status && (!status.configured || status.healthy===false) && <div className="space-y-2 text-sm text-muted">
      {status.issue==="credentials" && <p>Azure түлхүүр эсвэл бүсийн тохиргоо буруу байна.</p>}
      {status.issue==="quota_or_access" && <p>Azure орчуулгын эрх эсвэл сарын үнэгүй хязгаарыг шалгана уу. Төлбөртэй үйлчилгээ рүү автоматаар шилжихгүй.</p>}
      {status.issue==="rate_limited" && <p>Хүсэлтийн түр хязгаарт хүрсэн байна. Нэг минутын дараа дахин шалгана уу.</p>}
      <p>Vercel → Environment Variables → Production хэсэгт <code translate="no">AZURE_TRANSLATOR_KEY</code> болон <code translate="no">AZURE_TRANSLATOR_REGION</code>-ийг хадгалж, дахин нийтэлнэ. Бүсийг Azure-ийн Keys and Endpoint хэсгээс авна; Global бол <code translate="no">global</code> гэж оруулна. Түлхүүрээ олон нийтэд харагдах талбарт оруулахгүй.</p>
      <a className="underline" href="https://learn.microsoft.com/en-us/azure/ai-services/translator/how-to/create-translator-resource" target="_blank" rel="noopener noreferrer">Azure Translator тохируулах заавар ↗</a>
    </div>}
    <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={check}>{busy?"Шалгаж байна…":"Орчуулгын холболт шалгах"}</button>
    <p className="text-xs text-muted">Админаас оруулсан гар орчуулгыг түрүүлж ашиглана. Зураг доторх бичиг болон видео, аудионы ярианд тусдаа орчуулсан зураг, хадмал шаардлагатай.</p>
  </section>;
}
