import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-px py-20 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary-grad text-5xl text-white shadow-glow">✶</div>
        <h1 className="mt-8 font-display text-4xl font-semibold text-ink sm:text-5xl">404</h1>
        <p className="mt-3 text-lg text-muted">Таны хайсан хуудас олдсонгүй эсвэл зөөгдсөн байна.</p>
        <Link href="/" className="btn btn-primary btn-lg mt-8">Нүүр хуудас руу буцах</Link>
      </div>
    </section>
  );
}
