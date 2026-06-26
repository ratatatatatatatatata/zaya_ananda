import type { ReactNode } from "react";
import Link from "next/link";
import { T } from "./T";

export function PageHeader({
  title,
  desc,
  crumb,
}: {
  title: ReactNode;
  desc?: ReactNode;
  crumb?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-aurora">
      <div className="container-px py-14 sm:py-20">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="transition hover:text-primary-700">
            <T k="nav.home" />
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">{crumb ?? title}</span>
        </nav>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{desc}</p>}
      </div>
    </section>
  );
}
