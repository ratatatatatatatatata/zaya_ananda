import { itemTeachers } from "./item-teachers";
import type { CmsItem } from "./types";

/** Only teachers assigned to this item can be selected; never trust a submitted name. */
export function resolveTeacherSelection(item: CmsItem, submitted: unknown): { name?: string; error?: string } {
  if (item.kind !== "course" && item.kind !== "service") return {};
  const teachers = itemTeachers(item);
  const name = typeof submitted === "string" ? submitted.trim() : "";
  if (!name) return teachers.length > 1
    ? { error: "Багшаа сонгоно уу." }
    : { name: teachers[0]?.name };
  const teacher = teachers.find(person => person.name === name);
  return teacher ? { name: teacher.name } : { error: "Сонгосон багш энэ сургалт, үйлчилгээнд байхгүй байна. Дахин сонгоно уу." };
}

export function teacherBookingNote(name: string | undefined, note: unknown): string {
  return [name ? `Сонгосон багш: ${name}` : "", typeof note === "string" ? note.trim() : ""].filter(Boolean).join("\n");
}
