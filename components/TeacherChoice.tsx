"use client";

import { useId } from "react";
import type { TeacherPreset } from "@/lib/types";

export function TeacherChoice({ teachers, value, onChange }: {
  teachers: TeacherPreset[]; value: string; onChange: (name: string) => void;
}) {
  const group = useId();
  if (teachers.length < 2) return null;
  return <fieldset className="mb-5 text-left">
    <legend className="mb-2 font-semibold text-ink">Багшаа сонгоно уу</legend>
    <p className="mb-3 text-sm text-muted">Та доорх багш нараас нэгийг сонгоно.</p>
    <div className="grid gap-3">
      {teachers.map(teacher => <label key={teacher.name} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 transition ${value === teacher.name ? "border-primary-600 bg-primary-50" : "border-line bg-white hover:border-primary-400"}`}>
        <input type="radio" name={group} value={teacher.name} checked={value === teacher.name} onChange={() => onChange(teacher.name)} className="mt-4 shrink-0 accent-emerald-700" />
        {teacher.image && <img src={teacher.image} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />}
        <span className="min-w-0 break-words"><span className="block font-semibold text-ink">{teacher.name}</span>{teacher.role && <span className="mt-1 block text-xs text-muted">{teacher.role}</span>}</span>
      </label>)}
    </div>
  </fieldset>;
}
