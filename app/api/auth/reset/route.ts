import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getUserByEmail, setResetCode, clearResetCode, setUserPassword } from "@/lib/repo";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UserWithReset = { id: string; resetCodeHash?: string | null; resetExpires?: string | null };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const email = String(body.email || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Имэйл хаягаа оруулна уу." }, { status: 400 });

  const user = (await getUserByEmail(email)) as (UserWithReset & { email: string }) | null;

  if (body.action === "request") {
    if (!user) return NextResponse.json({ error: "Энэ имэйлээр бүртгэл олдсонгүй." }, { status: 404 });
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    try {
      await sendEmail(
        email,
        "Zaya's Ananda — Нууц үг сэргээх код",
        `<div style="font-family:sans-serif;max-width:420px"><h2>Нууц үг сэргээх</h2><p>Таны баталгаажуулах код:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p style="color:#777">Код 15 минутын дотор хүчинтэй. Хэрэв та энэ хүсэлтийг илгээгээгүй бол үл тоомсорлоно уу.</p></div>`
      );
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Имэйл илгээхэд алдаа." }, { status: 500 });
    }
    await setResetCode(user.id, hashPassword(code), expires);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "confirm") {
    const code = String(body.code || "").trim();
    const password = String(body.password || "");
    if (!code || password.length < 6)
      return NextResponse.json({ error: "Код болон шинэ нууц үгээ (6+ тэмдэгт) оруулна уу." }, { status: 400 });
    if (!user || !user.resetCodeHash || !user.resetExpires)
      return NextResponse.json({ error: "Сэргээх хүсэлт олдсонгүй. Дахин код авна уу." }, { status: 400 });
    if (new Date(user.resetExpires).getTime() < Date.now())
      return NextResponse.json({ error: "Кодны хугацаа дууссан. Дахин код авна уу." }, { status: 400 });
    if (!verifyPassword(code, user.resetCodeHash))
      return NextResponse.json({ error: "Код буруу байна." }, { status: 400 });
    await setUserPassword(user.id, password);
    await clearResetCode(user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
