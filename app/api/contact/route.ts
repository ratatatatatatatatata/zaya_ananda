import { NextResponse } from "next/server";
import { createMessage } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Буруу хүсэлт." }, { status: 400 });
  const { name, email, phone, subject, message } = body;
  if (!name || !email || !message)
    return NextResponse.json({ error: "Нэр, имэйл, зурвасаа бүрэн бичнэ үү." }, { status: 400 });

  const msg = await createMessage({
    name: String(name),
    email: String(email),
    phone: phone ? String(phone) : undefined,
    subject: subject ? String(subject) : "Холбоо барих хүсэлт",
    message: String(message),
  });
  return NextResponse.json({ ok: true, id: msg.id });
}
