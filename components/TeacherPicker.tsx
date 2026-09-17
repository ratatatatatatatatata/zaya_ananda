"use client";

import type { TeacherPreset } from "@/lib/types";
import { compressImage } from "@/lib/image-compress";

export type TeacherDraft = TeacherPreset & { key: string };
export const teacherDraft = (teacher: TeacherPreset): TeacherDraft => ({ ...teacher, key: crypto.randomUUID() });

export function TeacherPicker({ value, presets, onChange, onError }: { value: TeacherDraft[]; presets: TeacherPreset[]; onChange: React.Dispatch<React.SetStateAction<TeacherDraft[]>>; onError: (message: string) => void }) {
  const available = presets.filter(person => person.name?.trim() && !person.name.includes(","));
  const update = (key: string, patch: Partial<TeacherPreset>) => onChange(rows => rows.map(row => row.key === key ? { ...row, ...patch } : row));
  const toggle = (teacher: TeacherPreset) => onChange(rows => rows.some(row => row.name === teacher.name) ? rows.filter(row => row.name !== teacher.name) : [...rows, teacherDraft(teacher)]);
  return <div className="rounded-2xl border border-line bg-primary-50/40 p-4">
    <p className="font-display font-semibold text-ink">Заах багшийн мэдээлэл</p>
    <p className="mt-2 text-sm text-muted">Багш бүр өөрийн зураг, нэр, чиглэл, танилцуулгатай харагдана.</p>
    <div className="mt-3 flex flex-wrap gap-2">{available.map(teacher => <button key={teacher.name} type="button" aria-pressed={value.some(row => row.name === teacher.name)} onClick={() => toggle(teacher)} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${value.some(row => row.name === teacher.name) ? "border-primary-600 bg-primary-600 text-white" : "border-line bg-white text-ink"}`}>{teacher.name}</button>)}</div>
    <div className="mt-4 space-y-4">{value.map((teacher,index) => <fieldset key={teacher.key} className="rounded-2xl border border-line bg-surface-1 p-4">
      <legend className="px-2 font-semibold text-ink">Багш {index + 1}{teacher.name ? ` — ${teacher.name}` : ""}</legend>
      <div className="flex flex-wrap items-center gap-3">
        {teacher.image && <img src={teacher.image} alt={teacher.name} className="h-20 w-20 rounded-full object-cover" />}
        <label className="min-w-0 flex-1 text-sm text-muted">Багшийн зураг<input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={async event => {
          const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
          try { update(teacher.key, { image: await compressImage(file) }); } catch (error) { onError(error instanceof Error ? error.message : "Зураг оруулахад алдаа гарлаа."); }
        }} /></label>
        {teacher.image && <button type="button" onClick={() => update(teacher.key,{image:""})} className="text-sm text-rose-600">Зураг арилгах</button>}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="field-label">Багшийн нэр<input className="input mt-1" value={teacher.name} onChange={event => update(teacher.key,{name:event.target.value})} required /></label><label className="field-label">Албан тушаал / чиглэл<input className="input mt-1" value={teacher.role || ""} onChange={event => update(teacher.key,{role:event.target.value})} /></label></div>
      <label className="field-label mt-3 block">Танилцуулга<textarea className="textarea mt-1" rows={4} value={teacher.info || ""} onChange={event => update(teacher.key,{info:event.target.value})} /></label>
      <button type="button" onClick={() => onChange(rows => rows.filter(row => row.key !== teacher.key))} className="mt-3 text-sm font-semibold text-rose-600">Сонголтоос хасах</button>
    </fieldset>)}</div>
    <button type="button" onClick={() => onChange(rows => [...rows,teacherDraft({name:"",image:"",role:"",info:""})])} className="btn btn-outline btn-sm mt-4">+ Өөр багш нэмэх</button>
    <p className="mt-3 text-xs text-muted">Хадгалахад багш бүрийн мэдээлэл “Хамт олон” жагсаалтад тусдаа шинэчлэгдэнэ.</p>
  </div>;
}
