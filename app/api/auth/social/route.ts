import { NextResponse } from "next/server";
import { getOrCreateSocialUser, toPublicUser, isAdminEmail } from "@/lib/repo";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NOTE: demo social sign-in. Real Facebook login needs a Facebook App (App ID/Secret) + OAuth.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const provider = String(body?.provider || "facebook").toLowerCase();
  if (provider !== "facebook")
    return NextResponse.json({ error: "Дэмжигдэхгүй нэвтрэлт." }, { status: 400 });
  try {
    const user = await getOrCreateSocialUser(provider);
    await createSession(user.id);
    return NextResponse.json({ user: { ...toPublicUser(user), isAdmin: isAdminEmail(user.email) } });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
