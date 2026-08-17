import type { Person } from "@/data/journeys";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Хүний зураг — байхгүй бол нэрний эхний үсгээр процедур дүрс */
export function Avatar({ person, size = "lg" }: { person: Person; size?: "lg" | "sm" }) {
  const box = size === "lg" ? "h-full w-full" : "h-16 w-16";
  if (person.image) {
    return <img src={person.image} alt={person.name} className={`${box} object-cover`} />;
  }
  return (
    <div
      className={`${box} grid place-items-center font-display font-semibold text-[#14231F]`}
      style={{ backgroundImage: "linear-gradient(150deg,#FFE7A8,#E8B75F 55%,#B98A3C)" }}
    >
      <span className={size === "lg" ? "text-5xl" : "text-lg"}>{initials(person.name)}</span>
    </div>
  );
}

/** Аяллыг хариуцах гол хүн — зураг дээр, мэдээлэл доор */
export function LeadCard({ person }: { person: Person }) {
  return (
    <article className="card overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-3">
        <Avatar person={person} />
      </div>
      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{person.role}</p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold text-ink">{person.name}</h3>
        <p className="mt-3 leading-relaxed text-muted">{person.info}</p>
      </div>
    </article>
  );
}

/** Хамт явах багийн гишүүн */
export function CrewRow({ person }: { person: Person }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-line bg-surface-1 p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-3">
        <Avatar person={person} size="sm" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-base font-semibold text-ink">{person.name}</p>
        <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{person.role}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{person.info}</p>
      </div>
    </div>
  );
}
