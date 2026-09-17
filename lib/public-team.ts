import type { TeacherPreset } from "./types";

export const teacherNameKey = (name: string) => name.normalize("NFKC").toLowerCase().replace(/[\s.·]+/g, "");
const clean = (name: string) => name.trim().replace(/\s+/g, " ");

/** Public catalogue: legacy multi-teacher labels are references, not additional people. */
export function publicTeam(...sources: TeacherPreset[][]): TeacherPreset[] {
  const rows = sources.flat().filter(person => person?.name?.trim());
  const people = new Map<string, TeacherPreset>();
  for (const person of rows.filter(person => !person.name.includes(","))) {
    const name = clean(person.name), key = teacherNameKey(name), existing = people.get(key);
    if (!existing) people.set(key, { ...person, name });
    else people.set(key, { ...existing, image: existing.image || person.image, role: existing.role || person.role, info: existing.info || person.info, ...((existing.focus ?? person.focus) !== undefined ? { focus: existing.focus ?? person.focus } : {}) });
  }
  for (const group of rows.filter(person => person.name.includes(","))) {
    for (const value of group.name.split(",")) {
      const name = clean(value), key = teacherNameKey(name);
      // A combined record's photo/bio cannot be attributed to another person.
      if (name && !people.has(key)) people.set(key, { name });
    }
  }
  return [...people.values()];
}
