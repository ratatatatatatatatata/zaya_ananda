import Link from "next/link";
import { ToorogReading } from "@/components/ToorogReading";

export const metadata = { title: "Төөрөг" };

export default function ToorogPage() {
  return (
    <div className="container-px py-12 sm:py-16">
      <ToorogReading />

      {/* Тоон зурхайн матрикс руу */}
      <div className="relative mt-12 overflow-hidden rounded-4xl border border-grape-500/30 bg-[#1B1B44] p-7 sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(155,110,240,0.3), transparent 70%)", filter: "blur(8px)" }} />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-white">🔢 Тоон зурхайн матрикс</h2>
            <p className="mt-2 leading-relaxed text-white/75">
              Төрсөн он, сар, өдрөөрөө хувь тавилангийн матриксаа тайлж — үндсэн эрчим энерги, сүнсний түвшин, зөн билэг далд чадамжаа нээгээрэй.
            </p>
          </div>
          <Link href="/matrix" className="btn btn-lg shrink-0 text-white shadow-glow-grape hover:brightness-110 hover:-translate-y-0.5" style={{ backgroundImage: "linear-gradient(120deg,#9B6EF0,#5E8DE0)" }}>
            Матриксаа тайлах →
          </Link>
        </div>
      </div>
    </div>
  );
}
