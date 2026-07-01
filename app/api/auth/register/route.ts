import { NextResponse } from "next/server";
import { createUser, toPublicUser, isAdminEmail } from "@/lib/repo";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Буруу хүсэлт." }, { status: 400 });
  const { name, email, password, phone } = body;
  if (!name || !password)
    return NextResponse.json({ error: "Нэр, нууц үгээ оруулна уу." }, { status: 400 });
  if (!email && !phone)
    return NextResponse.json({ error: "Имэйл эсвэл утасны дугаараа оруулна уу." }, { status: 400 });
  if (typeof password !== "string" || password.length < 6)
    return NextResponse.json({ error: "Нууц үг дор хаяж 6 тэмдэгт байх ёстой." }, { status: 400 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email)))
    return NextResponse.json({ error: "Имэйл хаяг буруу байна." }, { status: 400 });

  try {
    const { user, error } = await createUser({ name: String(name), email: email ? String(email) : undefined, password, phone: phone ? String(phone) : undefined });
    if (error || !user)
      return NextResponse.json({ error: error || "Бүртгэл амжилтгүй боллоо." }, { status: 409 });
    await createSession(user.id);
    return NextResponse.json({ user: { ...toPublicUser(user), isAdmin: isAdminEmail(user.email) } });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
