import Link from "next/link";
import type { CmsItem } from "@/lib/types";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Энергийн заслын карт — дээр нь үйлчилгээний зураг, доор нь хариуцах багшийн зураг, нэр. */
export function ServiceCard({ item }: { item: CmsItem }) {
  const cover = item.image || item.images?.[0];
  const hasTeacher = Boolean(item.teacherName);

  return (
    <Link href={"/item/" + item.id} className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-glow">
      {/* Үйлчилгээний зураг */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-3">
        {cover ? (
          <img src={cover} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />
        )}
        {item.category && (
          <span className="absolute left-4 top-4 rounded-full bg-[#0B1714]/75 px-3 py-1 text-xs font-semibold text-accent-300 backdrop-blur">
            {item.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
        {item.summary && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.summary}</p>}

        {/* Багшийн мэдээлэл */}
        {hasTeacher && (
          <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-3">
              {item.teacherImage ? (
                <img src={item.teacherImage} alt={item.teacherName} className="h-full w-full object-cover" />
              ) : (
                <span
                  className="grid h-full w-full place-items-center font-display text-sm font-semibold text-[#14231F]"
                  style={{ backgroundImage: "linear-gradient(150deg,#FFE7A8,#E8B75F 55%,#B98A3C)" }}
                >
                  {initials(item.teacherName || "")}
                </span>
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-semibold text-ink">{item.teacherName}</span>
              {item.teacherInfo && <span className="block truncate text-xs text-muted">{item.teacherInfo.split("\n")[0]}</span>}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
