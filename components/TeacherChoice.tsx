"use client";

import { useId } from "react";
import type { TeacherPreset } from "@/lib/types";

export function TeacherChoice({ teachers, value, onChange, readOnly = false }: {
  teachers: TeacherPreset[]; value: string; onChange: (name: string) => void; readOnly?: boolean;
}) {
  const group = useId();
  if (teachers.length < 2) return null;
  const shown = readOnly && teachers.some(teacher => teacher.name === value) ? teachers.filter(teacher => teacher.name === value) : teachers;
  return <fieldset disabled={readOnly} className="mb-5 min-w-0 text-left">
    <legend className="mb-2 font-semibold text-ink">{readOnly ? "Багшийн мэдээлэл" : "Багшаа сонгоно уу"}</legend>
    {!readOnly && <p className="mb-3 text-sm text-muted">Танилцуулгыг уншаад багшийн карт дээр дарж сонгоно уу.</p>}
    <div className="grid gap-3">
      {shown.map(teacher => <label data-teacher-choice key={teacher.name} className={`block rounded-2xl border-2 p-4 transition ${readOnly ? "" : "cursor-pointer"} ${value === teacher.name ? "border-primary-600 bg-primary-50" : "border-line bg-white hover:border-primary-400"}`}>
        <span className="flex items-center gap-3">
          <input type="radio" aria-label={teacher.name} name={group} value={teacher.name} checked={value === teacher.name} onChange={() => onChange(teacher.name)} className="shrink-0 accent-emerald-700" />
          {teacher.image && <img src={teacher.image} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" style={{objectPosition:`50% ${teacher.focus ?? 50}%`}} />}
          <span className="min-w-0 break-words"><span className="block font-semibold text-ink">{teacher.name}</span>{teacher.role && <span className="mt-1 block text-sm text-primary-700">{teacher.role}</span>}</span>
        </span>
        {teacher.info && <span className="mt-3 block whitespace-pre-line text-sm leading-relaxed text-muted">{teacher.info}</span>}
        {value === teacher.name && <span className="mt-3 block text-xs font-semibold text-primary-700">✓ Сонгосон багш</span>}
      </label>)}
    </div>
  </fieldset>;
}
