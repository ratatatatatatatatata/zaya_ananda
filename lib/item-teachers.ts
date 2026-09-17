import type { CmsItem, TeacherPreset } from "./types";

type TeacherSource = Pick<CmsItem, "teacherName" | "teacherImage" | "teacherInfo" | "teachers">;

export function normalizeTeachers(value: unknown): TeacherPreset[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap(entry => {
    if (!entry || typeof entry !== "object" || typeof entry.name !== "string") return [];
    const name = entry.name.trim();
    if (!name || seen.has(name.toLowerCase())) return [];
    seen.add(name.toLowerCase());
    return [{ name, image: typeof entry.image === "string" ? entry.image : "", role: typeof entry.role === "string" ? entry.role.trim() : "", info: typeof entry.info === "string" ? entry.info.trim() : "", ...(typeof entry.focus === "number" ? { focus: Math.min(100, Math.max(0, entry.focus)) } : {}) }];
  });
}

/** Existing name references resolve against individual profiles, never a combined-name preset. */
export function itemTeachers(item: TeacherSource, presets: TeacherPreset[] = []): TeacherPreset[] {
  if (Array.isArray(item.teachers)) return normalizeTeachers(item.teachers);
  const names = [...new Set((item.teacherName || "").split(",").map(name => name.trim()).filter(Boolean))];
  return names.map((name, index) => {
    const preset = presets.find(person => person.name.trim().toLowerCase() === name.toLowerCase());
    if (preset) return { ...preset, name };
    // Older multi-select records had only one picture/bio; never copy it to every teacher.
    return { name, image: index === 0 ? item.teacherImage || "" : "", info: index === 0 ? item.teacherInfo || "" : "" };
  });
}

/** Keep the existing database columns as name references, with legacy single-teacher fallbacks. */
export function teacherFields(teachers: TeacherPreset[]) {
  return { teacherName: teachers.map(person => person.name).join(", "), teacherImage: teachers[0]?.image || "", teacherInfo: teachers[0]?.info || "" };
}
