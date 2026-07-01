import { NextResponse } from "next/server";
import { authenticate, toPublicUser } from "@/lib/repo";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Буруу хүсэлт." }, { status: 400 });
  const { email, identifier, password } = body;
  const id = identifier || email;
  if (!id || !password)
    return NextResponse.json({ error: "Имэйл/утас болон нууц үгээ оруулна уу." }, { status: 400 });

  const user = authenticate(String(id), String(password));
  if (!user)
    return NextResponse.json({ error: "Имэйл эсвэл нууц үг буруу байна." }, { status: 401 });

  await createSession(user.id);
  return NextResponse.json({ user: toPublicUser(user) });
}
