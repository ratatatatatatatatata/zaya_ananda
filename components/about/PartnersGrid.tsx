import type { ReactNode } from "react";

type Partner = { logo: string; name: string };

/** Дэмжлэг ба хүлээн зөвшөөрөл — хамтрагч байгууллагын логоны 3 баганат тор.
 *  Admin хараахан юу ч нэмээгүй бол бодит хамтрагч байгаа мэт харагдахгүйн тулд
 *  тодорхой тэмдэглэсэн placeholder слотуудыг харуулна. */
export function PartnersGrid({ eyebrow, title, partners }: {
  eyebrow?: ReactNode;
  title: ReactNode;
  partners: Partner[];
}) {
  const hasReal = partners.length > 0;
  const slots = hasReal ? partners : [0, 1, 2];

  return (
    <section className="section">
      <div className="container-px">
        {eyebrow && <p className="eyebrow-line">{eyebrow}</p>}
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hasReal
            ? (slots as Partner[]).map((p, i) => (
                <div
                  key={i}
                  className="flex h-28 items-center justify-center rounded-3xl border border-line bg-surface-1 p-6 grayscale transition hover:grayscale-0 hover:border-primary-400/40"
                >
                  {p.logo
                    ? <img src={p.logo} alt={p.name || "Хамтрагч"} className="max-h-12 w-auto object-contain opacity-80" />
                    : <span className="text-sm font-semibold text-muted">{p.name || "Хамтрагч"}</span>}
                </div>
              ))
            : (slots as number[]).map((i) => (
                <div
                  key={i}
                  className="flex h-28 items-center justify-center rounded-3xl border border-dashed border-line/70 bg-surface-2/60 p-6 text-center"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-muted/70">Хамтрагчийн лого удахгүй нэмэгдэнэ</span>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
