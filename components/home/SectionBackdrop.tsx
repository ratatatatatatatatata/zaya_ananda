import Image from "next/image";

/** Decorative section imagery; the existing content remains the interactive layer. */
export function SectionBackdrop({ src, position = "center", centered = false }: {
  src: string;
  position?: string;
  centered?: boolean;
}) {
  return (
    <div className={`activity-backdrop${centered ? " activity-backdrop-centered" : ""}`} aria-hidden="true">
      <Image src={src} alt="" fill sizes="100vw" unoptimized={!src.startsWith("/")} style={{ objectPosition: position }} />
    </div>
  );
}
