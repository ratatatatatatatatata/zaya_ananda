import type { CmsItem } from "@/lib/types";
import { itemTeachers } from "@/lib/item-teachers";

export function ItemTeachers({ item, compact = false }: { item: CmsItem; compact?: boolean }) {
  const teachers = itemTeachers(item);
  if (!teachers.length) return null;
  return <div className="space-y-4" aria-label="Багш нарын мэдээлэл">
    {teachers.map(teacher => <div key={teacher.name} className="flex items-start gap-4" data-teacher-profile>
      {teacher.image ? <img src={teacher.image} alt={teacher.name} className={`${compact ? "h-12 w-12" : "h-20 w-20"} shrink-0 rounded-full object-cover`} style={{objectPosition:`50% ${teacher.focus ?? 50}%`}} />
        : <span aria-hidden className={`${compact ? "h-12 w-12" : "h-20 w-20"} grid shrink-0 place-items-center rounded-full bg-primary-50 font-semibold text-primary-700`}>{teacher.name.split(/\s+/).map(part => part[0]).slice(0,2).join("")}</span>}
      <div className="min-w-0"><p className="font-semibold text-ink">{teacher.name}</p>{teacher.role && <p className="mt-1 whitespace-pre-line text-sm text-primary-700">{teacher.role}</p>}{teacher.info && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{compact ? teacher.info.split("\n")[0] : teacher.info}</p>}</div>
    </div>)}
  </div>;
}
