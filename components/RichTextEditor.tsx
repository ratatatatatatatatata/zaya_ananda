"use client";

import { useEffect, useRef } from "react";

const FONTS = [
  { label: "Үндсэн фонт", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];
const SIZES = [
  { label: "Жижиг", value: "2" },
  { label: "Энгийн", value: "3" },
  { label: "Том", value: "4" },
  { label: "Маш том", value: "5" },
  { label: "Гарчиг", value: "6" },
];

/** Word маягийн энгийн текст засварлагч — фонт, хэмжээ, тод/доогуур зураас, өнгө, байрлал. */
export function RichTextEditor({ value, onChange, minHeight = 180 }: { value: string; onChange: (html: string) => void; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ref.current || loaded.current) return;
    ref.current.innerHTML = value || "";
    loaded.current = true;
  }, [value]);

  // Засварлаж эхэлээгүй байхад гаднаас утга өөрчлөгдвөл (жишээ нь "Засах" дарахад) шинэчилнэ
  useEffect(() => {
    if (!ref.current) return;
    if (document.activeElement !== ref.current && ref.current.innerHTML !== (value || "")) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const Btn = ({ cmd, arg, children, title }: { cmd: string; arg?: string; children: React.ReactNode; title: string }) => (
    <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={() => exec(cmd, arg)}
      className="grid h-8 min-w-8 place-items-center rounded-md border border-line bg-white/10 px-1.5 text-sm text-ink/80 hover:bg-primary-50">
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-line bg-[#121D33]">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-line bg-aqua/60 p-2">
        <select className="h-8 rounded-md border border-line bg-white/10 px-1 text-sm" defaultValue="" title="Фонт"
          onChange={(e) => { if (e.target.value) exec("fontName", e.target.value); }}>
          {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
        </select>
        <select className="h-8 rounded-md border border-line bg-white/10 px-1 text-sm" defaultValue="3" title="Хэмжээ"
          onChange={(e) => exec("fontSize", e.target.value)}>
          {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <Btn cmd="bold" title="Тод"><b>B</b></Btn>
        <Btn cmd="italic" title="Налуу"><i>I</i></Btn>
        <Btn cmd="underline" title="Доогуур зураас"><u>U</u></Btn>
        <label className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-line bg-white/10" title="Үсгийн өнгө">
          <span className="text-sm font-bold" style={{ borderBottom: "3px solid #e11d48" }}>A</span>
          <input type="color" className="h-0 w-0 opacity-0" onChange={(e) => exec("foreColor", e.target.value)} />
        </label>
        <span className="mx-1 h-6 w-px bg-line" />
        <Btn cmd="justifyLeft" title="Зүүн тийш">⬅</Btn>
        <Btn cmd="justifyCenter" title="Голд">↔</Btn>
        <Btn cmd="justifyRight" title="Баруун тийш">➡</Btn>
        <span className="mx-1 h-6 w-px bg-line" />
        <Btn cmd="insertUnorderedList" title="Жагсаалт">• —</Btn>
        <Btn cmd="removeFormat" title="Формат арилгах">⌫</Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="prose max-w-none px-4 py-3 text-[15px] leading-relaxed text-ink outline-none"
        style={{ minHeight }}
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        onBlur={() => { if (ref.current) onChange(ref.current.innerHTML); }}
      />
    </div>
  );
}
